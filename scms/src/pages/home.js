import { useEffect, useState } from "react"
import supabase from "../config/SupabaseClient"

const Home = () => {
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
    <div className="page home">
      {fetchError && (<p className="error">{fetchError}</p>)}
      {loadData && loadData.length === 0 && (
        <p>No data found! The "Load" table is either empty or Row Level Security (RLS) is blocking read access.</p>
      )}
      {loadData && loadData.length > 0 && (
        <div className="loads">
          {loadData.map((load) => (
            <div key={load.Truck_id} className="load-card">
              <div className="load-header">
                <h3 className="load-title">{load.Name}</h3>
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