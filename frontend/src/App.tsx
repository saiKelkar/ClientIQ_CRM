import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { useState, useEffect } from "react"
import Sidebar from "./Sidebar"
import Topbar from "./Topbar"
import Dashboard from "./Dashboard"
import Customers from "./Customer"
import Contacts from "./Contact"
import Leads from "./Lead"
import Transactions from "./Transaction"
import AuthPage from "./AuthPage"

type Role = "admin" | "staff"

export default function App() {
  const [currentScreen, setCurrentScreen] = useState("Dashboard")
  const [role, setRole] = useState<Role>("admin")
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      setIsAuthenticated(true)
    }
  }, [])

  const renderWithLayout = (component: JSX.Element) => (
    <div>
      <Sidebar setCurrentScreen={setCurrentScreen} />
      <div className="ml-64 flex flex-col h-screen">
        <div className="fixed top-0 right-0 left-64 h-16 bg-gray-200 flex justify-between items-center px-6">
          <Topbar currentScreen={currentScreen} role={role} />
        </div>
        <main
          className="mt-16 p-6 overflow-auto flex-grow bg-gray-50"
          style={{ height: "calc(100vh - 4rem)" }}
        >
          {component}
        </main>
      </div>
    </div>
  )

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<AuthPage setIsAuthenticated={setIsAuthenticated} setRole={setRole} />}
        />

        <Route
          path="/dashboard"
          element={isAuthenticated ? renderWithLayout(<Dashboard />) : <Navigate to="/" />}
        />

        <Route
          path="/contacts"
          element={isAuthenticated ? renderWithLayout(<Contacts />) : <Navigate to="/" />}
        />

        <Route
          path="/customers"
          element={isAuthenticated ? renderWithLayout(<Customers />) : <Navigate to="/" />}
        />

        <Route
          path="/leads"
          element={isAuthenticated ? renderWithLayout(<Leads />) : <Navigate to="/" />}
        />

        <Route
          path="/transactions"
          element={isAuthenticated ? renderWithLayout(<Transactions />) : <Navigate to="/" />}
        />
      </Routes>
    </Router>
  )
}