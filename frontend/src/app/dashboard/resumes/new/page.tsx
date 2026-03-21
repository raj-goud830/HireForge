import ResumeForm from "@/components/resume/ResumeForm";

export default function NewResumePage() {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Create New Resume</h1>
        <p className="text-slate-500 mt-1">
          Fill in the details below. Our AI will help you optimize your content for ATS systems.
        </p>
      </div>
      
      <ResumeForm />
    </div>
  );
}
