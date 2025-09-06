import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { getLeads } from "./Api/api";
import type { LeadResponse } from "./Api/types";

export default function Leads() {
  const [leads, setLeads] = useState<LeadResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [skip, setSkip] = useState(0);
  const limit = 10;
  const [currentScreen] = useState<string>("Leads");
  const role: "admin" | "staff" = "staff"; // adjust if needed

  async function fetchLeads() {
    try {
      setLoading(true);
      const res = await getLeads({ skip, limit });
      setLeads(res.data);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to fetch leads");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchLeads();
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
          {loading && <div>Loading leads...</div>}
          {error && <div className="text-red-600">Error: {error}</div>}

          {!loading && !error && (
            <>
              <h2 className="text-xl font-semibold mb-4">Leads</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white shadow rounded">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="py-2 px-4 border">ID</th>
                      <th className="py-2 px-4 border">Contact</th>
                      <th className="py-2 px-4 border">Prospect Type</th>
                      <th className="py-2 px-4 border">Estimated Value</th>
                      <th className="py-2 px-4 border">Potential Investment</th>
                      <th className="py-2 px-4 border">Stage</th>
                      <th className="py-2 px-4 border">Customer</th>
                      <th className="py-2 px-4 border">Handled By</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-gray-50">
                        <td className="py-2 px-4 border">{lead.id}</td>
                        <td className="py-2 px-4 border">
                          {lead.contact.first_name} {lead.contact.last_name} <br />
                          <span className="text-sm text-gray-500">{lead.contact.email}</span>
                        </td>
                        <td className="py-2 px-4 border">{lead.prospect_type}</td>
                        <td className="py-2 px-4 border">{lead.estimated_value}</td>
                        <td className="py-2 px-4 border">{lead.potential_investment}</td>
                        <td className="py-2 px-4 border">{lead.stage}</td>
                        <td className="py-2 px-4 border">
                          {lead.customer
                            ? `${lead.customer.contact.first_name} ${lead.customer.contact.last_name}`
                            : "N/A"}
                        </td>
                        <td className="py-2 px-4 border">
                          {lead.customer?.converted_by_staff ? lead.customer.converted_by_staff.name : "N/A"}
                        </td>
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
                  disabled={leads.length < limit}
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
