import Link from 'next/link';

export default function Navbar() {
  return (
    <nav style={{ padding: "1rem", backgroundColor: "#333", color: "#fff" }}>
      <ul style={{ display: "flex", gap: "1rem", listStyle: "none" }}>
        <li><Link href="/">Home</Link></li>
        <li><Link href="/jobs">Jobs</Link></li>
        <li><Link href="/employees">Employees</Link></li>
        <li><Link href="/customers">Customers</Link></li>
        <li><Link href="/timesheets">Timesheets</Link></li>
        <li><Link href="/settings">Settings</Link></li>
      </ul>
    </nav>
  );
}
