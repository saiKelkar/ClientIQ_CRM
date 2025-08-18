import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { useState } from 'react'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import Dashboard from './Dashboard'
import Customers from "./Customer"
import AuthPage from "./AuthPage"
import Project from "./Project"

type Role = "admin" | "staff"

function App() {
  const [currentScreen, setCurrentScreen] = useState("Dashboard")
  const [role, setRole] = useState<Role>("admin")
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthPage setIsAuthenticated={setIsAuthenticated} setRole={setRole} />} />
        <Route
          path="/dashboard"
          element={
            isAuthenticated ? (
              <div>
                <Sidebar setCurrentScreen={setCurrentScreen} />
                <div className='ml-64 flex flex-col h-screen'>
                  <div className='fixed top-0 right-0 left-64 h-16 bg-gray-200 flex justify-between items-center px-6'>
                    <Topbar currentScreen={currentScreen} role={role} />
                  </div>
                  <main
                    className="mt-16 p-6 overflow-auto flex-grow bg-gray-50"
                    style={{ height: "calc(100vh - 4rem)" }}
                  >
                    <Dashboard />
                  </main>
                </div>
              </div>
            ) : (
              <Navigate to="/" />
            )
          }
        />
      
      <Route
          path="/customers"
          element={
            isAuthenticated ? (
              <div>
                <Sidebar setCurrentScreen={setCurrentScreen} />
                <div className='ml-64 flex flex-col h-screen'>
                  <div className='fixed top-0 right-0 left-64 h-16 bg-gray-200 flex justify-between items-center px-6'>
                    <Topbar currentScreen={currentScreen} role={role} />
                  </div>
                  <main
                    className="mt-16 p-6 overflow-auto flex-grow bg-gray-50"
                    style={{ height: "calc(100vh - 4rem)" }}
                  >
                    <Customers />
                  </main>
                </div>
              </div>
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route
          path="/projects"
          element={
            isAuthenticated ? (
              <div>
                <Sidebar setCurrentScreen={setCurrentScreen} />
                <div className='ml-64 flex flex-col h-screen'>
                  <div className='fixed top-0 right-0 left-64 h-16 bg-gray-200 flex justify-between items-center px-6'>
                    <Topbar currentScreen={currentScreen} role={role} />
                  </div>
                  <main
                    className="mt-16 p-6 overflow-auto flex-grow bg-gray-50"
                    style={{ height: "calc(100vh - 4rem)" }}
                  >
                    <Project />
                  </main>
                </div>
              </div>
            ) : (
              <Navigate to="/" />
            )
          }
        />

      </Routes>
    </Router>
  )
}

export default App
