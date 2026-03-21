import mongoose from 'mongoose';

const JobSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  company: { type: String, required: true },
  position: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['Saved', 'Applied', 'Interviewing', 'Offered', 'Rejected'],
    default: 'Applied' 
  },
  dateApplied: { type: Date, default: Date.now },
  salary: { type: String },
  location: { type: String },
  jobUrl: { type: String },
  notes: { type: String },
  
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model('Job', JobSchema);
