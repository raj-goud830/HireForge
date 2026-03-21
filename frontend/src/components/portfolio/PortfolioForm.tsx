"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";

export default function PortfolioForm() {
  const { getToken } = useAuth();
  const [formData, setFormData] = useState({
    title: "My Dev Portfolio",
    theme: "minimal",
    primaryColor: "#2563eb", // blue-600
    hero: {
      heading: "Hi, I'm a Developer",
      subheading: "I build modern web applications.",
    }
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const token = await getToken();
      const res = await fetch("http://localhost:5000/api/portfolios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        alert("Portfolio Designed Successfully!");
        window.location.href = "/dashboard/portfolios";
      } else {
        alert("Failed to save portfolio.");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving portfolio");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col lg:flex-row min-h-[700px] overflow-hidden">
      
      {/* Editor Sidebar */}
      <div className="w-full lg:w-[400px] border-b lg:border-b-0 lg:border-r border-slate-200 bg-slate-50 p-6 flex flex-col h-[700px] overflow-y-auto">
        <h2 className="text-xl font-bold text-slate-900 mb-6">Design Editor</h2>
        
        <div className="space-y-6 flex-1">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Portfolio Title</label>
            <input 
              type="text" 
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full h-10 px-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white" 
            />
          </div>

          <div className="space-y-3">
             <label className="text-sm font-semibold text-slate-700">Theme Base</label>
             <div className="grid grid-cols-3 gap-3">
                 <button onClick={() => setFormData({...formData, theme: 'minimal'})} className={`py-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${formData.theme === 'minimal' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-400'}`}>
                    <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-300"></div>
                    <span className="text-xs font-semibold">Minimal</span>
                 </button>
                 <button onClick={() => setFormData({...formData, theme: 'dark'})} className={`py-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${formData.theme === 'dark' ? 'border-indigo-600 bg-indigo-900 text-indigo-100' : 'border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-600'}`}>
                    <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-600"></div>
                    <span className="text-xs font-semibold">Dark</span>
                 </button>
                 <button onClick={() => setFormData({...formData, theme: 'creative'})} className={`py-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${formData.theme === 'creative' ? 'border-pink-500 bg-pink-50 text-pink-700' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-400'}`}>
                    <div className="w-8 h-8 rounded-full bg-linear-to-tr from-pink-400 to-purple-500 border border-transparent"></div>
                    <span className="text-xs font-semibold">Creative</span>
                 </button>
             </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Primary Color</label>
            <div className="flex gap-2 items-center">
                <input 
                 type="color" 
                 value={formData.primaryColor}
                 onChange={(e) => setFormData({...formData, primaryColor: e.target.value})}
                 className="w-10 h-10 rounded-lg border-0 bg-transparent cursor-pointer" 
                />
                <span className="text-sm text-slate-500 font-mono">{formData.primaryColor}</span>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-200 space-y-4">
             <h3 className="font-bold text-slate-900">Hero Section</h3>
             <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Heading</label>
                <input 
                  type="text" 
                  value={formData.hero.heading}
                  onChange={(e) => setFormData({...formData, hero: {...formData.hero, heading: e.target.value}})}
                  className="w-full h-10 px-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white" 
                />
             </div>
             <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Subheading</label>
                <textarea 
                  rows={3}
                  value={formData.hero.subheading}
                  onChange={(e) => setFormData({...formData, hero: {...formData.hero, subheading: e.target.value}})}
                  className="w-full p-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white resize-none" 
                ></textarea>
             </div>
          </div>
        </div>

        <div className="pt-6 mt-6 border-t border-slate-200">
             <button 
                onClick={handleSave} 
                disabled={isSaving}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 rounded-xl shadow-md transition-all disabled:opacity-50"
             >
                {isSaving ? "Saving..." : "Save Design"}
             </button>
        </div>
      </div>

      {/* Live Preview Area */}
      <div className="flex-1 bg-slate-200/50 p-4 sm:p-8 flex items-center justify-center relative overflow-hidden h-[700px]">
          <div className="absolute top-4 left-4 bg-white/80 backdrop-blur text-xs font-bold px-3 py-1 rounded-full text-slate-500 shadow-sm border border-slate-200">
             Live Preview
          </div>

          {/* Browser Window Mockup */}
          <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-slate-300 overflow-hidden flex flex-col h-[500px]">
             <div className="h-8 bg-slate-100 border-b border-slate-200 flex items-center px-4 gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
             </div>

             {/* Dynamic Theme Content */}
             <div className={`flex-1 flex flex-col items-center justify-center p-8 text-center transition-colors duration-500 ${formData.theme === 'dark' ? 'bg-slate-900 text-white' : formData.theme === 'creative' ? 'bg-indigo-50 text-indigo-900' : 'bg-white text-slate-900'}`}>
                 
                 {formData.theme === 'creative' && <div className="absolute w-64 h-64 bg-linear-to-tr from-pink-300 to-purple-300 rounded-full blur-3xl opacity-30 -top-20 -left-20"></div>}

                 <div className="relative z-10">
                    <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight" style={{color: formData.theme === 'minimal' ? formData.primaryColor : 'inherit'}}>
                        {formData.hero.heading}
                    </h1>
                    <p className="mt-4 text-lg max-w-md mx-auto opacity-80 leading-relaxed">
                        {formData.hero.subheading}
                    </p>
                    <div className="mt-8 flex gap-4 justify-center">
                       <button className="px-6 py-2.5 rounded-full text-white font-semibold transition-transform hover:scale-105" style={{backgroundColor: formData.primaryColor}}>
                          View Projects
                       </button>
                       <button className={`px-6 py-2.5 rounded-full font-semibold transition-all hover:bg-opacity-10`} style={{border: `2px solid ${formData.primaryColor}`, color: formData.primaryColor}}>
                          Contact Me
                       </button>
                    </div>
                 </div>

             </div>
          </div>
      </div>

    </div>
  );
}
