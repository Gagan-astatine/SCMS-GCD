import { useEffect, useState } from "react"
import supabase from "../config/SupabaseClient"

const Dispatch = () => {
    const [fetchError, setFetchError] = useState(null)
    const [dispatchData, setDispatchData] = useState(null)
    const [drivers, setDrivers] = useState([])

    useEffect(() => {


        const fetchLoads = async () => {
            const { data, error } = await supabase
                .from('Load')
                .select('assigned_driver, unassigned, assigned, driver_id')

            if (error) {
                setFetchError("Could not fetch dispatch data")
                setDispatchData(null)
                console.log(error)
                return
            }


            const processedData = data.map((item) => {
                if (item.unassigned === true) {
                    return { ...item, assigned: false }
                }
                if (item.assigned === true) {
                    return { ...item, unassigned: false }
                }
                return item
            })

            setDispatchData(processedData)
            setFetchError(null)
        }


        const fetchDrivers = async () => {
            const { data, error } = await supabase
                .from('driver')
                .select('driver_id, name, status, rating')
                .ilike('status', 'available')

            if (error) {
                console.log("Driver fetch error:", error)
                return
            }

            console.log("Fetched available drivers:", data)
            setDrivers(data || [])
        }

        fetchLoads()
        fetchDrivers()

    }, [])

  return (
    <div className="page dispatch">
      <div className="dispatch-title" style={{ marginBottom: '30px' }}>
        <h2>Dispatch Control</h2>
        <p>Manage unassigned loads and assign available drivers.</p>
      </div>

      {fetchError && <p className="error">{fetchError}</p>}

      {dispatchData && dispatchData.length === 0 && (
        <p>No dispatch data available</p>
      )}

      {dispatchData && dispatchData.length > 0 && (
        <div className="dispatch-list">
          {dispatchData.map((item, index) => {
            const statusText = item.unassigned ? "Unassigned 🔴" : item.assigned ? "Assigned 🟢" : "Unknown ⚪";
            const statusClass = item.unassigned ? "stat-unassigned" : "stat-assigned";

            return (
              <div key={index} className="dispatch-card">
                <div className="dispatch-header">
                  <div className="dispatch-header-left">
                    <div className="dispatch-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>
                    </div>
                    <h3>Load #{index + 1}</h3>
                  </div>
                  <span className="dispatch-header-badge">
                    {statusText}
                  </span>
                </div>

                <div className="dispatch-details">
                  <div className="detail-item full-width stat-driver">
                    <span className="detail-label">ASSIGNED DRIVER</span>
                    <span className="detail-value">{item.assigned_driver || "None"}</span>
                  </div>

                  <div className={`detail-item ${statusClass}`}>
                    <span className="detail-label">STATUS</span>
                    <span className="detail-value">
                      {item.unassigned ? "Unassigned" : item.assigned ? "Assigned" : "Unknown"}
                    </span>
                  </div>

                  <div className="detail-item">
                    <span className="detail-label">DRIVER ID</span>
                    <span className="detail-value" style={{ fontSize: '0.9rem' }}>{item.driver_id || "Not linked"}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 🔹 Show available drivers */}
      <div className="drivers-section" style={{ marginTop: '40px', background: 'white', padding: '24px', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.04)', border: '1px solid rgba(226, 232, 240, 0.8)' }}>
        <h3 style={{ margin: '0 0 16px 0', color: '#0f172a', fontSize: '1.25rem' }}>Available Drivers</h3>
        {drivers.length === 0 ? (
          <p style={{ color: '#64748b' }}>No drivers found</p>
        ) : (
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {drivers.map((driver) => (
              <div key={driver.driver_id} style={{ 
                  background: '#f8fafc', 
                  padding: '12px 20px', 
                  borderRadius: '16px', 
                  border: '1px solid #e2e8f0', 
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
              }}>
                <span style={{ fontWeight: '700', color: '#0f172a', fontSize: '1rem' }}>{driver.name}</span>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span style={{ color: '#10b981', fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase' }}>{driver.status}</span>
                    <span style={{ color: '#64748b', fontSize: '0.75rem' }}>•</span>
                    <span style={{ color: '#f59e0b', fontSize: '0.75rem', fontWeight: 'bold' }}>⭐ {driver.rating || "N/A"}</span>
                </div>
                <span style={{ color: '#94a3b8', fontSize: '0.7rem', fontFamily: 'monospace' }}>ID: {driver.driver_id}</span>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}

export default Dispatch