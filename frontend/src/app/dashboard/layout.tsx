import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-slate-50 font-(family-name:--font-geist-sans)">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-slate-200">
          <Link href="/dashboard" className="text-xl font-bold tracking-tight text-slate-900">
            Career<span className="text-blue-600">SaaS</span>
          </Link>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-700 bg-slate-100 font-medium transition-colors"
          >
            <span className="text-xl">📊</span> Overview
          </Link>
          <Link
            href="/dashboard/resumes"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium transition-colors"
          >
            <span className="text-xl">📄</span> Resumes
          </Link>
          <Link
            href="/dashboard/portfolios"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium transition-colors"
          >
            <span className="text-xl">💼</span> Portfolios
          </Link>
          <Link
            href="/dashboard/jobs"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium transition-colors"
          >
            <span className="text-xl">🎯</span> Job Tracker
          </Link>
          <Link
            href="/dashboard/finder"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium transition-colors"
          >
            <span className="text-xl">🔭</span> Job Finder
          </Link>
          <Link
            href="/dashboard/interviews"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium transition-colors"
          >
            <span className="text-xl">🤖</span> AI Interviews
          </Link>
        </nav>
        <div className="p-4 border-t border-slate-200">
          <div className="bg-linear-to-tr from-blue-600 to-indigo-600 rounded-xl p-4 text-white shadow-md">
            <h4 className="font-semibold text-sm">Upgrade to Pro</h4>
            <p className="text-xs text-blue-100 mt-1 mb-3">
              Unlock unlimited AI credits and premium templates.
            </p>
            <button className="w-full bg-white text-blue-600 text-sm font-semibold py-2 rounded-lg hover:bg-slate-50 transition-colors">
              View Plans
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-end px-8 shadow-sm z-10">
          <UserButton
            appearance={{
              elements: {
                userButtonAvatarBox: "w-9 h-9",
              },
            }}
          />
        </header>
        
        {/* Page Content */}
        <div className="flex-1 overflow-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
