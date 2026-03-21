"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";

const COLUMNS = ["Saved", "Applied", "Interviewing", "Offered", "Rejected"];

export default function JobsPage() {
  const { getToken, isLoaded } = useAuth();
  const [jobs, setJobs] = useState<any[]>([]);
  const [isAddingMode, setIsAddingMode] = useState(false);
  const [newJob, setNewJob] = useState({ company: "", position: "", status: "Applied" });

  async function fetchJobs() {
    if (!isLoaded) return;
    try {
      const token = await getToken();
      const res = await fetch("http://localhost:5000/api/jobs", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setJobs(data);
      }
    } catch (error) {
      console.error("Failed to fetch jobs", error);
    }
  }

  useEffect(() => {
    fetchJobs();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getToken, isLoaded]);

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJob.company || !newJob.position) return alert("Company and Position are required");
    try {
      const token = await getToken();
      const res = await fetch("http://localhost:5000/api/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newJob),
      });
      if (res.ok) {
        setNewJob({ company: "", position: "", status: "Applied" });
        setIsAddingMode(false);
        fetchJobs();
      }
    } catch (err) {
      alert("Error adding job");
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const token = await getToken();
      const res = await fetch(`http://localhost:5000/api/jobs/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        fetchJobs();
      }
    } catch (err) {
      alert("Error updating job");
    }
  };

  const handleDelete = async (id: string) => {
    if(!confirm("Are you sure you want to delete this job?")) return;
    try {
      const token = await getToken();
      const res = await fetch(`http://localhost:5000/api/jobs/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        fetchJobs();
      }
    } catch (err) {
      alert("Error deleting job");
    }
  };

  return (
    <div className="max-w-7xl mx-auto flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex justify-between items-end mb-6 shrink-0">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Job Board</h1>
          <p className="text-slate-500 mt-1">Track your applications pipeline.</p>
        </div>
        <button
          onClick={() => setIsAddingMode(!isAddingMode)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-semibold transition-colors shadow-sm"
        >
          {isAddingMode ? "Cancel" : "+ Add Job"}
        </button>
      </div>

      {isAddingMode && (
        <form onSubmit={handleCreateJob} className="bg-white p-6 rounded-xl border border-indigo-200 shadow-md mb-8 flex gap-4 items-end shrink-0 animate-in slide-in-from-top-4">
          <div className="flex-1 space-y-2">
            <label className="text-sm font-semibold text-slate-700">Company</label>
            <input 
              type="text" 
              value={newJob.company} 
              onChange={e => setNewJob({...newJob, company: e.target.value})} 
              placeholder="e.g. Google"
              className="w-full h-11 px-4 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex-1 space-y-2">
            <label className="text-sm font-semibold text-slate-700">Position</label>
            <input 
              type="text" 
              value={newJob.position} 
              onChange={e => setNewJob({...newJob, position: e.target.value})} 
              placeholder="e.g. Frontend Engineer"
              className="w-full h-11 px-4 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="w-48 space-y-2">
            <label className="text-sm font-semibold text-slate-700">Status</label>
            <select 
              value={newJob.status} 
              onChange={e => setNewJob({...newJob, status: e.target.value})}
              className="w-full h-11 px-4 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              {COLUMNS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <button type="submit" className="h-11 bg-slate-900 hover:bg-slate-800 text-white px-8 rounded-lg font-semibold transition-colors">
            Save
          </button>
        </form>
      )}

      {/* Kanban Board */}
      <div className="flex gap-6 overflow-x-auto pb-6 flex-1 items-start min-h-0">
        {COLUMNS.map(column => {
          const columnJobs = jobs.filter(j => j.status === column);
          return (
            <div key={column} className="flex-shrink-0 w-80 bg-slate-100/50 rounded-xl p-4 flex flex-col max-h-full border border-slate-200">
              <div className="flex justify-between items-center mb-4 px-1">
                <h3 className="font-bold text-slate-700 uppercase tracking-wider text-sm">{column}</h3>
                <span className="bg-slate-200 text-slate-600 text-xs font-bold px-2.5 py-1 rounded-full">{columnJobs.length}</span>
              </div>
              
              <div className="flex flex-col gap-3 overflow-y-auto min-h-0 pb-2 pr-1 custom-scrollbar">
                {columnJobs.map(job => {
                  const isStale = job.status === 'Applied' && (new Date().getTime() - new Date(job.dateApplied).getTime()) > 7 * 24 * 60 * 60 * 1000;
                  return (
                  <div key={job._id} className={`bg-white p-4 rounded-xl shadow-sm border hover:border-indigo-400 group transition-all flex flex-col relative cursor-pointer ${isStale ? 'border-amber-300 bg-amber-50/30' : 'border-slate-200'}`}>
                    
                    <button onClick={() => handleDelete(job._id)} className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-opacity">
                      ✕
                    </button>

                    <h4 className="font-bold text-slate-900 pr-6 flex items-center gap-2">
                        {job.position}
                        {isStale && <span title="Applied over 7 days ago. Consider following up!" className="flex w-2 h-2 rounded-full bg-amber-500"></span>}
                    </h4>
                    <p className="text-sm text-slate-600 font-medium">{job.company}</p>
                    
                    <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center">
                       <span className="text-xs text-slate-400 font-medium">
                          {new Date(job.dateApplied).toLocaleDateString()}
                       </span>
                       
                       <select 
                         value={job.status}
                         onChange={(e) => handleUpdateStatus(job._id, e.target.value)}
                         className="text-xs bg-slate-50 border border-slate-200 rounded-md px-2 py-1 outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                       >
                         {COLUMNS.map(c => <option key={c} value={c}>{c}</option>)}
                       </select>
                    </div>
                  </div>
                )})}

                {columnJobs.length === 0 && (
                   <div className="text-center p-6 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 text-sm">
                      No jobs in this stage.
                   </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
