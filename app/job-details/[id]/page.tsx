"use client";
import { useRouter } from "next/navigation";

export default function JobDetails() {
  const router = useRouter();
  const jobId = router.query.id;

  return (
    <main style={{ padding: "2rem", textAlign: "center" }}>
      <h1>Job Details</h1>
      <p>Quote Number: {jobId}</p>
      <p>Job Name: Example Job Name</p>
      <p>Customer: Example Customer</p>
      <p>Description: This is a placeholder description for the job.</p>
      <p>Status: Active</p>
      <p>Budget: $1,000</p>

      <h2>Invoice Status</h2>
      <p>Deposit: Paid</p>
      <p>Progress: Pending</p>
      <p>Final: Unpaid</p>

      <button
        style={{ marginTop: "1rem", padding: "0.5rem 1rem" }}
        onClick={() => router.push("/jobs")}
      >
        Back to Jobs
      </button>
    </main>
  );
}
