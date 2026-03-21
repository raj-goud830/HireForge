import express from 'express';
import { requireAuth } from '@clerk/express';
import OpenAI from 'openai';

const router = express.Router();

router.post('/enhance', requireAuth(), async (req: express.Request, res: express.Response) => {
  try {
    const { text, type } = req.body; // type can be 'summary', 'experience', etc.

    if (!process.env.OPENAI_API_KEY) {
      // Mock fallback if user hasn't provided an API key yet
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate delay
      return res.json({
        enhancedText: `[MOCK AI ENHANCED]: Optimised for ATS. ${text}`,
      });
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    let prompt = '';
    if (type === 'summary') {
      prompt = `Act as an expert career coach and resume writer. Enhance the following professional summary to be concise, impactful, and ATS-friendly. Use strong action verbs and industry keywords. Return ONLY the enhanced text without quotes or explanations.\n\nOriginal text: ${text}`;
    } else if (type === 'experience') {
       prompt = `Act as an expert career coach and resume writer. Enhance the following work experience description to be achievement-oriented, quantifiable (where possible), and ATS-friendly. Use bullet points and strong action verbs. Return ONLY the enhanced text without quotes or explanations.\n\nOriginal text: ${text}`;
    } else {
       prompt = `Enhance the following text for a professional resume:\n\n${text}`;
    }

    const completion = await openai.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'gpt-3.5-turbo',
      temperature: 0.7,
    });

    res.json({ enhancedText: completion.choices[0].message.content });
  } catch (error) {
    console.error('Error in AI enhancement:', error);
    res.status(500).json({ error: 'Failed to enhance text using AI' });
  }
});

// Mock Interview Endpoint
router.post('/interview', requireAuth(), async (req: express.Request, res: express.Response) => {
  try {
    const { role, messageHistory } = req.body;
    
    if (!process.env.OPENAI_API_KEY) {
       // Mock fallback
       await new Promise((resolve) => setTimeout(resolve, 1500));
       return res.json({
         reply: `[MOCK AI]: That's a great answer for a ${role} position. Can you also tell me about a time you faced a difficult challenge and how you overcame it?`
       });
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    
    // Convert client history to OpenAI history format
    const messages = messageHistory.map((m: any) => ({
      role: m.sender === 'user' ? 'user' : 'assistant',
      content: m.text
    }));

    // Inject system prompt unconditionally
    messages.unshift({
       role: 'system',
       content: `You are an expert technical interviewer conducting a mock interview for a ${role} position. Ask one question at a time. Evaluate their answers briefly, then ask the next technical or behavioral question.`
    });

    const completion = await openai.chat.completions.create({
      messages: messages,
      model: 'gpt-3.5-turbo',
      temperature: 0.7,
      max_tokens: 150
    });

    res.json({ reply: completion.choices[0].message.content });
  } catch (error) {
    console.error('Error in AI interview:', error);
    res.status(500).json({ error: 'Failed to generate interview response' });
  }
});

export default router;
