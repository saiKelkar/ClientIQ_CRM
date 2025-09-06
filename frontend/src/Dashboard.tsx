import { useEffect, useState } from "react"
import KpiTile from "./KpiTile"
import Topbar from "./Topbar"
import Sidebar from "./Sidebar"
import { getCustomers, getContacts, getLeads, getTransactions } from "./Api/api"
import type { 
  CustomerResponse, 
  ContactResponse, 
  LeadResponse, 
  TransactionResponse,
} from "./Api/types"

type Role = "admin" | "staff";

export default function Dashboard() {
  const [customers, setCustomers] = useState<CustomerResponse[]>([])
  const [contacts, setContacts] = useState<ContactResponse[]>([])
  const [leads, setLeads] = useState<LeadResponse[]>([])
  const [transactions, setTransactions] = useState<TransactionResponse[]>([])
  const [role, _setRole] = useState<Role>("staff") 
  const [currentScreen, setCurrentScreen] = useState<string>("Dashboard") 

  useEffect(() => {
    async function fetchData() {
      try {
        const [custRes, contRes, leadRes, transRes] = await Promise.all([
          getCustomers(),
          getContacts(),
          getLeads(),
          getTransactions(),
        ])

        setCustomers(custRes.data)
        setContacts(contRes.data)
        setLeads(leadRes.data)
        setTransactions(transRes.data)
      } catch (err) {
        console.error("Error fetching dashboard data:", err)
      }
    }

    fetchData()
  }, [])

  return (
    <div>
      <Sidebar setCurrentScreen={setCurrentScreen} />
      <div className="ml-64 flex flex-col h-screen">
        <div className="fixed top-0 right-0 left-64 h-16 bg-gray-200 flex justify-between items-center px-6 shadow-[0_2px_4px_0_rgba(0,0,0,0.1)]">
          <Topbar currentScreen={currentScreen} role={role} />
        </div>
        
        <div className="pt-20 p-6 space-y-6">
          {/* KPI Tiles */}
          <div className="grid grid-cols-4 gap-4">
            <KpiTile title="Total Customers" value={customers.length} />
            <KpiTile title="Total Contacts" value={contacts.length} />
            <KpiTile title="Total Leads" value={leads.length} />
            <KpiTile title="Total Transactions" value={transactions.length} />
          </div>

          {/* Cashflow + Income/Expense */}
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2 bg-white rounded shadow p-6">
              <h2 className="font-semibold text-lg mb-4">
                Cashflow (Last 30 days)
              </h2>
              <div className="h-48 bg-gray-200 rounded">Graph placeholder</div>
            </div>

            <div className="bg-white rounded shadow p-6 flex flex-col space-y-4">
              <h2 className="font-semibold text-lg">Income vs Expense</h2>
              <div className="grid grid-cols-1 gap-3">
                <KpiTile title="Expense Today" value="₹5,000" />
                <KpiTile title="Income This Month" value="₹50,000" />
                <KpiTile title="Total Transactions" value={transactions.length} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
