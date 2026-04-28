import { useState } from 'react'
import supabase from '../config/SupabaseClient'

const Auth = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('seller')
  const [isLogin, setIsLogin] = useState(true)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setMessage(null)
    setLoading(true)

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) setError(error.message)
    } else {

      // ✅ ADD HERE (inside else block)
      const roleMap = {
        seller: "owner",
        buyer: "buyer",
        driver: "driver"
      };

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: roleMap[role]   // ✅ FIXED
          }
        }
      })

      if (error) {
        setError(error.message)
      } else {
        setMessage('Registration successful!')
        setIsLogin(true)
        setPassword('')
      }
    }

    setLoading(false)
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>{isLogin ? 'Access Your Intelligence Core' : 'Initialize Your Core'}</h2>
        <p className="auth-subtitle">
          {isLogin
            ? 'Sign in to manage your knowledge base and unlock AI-powered analysis'
            : 'Sign up to build your secure logistics intelligence network'}
        </p>

        {error && <p className="auth-error">{error}</p>}
        {message && <p className="auth-message">{message}</p>}

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <div className="input-group">
              <label htmlFor="role">Account Type</label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="auth-input"
              >
                <option value="seller">Seller</option>
                <option value="buyer">Buyer</option>
                <option value="driver">Driver</option>
              </select>
            </div>
          )}

          <div className="input-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="enter your email"
              className="auth-input"
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="enter your password"
              className="auth-input"
              required
            />
          </div>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'Processing...' : (isLogin ? 'Continue With Mail ➔' : 'Create Account ➔')}
          </button>
        </form>

        <p className="auth-toggle">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Sign Up' : 'Sign In'}
          </span>
        </p>
        <p className="auth-encryption-notice">
          Your data is encrypted and secure. We never share your information with third parties.
        </p>
      </div>
    </div>
  )
}

export default Auth
