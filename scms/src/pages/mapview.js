import { useEffect, useState } from "react"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import L from "leaflet"
import supabase from "../config/SupabaseClient"

// Custom premium truck icon for map markers
const truckIcon = new L.divIcon({
    className: 'custom-truck-marker',
    html: `
        <div style="
            background-color: #fff;
            border: 2px solid #f59e0b;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 12px rgba(0,0,0,0.25);
            transition: transform 0.2s;
        ">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <rect x="1" y="3" width="15" height="13"></rect>
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                <circle cx="5.5" cy="18.5" r="2.5"></circle>
                <circle cx="18.5" cy="18.5" r="2.5"></circle>
            </svg>
        </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20]
});

const MapView = () => {
    const [fleet, setFleet] = useState([])

    useEffect(() => {
        const fetchFleetLocations = async () => {
            const { data, error } = await supabase
                .from("Fleet")
                .select() // Fetch all columns to prevent 'column does not exist' errors

            if (error) {
                console.log("Error fetching Fleet data:", error)
                return
            }

            // Convert location string → lat/lng
            const formatted = data.map((item) => {
                // Safely grab the coordinate string from either the new or old column
                const locString = item.FleetLocations || item.loaction || item.location;

                if (!locString || typeof locString !== 'string') return null;

                const [lat, lng] = locString.split(",").map(Number)

                // Skip if coordinates are invalid
                if (isNaN(lat) || isNaN(lng)) return null;

                return {
                    ...item,
                    lat,
                    lng,
                    displayLoc: locString
                }
            }).filter(Boolean) // remove any nulls

            setFleet(formatted)
        }

        fetchFleetLocations()
    }, [])

    return (
        <div className="page map-view" style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px', animation: 'fadeIn 0.5s ease-out' }}>

            <div className="map-title" style={{ marginBottom: '24px' }}>
                <h2 style={{ fontSize: '2rem', color: '#f97316', margin: '0', fontWeight: '800', letterSpacing: '-0.02em', textTransform: 'uppercase' }}>
                    Live Fleet Tracking
                </h2>
                <p style={{ color: '#64748b', margin: '8px 0 0', fontSize: '1rem' }}>
                    Monitor real-time GPS locations of your active trucks.
                </p>
            </div>

            <div style={{
                height: "75vh",
                width: "100%",
                borderRadius: "20px",
                overflow: "hidden",
                boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                border: "1px solid #e2e8f0"
            }}>
                <MapContainer center={[12.9716, 77.5946]} zoom={10} style={{ height: "100%", width: "100%" }}>

                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />

                    {fleet.map((truck) => (
                        <Marker key={truck.vehicle_id} position={[truck.lat, truck.lng]} icon={truckIcon}>
                            <Popup>
                                <div style={{ textAlign: 'center' }}>
                                    <h3 style={{ margin: '0 0 5px 0', color: '#0f172a' }}>Truck #{truck["Vehicle Id"] || truck.vehicle_id}</h3>
                                    <span style={{ fontSize: '0.85rem', color: '#64748b', background: '#f1f5f9', padding: '4px 8px', borderRadius: '8px' }}>
                                        {truck.displayLoc}
                                    </span>
                                </div>
                            </Popup>
                        </Marker>
                    ))}

                </MapContainer>
            </div>
        </div>
    )
}

export default MapView