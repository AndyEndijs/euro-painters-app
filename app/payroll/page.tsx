"use client";
import { useState, useEffect } from "react";

type DayEntry = {
  date: string;
  startTime: string;
  endTime: string;
  jobSite: string;
  description: string;
  totalHours: number;
  isLocked: boolean;
  isApproved: boolean;
};

type DayData = {
  entries: DayEntry[];
  lunchStart: string;
  lunchEnd: string;
};

type EmployeeTimesheet = {
  employeeId: string;
  employeeName: string;
  week: string;
  days: DayData[];
};

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-GB");
}

function calculateHours(start: string, end: string, lunchStart: string, lunchEnd: string): number {
  const startTime = new Date(`1970-01-01T${start}`).getTime();
  const endTime = new Date(`1970-01-01T${end}`).getTime();
  const lunchStartTime = new Date(`1970-01-01T${lunchStart}`).getTime();
  const lunchEndTime = new Date(`1970-01-01T${lunchEnd}`).getTime();
  const totalTime = (endTime - startTime - (lunchEndTime - lunchStartTime)) / (1000 * 60 * 60);
  return Math.max(totalTime, 0);
}

function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
}

export default function Payroll() {
  const [week, setWeek] = useState<string>(formatDate(getWeekStart(new Date())));
  const [employeeTimesheets, setEmployeeTimesheets] = useState<EmployeeTimesheet[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<string>("all");
  const [editingEntry, setEditingEntry] = useState<{ empId: string; dayIndex: number; entryIndex: number } | null>(null);

  useEffect(() => {
    const weekStart = getWeekStart(new Date(week.split("/").reverse().join("-")));
    const mockTimesheets: EmployeeTimesheet[] = [
      {
        employeeId: "emp1",
        employeeName: "John Doe",
        week: week,
        days: Array(7).fill(null).map((_, i) => {
          const entryDate = new Date(weekStart);
          entryDate.setDate(weekStart.getDate() + i);
          return {
            entries: [{
              date: formatDate(entryDate),
              startTime: "07:30",
              endTime: "16:30",
              jobSite: "Site A",
              description: "Painting work",
              totalHours: 0,
              isLocked: true,
              isApproved: false,
            }],
            lunchStart: "12:00",
            lunchEnd: "12:30"
          };
        })
      },
      {
        employeeId: "emp2",
        employeeName: "Jane Smith",
        week: week,
        days: Array(7).fill(null).map((_, i) => {
          const entryDate = new Date(weekStart);
          entryDate.setDate(weekStart.getDate() + i);
          return {
            entries: [{
              date: formatDate(entryDate),
              startTime: "08:00",
              endTime: "17:00",
              jobSite: "Site B",
              description: "Supervising",
              totalHours: 0,
              isLocked: true,
              isApproved: false,
            }],
            lunchStart: "12:30",
            lunchEnd: "13:00"
          };
        })
      }
    ];
    setEmployeeTimesheets(mockTimesheets);
  }, [week]);

  const approveEntry = (empId: string, dayIndex: number, entryIndex: number) => {
    setEmployeeTimesheets((prev) =>
      prev.map(emp => emp.employeeId === empId ? {
        ...emp,
        days: emp.days.map((day, dIdx) => dIdx === dayIndex ? {
          ...day,
          entries: day.entries.map((entry, eIdx) => eIdx === entryIndex ? { 
            ...entry, 
            isApproved: true,
            totalHours: entry.jobSite ? calculateHours(entry.startTime, entry.endTime, day.lunchStart, day.lunchEnd) : 0
          } : entry)
        } : day)
      } : emp)
    );
  };

  const unapproveEntry = (empId: string, dayIndex: number, entryIndex: number) => {
    setEmployeeTimesheets((prev) =>
      prev.map(emp => emp.employeeId === empId ? {
        ...emp,
        days: emp.days.map((day, dIdx) => dIdx === dayIndex ? {
          ...day,
          entries: day.entries.map((entry, eIdx) => eIdx === entryIndex ? { 
            ...entry, 
            isApproved: false,
            totalHours: 0
          } : entry)
        } : day)
      } : emp)
    );
  };

  const startEdit = (empId: string, dayIndex: number, entryIndex: number) => {
    setEditingEntry({ empId, dayIndex, entryIndex });
  };

  const updateEntry = (empId: string, dayIndex: number, entryIndex: number, field: keyof DayEntry, value: string) => {
    setEmployeeTimesheets((prev) =>
      prev.map(emp => emp.employeeId === empId ? {
        ...emp,
        days: emp.days.map((day, dIdx) => dIdx === dayIndex ? {
          ...day,
          entries: day.entries.map((entry, eIdx) =>
            eIdx === entryIndex ? { ...entry, [field]: value } : entry
          )
        } : day)
      } : emp)
    );
  };

  const updateLunch = (empId: string, dayIndex: number, field: "lunchStart" | "lunchEnd", value: string) => {
    setEmployeeTimesheets((prev) =>
      prev.map(emp => emp.employeeId === empId ? {
        ...emp,
        days: emp.days.map((day, dIdx) => dIdx === dayIndex ? {
          ...day,
          [field]: value
        } : day)
      } : emp)
    );
  };

  const saveEdit = (empId: string, dayIndex: number, entryIndex: number) => {
    setEmployeeTimesheets((prev) =>
      prev.map(emp => emp.employeeId === empId ? {
        ...emp,
        days: emp.days.map((day, dIdx) => dIdx === dayIndex ? {
          ...day,
          entries: day.entries.map((entry, eIdx) => eIdx === entryIndex && entry.isApproved ? { 
            ...entry,
            totalHours: entry.jobSite ? calculateHours(entry.startTime, entry.endTime, day.lunchStart, day.lunchEnd) : 0
          } : entry)
        } : day)
      } : emp)
    );
    setEditingEntry(null);
  };

  const totalEmployeeHours = (employee: EmployeeTimesheet) => {
    return employee.days.flatMap(day => day.entries).reduce((sum, entry) => sum + (entry.isApproved && entry.jobSite ? entry.totalHours : 0), 0);
  };

  const exportXeroJournal = () => {
    const csvRows = ["Date,Description,AccountCode,Debit,Credit,TrackingCategory1"];
    const hourlyRate = 25; // Adjust based on your NZ rates
    employeeTimesheets.forEach(emp => {
      emp.days.forEach(day => {
        day.entries.forEach(entry => {
          if (entry.isApproved && entry.jobSite) {
            const wageAmount = (entry.totalHours * hourlyRate).toFixed(2);
            csvRows.push(`${entry.date},${emp.employeeName} Wages,400,${wageAmount},,${entry.jobSite}`);
            csvRows.push(`${entry.date},${emp.employeeName} Wages,814,,${wageAmount},`);
          }
        });
      });
    });
    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "xero_nz_payroll_journal.csv";
    a.click();
  };

  const exportPayHeroCSV = () => {
    const csvRows = ["EmployeeName,Date,StartTime,EndTime,LunchStart,LunchEnd,JobCode,Hours"];
    employeeTimesheets.forEach(emp => {
      emp.days.forEach(day => {
        day.entries.forEach(entry => {
          if (entry.isApproved && entry.jobSite) {
            csvRows.push(`${emp.employeeName},${entry.date},${entry.startTime},${entry.endTime},${day.lunchStart},${day.lunchEnd},${entry.jobSite},${entry.totalHours}`);
          }
        });
      });
    });
    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "payhero_timesheets.csv";
    a.click();
  };

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Payroll Management</h1>

      <div style={{ marginBottom: "1rem" }}>
        <label>Select Week: </label>
        <input
          type="date"
          value={week.split("/").reverse().join("-")}
          onChange={(e) => setWeek(formatDate(getWeekStart(new Date(e.target.value))))}
          style={{ marginRight: "1rem" }}
        />
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <label>Select Employee: </label>
        <select
          value={selectedEmployee}
          onChange={(e) => setSelectedEmployee(e.target.value)}
          style={{ marginRight: "1rem" }}
        >
          <option value="all">All Employees</option>
          {employeeTimesheets.map(emp => (
            <option key={emp.employeeId} value={emp.employeeId}>{emp.employeeName}</option>
          ))}
        </select>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Employee</th>
            <th>Date</th>
            <th>Job Site</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Lunch Start</th>
            <th>Lunch End</th>
            <th>Total Hours</th>
            <th>Description</th>
            <th>Approve</th>
            <th>Edit</th>
          </tr>
        </thead>
        <tbody>
          {employeeTimesheets
            .filter(emp => selectedEmployee === "all" || emp.employeeId === selectedEmployee)
            .flatMap(employee =>
              employee.days.flatMap((day, dayIndex) =>
                day.entries.map((entry, entryIndex) => {
                  const isEditing = editingEntry?.empId === employee.employeeId && 
                                  editingEntry?.dayIndex === dayIndex && 
                                  editingEntry?.entryIndex === entryIndex;

                  return (
                    <tr key={`${employee.employeeId}-${dayIndex}-${entryIndex}`} style={{ textAlign: "center" }}>
                      <td>{employee.employeeName}</td>
                      <td>{entry.date}</td>
                      <td>
                        {isEditing ? (
                          <input
                            type="text"
                            value={entry.jobSite}
                            onChange={(e) => updateEntry(employee.employeeId, dayIndex, entryIndex, "jobSite", e.target.value)}
                          />
                        ) : (
                          entry.jobSite || "Not Selected"
                        )}
                      </td>
                      <td>
                        {isEditing ? (
                          <input
                            type="time"
                            value={entry.startTime}
                            onChange={(e) => updateEntry(employee.employeeId, dayIndex, entryIndex, "startTime", e.target.value)}
                          />
                        ) : (
                          entry.startTime
                        )}
                      </td>
                      <td>
                        {isEditing ? (
                          <input
                            type="time"
                            value={entry.endTime}
                            onChange={(e) => updateEntry(employee.employeeId, dayIndex, entryIndex, "endTime", e.target.value)}
                          />
                        ) : (
                          entry.endTime
                        )}
                      </td>
                      <td>
                        {isEditing ? (
                          <input
                            type="time"
                            value={day.lunchStart}
                            onChange={(e) => updateLunch(employee.employeeId, dayIndex, "lunchStart", e.target.value)}
                          />
                        ) : (
                          day.lunchStart
                        )}
                      </td>
                      <td>
                        {isEditing ? (
                          <input
                            type="time"
                            value={day.lunchEnd}
                            onChange={(e) => updateLunch(employee.employeeId, dayIndex, "lunchEnd", e.target.value)}
                          />
                        ) : (
                          day.lunchEnd
                        )}
                      </td>
                      <td>{entry.isApproved && entry.jobSite ? entry.totalHours.toFixed(2) : "0.00"}</td>
                      <td>
                        {isEditing ? (
                          <input
                            type="text"
                            value={entry.description}
                            onChange={(e) => updateEntry(employee.employeeId, dayIndex, entryIndex, "description", e.target.value)}
                          />
                        ) : (
                          entry.description || "None"
                        )}
                      </td>
                      <td>
                        {entry.isLocked ? (
                          entry.isApproved ? (
                            <button onClick={() => unapproveEntry(employee.employeeId, dayIndex, entryIndex)}>Unapprove</button>
                          ) : (
                            <button onClick={() => approveEntry(employee.employeeId, dayIndex, entryIndex)}>Approve</button>
                          )
                        ) : (
                          "Not Submitted"
                        )}
                      </td>
                      <td>
                        {isEditing ? (
                          <button onClick={() => saveEdit(employee.employeeId, dayIndex, entryIndex)}>Save</button>
                        ) : (
                          entry.isLocked && <button onClick={() => startEdit(employee.employeeId, dayIndex, entryIndex)}>Edit</button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )
            )}
        </tbody>
      </table>

      <div style={{ marginTop: "1rem" }}>
        {employeeTimesheets
          .filter(emp => selectedEmployee === "all" || emp.employeeId === selectedEmployee)
          .map(emp => (
            <p key={emp.employeeId}>
              Total Hours for {emp.employeeName}: {totalEmployeeHours(emp).toFixed(2)}
            </p>
          ))}
        <button onClick={exportXeroJournal}>Export Xero Journal</button>
        <button onClick={exportPayHeroCSV} style={{ marginLeft: "1rem" }}>Export for PayHero</button>
      </div>
    </main>
  );
}