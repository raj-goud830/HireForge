"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";

// Mock Data for MVP Demonstration
const MOCK_JOBS = [
  { id: 1, title: "Frontend Engineer", company: "Vercel", type: "Full-time", location: "Remote", salary: "$120k-$150k", tags: ["React", "Next.js", "TypeScript"], posted: "2 hours ago", isStartup: true },
  { id: 2, title: "Backend Engineer", company: "Stripe", type: "Full-time", location: "San Francisco, CA", salary: "$140k-$180k", tags: ["Node.js", "Ruby", "API"], posted: "5 hours ago", isStartup: false },
  { id: 3, title: "Founding Engineer", company: "AI Startup Stealth", type: "Full-time", location: "Remote", salary: "$100k + Equity", tags: ["React", "Python", "LLMs"], posted: "1 day ago", isStartup: true },
  { id: 4, title: "DevOps Engineer", company: "Supabase", type: "Contract", location: "Remote", salary: "$100/hr", tags: ["Docker", "AWS", "Postgres"], posted: "2 days ago", isStartup: true },
  { id: 5, title: "Data Scientist", company: "OpenAI", type: "Full-time", location: "San Francisco, CA", salary: "$150k-$200k", tags: ["Python", "PyTorch", "ML"], posted: "3 days ago", isStartup: false },
];

export default function JobFinderPage() {
  const { getToken } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStartup, setFilterStartup] = useState(false);
  const [isSaving, setIsSaving] = useState<number | null>(null);

  const filteredJobs = MOCK_JOBS.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) || job.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStartup = filterStartup ? job.isStartup : true;
    return matchesSearch && matchesStartup;
  });

  const handleSaveToTracker = async (job: typeof MOCK_JOBS[0]) => {
    setIsSaving(job.id);
    try {
      const token = await getToken();
      const res = await fetch("http://localhost:5000/api/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          company: job.company,
          position: job.title,
          status: "Saved",
          salary: job.salary,
          location: job.location
        }),
      });
      if (res.ok) {
        alert("Saved to your Job Tracker!");
      }
    } catch (err) {
      alert("Error saving job.");
    } finally {
      setIsSaving(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Auto Job Finder</h1>
        <p className="text-slate-500 mt-1">Discover fresh tech roles and startups tailored to your criteria.</p>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4">
         <div className="flex-1 relative">
            <span className="absolute left-4 top-3.5 text-slate-400">🔍</span>
            <input 
              type="text" 
              placeholder="Search by role or company..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full h-12 pl-12 pr-4 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50"
            />
         </div>
         <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl hover:bg-slate-100 transition-colors">
               <input 
                 type="checkbox" 
                 checked={filterStartup} 
                 onChange={e => setFilterStartup(e.target.checked)} 
                 className="w-5 h-5 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer" 
               />
               <span className="font-medium text-slate-700">Startups Only 🚀</span>
            </label>
            <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors shadow-sm h-12">
               Search
            </button>
         </div>
      </div>

      <div className="space-y-4">
         <div className="flex justify-between items-end mb-2 px-2">
            <h2 className="text-xl font-bold text-slate-800">Available Roles <span className="text-slate-400 font-normal text-sm ml-2">({filteredJobs.length} found)</span></h2>
            <button className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
               <span className="text-lg">🔔</span> Create Email Alert
            </button>
         </div>

         <div className="grid gap-4">
            {filteredJobs.map(job => (
              <div key={job.id} className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-emerald-400 hover:shadow-md transition-all flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-center group">
                 <div className="space-y-2">
                    <div className="flex items-center gap-3">
                       <h3 className="text-lg font-bold text-slate-900">{job.title}</h3>
                       {job.isStartup && <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-0.5 rounded-full border border-orange-200">Startup</span>}
                    </div>
                    <p className="font-medium text-slate-700">{job.company}</p>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                       <span className="flex items-center gap-1">📍 {job.location}</span>
                       <span className="flex items-center gap-1">💼 {job.type}</span>
                       <span className="flex items-center gap-1">💰 {job.salary}</span>
                    </div>
                    <div className="flex gap-2 pt-2">
                       {job.tags.map(tag => (
                          <span key={tag} className="bg-slate-100 text-slate-600 text-xs font-medium px-2.5 py-1 rounded-md border border-slate-200">
                             {tag}
                          </span>
                       ))}
                    </div>
                 </div>

                 <div className="flex sm:flex-col gap-3 w-full sm:w-auto">
                    <button 
                      onClick={() => handleSaveToTracker(job)}
                      disabled={isSaving === job.id}
                      className="flex-1 sm:flex-none border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-semibold px-6 py-2.5 rounded-xl transition-colors text-sm"
                    >
                       {isSaving === job.id ? "Saving..." : "Save to Tracker"}
                    </button>
                    <button className="flex-1 sm:flex-none bg-slate-900 hover:bg-slate-800 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors text-sm shadow-sm">
                       Apply Now
                    </button>
                 </div>
              </div>
            ))}
            
            {filteredJobs.length === 0 && (
               <div className="text-center py-12 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl">
                  <span className="text-4xl">🔭</span>
                  <h3 className="text-lg font-bold text-slate-900 mt-4">No jobs found</h3>
                  <p className="text-slate-500 mt-1">Try adjusting your filters or search terms.</p>
               </div>
            )}
         </div>
      </div>
    </div>
  );
}
