import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import AuthPage from "./AuthPage";
import Dashboard from "./Dashboard";
import Contact from "./Contact";
import Customer from "./Customer";
import Leads from "./Lead";
import Transactions from "./Transaction";
import API from "./Api/api";

type Role = "admin" | "staff";

export default function App() {
  console.log("API BaseURL:", API.defaults?.baseURL);

  const [_isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState<Role>("staff");

  return (
    <Router>
      <Routes>
        {/* Authentication */}
        <Route path="/" element={<AuthPage
              setIsAuthenticated={setIsAuthenticated}
              setRole={setRole} 
            />
          }
        />

        {/* Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Contacts */}
        <Route path="/contacts" element={<Contact role={role} />} />

        {/* Customers */}
        <Route path="/customers" element={<Customer />} />

        {/* Leads */}
        <Route path="/leads" element={<Leads />} />

        {/* Transactions */}
        <Route path="/transactions" element={<Transactions />} />
      </Routes>
    </Router>
  );
}
