import React, { useEffect, useState } from 'react';
import supabase from '../config/SupabaseClient';
import AIAssistant from '../components/AIAssistant';

const AIAssistancePage = () => {
    const [stats, setStats] = useState({
        overflowing: 0,
        activeTrucks: 0,
        unassignedOrders: 0,
        availableDrivers: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // 1. Warehouses (Overflowing)
                const { data: wData } = await supabase.from('warehouses').select('*');
                let overflowing = 0;
                if (wData) {
                    overflowing = wData.filter(w => ((w.current_load + (w.reserved_space || 0)) / (w.max_capacity || 1)) > 0.85).length;
                }

                // 2. Fleet (Active Trucks)
                const { data: fData } = await supabase.from('Fleet').select('*');
                let activeTrucks = 0;
                if (fData) {
                    activeTrucks = fData.filter(t => 
                        t.vehicle_status === true || t.vehicle_status === 'true' || 
                        t["vehicle status"] === true || t["vehicle status"] === 'true'
                    ).length;
                }

                // 3. Orders (Unassigned)
                const { data: oData } = await supabase.from('Load').select('*');
                let unassignedOrders = 0;
                if (oData) {
                    unassignedOrders = oData.filter(o => o.unassigned === true || o.unassigned === 'true' || o.status?.toLowerCase() === 'unassigned').length;
                }

                // 4. Drivers (Available)
                const { data: dData } = await supabase.from('driver').select('*');
                let availableDrivers = 0;
                if (dData) {
                    availableDrivers = dData.filter(d => d.status?.toLowerCase() === 'available').length;
                }

                setStats({ overflowing, activeTrucks, unassignedOrders, availableDrivers });
            } catch (err) {
                console.error("Failed to fetch live stats", err);
            }
        };

        // Fetch immediately, then every 30 seconds
        fetchStats();
        const interval = setInterval(fetchStats, 30000);

        return () => clearInterval(interval);
    }, []);

    const cardStyle = {
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderRadius: '12px',
        padding: '24px',
        border: '1px solid rgba(249, 115, 22, 0.3)',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.05)'
    };

    return (
        <div className="ai-page-container" style={{
            padding: '20px',
            gap: '24px',
            backgroundColor: 'transparent',
            boxSizing: 'border-box',
            minHeight: 'calc(100vh - 70px)'
        }}>
            {/* Left: AI Chat */}
            <div className="ai-chat-container" style={{
                borderRadius: '12px',
                overflow: 'hidden',
                border: '1px solid rgba(249, 115, 22, 0.3)',
                boxShadow: '0 4px 30px rgba(0, 0, 0, 0.05)',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(16px)'
            }}>
                <AIAssistant />
            </div>

            {/* Right: Live Stats Sidebar */}
            <div className="ai-stats-container" style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
                overflowY: 'auto'
            }}>
                <div style={{ padding: '0 4px' }}>
                    <h2 style={{ margin: '0 0 4px 0', color: '#f97316', fontSize: '1.25rem', textTransform: 'uppercase' }}>Live Context</h2>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{ width: '8px', height: '8px', backgroundColor: '#f97316', borderRadius: '50%', animation: 'pulse 2s infinite' }}></div>
                        <p style={{ margin: 0, color: '#64748b', fontSize: '0.85rem' }}>Auto-updating every 30s</p>
                    </div>
                </div>

                <div style={cardStyle}>
                    <p style={{ margin: 0, color: '#64748b', fontSize: '0.85rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Overflowing Warehouses</p>
                    <h3 style={{ margin: 0, color: stats.overflowing > 0 ? '#ef4444' : '#1e293b', fontSize: '2.5rem' }}>{stats.overflowing}</h3>
                </div>

                <div style={cardStyle}>
                    <p style={{ margin: 0, color: '#64748b', fontSize: '0.85rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Active Trucks</p>
                    <h3 style={{ margin: 0, color: '#10b981', fontSize: '2.5rem' }}>{stats.activeTrucks}</h3>
                </div>

                <div style={cardStyle}>
                    <p style={{ margin: 0, color: '#64748b', fontSize: '0.85rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Unassigned Orders</p>
                    <h3 style={{ margin: 0, color: stats.unassignedOrders > 0 ? '#f59e0b' : '#1e293b', fontSize: '2.5rem' }}>{stats.unassignedOrders}</h3>
                </div>

                <div style={cardStyle}>
                    <p style={{ margin: 0, color: '#64748b', fontSize: '0.85rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Available Drivers</p>
                    <h3 style={{ margin: 0, color: '#3b82f6', fontSize: '2.5rem' }}>{stats.availableDrivers}</h3>
                </div>
            </div>

            <style>
                {`
                @keyframes pulse {
                    0% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.5; transform: scale(1.2); }
                    100% { opacity: 1; transform: scale(1); }
                }
                `}
            </style>
        </div>
    );
};

export default AIAssistancePage;
