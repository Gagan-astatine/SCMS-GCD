import React, { useState, useRef, useEffect } from 'react';
import { detectIntent } from '../hooks/useAIIntent';
import supabase from '../config/SupabaseClient';
import { GoogleGenerativeAI } from "@google/generative-ai";

const AIAssistant = () => {
        const genAI = new GoogleGenerativeAI(
        process.env.REACT_APP_GEMINI_API_KEY
    );
    const model = genAI.getGenerativeModel({
        model: "gemini-3.1-flash-lite-preview"
    });
    const [messages, setMessages] = useState([
        { role: 'ai', text: 'Hello! I am your SCMS Co-Pilot. How can I help you manage your supply chain today?', timestamp: new Date() }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    const messagesEndRef = useRef(null);

    const suggestions = [
        "Warehouse status",
        "Driver availability",
        "Today's summary",
        "Order overview"
    ];

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, loading]);

    const formatTimeAgo = (timestamp) => {
        const minutesAgo = Math.floor((new Date() - new Date(timestamp)) / 60000);
        if (minutesAgo === 0) return 'Just now';
        if (minutesAgo === 1) return '1 min ago';
        if (minutesAgo < 60) return minutesAgo + ' mins ago';
        const hoursAgo = Math.floor(minutesAgo / 60);
        return hoursAgo + ' hours ago';
    };

    const formatMessageText = (text) => {
        // Very basic markdown list parsing for bullet points
        if (text.includes('- ') || text.includes('* ')) {
            const lines = text.split('\n');
            const formattedLines = [];
            let inList = false;

            lines.forEach((line) => {
                const trimmed = line.trim();
                // Check if the line is a list item
                if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
                    if (!inList) {
                        formattedLines.push('<ul style="margin: 8px 0; padding-left: 20px;">');
                        inList = true;
                    }
                    // Extract the text after the bullet point
                    const bulletText = trimmed.substring(2);
                    // Bold text formatting **text** inside the bullet
                    const boldParsed = bulletText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                    formattedLines.push(`<li>${boldParsed}</li>`);
                } else {
                    if (inList) {
                        formattedLines.push('</ul>');
                        inList = false;
                    }
                    if (trimmed) {
                        // Bold text formatting outside bullets
                        const boldParsed = trimmed.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                        formattedLines.push(`<p style="margin: 0 0 8px 0;">${boldParsed}</p>`);
                    }
                }
            });
            if (inList) formattedLines.push('</ul>');
            return <div dangerouslySetInnerHTML={{ __html: formattedLines.join('') }} />;
        }

        // Just parse bold text if no lists
        const boldParsed = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        return <p style={{ margin: 0, whiteSpace: 'pre-wrap' }} dangerouslySetInnerHTML={{ __html: boldParsed }} />;
    };

    const handleSend = async (textToSend = input) => {
        const messageText = textToSend.trim();
        if (!messageText) return;

        // 1. Add user message
        const newUserMsg = { role: 'user', text: messageText, timestamp: new Date() };
        setMessages(prev => [...prev, newUserMsg]);
        setInput('');
        setLoading(true);

        try {
            // 2. Call detectIntent
            const intent = detectIntent(messageText);

            // 3. Fetch context directly from Supabase
            let contextData = [];
            try {
                if (intent === "warehouses") {
                    const { data } = await supabase.from("warehouses").select("*");
                    contextData = { warehouses: data || [] };
                } else if (intent === "orders") {
                    const { data } = await supabase.from("Load").select("*").limit(30);
                    contextData = { orders: data || [] };
                } else if (intent === "logs") {
                    const { data } = await supabase.from("warehouse_logs").select("*").limit(15);
                    contextData = { logs: data || [] };
                } else if (intent === "fleet") {
                    const { data } = await supabase.from("Fleet").select("*");
                    contextData = { fleet: data || [] };
                } else if (intent === "drivers") {
                    const { data } = await supabase.from("driver").select("*");
                    const { data: eData } = await supabase.from("driver_earnings").select("*").limit(10);
                    contextData = { drivers: data || [], driver_earnings_sample: eData || [] };
                } else if (intent === "payments") {
                    const { data } = await supabase.from("payments").select("*").limit(20);
                    contextData = { payments: data || [] };
                } else if (intent === "reroutes") {
                    const { data } = await supabase.from("truck_reroutes").select("*");
                    contextData = { reroutes: data || [] };
                } else if (intent === "all") {
                    // Fetch a summary of everything
                    const [w, l, f, d, p] = await Promise.all([
                        supabase.from("warehouses").select("*"),
                        supabase.from("Load").select("*").limit(10),
                        supabase.from("Fleet").select("*"),
                        supabase.from("driver").select("*"),
                        supabase.from("payments").select("*").limit(5)
                    ]);
                    contextData = {
                        warehouses: w.data || [],
                        recentOrders: l.data || [],
                        fleetStatus: f.data || [],
                        drivers: d.data || [],
                        recentPayments: p.data || []
                    };
                }
            } catch (err) {
                console.error("Supabase fetch error:", err);
                contextData = { error: "Failed to fetch live data" };
            }

            // 4. Build the Gemini prompt
            const prompt = `
   You are SCMS Co-Pilot, an AI assistant for a supply chain 
   management system in India.
   
   Context data: ${JSON.stringify(contextData)}
   
   User question: ${messageText}
   
   Rules:
   - Give a direct one-line answer first
   - Then bullet points with details
   - End with one recommendation
   - Keep under 150 words
   - Only use data from context
   - If no data say: I don't have enough data for that
   `;

            // 5. Call Gemini directly
            const result = await model.generateContent(prompt);
            const reply = result.response.text();

            // 6. Add AI reply
            setMessages(prev => [...prev, { role: 'ai', text: reply, timestamp: new Date() }]);

        } catch (error) {
            console.error("AI Assistant Error:", error);
            setMessages(prev => [...prev, {
                role: 'ai',
                text: "AI error: " + error.message,
                timestamp: new Date(),
                isError: true
            }]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            backgroundColor: '#f8fafc',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            color: '#1e293b',
            borderLeft: '1px solid #e2e8f0'
        }}>
            {/* Top Bar */}
            <div style={{
                padding: '16px 24px',
                borderBottom: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                backgroundColor: '#ffffff'
            }}>
                <div style={{
                    width: '10px',
                    height: '10px',
                    backgroundColor: '#22c55e',
                    borderRadius: '50%',
                    boxShadow: '0 0 8px #22c55e'
                }} />
                <h2 style={{ margin: 0, fontSize: '1.2rem', color: '#f97316', textTransform: 'uppercase' }}>AI Co-Pilot</h2>
            </div>

            {/* Messages Area */}
            <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '24px',
                scrollBehavior: 'smooth'
            }}>
                {messages.map((msg, idx) => (
                    <div key={idx} style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start'
                    }}>
                        <div style={{
                            display: 'flex',
                            gap: '12px',
                            maxWidth: '85%',
                            flexDirection: msg.role === 'user' ? 'row-reverse' : 'row'
                        }}>
                            {/* Avatar */}
                            {msg.role === 'ai' && (
                                <div style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '50%',
                                    backgroundColor: '#f97316',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    flexShrink: 0,
                                    fontSize: '18px'
                                }}>
                                    🤖
                                </div>
                            )}

                            {/* Bubble */}
                            <div style={{
                                backgroundColor: msg.role === 'user' ? '#f97316' : (msg.isError ? '#fef2f2' : '#ffffff'),
                                padding: '12px 16px',
                                borderRadius: '12px',
                                borderTopLeftRadius: msg.role === 'ai' ? '2px' : '12px',
                                borderTopRightRadius: msg.role === 'user' ? '2px' : '12px',
                                color: msg.role === 'user' ? 'white' : (msg.isError ? '#ef4444' : '#1e293b'),
                                fontSize: '0.95rem',
                                lineHeight: '1.5',
                                boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                                border: msg.role === 'ai' ? '1px solid #e2e8f0' : 'none',
                                wordBreak: 'break-word'
                            }}>
                                {formatMessageText(msg.text)}
                            </div>
                        </div>
                        {/* Timestamp */}
                        <span style={{
                            fontSize: '0.75rem',
                            color: '#94a3b8',
                            marginTop: '6px',
                            marginRight: msg.role === 'user' ? '4px' : '0',
                            marginLeft: msg.role === 'ai' ? '44px' : '0'
                        }}>
                            {formatTimeAgo(msg.timestamp)}
                        </span>
                    </div>
                ))}

                {/* Loading State (3 bouncing dots) */}
                {loading && (
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                        <div style={{
                            width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#f97316',
                            display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0, fontSize: '18px'
                        }}>
                            🤖
                        </div>
                        <div style={{
                            backgroundColor: '#ffffff', padding: '16px', borderRadius: '12px', borderTopLeftRadius: '2px',
                            display: 'flex', gap: '6px', alignItems: 'center', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
                        }}>
                            <div className="typing-dot" style={{ animationDelay: '0s' }}></div>
                            <div className="typing-dot" style={{ animationDelay: '0.2s' }}></div>
                            <div className="typing-dot" style={{ animationDelay: '0.4s' }}></div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Bottom Input Area */}
            <div style={{
                padding: '20px',
                backgroundColor: '#ffffff',
                borderTop: '1px solid #e2e8f0',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
            }}>
                {/* 4 Quick Suggestions */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {suggestions.map(s => (
                        <button
                            key={s}
                            onClick={() => handleSend(s)}
                            style={{
                                backgroundColor: 'transparent',
                                border: '1px solid #f97316',
                                color: '#f97316',
                                padding: '6px 12px',
                                borderRadius: '16px',
                                fontSize: '0.8rem',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                whiteSpace: 'nowrap'
                            }}
                            onMouseOver={(e) => {
                                e.target.style.backgroundColor = '#f97316';
                                e.target.style.color = 'white';
                            }}
                            onMouseOut={(e) => {
                                e.target.style.backgroundColor = 'transparent';
                                e.target.style.color = '#f97316';
                            }}
                        >
                            {s}
                        </button>
                    ))}
                </div>

                {/* Text Input & Send Button */}
                <div style={{ display: 'flex', gap: '12px' }}>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask about your supply chain..."
                        style={{
                            flex: 1,
                            backgroundColor: '#f8fafc',
                            border: '1px solid #cbd5e1',
                            padding: '12px 16px',
                            borderRadius: '8px',
                            color: '#1e293b',
                            fontSize: '0.95rem',
                            outline: 'none',
                            transition: 'border-color 0.2s'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#f97316'}
                        onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
                    />
                    <button
                        onClick={() => handleSend()}
                        disabled={loading || !input.trim()}
                        style={{
                            backgroundColor: (loading || !input.trim()) ? '#cbd5e1' : '#f97316',
                            color: 'white',
                            border: 'none',
                            padding: '0 24px',
                            borderRadius: '8px',
                            fontWeight: 'bold',
                            cursor: (loading || !input.trim()) ? 'not-allowed' : 'pointer',
                            transition: 'background-color 0.2s'
                        }}
                    >
                        Send
                    </button>
                </div>
            </div>

            {/* CSS Keyframes for typing animation */}
            <style>
                {`
                @keyframes typingBounce {
                    0%, 80%, 100% { transform: translateY(0); }
                    40% { transform: translateY(-6px); }
                }
                .typing-dot {
                    width: 8px;
                    height: 8px;
                    background-color: #94a3b8;
                    border-radius: 50%;
                    animation: typingBounce 1.4s infinite ease-in-out both;
                }
                `}
            </style>
        </div>
    );
};

export default AIAssistant;
