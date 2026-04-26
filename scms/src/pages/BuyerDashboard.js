import supabase from "../config/SupabaseClient"

const BuyerDashboard = () => {
  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  return (
    <div className="page home">
      <div className="home-header">
        <h2>Buyer Dashboard</h2>
        <button onClick={handleLogout} className="btn-logout">Logout</button>
      </div>
      <div className="dashboard-content">
        <p>Welcome to the Buyer Portal.</p>
        <p>You can view your purchases, invoices, and tracking from the sidebar.</p>
      </div>
    </div>
  )
}

export default BuyerDashboard
