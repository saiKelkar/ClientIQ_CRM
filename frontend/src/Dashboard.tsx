import { useEffect, useState } from "react"
import KpiTile from "./KpiTile"
import axios from "axios"
import { getCustomers, getContacts, getLeads, getTransactions } from "./Api/api"
import type { 
    CustomerResponse, 
    ContactResponse, 
    LeadResponse, 
    TransactionResponse,
    UserLogin,
    UserCreate,
    UserResponse,
} from "./Api/types"

export default function Dashboard() {
  const [customers, setCustomers] = useState<CustomerResponse[]>([])
  const [contacts, setContacts] = useState<ContactResponse[]>([])
  const [leads, setLeads] = useState<LeadResponse[]>([])
  const [transactions, setTransactions] = useState<TransactionResponse[]>([])

  useEffect(() => {
    async function fetchData() {
      try {
        const [cust, cont, ld, trans] = await Promise.all([
          getCustomers(),
          getContacts(),
          getLeads(),
          getTransactions(),
        ])
        setCustomers(cust)
        setContacts(cont)
        setLeads(ld)
        setTransactions(trans)
      } catch (err) {
        console.error("Error fetching dashboard data:", err)
      }
    }
    fetchData()
  }, [])

  return (
    <div className="p-6 space-y-6 bg-gray-100 min-h-screen">
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
          <h2 className="font-semibold text-lg mb-4">Cashflow (Last 30 days)</h2>
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

      {/* Project Status + Account Balance */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded shadow p-6">
          <h2 className="font-semibold text-lg mb-4">Project Status</h2>
          <div className="h-48 bg-gray-200 rounded">Pie chart here</div>
        </div>

        <div className="bg-white rounded shadow p-6">
          <h2 className="font-semibold text-lg mb-4">Account Balance</h2>
          <div>Name: John Doe</div>
          <div>Balance: ₹1,20,000</div>
          <div>Status: Active</div>
        </div>
      </div>
    </div>
  )
}
