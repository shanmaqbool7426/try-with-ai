const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { createServer } = require('http');
const { Server } = require('socket.io');
const path = require('path');
require('dotenv').config();

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(morgan('dev'));

const tryonRoutes = require('./routes/tryon');
const stylistRoutes = require('./routes/stylist');
const outfitRoutes = require('./routes/outfit');
const socialRoutes = require('./routes/social');
const authRoutes = require('./routes/auth');

app.use('/api/tryon', tryonRoutes);
app.use('/api/stylist', stylistRoutes);
app.use('/api/outfit', outfitRoutes);
app.use('/api/social', socialRoutes);
app.use('/api/auth', authRoutes);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Try Clothes On Me API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    features: ['virtual-tryon', 'ai-stylist', 'outfit-generator', 'social-feed', 'ar-tryon'],
  });
});

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('tryon:start', (data) => {
    const steps = [
      { step: 'analyzing', message: 'Analyzing body shape...', progress: 15 },
      { step: 'detecting', message: 'Detecting pose...', progress: 30 },
      { step: 'fitting', message: 'AI fitting clothes...', progress: 55 },
      { step: 'rendering', message: 'Rendering fabric...', progress: 75 },
      { step: 'enhancing', message: 'Enhancing output...', progress: 90 },
      { step: 'complete', message: 'Complete!', progress: 100 },
    ];

    let i = 0;
    const interval = setInterval(() => {
      if (i < steps.length) {
        socket.emit('tryon:progress', steps[i]);
        i++;
      } else {
        clearInterval(interval);
        socket.emit('tryon:result', {
          resultImage: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80',
          quality: 98,
          fitScore: 97,
        });
      }
    }, 600);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    status: err.status || 500,
  });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, 'localhost', () => {
  console.log(`🚀 Try Clothes On Me API running on http://localhost:${PORT}`);
  console.log(`📡 Socket.io ready for real-time connections`);
  console.log(`🤖 AI endpoints active`);
});

module.exports = { app, io };
