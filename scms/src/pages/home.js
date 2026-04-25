import supabase from "../config/SupabaseClient"

const Home = () => {
  console.log(supabase)

  return (
    <div className="page home">
      <h2>HEllo</h2>
    </div>
  )
}

export default Home