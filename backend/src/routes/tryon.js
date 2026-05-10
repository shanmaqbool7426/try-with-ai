const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

const RESULT_IMAGES = [
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80',
  'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&q=80',
  'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80',
  'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80',
];

const jobs = new Map();

router.post('/upload', async (req, res) => {
  try {
    const jobId = uuidv4();
    const { style = 'casual', background = 'studio' } = req.body;

    jobs.set(jobId, {
      id: jobId,
      status: 'processing',
      progress: 0,
      style,
      background,
      createdAt: Date.now(),
    });

    setTimeout(() => {
      const result = RESULT_IMAGES[Math.floor(Math.random() * RESULT_IMAGES.length)];
      jobs.set(jobId, {
        id: jobId,
        status: 'complete',
        progress: 100,
        resultImage: result,
        fitScore: Math.floor(92 + Math.random() * 8),
        styleScore: Math.floor(88 + Math.random() * 12),
        qualityScore: Math.floor(90 + Math.random() * 10),
        processingTime: 4.2 + Math.random() * 2,
        metadata: {
          style,
          background,
          resolution: '2048x2048',
          model: 'IDM-VTON-v2',
        },
      });
    }, 4000);

    res.json({
      success: true,
      jobId,
      message: 'AI try-on processing started',
      estimatedTime: '4-6 seconds',
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to start try-on processing' });
  }
});

router.get('/result/:jobId', (req, res) => {
  const job = jobs.get(req.params.jobId);
  if (!job) {
    return res.status(404).json({ error: 'Job not found' });
  }
  res.json(job);
});

router.get('/history', (req, res) => {
  const history = Array.from(jobs.values())
    .filter((j) => j.status === 'complete')
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 20);

  res.json({ history, total: history.length });
});

router.post('/generate-background', (req, res) => {
  const { style = 'studio' } = req.body;

  const backgrounds = {
    studio: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    mall: 'https://images.unsplash.com/photo-1555529771-835f59fc5efe?w=800&q=80',
    beach: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
    street: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&q=80',
    wedding: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80',
    rooftop: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&q=80',
  };

  res.json({
    success: true,
    backgroundImage: backgrounds[style] || backgrounds.studio,
    style,
  });
});

router.get('/catalog', (req, res) => {
  const { category = 'all', page = 1, limit = 20 } = req.query;

  const catalog = [
    { id: '1', name: 'Black Blazer', category: 'formal', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80', price: 129, brand: 'StyleAI' },
    { id: '2', name: 'White Linen Dress', category: 'casual', image: 'https://images.unsplash.com/photo-1495385794356-15371f348c31?w=300&q=80', price: 89, brand: 'Elegance' },
    { id: '3', name: 'Luxury Evening Gown', category: 'luxury', image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=300&q=80', price: 349, brand: 'Luxe' },
    { id: '4', name: 'Navy Suit', category: 'formal', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&q=80', price: 249, brand: 'StyleAI' },
    { id: '5', name: 'Floral Sundress', category: 'casual', image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=300&q=80', price: 75, brand: 'Spring' },
    { id: '6', name: 'Leather Jacket', category: 'street', image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&q=80', price: 199, brand: 'Edge' },
  ];

  const filtered = category === 'all' ? catalog : catalog.filter((c) => c.category === category);

  res.json({ catalog: filtered, total: filtered.length, page: Number(page), limit: Number(limit) });
});

module.exports = router;
