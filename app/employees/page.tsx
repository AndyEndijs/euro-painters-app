"use client";
import { useState } from "react";

type Employee = {
  id: string;
  name: string;
  address: string;
  email: string;
  phone: string;
  position: string;
  employmentType: string;
  status: string;
};

const dummyEmployees: Employee[] = [
  {
    id: "1",
    name: "John Doe",
    address: "123 Main St, City",
    email: "john@example.com",
    phone: "123-456-7890",
    position: "Painter",
    employmentType: "Employee",
    status: "Active",
  },
  {
    id: "2",
    name: "Jane Smith",
    address: "456 Elm St, Town",
    email: "jane@example.com",
    phone: "987-654-3210",
    position: "Supervisor",
    employmentType: "Contractor",
    status: "Inactive",
  },
  {
    id: "3",
    name: "Tom Brown",
    address: "789 Oak St, Village",
    email: "tom@example.com",
    phone: "555-123-4567",
    position: "Subcontractor",
    employmentType: "Subcontractor",
    status: "Active",
  },
];

export default function Employees() {
  const [employees, setEmployees] = useState<Employee[]>(dummyEmployees);
  const [search, setSearch] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [showForm, setShowForm] = useState<boolean>(false);
  const [newEmployee, setNewEmployee] = useState<Employee>({
    id: "",
    name: "",
    address: "",
    email: "",
    phone: "",
    position: "",
    employmentType: "Employee",
    status: "Active",
  });

  const filteredEmployees = employees.filter((employee) => {
    return (
      (employee.name.toLowerCase().includes(search.toLowerCase()) ||
        employee.address.toLowerCase().includes(search.toLowerCase()) ||
        employee.email.toLowerCase().includes(search.toLowerCase()) ||
        employee.phone.includes(search)) &&
      (statusFilter === "" || employee.status === statusFilter)
    );
  });

  const handleAddEmployee = () => {
    if (newEmployee.name.trim()) {
      const newId = (employees.length + 1).toString();
      setEmployees([...employees, { ...newEmployee, id: newId }]);
      setNewEmployee({
        id: "",
        name: "",
        address: "",
        email: "",
        phone: "",
        position: "",
        employmentType: "Employee",
        status: "Active",
      });
      setShowForm(false);
    }
  };

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Employee Management</h1>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "1rem 0" }}>
        <div>
          <input
            type="text"
            placeholder="Search by name, address, email, or phone"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ padding: "0.5rem", marginRight: "1rem" }}
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ padding: "0.5rem" }}
          >
            <option value="">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
        <button onClick={() => setShowForm(!showForm)} style={{ padding: "0.5rem 1rem" }}>
          {showForm ? "Cancel" : "Add New Employee"}
        </button>
      </div>

      {showForm && (
        <div style={{ margin: "1rem 0", padding: "1rem", border: "1px solid #ccc" }}>
          <h3>Add New Employee</h3>
          <input
            type="text"
            placeholder="Name"
            value={newEmployee.name}
            onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
            style={{ padding: "0.5rem", marginRight: "0.5rem" }}
          />
          <input
            type="text"
            placeholder="Address"
            value={newEmployee.address}
            onChange={(e) => setNewEmployee({ ...newEmployee, address: e.target.value })}
            style={{ padding: "0.5rem", marginRight: "0.5rem" }}
          />
          <input
            type="email"
            placeholder="Email"
            value={newEmployee.email}
            onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
            style={{ padding: "0.5rem", marginRight: "0.5rem" }}
          />
          <input
            type="text"
            placeholder="Phone"
            value={newEmployee.phone}
            onChange={(e) => setNewEmployee({ ...newEmployee, phone: e.target.value })}
            style={{ padding: "0.5rem", marginRight: "0.5rem" }}
          />
          <input
            type="text"
            placeholder="Position"
            value={newEmployee.position}
            onChange={(e) => setNewEmployee({ ...newEmployee, position: e.target.value })}
            style={{ padding: "0.5rem", marginRight: "0.5rem" }}
          />
          <select
            value={newEmployee.employmentType}
            onChange={(e) => setNewEmployee({ ...newEmployee, employmentType: e.target.value })}
            style={{ padding: "0.5rem", marginRight: "0.5rem" }}
          >
            <option value="Employee">Employee</option>
            <option value="Contractor">Contractor</option>
            <option value="Subcontractor">Subcontractor</option>
          </select>
          <select
            value={newEmployee.status}
            onChange={(e) => setNewEmployee({ ...newEmployee, status: e.target.value })}
            style={{ padding: "0.5rem", marginRight: "0.5rem" }}
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
          <button onClick={handleAddEmployee} style={{ padding: "0.5rem 1rem" }}>Save</button>
        </div>
      )}

      <table border="1" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Address</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Position</th>
            <th>Employment Type</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredEmployees.map((employee) => (
            <tr key={employee.id}>
              <td>
                <a href={`/employees/${employee.id}`}>{employee.name}</a>
              </td>
              <td>{employee.address}</td>
              <td>{employee.email}</td>
              <td>{employee.phone}</td>
              <td>{employee.position}</td>
              <td>{employee.employmentType}</td>
              <td>{employee.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
