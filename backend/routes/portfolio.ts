import express from 'express';
import { requireAuth } from '@clerk/express';
import Portfolio from '../models/Portfolio';

const router = express.Router();

router.get('/', requireAuth(), async (req: any, res: any) => {
  try {
    const portfolios = await Portfolio.find({ userId: req.auth.userId });
    res.json(portfolios);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch portfolios' });
  }
});

router.post('/', requireAuth(), async (req: any, res: any) => {
  try {
    const newPortfolio = new Portfolio({ ...req.body, userId: req.auth.userId });
    await newPortfolio.save();
    res.status(201).json(newPortfolio);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create portfolio' });
  }
});

router.delete('/:id', requireAuth(), async (req: any, res: any) => {
    try {
      const { id } = req.params;
      await Portfolio.findOneAndDelete({ _id: id, userId: req.auth.userId });
      res.json({ message: 'Portfolio deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete portfolio' });
    }
});

// Mock deploy endpoint
router.post('/:id/deploy', requireAuth(), async (req: any, res: any) => {
    try {
      const { id } = req.params;
      const portfolio = await Portfolio.findOne({ _id: id, userId: req.auth.userId });
      
      if (!portfolio) {
        return res.status(404).json({ error: 'Portfolio not found' });
      }

      // Simulate deployment delay
      await new Promise((resolve) => setTimeout(resolve, 3000));
      
      portfolio.isDeployed = true;
      portfolio.githubRepoUrl = `https://github.com/mock-user/portfolio-${id}`;
      portfolio.customDomain = `https://portfolio-${id}.vercel.app`;
      await portfolio.save();

      res.json({ message: 'Deployment successful', portfolio });
    } catch (error) {
      res.status(500).json({ error: 'Failed to deploy portfolio' });
    }
});

// Download HTML Template Endpoint
router.get('/:id/download', requireAuth(), async (req: any, res: any) => {
    try {
      const { id } = req.params;
      const portfolio = await Portfolio.findOne({ _id: id, userId: req.auth.userId });
      
      if (!portfolio) {
        return res.status(404).json({ error: 'Portfolio not found' });
      }

      const isDark = portfolio.theme === 'dark';
      const isCreative = portfolio.theme === 'creative';
      
      const bgColor = isDark ? '#0f172a' : isCreative ? portfolio.primaryColor : '#f8fafc';
      const textColor = (isDark || isCreative) ? '#ffffff' : '#0f172a';

      const htmlTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${portfolio.title || 'My Portfolio'}</title>
    <style>
        :root {
            --primary: ${portfolio.primaryColor || '#4f46e5'};
            --bg: ${bgColor};
            --text: ${textColor};
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; 
            background: var(--bg);
            color: var(--text);
            line-height: 1.6;
            -webkit-font-smoothing: antialiased;
        }
        .hero {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            padding: 2rem;
            background: linear-gradient(135deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0) 100%);
        }
        h1 { 
            font-size: clamp(3rem, 10vw, 5rem); 
            font-weight: 800;
            letter-spacing: -0.05em;
            margin-bottom: 1.5rem; 
        }
        .subheading { 
            font-size: clamp(1.25rem, 4vw, 1.75rem); 
            opacity: 0.9; 
            max-width: 800px;
            margin: 0 auto;
        }
        .container {
            max-width: 1000px;
            margin: 0 auto;
            padding: 5rem 2rem;
        }
        h2 { font-size: 2.5rem; margin-bottom: 2rem; position: relative; padding-bottom: 0.5rem; }
        h2::after { content: ''; position: absolute; bottom: 0; left: 0; width: 60px; height: 4px; background: var(--primary); }
        .about-text { font-size: 1.125rem; opacity: 0.8; max-width: 700px; margin-bottom: 3rem; white-space: pre-wrap; }
        
        .projects-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 2rem;
        }
        .project-card {
            background: rgba(255,255,255,0.05);
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 12px;
            padding: 2rem;
            transition: transform 0.2s;
        }
        .project-card:hover { transform: translateY(-5px); border-color: var(--primary); }
        .project-title { font-size: 1.5rem; font-weight: bold; margin-bottom: 1rem; }
        .project-desc { opacity: 0.8; margin-bottom: 1.5rem; }
        .project-link { color: var(--primary); text-decoration: none; font-weight: bold; }
        
        /* Contact Button overrides */
        .btn {
            display: inline-block;
            background: var(--primary);
            color: white;
            padding: 1rem 2.5rem;
            border-radius: 99px;
            text-decoration: none;
            font-weight: 600;
            margin-top: 3rem;
            transition: opacity 0.2s;
        }
        .btn:hover { opacity: 0.9; }
    </style>
</head>
<body>
    <header class="hero">
        <div>
            <h1>${portfolio.hero?.heading || 'Hello World'}</h1>
            <p class="subheading">${portfolio.hero?.subheading || 'Welcome to my developer portfolio.'}</p>
        </div>
    </header>

    <main class="container">
        <section>
            <h2>About Me</h2>
            <div class="about-text">${(portfolio as any).about || 'A passionate developer building amazing things.'}</div>
        </section>

        <section style="margin-top: 5rem;">
            <h2>Projects</h2>
            <div class="projects-grid">
                ${(portfolio as any).projects?.map((p: any) => `
                <div class="project-card">
                    <div class="project-title">${p.title}</div>
                    <div class="project-desc">${p.description}</div>
                    <a href="${p.link}" class="project-link" target="_blank">View Project &rarr;</a>
                </div>
                `).join('') || `
                <div class="project-card">
                    <div class="project-title">Sample Project</div>
                    <div class="project-desc">A demonstration of my skills and capabilities using modern web technologies.</div>
                    <a href="#" class="project-link">View Project &rarr;</a>
                </div>`}
            </div>
        </section>

        <div style="text-align: center; margin-top: 6rem; padding-top: 4rem; border-top: 1px solid rgba(150,150,150,0.2);">
            <h2 style="text-align: center; margin-bottom: 1.5rem;">Let's Work Together</h2>
            <p style="opacity: 0.8; font-size: 1.25rem;">I'm currently available for new opportunities.</p>
            <a href="mailto:hello@example.com" class="btn">Get In Touch</a>
        </div>
    </main>
</body>
</html>`;

      res.setHeader('Content-Type', 'text/html');
      res.setHeader('Content-Disposition', `attachment; filename="${portfolio.title.replace(/\s+/g, '-').toLowerCase()}-template.html"`);
      res.send(htmlTemplate);
    } catch (error) {
      console.error('Template Download Error:', error);
      res.status(500).json({ error: 'Failed to generate template' });
    }
});

export default router;
