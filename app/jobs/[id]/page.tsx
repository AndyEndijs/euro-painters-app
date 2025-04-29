"use client";
import { useState, useEffect } from "react";

type Job = {
  id: string;
  quoteNumber: string;
  name: string;
  customer: string;
  description: string;
  status: string;
  budget: number;
  invoiceStatus: string;
  invoiceNumber: string;
};

type Entry = {
  type: string;
  invoiceNumber: string;
  supplier: string;
  description: string;
  amount: number;
};

const dummyJobs: Job[] = [
  {
    id: "1",
    quoteNumber: "Q001",
    name: "Interior Painting",
    customer: "John Doe",
    description: "Living room and kitchen repainting.",
    status: "Active",
    budget: 1500,
    invoiceStatus: "Deposit",
    invoiceNumber: "INV001",
  },
  {
    id: "2",
    quoteNumber: "Q002",
    name: "Exterior Painting",
    customer: "Jane Smith",
    description: "House exterior and windows.",
    status: "Quoted",
    budget: 2500,
    invoiceStatus: "Progress",
    invoiceNumber: "INV002",
  },
  {
    id: "3",
    quoteNumber: "Q003",
    name: "Commercial Office",
    customer: "Acme Corp",
    description: "Office interior walls and ceilings.",
    status: "Completed",
    budget: 4000,
    invoiceStatus: "Final",
    invoiceNumber: "INV003",
  },
];

export default function JobDetails({ params }: { params: Promise<{ id: string }> }) {
  const [job, setJob] = useState<Job | null>(null);
  const [jobId, setJobId] = useState<string>("");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [newEntry, setNewEntry] = useState<Entry>({
    type: "Expense",
    invoiceNumber: "",
    supplier: "",
    description: "",
    amount: 0,
  });

  useEffect(() => {
    async function fetchParams() {
      const resolvedParams = await params;
      setJobId(resolvedParams.id);
      const foundJob = dummyJobs.find((j) => j.id === resolvedParams.id);
      setJob(foundJob || null);
    }
    fetchParams();
  }, [params]);

  const handleAddEntry = () => {
    if (newEntry.description.trim()) {
      setEntries([...entries, newEntry]);
      setNewEntry({ type: "Expense", invoiceNumber: "", supplier: "", description: "", amount: 0 });
    }
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleJobChange = (field: keyof Job, value: string | number) => {
    if (job) {
      setJob({ ...job, [field]: value });
    }
  };

  const totalExpenses = entries
    .filter((entry) => entry.type === "Expense")
    .reduce((sum, entry) => sum + entry.amount, 0);

  const totalMaterials = entries
    .filter((entry) => entry.type === "Material")
    .reduce((sum, entry) => sum + entry.amount, 0);

  if (!job) {
    return (
      <main style={{ padding: "2rem", textAlign: "left" }}>
        <h1>Job Not Found</h1>
        <p>No job found for ID: {jobId}</p>
      </main>
    );
  }

  return (
    <main style={{ padding: "2rem", textAlign: "left" }}>
      <h1>Job Details</h1>
      
      {Object.keys(job).map((key) => (
        <p key={key}>
          <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong>{" "}
          {isEditing ? (
            <input
              type={key === "budget" ? "number" : "text"}
              value={String(job[key as keyof Job])}
              onChange={(e) => handleJobChange(key as keyof Job, e.target.value)}
              style={{ margin: "0.5rem", padding: "0.2rem" }}
            />
          ) : (
            job[key as keyof Job]
          )}
        </p>
      ))}

      <button onClick={toggleEdit} style={{ margin: "1rem 0", padding: "0.5rem 1rem" }}>
        {isEditing ? "Save" : "Edit Job"}
      </button>

      <h2>Labor Cost (linked to Timesheets)</h2>
      <p>(This section will be dynamically populated once timesheets are set up.)</p>

      <h2>Add Expense or Material</h2>
      <div style={{ margin: "1rem 0" }}>
        <select
          value={newEntry.type}
          onChange={(e) => setNewEntry({ ...newEntry, type: e.target.value })}
          style={{ padding: "0.5rem", marginRight: "0.5rem" }}
        >
          <option value="Expense">Expense</option>
          <option value="Material">Material</option>
        </select>
        <input
          type="text"
          placeholder="Invoice Number"
          value={newEntry.invoiceNumber}
          onChange={(e) => setNewEntry({ ...newEntry, invoiceNumber: e.target.value })}
          style={{ padding: "0.5rem", marginRight: "0.5rem" }}
        />
        <input
          type="text"
          placeholder="Supplier"
          value={newEntry.supplier}
          onChange={(e) => setNewEntry({ ...newEntry, supplier: e.target.value })}
          style={{ padding: "0.5rem", marginRight: "0.5rem" }}
        />
        <input
          type="text"
          placeholder="Description"
          value={newEntry.description}
          onChange={(e) => setNewEntry({ ...newEntry, description: e.target.value })}
          style={{ padding: "0.5rem", marginRight: "0.5rem" }}
        />
        <input
          type="number"
          placeholder="Amount"
          value={newEntry.amount || ""}
          onChange={(e) => setNewEntry({ ...newEntry, amount: parseFloat(e.target.value) || 0 })}
          style={{ padding: "0.5rem", marginRight: "0.5rem" }}
        />
        <button onClick={handleAddEntry} style={{ padding: "0.5rem 1rem" }}>
          Save
        </button>
      </div>

      <h3>Expenses and Materials</h3>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {entries.map((entry, index) => (
          <li key={index} style={{ margin: "0.5rem 0" }}>
            [{entry.type}] {entry.invoiceNumber} - {entry.supplier} - {entry.description} - ${entry.amount.toFixed(2)}
          </li>
        ))}
      </ul>

      <p>Total Expenses: ${totalExpenses.toFixed(2)}</p>
      <p>Total Materials: ${totalMaterials.toFixed(2)}</p>
    </main>
  );
}
