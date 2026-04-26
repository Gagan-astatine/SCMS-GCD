import { useEffect, useState } from "react"
import supabase from "../config/SupabaseClient"

const TruckIcon = () => (
  <svg className="truck-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="3" width="15" height="13"></rect>
    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
    <circle cx="5.5" cy="18.5" r="2.5"></circle>
    <circle cx="18.5" cy="18.5" r="2.5"></circle>
  </svg>
)

const Orders = () => {
  const [fetchError, setFetchError] = useState(null)
  const [loadData, setLoadData] = useState(null)

  useEffect(() => {
    const fetchLoads = async () => {
      const { data, error } = await supabase
        .from('Load')
        .select()

      if (error) {
        setFetchError('Could not fetch the loads')
        setLoadData(null)
        console.log(error)
      }
      if (data) {
        setLoadData(data)
        setFetchError(null)
      }
    }

    fetchLoads()
  }, [])

  return (
    <div className="page orders">
      <div className="home-header">
        <h2>Orders</h2>
      </div>
      {fetchError && (<p className="error">{fetchError}</p>)}
      {loadData && loadData.length === 0 && (
        <p>No data found! The "Load" table is either empty or Row Level Security (RLS) is blocking read access.</p>
      )}
      {loadData && loadData.length > 0 && (
        <div className="loads">
          {loadData.map((load) => (
            <div key={load.load_id} className="load-card">
              <div className="load-header">
                <div className="load-title-wrapper">
                  <TruckIcon />
                  <h3 className="load-title">{load.customer}</h3>
                </div>
                <span className="load-id">ID: {load.load_id}</span>
              </div>
              <div className="load-details">
                <div className="detail-item">
                  <span className="detail-label">CUSTOMER</span>
                  <span className="detail-value">{load.customer}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">PICKUP</span>
                  <span className="detail-value">{load.pickup}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">DROP</span>
                  <span className="detail-value">{load.drop}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">ETA</span>
                  <span className="detail-value">{load.eta}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">STATUS</span>
                  <span className="detail-value">{load.status}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">ASSIGNED DRIVER</span>
                  <span className="detail-value">{load.assigned_driver}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Orders
