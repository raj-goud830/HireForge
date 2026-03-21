"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";

export default function ResumeForm() {
  const { getToken } = useAuth();
  const [step, setStep] = useState(1);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    targetRole: "",
    summary: "",
    contact: { email: "", phone: "", linkedin: "", github: "" },
    experience: [],
    education: [],
    skills: [],
    projects: [],
  });

  const nextStep = () => setStep((s) => Math.min(s + 1, 4));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const handleEnhanceSummary = async () => {
    if (!formData.summary) return alert("Please enter a summary first");
    try {
      setIsEnhancing(true);
      const token = await getToken();
      const res = await fetch("http://localhost:5000/api/ai/enhance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: formData.summary, type: "summary" }),
      });
      const data = await res.json();
      if (data.enhancedText) {
        setFormData({ ...formData, summary: data.enhancedText });
      } else {
        alert("Failed to enhance summary");
      }
    } catch (err) {
      console.error(err);
      alert("Error enhancing summary");
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleSaveResume = async () => {
    if (!formData.title) return alert("Please enter a Resume Title first");
    try {
      const token = await getToken();
      const res = await fetch("http://localhost:5000/api/resumes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        alert("Resume Saved Successfully!");
        window.location.href = "/dashboard/resumes";
      } else {
        const errText = await res.text();
        console.error("Save Resume Error Response:", errText);
        alert(`Failed to save resume: ${res.status} ${errText}`);
      }
    } catch (err) {
      console.error(err);
      alert("Error saving resume");
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col md:flex-row min-h-[600px]">
      {/* Sidebar Progress */}
      <div className="w-full md:w-64 bg-slate-50 border-b md:border-b-0 md:border-r border-slate-200 p-6 flex flex-row md:flex-col gap-4 overflow-x-auto md:overflow-hidden">
        <div className={`flex items-center gap-3 ${step === 1 ? "text-blue-600 font-semibold" : "text-slate-500"}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step === 1 ? "border-blue-600 bg-blue-50" : "border-slate-300"}`}>1</div>
          <span className="hidden md:inline">Basic Info</span>
        </div>
        <div className={`flex items-center gap-3 ${step === 2 ? "text-blue-600 font-semibold" : "text-slate-500"}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step >= 2 ? (step === 2 ? "border-blue-600 bg-blue-50" : "border-blue-600 bg-blue-600 text-white") : "border-slate-300"}`}>2</div>
          <span className="hidden md:inline">Experience</span>
        </div>
        <div className={`flex items-center gap-3 ${step === 3 ? "text-blue-600 font-semibold" : "text-slate-500"}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step >= 3 ? (step === 3 ? "border-blue-600 bg-blue-50" : "border-blue-600 bg-blue-600 text-white") : "border-slate-300"}`}>3</div>
          <span className="hidden md:inline">Education</span>
        </div>
        <div className={`flex items-center gap-3 ${step === 4 ? "text-blue-600 font-semibold" : "text-slate-500"}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step === 4 ? "border-blue-600 bg-blue-50" : "border-slate-300"}`}>4</div>
          <span className="hidden md:inline">Skills & Projects</span>
        </div>
      </div>

      {/* Main Form Content */}
      <div className="flex-1 p-8 flex flex-col">
        <div className="flex-1">
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-2xl font-bold text-slate-900">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Resume Title</label>
                  <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g. SDE Frontend 2026" className="w-full h-11 px-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Target Role</label>
                  <select value={formData.targetRole} onChange={e => setFormData({...formData, targetRole: e.target.value})} className="w-full h-11 px-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white">
                    <option value="" disabled>Select Role</option>
                    <option value="web">Web Developer</option>
                    <option value="cloud">Cloud Engineer</option>
                    <option value="devops">DevOps Engineer</option>
                    <option value="data">Data Scientist</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Email Address</label>
                  <input type="email" value={formData.contact.email} onChange={e => setFormData({...formData, contact: { ...formData.contact, email: e.target.value}})} placeholder="john@example.com" className="w-full h-11 px-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Phone</label>
                  <input type="tel" value={formData.contact.phone} onChange={e => setFormData({...formData, contact: { ...formData.contact, phone: e.target.value}})} placeholder="+1 (555) 000-0000" className="w-full h-11 px-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-slate-700">Professional Summary <span className="text-blue-600 font-normal text-xs ml-2">✨ AI Optional</span></label>
                  <textarea value={formData.summary} onChange={(e) => setFormData({...formData, summary: e.target.value})} rows={4} placeholder="Brief summary of your background and goals..." className="w-full p-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"></textarea>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-900">Work Experience</h2>
                <button className="text-sm text-blue-600 font-semibold hover:text-blue-700 border border-blue-200 bg-blue-50 px-3 py-1.5 rounded-lg transition-colors">
                  + Add Experience
                </button>
              </div>
              
              <div className="p-6 border border-slate-200 rounded-xl bg-slate-50 text-center">
                <p className="text-slate-500 text-sm">No experience added yet. Add your internships or full-time roles.</p>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-900">Education</h2>
                <button className="text-sm text-blue-600 font-semibold hover:text-blue-700 border border-blue-200 bg-blue-50 px-3 py-1.5 rounded-lg transition-colors">
                  + Add Education
                </button>
              </div>
              <div className="p-6 border border-slate-200 rounded-xl bg-slate-50 text-center">
                <p className="text-slate-500 text-sm">No education added yet. Add your university degrees.</p>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-2xl font-bold text-slate-900">Skills & Projects</h2>
              <div className="space-y-2">
                 <label className="text-sm font-medium text-slate-700">Skills (Comma separated)</label>
                 <input type="text" placeholder="React, Next.js, TypeScript, Docker..." className="w-full h-11 px-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
              </div>

               <div className="flex justify-between items-center mt-8">
                <h3 className="text-xl font-bold text-slate-900">Projects</h3>
                <button className="text-sm text-blue-600 font-semibold hover:text-blue-700 border border-blue-200 bg-blue-50 px-3 py-1.5 rounded-lg transition-colors">
                  + Add Project
                </button>
              </div>
              <div className="p-6 border border-slate-200 rounded-xl bg-slate-50 text-center">
                <p className="text-slate-500 text-sm">No projects added. Add key personal or academic projects.</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-6 border-t border-slate-200 mt-6 flex justify-between">
          <button
            onClick={prevStep}
            disabled={step === 1}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${step === 1 ? "bg-slate-100 text-slate-400 cursor-not-allowed" : "bg-white border border-slate-300 text-slate-700 hover:bg-slate-50"}`}
          >
            Back
          </button>
          
          <div className="flex gap-3">
             <button type="button" onClick={handleEnhanceSummary} disabled={isEnhancing} className="px-6 py-2 rounded-lg font-medium bg-indigo-50 text-indigo-600 border border-indigo-200 hover:bg-indigo-100 disabled:opacity-50 transition-colors flex items-center gap-2">
                <span className="text-lg">✨</span> {isEnhancing ? "Enhancing..." : "Auto-Enhance with AI"}
             </button>
            {step < 4 ? (
              <button
                onClick={nextStep}
                className="px-6 py-2 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm"
              >
                Next Step
              </button>
            ) : (
               <button
                onClick={handleSaveResume}
                className="px-6 py-2 rounded-lg font-medium bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-sm"
              >
                Save Resume
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
