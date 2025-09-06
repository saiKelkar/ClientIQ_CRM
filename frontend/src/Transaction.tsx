import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { getTransactions } from "./Api/api";
import type { TransactionResponse } from "./Api/types";

type Role = "admin" | "staff";

export default function Transactions() {
  const [transactions, setTransactions] = useState<TransactionResponse[]>([]);
  const [skip, setSkip] = useState(0);
  const limit = 10;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [role] = useState<Role>("staff");
  const [currentScreen] = useState<string>("Transactions");

  async function fetchTransactions() {
    try {
      setLoading(true);
      const res = await getTransactions({ skip, limit });
      setTransactions(res.data);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to fetch transactions");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTransactions();
  }, [skip]);

  const nextPage = () => setSkip((prev) => prev + limit);
  const prevPage = () => setSkip((prev) => Math.max(prev - limit, 0));

  return (
    <div>
      <Sidebar setCurrentScreen={() => {}} />
      <div className="ml-64 flex flex-col h-screen">
        {/* Topbar */}
        <div className="fixed top-0 right-0 left-64 h-16 bg-gray-200 flex justify-between items-center px-6 shadow-[0_2px_4px_0_rgba(0,0,0,0.1)]">
          <Topbar currentScreen={currentScreen} role={role} />
        </div>

        {/* Main Content */}
        <div className="pt-20 p-6 space-y-6">
          {loading && <div>Loading transactions...</div>}
          {error && <div className="text-red-600">Error: {error}</div>}

          {!loading && !error && (
            <>
              <h2 className="text-xl font-semibold mb-4">Transactions</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border shadow rounded">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2 text-left border">ID</th>
                      <th className="px-4 py-2 text-left border">Amount</th>
                      <th className="px-4 py-2 text-left border">Payment Method</th>
                      <th className="px-4 py-2 text-left border">Payment Status</th>
                      <th className="px-4 py-2 text-left border">Contact</th>
                      <th className="px-4 py-2 text-left border">Customer</th>
                      <th className="px-4 py-2 text-left border">Converted By</th>
                      <th className="px-4 py-2 text-left border">Created At</th>
                      <th className="px-4 py-2 text-left border">Updated At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-gray-50">
                        <td className="px-4 py-2 border">{tx.id}</td>
                        <td className="px-4 py-2 border">₹{tx.amount_invested}</td>
                        <td className="px-4 py-2 border">{tx.payment_method.replace("_", " ")}</td>
                        <td
                          className={`px-4 py-2 border font-semibold ${
                            tx.payment_status === "completed"
                              ? "text-green-600"
                              : tx.payment_status === "pending"
                              ? "text-orange-600"
                              : "text-red-600"
                          }`}
                        >
                          {tx.payment_status}
                        </td>
                        <td className="px-4 py-2 border">
                          {tx.contact.first_name} {tx.contact.last_name} ({tx.contact.email})
                        </td>
                        <td className="px-4 py-2 border">
                          {tx.customer.contact.first_name} {tx.customer.contact.last_name} ({tx.customer.contact.email})
                        </td>
                        <td className="px-4 py-2 border">
                          {tx.customer.converted_by_staff.name} ({tx.customer.converted_by_staff.email})
                        </td>
                        <td className="px-4 py-2 border">
                          {tx.customer.closing_date ? new Date(tx.customer.closing_date).toLocaleString() : "N/A"}
                        </td>
                        <td className="px-4 py-2 border">N/A</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-between mt-4">
                <button
                  onClick={prevPage}
                  disabled={skip === 0}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={nextPage}
                  disabled={transactions.length < limit}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
