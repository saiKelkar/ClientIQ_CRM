import { useEffect, useState, type FormEvent } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { getContacts, createContact } from "./Api/api";
import type { ContactCreate, ContactResponse } from "./Api/types";

type Role = "admin" | "staff";

interface ContactProps {
  role: Role;
}

export default function Contact({ role }: ContactProps) {
  const [contacts, setContacts] = useState<ContactResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentScreen] = useState<string>("Contacts");

  // Form state (for admin)
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // Fetch contacts (for staff role)
  useEffect(() => {
    if (role === "staff") fetchContacts();
  }, [role]);

  async function fetchContacts() {
    setLoading(true);
    setError(null);
    try {
      const res = await getContacts();
      setContacts(res.data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch contacts");
    } finally {
      setLoading(false);
    }
  }

  // Admin: handle form submission
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const newContact: ContactCreate = {
      first_name: firstName,
      last_name: lastName,
      email,
      phone: phone || undefined,
    };

    try {
      const res = await createContact(newContact);
      alert(`Contact "${res.data.first_name} ${res.data.last_name}" added successfully!`);
      // reset form
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message);
    } finally {
      setLoading(false);
    }
  }

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
          {role === "admin" ? (
            <div className="bg-white shadow rounded p-6 max-w-md mx-auto">
              <h2 className="text-xl font-semibold mb-4">Add New Contact</h2>
              {error && <p className="mb-4 text-red-600">{error}</p>}
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
                <input
                  type="tel"
                  placeholder="Phone (optional)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? "Adding..." : "Add Contact"}
                </button>
              </form>
            </div>
          ) : (
            <div>
              <h2 className="text-xl font-semibold mb-4">Contact List</h2>
              {loading && <p>Loading contacts...</p>}
              {error && <p className="text-red-600">{error}</p>}
              <table className="min-w-full bg-white shadow rounded">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="py-2 px-4 border">ID</th>
                    <th className="py-2 px-4 border">First Name</th>
                    <th className="py-2 px-4 border">Last Name</th>
                    <th className="py-2 px-4 border">Email</th>
                    <th className="py-2 px-4 border">Phone</th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.map((c) => (
                    <tr key={c.id}>
                      <td className="py-2 px-4 border">{c.id}</td>
                      <td className="py-2 px-4 border">{c.first_name}</td>
                      <td className="py-2 px-4 border">{c.last_name}</td>
                      <td className="py-2 px-4 border">{c.email}</td>
                      <td className="py-2 px-4 border">{c.phone || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
