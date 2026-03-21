import { auth } from "@clerk/nextjs/server";
import Link from "next/link";

export default async function DashboardOverview() {
  const { userId } = await auth();

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Welcome back!</h1>
        <p className="text-slate-500 mt-1">
          Here is an overview of your career progress.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center text-2xl">
              📄
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Resumes</p>
              <h3 className="text-2xl font-bold text-slate-900">0</h3>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center text-2xl">
              🎯
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Applications</p>
              <h3 className="text-2xl font-bold text-slate-900">0</h3>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-100 text-green-600 flex items-center justify-center text-2xl">
              🤖
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Interviews</p>
              <h3 className="text-2xl font-bold text-slate-900">0</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/dashboard/resumes/new"
            className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-sm transition-all group"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">✨</span>
              <div>
                <h4 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                  Create AI Resume
                </h4>
                <p className="text-sm text-slate-500">Build an ATS-friendly resume</p>
              </div>
            </div>
            <span className="text-slate-400 group-hover:text-blue-600 transition-colors">→</span>
          </Link>

          <Link
            href="/dashboard/interviews/practice"
            className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200 hover:border-indigo-400 hover:shadow-sm transition-all group"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">🎙️</span>
              <div>
                <h4 className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  Practice Interview
                </h4>
                <p className="text-sm text-slate-500">Mock technical & behavioral</p>
              </div>
            </div>
            <span className="text-slate-400 group-hover:text-indigo-600 transition-colors">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
