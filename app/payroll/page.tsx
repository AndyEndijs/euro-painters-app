"use client";
import { useState } from "react";

// Timesheet entry type
type TimesheetEntry = {
  id: number;
  employeeName: string;
  date: string;
  jobSite: string;
  startTime: string;
  endTime: string;
  lunchStart: string;
  lunchEnd: string;
  totalHours: number;
  status: "Pending" | "Approved" | "Rejected";
};

const defaultTimesheets: TimesheetEntry[] = [
  { id: 1, employeeName: "John Doe", date: "01/04/2025", jobSite: "Job A", startTime: "07:30", endTime: "16:30", lunchStart: "12:00", lunchEnd: "12:30", totalHours: 8, status: "Pending" },
  { id: 2, employeeName: "Jane Smith", date: "02/04/2025", jobSite: "Job B", startTime: "08:00", endTime: "17:00", lunchStart: "12:00", lunchEnd: "12:30", totalHours: 8, status: "Approved" },
  { id: 3, employeeName: "Tom Brown", date: "03/04/2025", jobSite: "Job C", startTime: "07:30", endTime: "16:30", lunchStart: "12:00", lunchEnd: "12:30", totalHours: 8, status: "Rejected" },
];

export default function Payroll() {
  const [timesheets, setTimesheets] = useState<TimesheetEntry[]>(defaultTimesheets);
  const [filterEmployee, setFilterEmployee] = useState<string>("");
  const [filterDate, setFilterDate] = useState<string>("");
  const [isEditing, setIsEditing] = useState<number | null>(null);

  // Update entry status
  const updateStatus = (id: number, status: "Approved" | "Rejected") => {
    setTimesheets((prev) =>
      prev.map((entry) =>
        entry.id === id ? { ...entry, status } : entry
      )
    );
  };

  // Update entry details
  const updateEntry = (id: number, field: keyof TimesheetEntry, value: string) => {
    setTimesheets((prev) =>
      prev.map((entry) =>
        entry.id === id ? { ...entry, [field]: value } : entry
      )
    );
  };

  // Filter timesheets
  const filteredTimesheets = timesheets.filter((entry) =>
    (filterEmployee === "" || entry.employeeName.toLowerCase().includes(filterEmployee.toLowerCase())) &&
    (filterDate === "" || entry.date === filterDate)
  );

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Payroll Management</h1>

      {/* Filter Bar */}
      <div style={{ margin: "1rem 0" }}>
        <label>Week: </label>
        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          style={{ margin: "0 1rem", padding: "0.5rem" }}
        />
        <label>Employee: </label>
        <input
          type="text"
          placeholder="Search by employee"
          value={filterEmployee}
          onChange={(e) => setFilterEmployee(e.target.value)}
          style={{ margin: "0 1rem", padding: "0.5rem" }}
        />
        <button style={{ padding: "0.5rem" }}>Generate Payroll Report</button>
      </div>

      {/* Timesheet List */}
      <table border="1" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Employee</th>
            <th>Date</th>
            <th>Job Site</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Lunch</th>
            <th>Total Hours</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredTimesheets.map((entry) => (
            <tr key={entry.id}>
              <td>{entry.employeeName}</td>
              <td>{entry.date}</td>
              <td>{entry.jobSite}</td>
              {isEditing === entry.id ? (
                <>
                  <td><input type="time" value={entry.startTime} onChange={(e) => updateEntry(entry.id, "startTime", e.target.value)} /></td>
                  <td><input type="time" value={entry.endTime} onChange={(e) => updateEntry(entry.id, "endTime", e.target.value)} /></td>
                  <td>
                    <input type="time" value={entry.lunchStart} onChange={(e) => updateEntry(entry.id, "lunchStart", e.target.value)} />
                    to
                    <input type="time" value={entry.lunchEnd} onChange={(e) => updateEntry(entry.id, "lunchEnd", e.target.value)} />
                  </td>
                </>
              ) : (
                <>
                  <td>{entry.startTime}</td>
                  <td>{entry.endTime}</td>
                  <td>{entry.lunchStart} - {entry.lunchEnd}</td>
                </>
              )}
              <td>{entry.totalHours}</td>
              <td>{entry.status}</td>
              <td>
                {isEditing === entry.id ? (
                  <button onClick={() => setIsEditing(null)}>Save</button>
                ) : (
                  <button onClick={() => setIsEditing(entry.id)}>Edit</button>
                )}
                <button onClick={() => updateStatus(entry.id, "Approved")} style={{ margin: "0.5rem" }}>
                  Approve
                </button>
                <button onClick={() => updateStatus(entry.id, "Rejected")}>
                  Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
