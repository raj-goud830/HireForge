"use client";

import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";

export default function ResumesPage() {
  const { getToken, isLoaded } = useAuth();
  const [resumes, setResumes] = useState<any[]>([]);

  useEffect(() => {
    async function fetchResumes() {
      if (!isLoaded) return;
      try {
        const token = await getToken();
        const res = await fetch("http://localhost:5000/api/resumes", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setResumes(data);
        }
      } catch (error) {
        console.error("Failed to fetch resumes", error);
      }
    }
    fetchResumes();
  }, [getToken, isLoaded]);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Your Resumes</h1>
          <p className="text-slate-500 mt-1">Manage and export your ATS-friendly resumes.</p>
        </div>
        <Link
          href="/dashboard/resumes/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-semibold transition-colors shadow-sm"
        >
          Create New Resume
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resumes.map((resume) => (
          <div key={resume._id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden group hover:border-blue-400 hover:shadow-md transition-all flex flex-col">
            <div className="h-40 bg-slate-100 flex items-center justify-center border-b border-slate-200">
              <span className="text-6xl group-hover:scale-110 transition-transform duration-300">📄</span>
            </div>
            <div className="p-5 flex-1 flex flex-col">
              <h3 className="text-lg font-bold text-slate-900">{resume.title}</h3>
              <p className="text-sm text-slate-500 mt-1">Target Role: {resume.targetRole || "General"}</p>
              
              <div className="mt-auto pt-6 flex gap-2">
                <button className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-2 rounded-lg text-sm transition-colors">
                  Edit
                </button>
                <Link href={`/dashboard/resumes/${resume._id}`} className="flex-1 flex justify-center items-center bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100 font-medium py-2 rounded-lg text-sm transition-colors">
                  View PDF
                </Link>
              </div>
            </div>
          </div>
        ))}

        <Link href="/dashboard/resumes/new" className="bg-slate-50 rounded-2xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-blue-600 hover:border-blue-400 transition-all min-h-[300px] gap-3">
            <div className="w-14 h-14 rounded-full bg-white border border-slate-200 flex items-center justify-center text-2xl shadow-sm">
                +
            </div>
            <p className="font-medium">Create New Resume</p>
        </Link>
      </div>
    </div>
  );
}
