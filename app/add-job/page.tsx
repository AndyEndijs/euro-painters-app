"use client";

import { useState, useEffect } from "react";
import { db } from "../../firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";

export default function AddJobPage() {
  // State Declarations
  const [jobName, setJobName] = useState<string>("");
  const [customerName, setCustomerName] = useState<string>("");
  const [jobDescription, setJobDescription] = useState<string>("");
  const [quoteNumber, setQuoteNumber] = useState<string>("");
  const [budget, setBudget] = useState<string>("");
  const [status, setStatus] = useState<string>("quoted");
  const [jobs, setJobs] = useState<any[]>([]);
  const [message, setMessage] = useState<string>("");

  // Fetch Jobs from Firestore
  const fetchJobs = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "jobs"));
      const jobsList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setJobs(jobsList);
    } catch (error) {
      console.error("Error fetching jobs: ", error);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // Add Job Function
  const handleAddJob = async () => {
    if (!jobName || !customerName || !jobDescription || !quoteNumber || !budget) {
      setMessage("Please fill in all fields.");
      return;
    }

    try {
      await addDoc(collection(db, "jobs"), {
        jobAddress: jobName,
        customerName,
        jobDescription,
        quoteNumber,
        budget,
        status,
      });
      setMessage("Job added successfully!");
      setJobName("");
      setCustomerName("");
      setJobDescription("");
      setQuoteNumber("");
      setBudget("");
      setStatus("quoted");
      fetchJobs();
    } catch (error) {
      console.error("Error adding job:", error);
      setMessage("Failed to add job.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Add New Job</h1>
      {message && <p className="mb-2 text-green-600">{message}</p>}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Enter job address"
          value={jobName}
          onChange={(e) => setJobName(e.target.value)}
          className="border rounded p-2 w-full mb-2"
        />
        <input
          type="text"
          placeholder="Enter customer name"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          className="border rounded p-2 w-full mb-2"
        />
        <textarea
          placeholder="Enter job description"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          className="border rounded p-2 w-full mb-2"
        />
        <input
          type="text"
          placeholder="Enter quote number"
          value={quoteNumber}
          onChange={(e) => setQuoteNumber(e.target.value)}
          className="border rounded p-2 w-full mb-2"
        />
        <input
          type="number"
          placeholder="Enter budget"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          className="border rounded p-2 w-full mb-2"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border rounded p-2 w-full mb-2"
        >
          <option value="quoted">Quoted</option>
          <option value="accepted">Accepted</option>
          <option value="active">Active</option>
          <option value="finished">Finished</option>
          <option value="archived">Archived</option>
        </select>
        <button
          onClick={handleAddJob}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Add Job
        </button>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">Job List</h2>
        {jobs.length > 0 ? (
          jobs.map((job) => (
            <div key={job.id} className="border p-2 mb-2 rounded">
              <p>
                Job Address:{" "}
                <a href={`/job-details/${job.id}`} className="text-blue-500 underline">
                  {job.jobAddress}
                </a>
              </p>
              <p>
                Quote Number:{" "}
                <a href={`/job-details/${job.id}`} className="text-blue-500 underline">
                  {job.quoteNumber}
                </a>
              </p>
              <p>Customer: {job.customerName}</p>
              <p>Description: {job.jobDescription}</p>
              <p>Budget: {job.budget}</p>
              <p>Status: {job.status}</p>
            </div>
          ))
        ) : (
          <p>No jobs found</p>
        )}
      </div>
    </div>
  );
}
