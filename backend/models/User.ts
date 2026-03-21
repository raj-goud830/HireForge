import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  clerkUserId: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  firstName: { type: String },
  lastName: { type: String },
  rolesOfInterest: [{ type: String }],
  stripeCustomerId: { type: String },
  subscriptionTier: { type: String, default: 'free' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('User', UserSchema);
