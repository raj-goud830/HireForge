import mongoose from 'mongoose';

const ExperienceSchema = new mongoose.Schema({
  company: String,
  role: String,
  startDate: String,
  endDate: String,
  description: String,
});

const EducationSchema = new mongoose.Schema({
  institution: String,
  degree: String,
  fieldOfStudy: String,
  graduationDate: String,
});

const ResumeSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // Maps to Clerk User ID
  title: { type: String, required: true }, // e.g., "Software Engineer Resume 1"
  summary: { type: String },
  contact: {
    email: String,
    phone: String,
    linkedin: String,
    github: String,
  },
  experience: [ExperienceSchema],
  education: [EducationSchema],
  skills: [{ type: String }],
  projects: [{
    name: String,
    description: String,
    technologies: [String],
    link: String,
  }],
  targetRole: String, // "DevOps" / "Cloud" / "Web" / "Data"
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model('Resume', ResumeSchema);
