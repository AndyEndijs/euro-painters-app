"use client";
import { useState } from "react";

type Customer = {
  id: number;
  name: string;
  address: string;
  email: string;
  phone: string;
};

const dummyCustomers: Customer[] = [
  { id: 1, name: "John Doe", address: "123 Main St", email: "john@example.com", phone: "123-456-7890" },
  { id: 2, name: "Jane Smith", address: "456 Oak Ave", email: "jane@example.com", phone: "987-654-3210" },
  { id: 3, name: "Acme Corp", address: "789 Elm Blvd", email: "contact@acme.com", phone: "555-555-5555" },
];

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>(dummyCustomers);
  const [newCustomer, setNewCustomer] = useState<Customer>({
    id: 0,
    name: "",
    address: "",
    email: "",
    phone: "",
  });
  const [searchTerm, setSearchTerm] = useState<string>("");

  const handleAddCustomer = () => {
    if (newCustomer.name.trim()) {
      setCustomers([...customers, { ...newCustomer, id: customers.length + 1 }]);
      setNewCustomer({ id: 0, name: "", address: "", email: "", phone: "" });
    }
  };

  const filteredCustomers = customers.filter((customer) =>
    [customer.name, customer.address, customer.email, customer.phone].some((field) =>
      field.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <main style={{ padding: "2rem", textAlign: "left" }}>
      <h1>Customer Management</h1>

      <input
        type="text"
        placeholder="Search customers..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: "1rem", padding: "0.5rem", width: "100%" }}
      />

      <h2>Add New Customer</h2>
      <div style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Name"
          value={newCustomer.name}
          onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
          style={{ margin: "0.5rem", padding: "0.5rem" }}
        />
        <input
          type="text"
          placeholder="Address"
          value={newCustomer.address}
          onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
          style={{ margin: "0.5rem", padding: "0.5rem" }}
        />
        <input
          type="text"
          placeholder="Email"
          value={newCustomer.email}
          onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
          style={{ margin: "0.5rem", padding: "0.5rem" }}
        />
        <input
          type="text"
          placeholder="Phone"
          value={newCustomer.phone}
          onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
          style={{ margin: "0.5rem", padding: "0.5rem" }}
        />
        <button onClick={handleAddCustomer} style={{ padding: "0.5rem 1rem" }}>
          Add Customer
        </button>
      </div>

      <h2>Customer List</h2>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>Name</th>
            <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>Address</th>
            <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>Email</th>
            <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>Phone</th>
          </tr>
        </thead>
        <tbody>
          {filteredCustomers.map((customer) => (
            <tr key={customer.id}>
              <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>
                <a href={`/customers/${customer.id}`}>{customer.name}</a>
              </td>
              <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>{customer.address}</td>
              <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>{customer.email}</td>
              <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>{customer.phone}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
