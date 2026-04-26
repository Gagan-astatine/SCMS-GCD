import supabase from "../config/SupabaseClient"

const DriverDashboard = () => {
  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  return (
    <div className="page home">
      <div className="home-header">
        <h2>Driver Dashboard</h2>
        <button onClick={handleLogout} className="btn-logout">Logout</button>
      </div>
      <div className="dashboard-content">
        <p>Welcome to the Driver Portal.</p>
        <p>View your assigned loads, map routes, and earnings from the sidebar.</p>
      </div>
    </div>
  )
}

export default DriverDashboard
