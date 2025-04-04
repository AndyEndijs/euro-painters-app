"use client";
import { useState } from "react";
import Link from "next/link";

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

export default function Jobs() {
  const [jobs, setJobs] = useState<Job[]>(dummyJobs);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  // Search and Filter Logic
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = 
      job.quoteNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.customer.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "All" || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <main style={{ padding: "2rem", textAlign: "center" }}>
      <h1>Jobs Management</h1>
      <p>Manage your jobs efficiently.</p>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search by Quote Number, Job Name, or Customer"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ padding: "0.5rem", margin: "1rem", width: "300px" }}
      />

      {/* Status Filter */}
      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        style={{ padding: "0.5rem", margin: "1rem" }}
      >
        <option value="All">All</option>
        <option value="Quoted">Quoted</option>
        <option value="Accepted">Accepted</option>
        <option value="Active">Active</option>
        <option value="Completed">Completed</option>
        <option value="Archived">Archived</option>
      </select>

      {/* Jobs Table */}
      <table style={{ width: "100%", borderCollapse: "collapse", margin: "1rem 0" }}>
        <thead>
          <tr>
            <th>Quote Number</th>
            <th>Job Name</th>
            <th>Customer</th>
            <th>Description</th>
            <th>Status</th>
            <th>Budget</th>
            <th>Invoice Status</th>
            <th>Invoice Number</th>
          </tr>
        </thead>
        <tbody>
          {filteredJobs.map((job) => (
            <tr key={job.id} style={{ borderBottom: "1px solid #ddd" }}>
              <td>
                <Link href={`/jobs/${job.id}`} style={{ color: "blue", textDecoration: "underline" }}>
                  {job.quoteNumber}
                </Link>
              </td>
              <td>
                <Link href={`/jobs/${job.id}`} style={{ color: "blue", textDecoration: "underline" }}>
                  {job.name}
                </Link>
              </td>
              <td>
                <Link href={`/customers/${job.customer}`} style={{ color: "blue", textDecoration: "underline" }}>
                  {job.customer}
                </Link>
              </td>
              <td>{job.description}</td>
              <td>{job.status}</td>
              <td>${job.budget.toFixed(2)}</td>
              <td>{job.invoiceStatus}</td>
              <td>{job.invoiceNumber}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
