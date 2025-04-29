"use client";
import { useState, useEffect } from "react";

// Customer type definition
type Customer = {
  id: string;
  name: string;
  address: string;
  email: string;
  phone: string;
};

// Job type definition
type Job = {
  id: string;
  quoteNumber: string;
  name: string;
  customer: string;
  status: string;
  invoiceNumber: string;
  invoiceStatus: string;
  budget: number;
};

// Dummy customer data
const dummyCustomers: Customer[] = [
  { id: "1", name: "John Doe", address: "123 Main St", email: "john@example.com", phone: "555-1234" },
  { id: "2", name: "Jane Smith", address: "456 Oak St", email: "jane@example.com", phone: "555-5678" },
  { id: "3", name: "Acme Corp", address: "789 Elm St", email: "contact@acme.com", phone: "555-9012" },
];

// Dummy job data
const dummyJobs: Job[] = [
  { id: "1", quoteNumber: "Q001", name: "Interior Painting", customer: "John Doe", status: "Active", invoiceNumber: "INV001", invoiceStatus: "Deposit", budget: 1500 },
  { id: "2", quoteNumber: "Q002", name: "Exterior Painting", customer: "Jane Smith", status: "Quoted", invoiceNumber: "INV002", invoiceStatus: "Progress", budget: 2500 },
  { id: "3", quoteNumber: "Q003", name: "Commercial Office", customer: "Acme Corp", status: "Completed", invoiceNumber: "INV003", invoiceStatus: "Final", budget: 4000 },
];

export default function CustomerDetails({ params }: { params: Promise<{ id: string }> }) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [customerJobs, setCustomerJobs] = useState<Job[]>([]);

  useEffect(() => {
    async function fetchParams() {
      const resolvedParams = await params;
      const foundCustomer = dummyCustomers.find((c) => c.id === resolvedParams.id);
      setCustomer(foundCustomer || null);

      const relatedJobs = dummyJobs.filter((j) => j.customer === foundCustomer?.name);
      setCustomerJobs(relatedJobs);
    }
    fetchParams();
  }, [params]);

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleCustomerChange = (field: keyof Customer, value: string) => {
    if (customer) {
      setCustomer({ ...customer, [field]: value });
    }
  };

  if (!customer) {
    return (
      <main style={{ padding: "2rem" }}>
        <h1>Customer Not Found</h1>
      </main>
    );
  }

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Customer Details</h1>

      {Object.keys(customer).map((key) => (
        <p key={key}>
          <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong>{" "}
          {isEditing ? (
            <input
              type="text"
              value={String(customer[key as keyof Customer])}
              onChange={(e) => handleCustomerChange(key as keyof Customer, e.target.value)}
              style={{ margin: "0.5rem", padding: "0.2rem" }}
            />
          ) : (
            customer[key as keyof Customer]
          )}
        </p>
      ))}

      <button onClick={toggleEdit} style={{ margin: "1rem 0", padding: "0.5rem 1rem" }}>
        {isEditing ? "Save" : "Edit"}
      </button>

      <h2>Job Summary</h2>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ padding: "0.5rem", border: "1px solid #ddd" }}>Quote Number</th>
            <th style={{ padding: "0.5rem", border: "1px solid #ddd" }}>Job Name</th>
            <th style={{ padding: "0.5rem", border: "1px solid #ddd" }}>Status</th>
            <th style={{ padding: "0.5rem", border: "1px solid #ddd" }}>Invoice Number</th>
            <th style={{ padding: "0.5rem", border: "1px solid #ddd" }}>Invoice Status</th>
            <th style={{ padding: "0.5rem", border: "1px solid #ddd" }}>Budget</th>
          </tr>
        </thead>
        <tbody>
          {customerJobs.map((job) => (
            <tr key={job.id}>
              <td style={{ padding: "0.5rem", border: "1px solid #ddd" }}>{job.quoteNumber}</td>
              <td style={{ padding: "0.5rem", border: "1px solid #ddd" }}>{job.name}</td>
              <td style={{ padding: "0.5rem", border: "1px solid #ddd" }}>{job.status}</td>
              <td style={{ padding: "0.5rem", border: "1px solid #ddd" }}>{job.invoiceNumber}</td>
              <td style={{ padding: "0.5rem", border: "1px solid #ddd" }}>{job.invoiceStatus}</td>
              <td style={{ padding: "0.5rem", border: "1px solid #ddd" }}>${job.budget.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
