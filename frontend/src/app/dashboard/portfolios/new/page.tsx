import PortfolioForm from "@/components/portfolio/PortfolioForm";

export default function NewPortfolioPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Design Portfolio</h1>
        <p className="text-slate-500 mt-1">
          Customize your developer portfolio. When ready, we can auto-deploy it to Vercel via GitHub.
        </p>
      </div>
      
      <PortfolioForm />
    </div>
  );
}
