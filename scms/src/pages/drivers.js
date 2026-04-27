import { useEffect, useState } from "react"
import supabase from "../config/SupabaseClient"

const Driver = () => {
    const [fetchError, setFetchError] = useState(null)
    const [driverData, setDriverData] = useState(null)

    useEffect(() => {
        const fetchDrivers = async () => {
            const { data, error } = await supabase
                .from('driver')
                .select('driver_id, name, status, rating, last_trip')

            if (error) {
                setFetchError('Could not fetch drivers')
                setDriverData(null)
                console.log(error)
            }

            if (data) {
                setDriverData(data)
                setFetchError(null)
            }
        }

        fetchDrivers()
    }, [])

    return (
        <div className="page driver">
            <div className="driver-title" style={{ marginBottom: '30px' }}>
                <h2>Drivers Overview</h2>
                <p>Manage and monitor driver statuses, ratings, and recent activity.</p>
            </div>

            {fetchError && <p className="error">{fetchError}</p>}

            {driverData && driverData.length === 0 && (
                <p>No drivers found! Add some drivers.</p>
            )}

            {driverData && driverData.length > 0 && (
                <div className="driver-list">
                    {driverData.map((driver) => (
                        <div key={driver.driver_id} className="driver-card">

                            <div className="driver-header">
                                <div className="driver-header-left">
                                    <div className="driver-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                                    </div>
                                    <h3>{driver.name}</h3>
                                </div>
                                <span className="driver-header-badge">
                                    ID: {driver.driver_id}
                                </span>
                            </div>

                            <div className="driver-details">

                                <div className="detail-item full-width">
                                    <span className="detail-label">LAST TRIP</span>
                                    <span className="detail-value">
                                        {driver.last_trip || "No trips yet"}
                                    </span>
                                </div>

                                <div className="detail-item stat-status">
                                    <span className="detail-label">STATUS</span>
                                    <span className="detail-value">{driver.status}</span>
                                </div>

                                <div className="detail-item stat-rating">
                                    <span className="detail-label">RATING</span>
                                    <span className="detail-value">
                                        {driver.rating ? `⭐ ${driver.rating}` : "No rating"}
                                    </span>
                                </div>

                            </div>

                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Driver