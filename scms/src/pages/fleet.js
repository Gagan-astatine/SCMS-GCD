import { useEffect, useState } from "react"
import supabase from "../config/SupabaseClient"

const Fleet = () => {
  const [fetchError, setFetchError] = useState(null)
  const [fleetData, setFleetData] = useState(null)

  useEffect(() => {
    const fetchFleet = async () => {
      const { data, error } = await supabase
        .from('Fleet')   
        .select()

      if (error) {
        setFetchError('Could not fetch fleet data')
        setFleetData(null)
        console.log(error)
      }

      if (data) {
        setFleetData(data)
        setFetchError(null)
      }
    }

    fetchFleet()
  }, [])

  return (
    <div className="page fleet">
      <div className="fleet-title" style={{ marginBottom: '30px' }}>
        <h2>Fleet Overview</h2>
        <p>Manage and monitor real-time vehicle status and assignments.</p>
      </div>

      {fetchError && (<p className="error">{fetchError}</p>)}

      {fleetData && fleetData.length === 0 && (
        <p>No vehicles found! Add some trucks or check RLS.</p>
      )}

      {fleetData && fleetData.length > 0 && (
        <div className="fleet-list">
          {fleetData.map((vehicle) => (
            <div key={vehicle.vehicle_id} className="fleet-card">

              <div className="fleet-header">
                <div className="fleet-header-left">
                  <div className="fleet-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
                  </div>
                  <h3>{vehicle.vehicle_id}</h3>
                </div>
                <span className="fleet-header-badge">
                  {vehicle.vehicle_status ? "Active 🟢" : "Inactive 🔴"}
                </span>
              </div>

              <div className="fleet-details">

                <div className="detail-item full-width stat-driver">
                  <span className="detail-label">ASSIGNED DRIVER</span>
                  <span className="detail-value">{vehicle.assigned_driver}</span>
                </div>

                <div className="detail-item full-width">
                  <span className="detail-label">LOCATION</span>
                  <span className="detail-value">{vehicle.location}</span>
                </div>

                <div className={`detail-item ${vehicle.vehicle_status ? 'stat-running' : 'stat-stopped'}`}>
                  <span className="detail-label">STATUS</span>
                  <span className="detail-value">
                    {vehicle.vehicle_status ? "Running" : "Stopped"}
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

export default Fleet