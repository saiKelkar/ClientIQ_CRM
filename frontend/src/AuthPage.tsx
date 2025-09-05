import React, { useState, useEffect, type FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import { loginUser, signupUser, getDashboard } from "./Api/api"

type Role = "admin" | "staff"

interface AuthPageProps {
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
  setRole: React.Dispatch<React.SetStateAction<Role>>
}

export const getDashboard = async () => {
  const res = await api.get<UserResponse>("/auth/dashboard")
  return res.data 
}

export default function AuthPage({
  setIsAuthenticated,
  setRole,
}: AuthPageProps) {
  const [mode, setMode] = useState<"login" | "signup">("login")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setLocalRole] = useState<Role>("staff")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    getDashboard()
      .then((data) => {
        setIsAuthenticated(true)
        if (data.role) setRole(data.role)
        navigate("/dashboard")
      })
      .catch(() => setIsAuthenticated(false))
  }, [navigate, setIsAuthenticated, setRole])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (mode === "login") {
        const res = await loginUser({ email, password })
        setIsAuthenticated(true)
        if (res.data.role) setRole(res.data.role)
        navigate("/dashboard")
      } else {
        await signupUser({ name, email, password, role })
        setMode("login")
        alert("Signup successful! Please login.")
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow rounded p-8 w-full max-w-md">
        <div className="flex mb-6">
          <button
            className={`flex-1 py-2 ${
              mode === "login"
                ? "border-b-2 border-blue-600 font-semibold"
                : "text-gray-500"
            }`}
            onClick={() => setMode("login")}
            type="button"
          >
            Login
          </button>
          <button
            className={`flex-1 py-2 ${
              mode === "signup"
                ? "border-b-2 border-blue-600 font-semibold"
                : "text-gray-500"
            }`}
            onClick={() => setMode("signup")}
            type="button"
          >
            Signup
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {mode === "signup" && (
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mb-4 px-3 py-2 border rounded"
              required
            />
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mb-4 px-3 py-2 border rounded"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mb-4 px-3 py-2 border rounded"
            required
          />

          {mode === "signup" && (
            <div className="mb-4">
              <label className="mr-4 font-semibold">Role:</label>
              <label className="mr-4">
                <input
                  type="radio"
                  name="role"
                  value="admin"
                  checked={role === "admin"}
                  onChange={() => setLocalRole("admin")}
                  className="mr-1"
                />
                Admin
              </label>
              <label>
                <input
                  type="radio"
                  name="role"
                  value="staff"
                  checked={role === "staff"}
                  onChange={() => setLocalRole("staff")}
                  className="mr-1"
                />
                Staff
              </label>
            </div>
          )}

          {error && <p className="mb-4 text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading
              ? mode === "login"
                ? "Logging in..."
                : "Signing up..."
              : mode === "login"
              ? "Login"
              : "Signup"}
          </button>
        </form>
      </div>
    </div>
  )
}
