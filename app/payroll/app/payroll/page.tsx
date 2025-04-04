"use client";
import { useState } from "react";

type TimesheetEntry = {
  id: string;
  employee: string;
  date: string;
  jobSite: string;
  startTime: string;
  endTime: string;
  totalHours: number;
  status: string;
};

const dummyTimesheets: TimesheetEntry[] = [
  {
    id: "1",
    employee: "John Doe",
    date: "01/04/2025",
    jobSite: "Job A",
    startTime: "07:30",
    endTime: "16:30",
    totalHours: 8,
    status: "Pending",
  },
  {
    id: "2",
    employee: "Jane Smith",
    date: "02/04/2025",
    jobSite: "Job B",
    startTime: "08:00",
    endTime: "17:00",
    totalHours: 8,
    status: "Approved",
  },
  {
    id: "3",
    employee: "Tom Brown",
    date: "03/04/2025",
    jobSite: "Job C",
    startTime: "07:30",
    endTime: "16:30",
    totalHours: 8,
    status: "Rejected",
  },
];

export default function PayrollPage() {
  const [search, setSearch] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [filteredEntries, setFilteredEntries] = useState<TimesheetEntry[]>(dummyTimesheets);

  // Filtering logic
  const filterEntries = () => {
    const filtered = dummyTimesheets.filter((entry) =>
      (entry.employee.toLowerCase().includes(search.toLowerCase()) ||
        entry.jobSite.toLowerCase().includes(search.toLowerCase())) &&
      (statusFilter === "All" || entry.status === statusFilter)
    );
    setFilteredEntries(filtered);
  };

  // Update status
  const updateStatus = (id: string, newStatus: string) => {
    const updated = filteredEntries.map((entry) =>
      entry.id === id ? { ...entry, status: newStatus } : entry
    );
    setFilteredEntries(updated);
  };

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Payroll Management</h1>

      {/* Filters */}
      <div style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Search by employee or job site"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ marginRight: "1rem", padding: "0.5rem" }}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ padding: "0.5rem", marginRight: "1rem" }}
        >
          <option value="All">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
        <button onClick={filterEntries} style={{ padding: "0.5rem 1rem" }}>
          Apply Filters
        </button>
      </div>

      {/* Timesheet Table */}
      <table border="1" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Employee</th>
            <th>Date</th>
            <th>Job Site</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Total Hours</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredEntries.map((entry) => (
            <tr key={entry.id}>
              <td>{entry.employee}</td>
              <td>{entry.date}</td>
              <td>{entry.jobSite}</td>
              <td>{entry.startTime}</td>
              <td>{entry.endTime}</td>
              <td>{entry.totalHours.toFixed(2)}</td>
              <td>{entry.status}</td>
              <td>
                <button
                  onClick={() => updateStatus(entry.id, "Approved")}
                  disabled={entry.status === "Approved"}
                  style={{ margin: "0.2rem" }}
                >
                  Approve
                </button>
                <button
                  onClick={() => updateStatus(entry.id, "Rejected")}
                  disabled={entry.status === "Rejected"}
                  style={{ margin: "0.2rem" }}
                >
                  Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Summary */}
      <h3>Total Hours by Status</h3>
      <ul>
        {["Pending", "Approved", "Rejected"].map((status) => {
          const totalHours = filteredEntries
            .filter((entry) => entry.status === status)
            .reduce((sum, entry) => sum + entry.totalHours, 0);
          return (
            <li key={status}>
              {status}: {totalHours} hours
            </li>
          );
        })}
      </ul>

      <h3>Total Hours: {filteredEntries.reduce((sum, entry) => sum + entry.totalHours, 0)} hours</h3>
    </main>
  );
}
