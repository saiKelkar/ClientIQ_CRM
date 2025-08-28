import { useState, useEffect, type FormEvent } from "react"

interface Customer {
  id: number
  name: string
  email: string
  phone?: string
  company?: string
  created_at?: string
  updated_at?: string
}

export default function Customers() {

    const [skip, setSkip] = useState(0)
    const [limit, _setLimit] = useState(10)

    const [customers, setCustomers] = useState<Customer[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")
    const [company, setCompany] = useState("")
    const [formError, setFormError] = useState<string | null>(null)
    const [formLoading, setFormLoading] = useState(false)

    async function fetchCustomers() {
        try {
        setLoading(true);
        const res = await fetch(`http://127.0.0.1:8000/customers/?skip=${skip}&limit=${limit}`)
        if (!res.ok) throw new Error("Failed to fetch customers")
        const data = await res.json()
        setCustomers(data)
        setError(null)
        } catch (err: any) {
        setError(err.message)
        } finally {
        setLoading(false)
        }
    }

    useEffect(() => {
        fetchCustomers()
    }, [skip, limit])

    function nextPage() {
        setSkip(prev => prev + limit);
    }

    function prevPage() {
        setSkip(prev => Math.max(prev - limit, 0));
    }

    async function handleAddCustomer(e:FormEvent) {
        e.preventDefault()
        setFormLoading(true)
        setFormError(null)

    if (!name || !email) {
      setFormError("Name and Email are required");
      setFormLoading(false);
      return;
    }

    try {
      const res = await fetch("http://127.0.0.1:8000/customers/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, company }),
      });

    if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || "Failed to add customer")
    }

    const newCustomer = await res.json()

    setCustomers(prev => [...prev, newCustomer])

    setName("")
    setEmail("")
    setPhone("")
    setCompany("")
    } catch (err: any) {
        setFormError(err.message)
    } finally {
        setFormLoading(false)
    }
    }

  if (loading) return <div>Loading customers...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <>
    <div className="p-6">
      <form
        onSubmit={handleAddCustomer}
        className="mb-6 bg-white p-4 rounded shadow max-w-md"
      >
        <h2 className="text-xl font-semibold mb-4">Add New Customer</h2>

        {formError && <div className="mb-4 text-red-600">{formError}</div>}

        <input
          type="text"
          placeholder="Name*"
          value={name}
          onChange={e => setName(e.target.value)}
          className="w-full mb-3 px-3 py-2 border rounded"
          required
        />
        <input
          type="email"
          placeholder="Email*"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full mb-3 px-3 py-2 border rounded"
          required
        />
        <input
          type="text"
          placeholder="Phone"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          className="w-full mb-3 px-3 py-2 border rounded"
        />
        <input
          type="text"
          placeholder="Company"
          value={company}
          onChange={e => setCompany(e.target.value)}
          className="w-full mb-3 px-3 py-2 border rounded"
        />

        <button
          type="submit"
          disabled={formLoading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {formLoading ? "Adding..." : "Add Customer"}
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {customers.map((customer) => (
          <div
            key={customer.id}
            className="bg-white shadow rounded p-4 hover:shadow-lg transition-shadow"
          >
            <h3 className="text-lg font-semibold">{customer.name}</h3>
            <p className="text-sm text-gray-600">{customer.email}</p>
            <p className="text-sm">{customer.phone || "No phone"}</p>
            <p className="text-sm italic text-gray-500">{customer.company || "No company"}</p>
            <p className="text-sm italic text-gray-250">{customer.created_at ? new Date(customer.created_at).toLocaleString() : "N/A" }</p>
            <p className="text-sm italic text-gray-250">{customer.updated_at ? new Date(customer.updated_at).toLocaleString() : "N/A" }</p>
          </div>
        ))}
        <button onClick={prevPage} disabled={skip === 0}>Previous</button>
        <button onClick={nextPage} disabled={customers.length < limit}>Next</button>
      </div>
    </div>
    
    </>
  );
}
