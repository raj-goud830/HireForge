"use client";

import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";

export default function PortfoliosPage() {
  const { getToken, isLoaded } = useAuth();
  const [portfolios, setPortfolios] = useState<any[]>([]);
  const [deployingId, setDeployingId] = useState<string | null>(null);

  async function fetchPortfolios() {
    if (!isLoaded) return;
    try {
      const token = await getToken();
      const res = await fetch("http://localhost:5000/api/portfolios", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setPortfolios(data);
      }
    } catch (error) {
      console.error("Failed to fetch portfolios", error);
    }
  }

  useEffect(() => {
    fetchPortfolios();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getToken, isLoaded]);

  const handleDeploy = async (id: string) => {
    setDeployingId(id);
    try {
      const token = await getToken();
      const res = await fetch(`http://localhost:5000/api/portfolios/${id}/deploy`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
         await fetchPortfolios();
         alert("Deployment Successful (Mock)!");
      } else {
         alert("Failed to deploy");
      }
    } catch (err) {
      console.error(err);
      alert("Error deploying portfolio");
    } finally {
      setDeployingId(null);
    }
  };

  const handleDownloadTemplate = async (id: string, title: string) => {
    try {
      const token = await getToken();
      const res = await fetch(`http://localhost:5000/api/portfolios/${id}/download`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Download failed");
      
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${title.replace(/\s+/g, '-').toLowerCase()}-portfolio.html`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error(err);
      alert("Error downloading template");
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 relative">
      {/* Deployment Overlay Mock */}
      {deployingId && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 text-center">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full animate-in zoom-in-95 duration-200">
                <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-6"></div>
                <h3 className="text-xl font-bold text-slate-900">Deploying Portfolio</h3>
                <p className="text-sm text-slate-500 mt-2 mb-4">Generating repository, pushing code to GitHub, and triggering Vercel build...</p>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-600 animate-[pulse_1s_ease-in-out_infinite] w-full origin-left"></div>
                </div>
            </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Your Portfolios</h1>
          <p className="text-slate-500 mt-1">One-click stunning developer portfolios.</p>
        </div>
        <Link
          href="/dashboard/portfolios/new"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-semibold transition-colors shadow-sm inline-flex items-center gap-2"
        >
          <span>✨</span> Create New Portfolio
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {portfolios.map((portfolio) => (
          <div key={portfolio._id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden group hover:border-indigo-400 hover:shadow-md transition-all flex flex-col">
            <div className={`h-40 flex items-center justify-center border-b border-slate-200 ${portfolio.theme === 'dark' ? 'bg-slate-900 text-white' : portfolio.theme === 'creative' ? 'bg-indigo-50 text-indigo-900' : 'bg-slate-50 text-slate-900'}`}>
              <div className="text-center px-4">
                 <h2 className="font-bold text-xl truncate">{portfolio.hero?.heading || "Hello World"}</h2>
                 <p className="text-xs opacity-70 truncate mt-1">{portfolio.hero?.subheading}</p>
              </div>
            </div>
            <div className="p-5 flex-1 flex flex-col">
              <h3 className="text-lg font-bold text-slate-900">{portfolio.title}</h3>
              <p className="text-sm text-slate-500 mt-1 flex items-center gap-2">
                 <span className="w-3 h-3 rounded-full" style={{backgroundColor: portfolio.primaryColor}}></span>
                 Theme: <span className="capitalize">{portfolio.theme}</span>
              </p>
              
              <div className="mt-auto pt-6 flex flex-col gap-2">
                <div className="flex gap-2">
                  <button onClick={() => handleDownloadTemplate(portfolio._id, portfolio.title)} className="flex-1 flex justify-center items-center font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 py-2 rounded-lg text-sm transition-colors gap-2">
                    ⬇️ Code
                  </button>
                  {portfolio.isDeployed ? (
                     <a href={portfolio.customDomain} target="_blank" rel="noopener noreferrer" className="flex-1 flex justify-center items-center bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 font-medium py-2 rounded-lg text-sm transition-colors gap-2">
                       <span className="text-green-600">✓</span> Live
                     </a>
                  ) : (
                     <button onClick={() => handleDeploy(portfolio._id)} className="flex-1 flex justify-center items-center bg-indigo-50 text-indigo-600 border border-indigo-200 hover:bg-indigo-100 font-medium py-2 rounded-lg text-sm transition-colors gap-2">
                       🚀 Deploy
                     </button>
                  )}
                </div>
              </div>
              
              {portfolio.isDeployed && (
                <div className="mt-3 text-xs text-center border-t border-slate-100 pt-3 flex flex-col gap-1">
                   <a href={portfolio.githubRepoUrl} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-slate-900 underline underline-offset-2">GitHub Repository</a>
                   <span className="text-slate-400">{portfolio.customDomain}</span>
                </div>
              )}
            </div>
          </div>
        ))}

        <Link href="/dashboard/portfolios/new" className="bg-slate-50 rounded-2xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-indigo-600 hover:border-indigo-400 transition-all min-h-[300px] gap-3">
            <div className="w-14 h-14 rounded-full bg-white border border-slate-200 flex items-center justify-center text-2xl shadow-sm">
                +
            </div>
            <p className="font-medium">Design New Portfolio</p>
        </Link>
      </div>
    </div>
  );
}
