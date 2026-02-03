import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import boxen from 'boxen';
import chalk from 'chalk';
import { checkIPFSConnection } from './services/ipfs.js';
import mediaRouter from './routes/media.js';
import collectionsRouter from './routes/collections.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Middleware
app.use(cors({
  origin: FRONTEND_URL,
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: [
    'Content-Type',
    'X-Media-Title',
    'X-Media-Description',
    'X-Media-Tags',
    'X-Media-Source',
    'X-Media-Lost-Date',
    'X-Media-Found-Date',
  ],
}));

// For JSON endpoints
app.use(express.json());

// Trust proxy for correct IP detection
app.set('trust proxy', true);

// Routes
app.use('/api/media', mediaRouter);
app.use('/api/collections', collectionsRouter);

// Health check
app.get('/api/health', async (_req, res) => {
  const ipfsConnected = await checkIPFSConnection();
  res.json({
    status: 'ok',
    ipfs: ipfsConnected ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
  });
});

// Error handling middleware
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// Start server
async function start() {
  // Check IPFS connection
  const ipfsConnected = await checkIPFSConnection();
  if (!ipfsConnected) {
    console.warn('⚠️  Warning: IPFS daemon is not running. Upload/streaming features will not work.');
    console.warn('   Start IPFS with: ipfs daemon');
  } else {
    console.log('✅ IPFS daemon connected');
  }

  app.listen(PORT, () => {
    const title = chalk.bold.magenta('🎬 Lost Media Archive Backend');
    const serverLine = `${chalk.cyan('Server running on:')} ${chalk.white(`http://localhost:${PORT}`)}`;
    const frontendLine = `${chalk.cyan('Frontend URL:')} ${chalk.white(FRONTEND_URL)}`;
    const ipfsLine = `${chalk.cyan('IPFS Status:')} ${ipfsConnected ? chalk.green('🟢 Connected') : chalk.red('🔴 Disconnected')}`;

    const content = [title, '', serverLine, frontendLine, ipfsLine].join('\n');

    console.log(
      boxen(content, {
        padding: 1,
        margin: 1,
        borderStyle: 'round',
        borderColor: 'magenta',
      })
    );
  });
}

start().catch(console.error);
