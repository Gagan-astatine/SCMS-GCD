import React, { useEffect, useState } from 'react';
import supabase from "../config/SupabaseClient"
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, CartesianGrid, Legend
} from 'recharts';
import { useTranslation } from 'react-i18next';

const AnalyticsPage = () => {
    const { t, i18n } = useTranslation();
    const [data, setData] = useState({
        warehouses: [],
        logs: [],
        reroutes: [],
        fleet: [],
        orders: [],
        drivers: [],
        warehouseStats: []
    });

    // We only use loading for the initial load, no global error state anymore
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAllData = async () => {
            setLoading(true);

            // 1. Warehouses
            let wData = [];
            try {
                const { data: resData, error } = await supabase.from('warehouses').select('*');
                if (error) throw error;
                wData = resData || [];
            } catch (err) {
                console.error('warehouses fetch failed:', err);
            }

            // 2. Warehouse Logs
            let lData = [];
            try {
                const { data: resData, error } = await supabase.from('warehouse_logs').select('*').order('triggered_at', { ascending: false }).limit(10);
                if (error) throw error;
                lData = resData || [];
            } catch (err) {
                console.error('warehouse_logs fetch failed:', err);
            }

            // 3. Truck Reroutes
            let rData = [];
            try {
                const { data: resData, error } = await supabase.from('truck_reroutes').select('*');
                if (error) throw error;
                rData = resData || [];
            } catch (err) {
                console.error('truck_reroutes fetch failed:', err);
            }

            // 4. Fleet
            let fData = [];
            try {
                // Trying lowercase first, if your table is exactly "Fleet" we log the error
                const { data: resData, error } = await supabase.from('Fleet').select('*');
                if (error) throw error;
                fData = resData || [];
            } catch (err) {
                console.error('fleet table fetch failed:', err);
            }

            // 5. Orders
            let oData = [];
            try {
                const { data: resData, error } = await supabase.from('Load').select('*');
                if (error) throw error;
                oData = resData || [];
            } catch (err) {
                console.error('load_id table fetch failed:', err);
            }

            // 6. Drivers
            let dData = [];
            try {
                const { data: resData, error } = await supabase.from('driver').select('*');
                if (error) throw error;
                dData = resData || [];
            } catch (err) {
                console.error('drivers fetch failed:', err);
            }

            // 7. Warehouse Stats
            let wsData = [];
            try {
                const { data: resData, error } = await supabase.from('warehouse').select('*');
                if (error) throw error;
                wsData = resData || [];
            } catch (err) {
                console.error('warehouse (stats) fetch failed:', err);
            }

            setData({
                warehouses: wData,
                logs: lData,
                reroutes: rData,
                fleet: fData,
                orders: oData,
                drivers: dData,
                warehouseStats: wsData
            });

            setLoading(false);
        };

        fetchAllData();
    }, []);

    if (loading) {
        return (
            <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f172a', color: 'white' }}>
                <h2>{t('loading', 'Loading Analytics...')}</h2>
            </div>
        );
    }

    // --- Data Processing ---

    // SECTION 1
    const totalWarehouses = data.warehouses.length;
    const overflowingWarehouses = data.warehouses.filter(w => {
        const cap = w.max_capacity || 1;
        return ((w.current_load + (w.reserved_space || 0)) / cap) > 0.85;
    }).length;

    const totalTrucks = data.fleet.length;
    const activeTrucks = data.fleet.filter(t => t.vehicle_status === true || t.vehicle_status === 'true').length;

    const totalOrders = data.orders.length;
    const totalDrivers = data.drivers.length;

    // SECTION 2
    const warehouseCapacityData = data.warehouses.map(w => {
        const fillPercent = Math.round(((w.current_load + (w.reserved_space || 0)) / (w.max_capacity || 1)) * 100);
        let color = '#22c55e'; // green
        if (fillPercent > 85) color = '#ef4444'; // red
        else if (fillPercent >= 60) color = '#f59e0b'; // amber

        return {
            name: t(w.name?.toLowerCase(), w.name || 'Unknown'),
            fillPercent,
            current_load: w.current_load || 0,
            max_capacity: w.max_capacity || 0,
            color
        };
    });

    // SECTION 3
    const orderStatusCounts = data.orders.reduce((acc, order) => {
        const status = order.status ? t(order.status.toLowerCase(), order.status) : t('pending', 'Pending');
        acc[status] = (acc[status] || 0) + 1;
        return acc;
    }, {});

    const orderStatusData = Object.keys(orderStatusCounts).map(status => ({
        name: status,
        value: orderStatusCounts[status]
    }));
    const PIE_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

    // SECTION 4
    const fleetDonutData = [
        { name: t('active', 'Active'), value: activeTrucks },
        { name: t('inactive', 'Inactive'), value: totalTrucks - activeTrucks }
    ];
    const DONUT_COLORS = ['#10b981', '#64748b'];

    // SECTION 5
    const sortedDrivers = [...data.drivers].sort((a, b) => (b.rating || 0) - (a.rating || 0));

    // SECTION 7
    const ioData = data.warehouseStats.map(w => ({
        name: t(w.warehouse_name?.toLowerCase(), w.warehouse_name || 'Unknown'),
        inbound: Number(w.inbound) || 0,
        outbound: Number(w.outbound) || 0,
        onhand: Number(w.onhand) || 0
    }));

    // Reusable styles
    const cardStyle = {
        backgroundColor: '#1e293b',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
        border: '1px solid #334155'
    };

    const titleStyle = { margin: '0 0 16px 0', fontSize: '1.1rem', color: '#f8fafc', fontWeight: '600' };
    const emptyStateStyle = { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: '#64748b', fontStyle: 'italic', minHeight: '200px' };

    // Removed unused getStatusText

    return (
        <div style={{ padding: '24px', backgroundColor: '#0f172a', minHeight: '100vh', color: '#e2e8f0', boxSizing: 'border-box' }}>
            <h1 style={{ margin: '0 0 24px 0', color: 'white' }}>{t('analytics.dashboard', 'SCMS Analytics Dashboard')}</h1>

            {/* SECTION 1: Top KPI Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '24px' }}>
                <div style={cardStyle}>
                    <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.9rem' }}>{t('cards.total_warehouses', 'Total Warehouses')}</p>
                    <h2 style={{ margin: '8px 0 0 0', fontSize: '2rem', color: 'white' }}>{data.warehouses.length > 0 ? totalWarehouses.toLocaleString(i18n.language) : '-'}</h2>
                </div>
                <div style={cardStyle}>
                    <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.9rem' }}>{t('cards.overflowing_now', 'Overflowing Warehouses')}</p>
                    <h2 style={{ margin: '8px 0 0 0', fontSize: '2rem', color: overflowingWarehouses > 0 ? '#ef4444' : 'white' }}>{data.warehouses.length > 0 ? overflowingWarehouses.toLocaleString(i18n.language) : '-'}</h2>
                </div>
                <div style={cardStyle}>
                    <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.9rem' }}>{t('cards.total_trucks', 'Total Trucks')}</p>
                    <h2 style={{ margin: '8px 0 0 0', fontSize: '2rem', color: 'white' }}>{data.fleet.length > 0 ? totalTrucks.toLocaleString(i18n.language) : '-'}</h2>
                </div>
                <div style={cardStyle}>
                    <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.9rem' }}>{t('cards.active_trucks', 'Active Trucks')}</p>
                    <h2 style={{ margin: '8px 0 0 0', fontSize: '2rem', color: '#10b981' }}>{data.fleet.length > 0 ? activeTrucks.toLocaleString(i18n.language) : '-'}</h2>
                </div>
                <div style={cardStyle}>
                    <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.9rem' }}>{t('cards.total_orders', 'Total Orders')}</p>
                    <h2 style={{ margin: '8px 0 0 0', fontSize: '2rem', color: 'white' }}>{data.orders.length > 0 ? totalOrders.toLocaleString(i18n.language) : '-'}</h2>
                </div>
                <div style={cardStyle}>
                    <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.9rem' }}>{t('cards.total_drivers', 'Total Drivers')}</p>
                    <h2 style={{ margin: '8px 0 0 0', fontSize: '2rem', color: 'white' }}>{data.drivers.length > 0 ? totalDrivers.toLocaleString(i18n.language) : '-'}</h2>
                </div>
            </div>

            {/* Middle Row Charts */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '24px', marginBottom: '24px' }}>

                {/* SECTION 2: Warehouse Capacity */}
                <div style={cardStyle}>
                    <h3 style={titleStyle}>{t('analytics.warehouse_capacity', 'Warehouse Capacity (%)')}</h3>
                    <div style={{ width: '100%', height: 300 }}>
                        {warehouseCapacityData.length > 0 ? (
                            <ResponsiveContainer>
                                <BarChart data={warehouseCapacityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickFormatter={(val) => val.split(' ')[0]} />
                                    <YAxis stroke="#94a3b8" fontSize={12} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }}
                                        formatter={(value, name, props) => [`${value.toLocaleString(i18n.language)}% (${props.payload.current_load.toLocaleString(i18n.language)}/${props.payload.max_capacity.toLocaleString(i18n.language)})`, t('warehouse.fill_percent', 'Filled')]}
                                    />
                                    <Bar dataKey="fillPercent" radius={[4, 4, 0, 0]}>
                                        {warehouseCapacityData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div style={emptyStateStyle}>{t('no_data', 'No data available')}</div>
                        )}
                    </div>
                </div>

                {/* SECTION 7: Inbound vs Outbound */}
                <div style={cardStyle}>
                    <h3 style={titleStyle}>{t('analytics.inbound_vs_outbound', 'Inbound vs Outbound Volume')}</h3>
                    <div style={{ width: '100%', height: 300 }}>
                        {ioData.length > 0 ? (
                            <ResponsiveContainer>
                                <BarChart data={ioData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickFormatter={(val) => val?.split(' ')[0] || val} />
                                    <YAxis stroke="#94a3b8" fontSize={12} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }}
                                        formatter={(value, name, props) => [`${value.toLocaleString(i18n.language)} (${t('warehouse.onhand', 'On hand')}: ${props.payload.onhand.toLocaleString(i18n.language)})`, name]}
                                    />
                                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                                    <Bar dataKey="inbound" name={t('inbound', 'Inbound')} fill="#3b82f6" radius={[2, 2, 0, 0]} />
                                    <Bar dataKey="outbound" name={t('outbound', 'Outbound')} fill="#f59e0b" radius={[2, 2, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div style={emptyStateStyle}>{t('no_data', 'No data available')}</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Bottom Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>

                {/* SECTION 3 & 4: Pie/Donut Charts Container */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div style={cardStyle}>
                        <h3 style={titleStyle}>{t('analytics.order_status', 'Order Status Distribution')}</h3>
                        <div style={{ width: '100%', height: 250 }}>
                            {orderStatusData.length > 0 ? (
                                <ResponsiveContainer>
                                    <PieChart>
                                        <Pie data={orderStatusData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                                            {orderStatusData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }} />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <div style={emptyStateStyle}>{t('no_data', 'No data available')}</div>
                            )}
                        </div>
                    </div>

                    <div style={cardStyle}>
                        <h3 style={titleStyle}>{t('analytics.fleet_status', 'Fleet Status')}</h3>
                        <div style={{ width: '100%', height: 250 }}>
                            {data.fleet.length > 0 ? (
                                <ResponsiveContainer>
                                    <PieChart>
                                        <Pie data={fleetDonutData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} dataKey="value" label>
                                            {fleetDonutData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={DONUT_COLORS[index % DONUT_COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }} />
                                        <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" fill="white" fontSize={24} fontWeight="bold">
                                            {Math.round((activeTrucks / (totalTrucks || 1)) * 100)}%
                                        </text>
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <div style={emptyStateStyle}>{t('no_data', 'No data available')}</div>
                            )}
                        </div>
                    </div>
                </div>

                {/* SECTION 5: Driver Performance */}
                <div style={cardStyle}>
                    <h3 style={titleStyle}>{t('analytics.driver_performance', 'Driver Performance Ranking')}</h3>
                    {sortedDrivers.length > 0 ? (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid #334155', color: '#94a3b8' }}>
                                        <th style={{ padding: '12px 8px' }}>{t('name', 'Driver Name')}</th>
                                        <th style={{ padding: '12px 8px' }}>{t('rating', 'Rating')}</th>
                                        <th style={{ padding: '12px 8px' }}>{t('status', 'Status')}</th>
                                        <th style={{ padding: '12px 8px' }}>{t('last_trip', 'Last Trip')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sortedDrivers.slice(0, 8).map(driver => (
                                        <tr key={driver.driver_id || driver.id || Math.random()} style={{ borderBottom: '1px solid #334155' }}>
                                            <td style={{ padding: '12px 8px', color: 'white' }}>{driver.name}</td>
                                            <td style={{ padding: '12px 8px', color: '#f59e0b' }}>
                                                {'★'.repeat(Math.floor(driver.rating || 0))}
                                                <span style={{ color: '#475569' }}>{'★'.repeat(5 - Math.floor(driver.rating || 0))}</span>
                                                <span style={{ marginLeft: '4px', color: '#94a3b8' }}>{driver.rating}</span>
                                            </td>
                                            <td style={{ padding: '12px 8px' }}>
                                                <span style={{
                                                    padding: '4px 8px', borderRadius: '12px', fontSize: '0.8rem',
                                                    backgroundColor: driver.status?.toLowerCase() === 'assigned' ? '#064e3b' :
                                                        driver.status?.toLowerCase() === 'available' ? '#1e3a8a' : '#334155',
                                                    color: driver.status?.toLowerCase() === 'assigned' ? '#34d399' :
                                                        driver.status?.toLowerCase() === 'available' ? '#60a5fa' : '#94a3b8'
                                                }}>
                                                    {driver.status ? t(driver.status.toLowerCase(), driver.status) : t('offline', 'Offline')}
                                                </span>
                                            </td>
                                            <td style={{ padding: '12px 8px', color: '#94a3b8' }}>{driver.last_trip || 'N/A'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div style={emptyStateStyle}>{t('no_data', 'No data available')}</div>
                    )}
                </div>

                {/* SECTION 6: Warehouse Events Timeline */}
                <div style={cardStyle}>
                    <h3 style={titleStyle}>{t('analytics.warehouse_events', 'Warehouse Events Log')}</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {data.logs.length > 0 ? data.logs.map(log => {
                            let badgeColor = '#10b981'; // restored = green
                            let bgColor = '#064e3b';

                            if (log.event_type === 'overflow') {
                                badgeColor = '#ef4444'; bgColor = '#7f1d1d';
                            } else if (log.event_type === 'reroute') {
                                badgeColor = '#f59e0b'; bgColor = '#78350f';
                            }

                            // Calculate time ago safely
                            let timeStr = t('just_now', 'Just now');
                            if (log.triggered_at) {
                                const minutesAgo = Math.floor((new Date() - new Date(log.triggered_at)) / 60000);
                                timeStr = minutesAgo < 60 ? t('mins_ago', { count: minutesAgo }) : t('hours_ago', { count: Math.floor(minutesAgo / 60) });
                            }

                            return (
                                <div key={log.id || Math.random()} style={{ display: 'flex', gap: '12px', borderLeft: `2px solid ${badgeColor}`, paddingLeft: '12px' }}>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                            <span style={{
                                                backgroundColor: bgColor, color: badgeColor, fontSize: '0.75rem',
                                                padding: '2px 8px', borderRadius: '12px', fontWeight: 'bold',
                                                textTransform: 'uppercase'
                                            }}>
                                                {log.event_type ? t(log.event_type.toLowerCase(), log.event_type) : t('event', 'Event')}
                                            </span>
                                            <span style={{ color: '#64748b', fontSize: '0.8rem' }}>{timeStr}</span>
                                        </div>
                                        <p style={{ margin: '0 0 4px 0', color: 'white', fontSize: '0.9rem' }}>{log.message || 'Unknown event occurred.'}</p>
                                    </div>
                                </div>
                            );
                        }) : (
                            <div style={emptyStateStyle}>{t('no_data', 'No data available')}</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsPage;
