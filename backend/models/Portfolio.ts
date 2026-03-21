import mongoose from 'mongoose';

const PortfolioSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true }, // E.g., "Main Developer Portfolio"
  theme: { type: String, default: 'minimal' }, // 'minimal', 'dark', 'creative'
  primaryColor: { type: String, default: '#2563eb' },
  customDomain: { type: String }, // For future domains
  githubRepoUrl: { type: String }, // Link to the exported Vercel repo
  isDeployed: { type: Boolean, default: false },
  
  // Data to embed in the portfolio
  hero: {
    heading: String,
    subheading: String,
    imageUrl: String,
  },
  resumeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Resume' }, // Extracting data from resume if needed
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model('Portfolio', PortfolioSchema);
