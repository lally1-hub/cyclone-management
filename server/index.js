import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import apiRouter from './routes/api.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// API Routes
app.use('/api', apiRouter);

// Serve static frontend assets in production build mode if needed
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  res.sendFile(path.join(distPath, 'index.html'), (err) => {
    if (err) {
      res.send('CORIOLIS Backend API running on port ' + PORT);
    }
  });
});

app.listen(PORT, () => {
  console.log(`[CORIOLIS Server] Backend API server active on http://localhost:${PORT}`);
  console.log(`[CORIOLIS Server] Health Endpoint: http://localhost:${PORT}/api/health`);
});
