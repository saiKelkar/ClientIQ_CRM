import { useState, useEffect } from "react";
import axios from "axios";

interface Project {
  id: number;
  customer_id: number;
  name: string;
  status: "pending" | "in_progress" | "completed";
  start_date: string | null;
  end_date: string | null;
  budget: number;
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [form, setForm] = useState({
    customer_id: "",
    name: "",
    status: "pending",
    budget: ""
  })

  // Fetch all projects
  const fetchProjects = () => {
    axios.get("http://127.0.0.1:8000/projects/")
      .then(res => setProjects(res.data))
      .catch(err => console.error(err));
  }

  useEffect(() => {
  fetchProjects();

  const ws = new WebSocket("ws://127.0.0.1:8000/ws")

  ws.onmessage = (event) => {
    const message = JSON.parse(event.data)
    if (message.type === "new_project") {
      setProjects((prev) => [...prev, message.data])
    }
  }

  ws.onopen = () => console.log("WebSocket connected")
  ws.onclose = () => console.log("WebSocket disconnected")

  return () => ws.close()
}, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  };

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("http://127.0.0.1:8000/projects/", {
        customer_id: Number(form.customer_id),
        name: form.name,
        status: form.status,
        budget: Number(form.budget),
        start_date: null,
        end_date: null
      });
      setForm({ customer_id: "", name: "", status: "pending", budget: "" })
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Projects</h2>

      <form onSubmit={handleAddProject} className="space-y-2 mb-6">
        <input
          type="number"
          name="customer_id"
          placeholder="Customer ID"
          value={form.customer_id}
          onChange={handleChange}
          className="border p-2"
          required
        />
        <input
          type="text"
          name="name"
          placeholder="Project Name"
          value={form.name}
          onChange={handleChange}
          className="border p-2"
          required
        />
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="border p-2"
        >
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        <input
          type="number"
          step="0.01"
          name="budget"
          placeholder="Budget"
          value={form.budget}
          onChange={handleChange}
          className="border p-2"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Add Project
        </button>
      </form>

      {/* Projects Table */}
      <table className="w-full border">
        <thead>
          <tr>
            <th className="border px-4 py-2 text-center">ID</th>
            <th className="border px-4 py-2 text-center">Customer ID</th>
            <th className="border px-4 py-2 text-center">Name</th>
            <th className="border px-4 py-2 text-center">Status</th>
            <th className="border px-4 py-2 text-center">Budget</th>
            <th className="border px-4 py-2 text-center">Start Date</th>
            <th className="border px-4 py-2 text-center">End Date</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((p) => (
            <tr key={p.id}>
              <td className="border px-4 py-2 text-center">{p.id}</td>
              <td className="border px-4 py-2 text-center">{p.customer_id}</td>
              <td className="border px-4 py-2 text-center">{p.name}</td>
              <td className="border px-4 py-2 text-center">{p.status}</td>
              <td className="border px-4 py-2 text-center">{p.budget}</td>
              <td className="border px-4 py-2 text-center">{p.start_date || "-"}</td>
              <td className="border px-4 py-2 text-center">{p.end_date || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
