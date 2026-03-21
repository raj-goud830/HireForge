"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect, useState, use } from "react";

export default function ResumeViewPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;
  const { getToken, isLoaded } = useAuth();
  const [resume, setResume] = useState<any>(null);

  useEffect(() => {
    async function fetchResume() {
      if (!isLoaded) return;
      try {
        const token = await getToken();
        // For MVP, we fetch all and filter since we don't have a get-by-id endpoint yet.
        // A better approach would be adding a GET /api/resumes/:id route.
        const res = await fetch("http://localhost:5000/api/resumes", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        const found = data.find((r: any) => r._id === id);
        if (found) setResume(found);
      } catch (err) {
        console.error(err);
      }
    }
    fetchResume();
  }, [id, getToken, isLoaded]);

  if (!resume) return <div className="p-8">Loading Resume...</div>;

  return (
    <div className="max-w-4xl mx-auto my-8">
      {/* Action Bar (Hidden in Print) */}
      <div className="flex justify-between items-center mb-8 print:hidden bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <h1 className="text-xl font-bold text-slate-800">Preview: {resume.title}</h1>
        <button 
          onClick={() => window.print()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
        >
          Download PDF
        </button>
      </div>

      {/* A4 ATS-Friendly Resume Sheet */}
      <div className="bg-white shadow-xl max-w-[850px] mx-auto min-h-[1100px] print:shadow-none print:m-0 print:p-0">
        <div className="p-12 text-slate-900 font-[family-name:var(--font-geist-sans)]">
          {/* Header */}
          <div className="text-center border-b-2 border-slate-800 pb-6 mb-6">
            <h1 className="text-3xl font-bold uppercase tracking-wide">{resume.contact?.name || "Your Name"}</h1>
            <p className="text-sm mt-2 text-slate-600 font-medium">
              {resume.contact?.email} {resume.contact?.phone ? `| ${resume.contact.phone}` : ""} {resume.contact?.linkedin ? `| ${resume.contact.linkedin}` : ""} {resume.contact?.github ? `| ${resume.contact.github}` : ""}
            </p>
          </div>

          {/* Summary */}
          {resume.summary && (
            <div className="mb-6">
              <h2 className="text-lg font-bold uppercase tracking-wider text-slate-800 border-b border-slate-300 pb-1 mb-3">Professional Summary</h2>
              <p className="text-sm leading-relaxed">{resume.summary}</p>
            </div>
          )}

          {/* Education Placeholder */}
          <div className="mb-6">
             <h2 className="text-lg font-bold uppercase tracking-wider text-slate-800 border-b border-slate-300 pb-1 mb-3">Education</h2>
             <div className="text-sm mb-3">
                 <div className="flex justify-between font-bold">
                     <span>University Name</span>
                     <span>May 2026</span>
                 </div>
                 <div className="flex justify-between italic">
                     <span>Bachelor of Science in Computer Science</span>
                     <span>GPA: 3.8/4.0</span>
                 </div>
             </div>
          </div>

          {/* Experience Placeholder */}
           <div className="mb-6">
             <h2 className="text-lg font-bold uppercase tracking-wider text-slate-800 border-b border-slate-300 pb-1 mb-3">Experience</h2>
             <div className="text-sm mb-3">
                 <div className="flex justify-between font-bold">
                     <span>Tech Company Inc.</span>
                     <span>June 2025 - Aug 2025</span>
                 </div>
                 <div className="italic mb-2">Software Engineering Intern</div>
                 <ul className="list-disc pl-5 space-y-1">
                     <li>Developed a responsive dashboard using React and Tailwind CSS, improving load time by 20%.</li>
                     <li>Integrated RESTful APIs to display real-time user metrics.</li>
                 </ul>
             </div>
          </div>
          
           {/* Skills Placeholder */}
           <div className="mb-6">
             <h2 className="text-lg font-bold uppercase tracking-wider text-slate-800 border-b border-slate-300 pb-1 mb-3">Skills</h2>
             <p className="text-sm"><strong>Languages:</strong> JavaScript, TypeScript, Python</p>
             <p className="text-sm"><strong>Technologies:</strong> React, Next.js, Node.js, Express, MongoDB, Docker</p>
          </div>
        </div>
      </div>
    </div>
  );
}
