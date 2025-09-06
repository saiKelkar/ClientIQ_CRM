import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { getCustomers } from "./Api/api";
import type { CustomerResponse } from "./Api/types";

export default function Customers() {
  const [customers, setCustomers] = useState<CustomerResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [skip, setSkip] = useState(0);
  const limit = 10;
  const [currentScreen] = useState<string>("Customers");
  const role: "admin" | "staff" = "staff"; // you can adjust if needed

  async function fetchCustomers() {
    try {
      setLoading(true);
      const res = await getCustomers({ skip, limit });
      setCustomers(res.data);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to fetch customers");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCustomers();
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
          {loading && <div>Loading customers...</div>}
          {error && <div className="text-red-600">Error: {error}</div>}

          {!loading && !error && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {customers.map((customer) => (
                  <div key={customer.id} className="bg-white shadow rounded p-4">
                    <h3 className="text-lg font-semibold">
                      {customer.contact.first_name} {customer.contact.last_name}
                    </h3>
                    <p className="text-sm text-gray-600">{customer.contact.email}</p>
                    <p className="text-sm">{customer.contact.phone || "No phone"}</p>
                    <p className="text-sm italic text-gray-500">
                      Converted by: {customer.converted_by_staff.name}
                    </p>
                    <p className="text-sm italic text-gray-400">
                      {customer.closing_date
                        ? new Date(customer.closing_date).toLocaleDateString()
                        : "No closing date"}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex justify-between mt-4">
                <button
                  onClick={prevPage}
                  disabled={skip === 0}
                  className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={nextPage}
                  disabled={customers.length < limit}
                  className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
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