import KpiTile from './KpiTile'

function Dashboard() {
    return (
        <div className="p-6 space-y-6 bg-gray-100 min-h-screen">

            <div className="grid grid-cols-4 gap-4">
                <KpiTile title="Total Customers" value={ 120 } />
                <KpiTile title="Total Vendors" value={ 15 } />
                <KpiTile title="Total Invoices" value={ 250 } />
                <KpiTile title="Total Bills" value={ 200 } />
            </div>

            <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2 bg-white rounded shadow p-6">
                    <h2 className="font-semibold text-lg mb-4">Cashflow (Last 30 days)</h2>
                    <div className="h-48 bg-gray-200 rounded">Graph placeholder</div>
                </div>
            

                <div className="bg-white rounded shadow p-6 flex flex-col space-y-4">
                    <h2 className="font-semibold text-lg">Income vs Expense</h2>
                    <div className="grid grid-cols-1 gap-3">
                        <KpiTile title="Expense Today" value="₹5,000" />
                        <KpiTile title="Total Customers" value={120} />
                        <KpiTile title="Income This Month" value="₹50,000" />
                    </div>
                </div>
            </div>

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

export default Dashboard