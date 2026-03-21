import express from 'express';
import { requireAuth } from '@clerk/express';
import Resume from '../models/Resume';

const router = express.Router();

// Get all resumes for the authenticated user
router.get('/', requireAuth(), async (req: any, res: any) => {
  try {
    const resumes = await Resume.find({ userId: req.auth.userId });
    res.json(resumes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch resumes' });
  }
});

// Create a new resume
router.post('/', requireAuth(), async (req: any, res: any) => {
  try {
    const newResume = new Resume({ ...req.body, userId: req.auth.userId });
    await newResume.save();
    res.status(201).json(newResume);
  } catch (error: any) {
    console.error("Resume Save Error:", error);
    res.status(500).json({ error: 'Failed to create resume', details: error.message });
  }
});

router.post('/test', async (req: any, res: any) => {
  try {
    const newResume = new Resume({ ...req.body, userId: 'test_user_123' });
    await newResume.save();
    res.status(201).json(newResume);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to create resume', details: error.message });
  }
});

// Delete a resume
router.delete('/:id', requireAuth(), async (req: any, res: any) => {
  try {
    const { id } = req.params;
    await Resume.findOneAndDelete({ _id: id, userId: req.auth.userId });
    res.json({ message: 'Resume deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete resume' });
  }
});

export default router;
