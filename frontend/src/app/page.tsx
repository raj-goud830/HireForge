import { SignInButton, UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";

export default async function Home() {
  const { userId } = await auth();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center font-(family-name:--font-geist-sans)">
      <main className="flex flex-col gap-8 items-center sm:items-start bg-white p-12 rounded-2xl shadow-xl max-w-2xl text-center sm:text-left border border-slate-100">
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900">
          Career<span className="text-blue-600">SaaS</span>
        </h1>
        <p className="text-lg text-slate-600 font-medium">
          Build ATS-friendly resumes, create stunning portfolios, and track your job applications with AI.
        </p>

        <div className="flex gap-4 items-center flex-col sm:flex-row mt-4 w-full justify-center sm:justify-start">
          {!userId ? (
            <SignInButton mode="modal">
              <button className="rounded-full border border-transparent transition-all duration-300 flex items-center justify-center bg-blue-600 text-white gap-2 hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5 text-base sm:text-lg h-12 sm:h-14 px-8 font-semibold w-full sm:w-auto">
                Get Started for Free
              </button>
            </SignInButton>
          ) : (
            <>
              <Link
                href="/dashboard"
                className="rounded-full border border-transparent transition-all duration-300 flex items-center justify-center bg-slate-900 text-white gap-2 hover:bg-slate-800 hover:shadow-lg hover:-translate-y-0.5 text-base sm:text-lg h-12 sm:h-14 px-8 font-semibold w-full sm:w-auto"
              >
                Go to Dashboard
              </Link>
              <div className="ml-0 sm:ml-4 flex items-center justify-center p-2 rounded-full border border-slate-200 hover:bg-slate-50 transition-colors">
                <UserButton appearance={{ elements: { userButtonAvatarBox: "w-10 h-10" } }} />
              </div>
            </>
          )}
        </div>
      </main>

      <footer className="mt-16 flex gap-6 flex-wrap items-center justify-center text-sm text-slate-500 font-medium">
        <p>© 2026 CareerSaaS. MVP Build.</p>
      </footer>
    </div>
  );
}
