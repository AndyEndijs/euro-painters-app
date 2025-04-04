"use client";
import { useState, useEffect } from "react";

type PayRate = {
  rate: number;
  startDate: string;
  isActive: boolean;
};

type Employee = {
  id: string;
  name: string;
  address: string;
  email: string;
  phoneNumber: string;
  position: string;
  employmentType: string;
  status: string;
  startDate: string;
  payRates: PayRate[];
  notes: string;
};

const dummyEmployees: Employee[] = [
  {
    id: "1",
    name: "John Doe",
    address: "123 Main St",
    email: "john@example.com",
    phoneNumber: "123-456-7890",
    position: "Painter",
    employmentType: "Employee",
    status: "Active",
    startDate: "2023-01-01",
    payRates: [
      { rate: 20, startDate: "2023-01-01", isActive: true },
      { rate: 18, startDate: "2022-06-01", isActive: false },
    ],
    notes: "Experienced and reliable painter.",
  },
  {
    id: "2",
    name: "Jane Smith",
    address: "456 Oak St",
    email: "jane@example.com",
    phoneNumber: "987-654-3210",
    position: "Contractor",
    employmentType: "Contractor",
    status: "Inactive",
    startDate: "2022-02-15",
    payRates: [{ rate: 25, startDate: "2022-02-15", isActive: true }],
    notes: "Part-time contractor.",
  },
];

export default function EmployeeDetails({ params }: { params: Promise<{ id: string }> }) {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [showRateModal, setShowRateModal] = useState<boolean>(false);
  const [newPayRate, setNewPayRate] = useState<number>(0);
  const [newPayStartDate, setNewPayStartDate] = useState<string>("");
  const [editingNote, setEditingNote] = useState<boolean>(false);
  const [newNote, setNewNote] = useState<string>("");

  useEffect(() => {
    async function fetchParams() {
      const resolvedParams = await params;
      const foundEmployee = dummyEmployees.find((e) => e.id === resolvedParams.id);
      setEmployee(foundEmployee || null);
    }
    fetchParams();
  }, [params]);

  const toggleEdit = () => setIsEditing(!isEditing);

  const toggleNoteEdit = () => setEditingNote(!editingNote);

  const handleEmployeeChange = (field: keyof Employee, value: string) => {
    if (employee) {
      setEmployee({ ...employee, [field]: value });
    }
  };

  const handleAddPayRate = () => {
    if (newPayRate && newPayStartDate && employee) {
      const updatedRates = employee.payRates.map((rate) => ({
        ...rate,
        isActive: false,
      }));
      updatedRates.push({ rate: newPayRate, startDate: newPayStartDate, isActive: true });
      setEmployee({ ...employee, payRates: updatedRates });
      setNewPayRate(0);
      setNewPayStartDate("");
      setShowRateModal(false);
    }
  };

  if (!employee) {
    return (
      <main style={{ padding: "2rem" }}>
        <h1>Employee Not Found</h1>
        <p>No employee found with the given ID.</p>
      </main>
    );
  }

  return (
    <main style={{ padding: "2rem", textAlign: "left" }}>
      <h1>Employee Details</h1>
      {Object.keys(employee).map((key) =>
        key !== "payRates" && key !== "notes" && (
          <p key={key}>
            <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong>{" "}
            {isEditing ? (
              <input
                type="text"
                value={String(employee[key as keyof Employee])}
                onChange={(e) => handleEmployeeChange(key as keyof Employee, e.target.value)}
                style={{ margin: "0.5rem", padding: "0.2rem" }}
              />
            ) : (
              employee[key as keyof Employee]
            )}
          </p>
        )
      )}

      <button onClick={toggleEdit} style={{ margin: "1rem 0", padding: "0.5rem 1rem" }}>
        {isEditing ? "Save" : "Edit Employee"}
      </button>

      <h2>Pay Rate</h2>
      {employee.payRates.map((rate, index) => (
        <p key={index} style={{ margin: "0.2rem 0" }}>
          {rate.startDate} - ${rate.rate.toFixed(2)} per hour {rate.isActive && "(Active)"}
        </p>
      ))}

      <button onClick={() => setShowRateModal(true)} style={{ margin: "1rem 0", padding: "0.5rem 1rem" }}>
        Add Pay Rate
      </button>

      {showRateModal && (
        <div style={{ margin: "1rem 0" }}>
          <input
            type="number"
            placeholder="New Pay Rate"
            value={newPayRate || ""}
            onChange={(e) => setNewPayRate(parseFloat(e.target.value))}
            style={{ marginRight: "0.5rem", padding: "0.5rem" }}
          />
          <input
            type="date"
            value={newPayStartDate}
            onChange={(e) => setNewPayStartDate(e.target.value)}
            style={{ marginRight: "0.5rem", padding: "0.5rem" }}
          />
          <button onClick={handleAddPayRate} style={{ padding: "0.5rem 1rem" }}>
            Save Pay Rate
          </button>
        </div>
      )}

      <h3>Notes</h3>
      {editingNote ? (
        <textarea
          value={employee.notes}
          onChange={(e) => handleEmployeeChange("notes", e.target.value)}
          style={{ width: "100%", height: "4rem", padding: "0.5rem" }}
        />
      ) : (
        <p>{employee.notes}</p>
      )}

      <button onClick={toggleNoteEdit} style={{ margin: "1rem 0", padding: "0.5rem 1rem" }}>
        {editingNote ? "Save Note" : "Add/Edit Note"}
      </button>
    </main>
  );
}
