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

const Home = () => {
  const [fetchError, setFetchError] = useState(null)
  const [loadData, setLoadData] = useState(null)

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

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
    <div className="page home">
      <div className="home-header">
        <h2>Home</h2>
        <button onClick={handleLogout} className="btn-logout">Logout</button>
      </div>
      {fetchError && (<p className="error">{fetchError}</p>)}
      {loadData && loadData.length === 0 && (
        <p>No data found! The "Load" table is either empty or Row Level Security (RLS) is blocking read access.</p>
      )}
      {loadData && loadData.length > 0 && (
        <div className="loads">
          {loadData.map((load) => (
            <div key={load.Truck_id} className="load-card">
              <div className="load-header">
                <div className="load-title-wrapper">
                  <TruckIcon />
                  <h3 className="load-title">{load.Name}</h3>
                </div>
                <span className="load-id">ID: {load.Truck_id.substring(0, 8)}...</span>
              </div>
              <div className="load-details">
                <div className="detail-item">
                  <span className="detail-label">Age</span>
                  <span className="detail-value">{load.Age}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Phone Number</span>
                  <span className="detail-value">{load.Phone_number}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Home