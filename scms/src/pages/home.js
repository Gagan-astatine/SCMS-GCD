import supabase from "../config/SupabaseClient"

const Home = () => {
  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  return (
    <div className="page home">
      <div className="home-header">
        <h2>Dashboard</h2>
        <button onClick={handleLogout} className="btn-logout">Logout</button>
      </div>
      <div className="dashboard-content">
        <p>Welcome to the SCMS Logistics Control Dashboard.</p>
        <p>Please select a module from the sidebar to continue.</p>
      </div>
    </div>
  )
}

export default Home