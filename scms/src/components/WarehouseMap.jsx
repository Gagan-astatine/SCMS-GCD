import React from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import useWarehouseStore from '../store/warehouseStore';

const WarehouseMap = () => {
    // 1. Get warehouses from Zustand store
    const warehouses = useWarehouseStore((state) => state.warehouses);

    // 2. Center coordinate of India
    const position = [20.5937, 78.9629];

    return (
        <MapContainer
            center={position}
            zoom={5}
            style={{ height: '100%', width: '100%', borderRadius: '12px', zIndex: 0 }}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />

            {warehouses.map((warehouse) => {
                // Prevent division by zero
                const capacity = warehouse.max_capacity || 1;
                const totalLoad = warehouse.current_load + warehouse.reserved_space;
                const fillPercent = totalLoad / capacity;

                // Determine color and animation class
                let color = '#22c55e'; // green
                let className = '';

                if (fillPercent > 0.85) {
                    color = '#ef4444'; // red
                    className = 'pulse-circle'; // CSS class for animation
                } else if (fillPercent >= 0.60) {
                    color = '#f59e0b'; // amber
                }

                return (
                    <CircleMarker
                        key={warehouse.id}
                        center={[warehouse.lat, warehouse.lng]}
                        radius={14}
                        color={color}
                        fillColor={color}
                        fillOpacity={0.7}
                        weight={3} // border thickness
                        className={className}
                    >
                        <Popup>
                            <div style={{ minWidth: '160px', padding: '5px' }}>
                                <h3 style={{ margin: '0 0 8px 0', fontSize: '1.1rem' }}>
                                    {warehouse.name}
                                </h3>
                                <p style={{ margin: '4px 0' }}>
                                    <strong>Fill Level:</strong> {Math.round(fillPercent * 100)}%
                                </p>
                                <p style={{ margin: '4px 0' }}>
                                    <strong>Load:</strong> {totalLoad} / {warehouse.max_capacity}
                                </p>

                                <button
                                    style={{
                                        backgroundColor: '#3b82f6',
                                        color: 'white',
                                        border: 'none',
                                        padding: '8px 12px',
                                        borderRadius: '6px',
                                        cursor: 'pointer',
                                        marginTop: '12px',
                                        width: '100%',
                                        fontWeight: 'bold'
                                    }}
                                    onClick={() => alert(`Override reroute triggered for ${warehouse.name}!`)}
                                >
                                    Override Reroute
                                </button>
                            </div>
                        </Popup>
                    </CircleMarker>
                );
            })}
        </MapContainer>
    );
};

export default WarehouseMap;
