import express from 'express';
import { requireAuth } from '@clerk/express';
import Job from '../models/Job';

const router = express.Router();

// Get all jobs for the authenticated user
router.get('/', requireAuth(), async (req: any, res: any) => {
  try {
    const jobs = await Job.find({ userId: req.auth.userId }).sort({ dateApplied: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});

// Create a new job tracker entry
router.post('/', requireAuth(), async (req: any, res: any) => {
  try {
    const newJob = new Job({ ...req.body, userId: req.auth.userId });
    await newJob.save();
    res.status(201).json(newJob);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create job entry' });
  }
});

// Update a job's status or details
router.put('/:id', requireAuth(), async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const updatedJob = await Job.findOneAndUpdate(
      { _id: id, userId: req.auth.userId },
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );
    if (!updatedJob) return res.status(404).json({ error: 'Job not found' });
    res.json(updatedJob);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update job' });
  }
});

// Delete a job
router.delete('/:id', requireAuth(), async (req: any, res: any) => {
  try {
    const { id } = req.params;
    await Job.findOneAndDelete({ _id: id, userId: req.auth.userId });
    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete job' });
  }
});

export default router;
