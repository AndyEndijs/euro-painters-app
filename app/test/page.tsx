"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function JobDetailsPage() {
  const router = useRouter();
  const [job, setJob] = useState(null);

  useEffect(() => {
    // Fetch job data here
    setJob({ id: 1, title: "Paint Job" });
  }, []);

  return (
    <div>
      <h1>Job Details</h1>
      {job ? <p>{job.title}</p> : <p>Loading...</p>}
    </div>
  );
}
