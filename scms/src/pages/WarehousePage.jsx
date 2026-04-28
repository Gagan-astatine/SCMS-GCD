import React, { useEffect, useState } from 'react';
import supabase from '../config/SupabaseClient';
import useWarehouseMonitor from '../hooks/useWarehouseMonitor';
import WarehouseMap from '../components/WarehouseMap';

//  NOTE: I am deliberately NOT rendering <WarehouseAlertBanner /> here because you 
// literally just placed it globally in App.jsx! If you render it here too, you will 
// have two identical overlapping banners on the screen. 
// If you ever want to remove it from App.jsx and put it ONLY on this page, uncomment the import!
// import WarehouseAlertBanner from '../components/WarehouseAlertBanner';

const WarehousePage = () => {
    // 1. Hook into our global state monitor
    const { warehouses, overflowing } = useWarehouseMonitor();

    // Local state for the reroute count
    const [reroutesToday, setReroutesToday] = useState(0);

    // 2. Fetch today's auto-reroute count from Supabase
    useEffect(() => {
        const fetchReroutes = async () => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const { count, error } = await supabase
                .from('truck_reroutes')
                .select('*', { count: 'exact', head: true })
                .gte('rerouted_at', today.toISOString());

            if (!error && count !== null) {
                setReroutesToday(count);
            } else if (error) {
                console.error("Error fetching reroutes:", error);
            }
        };

        fetchReroutes();
    }, []);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 40px)', padding: '20px', boxSizing: 'border-box' }}>

            {/* <WarehouseAlertBanner /> */}

            <h1 style={{ margin: '0 0 24px 0', fontSize: '28px', color: '#1e293b' }}>Warehouse Control Center</h1>

            {/* 3. Top Stats Bar (3 Metric Cards) */}
            <div style={{ display: 'flex', gap: '20px', marginBottom: '24px' }}>
                <div style={{ flex: 1, backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
                    <h3 style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Warehouses</h3>
                    <p style={{ margin: 0, fontSize: '36px', fontWeight: 'bold', color: '#0f172a' }}>{warehouses.length}</p>
                </div>

                <div style={{ flex: 1, backgroundColor: overflowing.length > 0 ? '#fef2f2' : 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: `1px solid ${overflowing.length > 0 ? '#fecaca' : '#e2e8f0'}` }}>
                    <h3 style={{ margin: '0 0 8px 0', fontSize: '14px', color: overflowing.length > 0 ? '#b91c1c' : '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Overflowing Now</h3>
                    <p style={{ margin: 0, fontSize: '36px', fontWeight: 'bold', color: overflowing.length > 0 ? '#ef4444' : '#0f172a' }}>{overflowing.length}</p>
                </div>

                <div style={{ flex: 1, backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
                    <h3 style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Auto-Reroutes Today</h3>
                    <p style={{ margin: 0, fontSize: '36px', fontWeight: 'bold', color: '#3b82f6' }}>{reroutesToday}</p>
                </div>
            </div>

            {/* 4. Warehouse Map (Takes remaining vertical space) */}
            <div style={{ flex: 1, minHeight: 0, borderRadius: '12px', overflow: 'hidden', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)', border: '1px solid #e2e8f0' }}>
                <WarehouseMap />
            </div>
        </div>
    );
};

export default WarehousePage;
