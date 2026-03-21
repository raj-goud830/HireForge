"use client";

import { useAuth } from "@clerk/nextjs";
import { useState } from "react";

export default function SettingsPage() {
  const { isLoaded, userId } = useAuth();
  const [isPro, setIsPro] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubscribe = async () => {
    setIsProcessing(true);
    // Mock Stripe Checkout flow
    setTimeout(() => {
      setIsProcessing(false);
      setIsPro(true);
      alert("Payment Successful! You are now subscribed to Pro.");
    }, 2000);
  };

  if (!isLoaded || !userId) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Settings & Billing</h1>
        <p className="text-slate-500 mt-1">Manage your account preferences and subscription plans.</p>
      </div>

      {/* Account Settings */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
         <h2 className="text-xl font-bold text-slate-800 mb-6 border-b border-slate-100 pb-4">Account Details</h2>
         <div className="space-y-4 max-w-md">
            <div>
               <label className="text-sm font-semibold text-slate-700 block mb-1">Clerk User ID</label>
               <input disabled type="text" value={userId} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-slate-500 font-mono text-sm" />
            </div>
            <div>
               <label className="text-sm font-semibold text-slate-700 block mb-1">Email Preferences</label>
               <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-sm font-medium text-slate-700">Job Alerts</span>
                  <input type="checkbox" defaultChecked className="w-4 h-4 text-indigo-600 rounded bg-white border-slate-300 focus:ring-indigo-500" />
               </div>
            </div>
         </div>
      </div>

      {/* Subscription Plans */}
      <div>
         <h2 className="text-xl font-bold text-slate-800 mb-6">Choose Your Plan</h2>
         <div className="grid md:grid-cols-2 gap-6">
            
            {/* Free Plan */}
            <div className={`bg-white p-8 rounded-2xl border-2 transition-all ${!isPro ? 'border-indigo-600 shadow-lg relative' : 'border-slate-200 shadow-sm opacity-75'}`}>
               {!isPro && <div className="absolute top-0 right-8 transform -translate-y-1/2 bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Current Plan</div>}
               <h3 className="text-2xl font-bold text-slate-900">Starter</h3>
               <div className="my-4 flex items-end gap-1">
                  <span className="text-4xl font-extrabold text-slate-900">$0</span>
                  <span className="text-slate-500 font-medium mb-1">/ month</span>
               </div>
               <p className="text-slate-500 text-sm mb-6">Perfect for students starting their career journey.</p>
               
               <ul className="space-y-3 text-sm font-medium text-slate-700 mb-8">
                  <li className="flex gap-3 items-center"><span className="text-indigo-600">✓</span> 1 AI Resume Generation</li>
                  <li className="flex gap-3 items-center"><span className="text-indigo-600">✓</span> 1 Portfolio Hosted</li>
                  <li className="flex gap-3 items-center"><span className="text-indigo-600">✓</span> Track up to 20 Jobs</li>
                  <li className="flex gap-3 items-center opacity-50"><span className="text-slate-400">✕</span> AI Interview Practice</li>
               </ul>

               <button disabled className="w-full py-3 rounded-xl font-bold transition-colors bg-slate-100 text-slate-400 cursor-not-allowed">
                  {!isPro ? "Active" : "Downgrade"}
               </button>
            </div>

            {/* Pro Plan */}
            <div className={`bg-slate-900 text-white p-8 rounded-2xl border-2 transition-all overflow-hidden relative ${isPro ? 'border-indigo-500 shadow-lg shadow-indigo-500/20' : 'border-transparent shadow-xl'}`}>
               {/* Decorative Gradient */}
               <div className="absolute -top-24 -right-24 w-48 h-48 bg-linear-to-bl from-indigo-500 to-purple-500 rounded-full blur-3xl opacity-50"></div>
               
               {isPro && <div className="absolute top-0 right-8 transform -translate-y-1/2 bg-indigo-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Active Subscription</div>}
               
               <h3 className="text-2xl font-bold relative z-10">Pro</h3>
               <div className="my-4 flex items-end gap-1 relative z-10">
                  <span className="text-4xl font-extrabold">$15</span>
                  <span className="text-indigo-200 font-medium mb-1">/ month</span>
               </div>
               <p className="text-indigo-100 text-sm mb-6 relative z-10">Everything you need to land your dream job.</p>
               
               <ul className="space-y-3 text-sm font-medium text-indigo-50 mb-8 relative z-10">
                  <li className="flex gap-3 items-center"><span className="text-indigo-400 text-lg">✦</span> Unlimited AI Resumes</li>
                  <li className="flex gap-3 items-center"><span className="text-indigo-400 text-lg">✦</span> Custom Domains for Portfolios</li>
                  <li className="flex gap-3 items-center"><span className="text-indigo-400 text-lg">✦</span> Unlimited Job Tracking</li>
                  <li className="flex gap-3 items-center"><span className="text-indigo-400 text-lg">✦</span> Mock AI Interviews (Unlimited)</li>
               </ul>

               {isPro ? (
                 <div className="flex gap-2">
                    <button className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold transition-colors relative z-10 text-sm">
                       Manage Billing
                    </button>
                    <button className="py-3 px-4 bg-white/10 hover:bg-white/20 rounded-xl font-bold transition-colors relative z-10 text-sm">
                       Cancel
                    </button>
                 </div>
               ) : (
                 <button 
                  onClick={handleSubscribe} 
                  disabled={isProcessing}
                  className="w-full py-3 bg-indigo-500 hover:bg-indigo-400 rounded-xl font-bold transition-colors relative z-10 shadow-lg"
                 >
                    {isProcessing ? "Processing via Stripe..." : "Upgrade to Pro"}
                 </button>
               )}
            </div>

         </div>
      </div>
    </div>
  );
}
