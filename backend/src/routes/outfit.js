const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

const GENERATED_LOOKS = [
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80',
  'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&q=80',
  'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80',
  'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80',
  'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&q=80',
];

router.post('/generate', async (req, res) => {
  const { prompt, style = 'casual', occasion, gender = 'unisex' } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  await new Promise((r) => setTimeout(r, 1500));

  const resultImage = GENERATED_LOOKS[Math.floor(Math.random() * GENERATED_LOOKS.length)];

  const accessories = [
    'Minimalist gold watch',
    'Leather crossbody bag',
    'Silk scarf',
    'Statement earrings',
    'Classic belt',
  ].sort(() => Math.random() - 0.5).slice(0, 3);

  res.json({
    success: true,
    id: uuidv4(),
    prompt,
    style,
    generatedImage: resultImage,
    outfitDetails: {
      mainPiece: prompt.split(' ').slice(-2).join(' '),
      accessories,
      estimatedCost: `$${150 + Math.floor(Math.random() * 500)}`,
      occasionFit: ['Casual', 'Semi-formal', 'Formal'][Math.floor(Math.random() * 3)],
      styleScore: Math.floor(88 + Math.random() * 12),
    },
    similarItems: [
      { name: 'Classic Version', image: GENERATED_LOOKS[0], price: '$149' },
      { name: 'Premium Version', image: GENERATED_LOOKS[1], price: '$299' },
    ],
    processingTime: 1.2 + Math.random() * 0.8,
  });
});

router.post('/background', async (req, res) => {
  const { style = 'studio', mood = 'professional' } = req.body;

  const backgrounds = {
    studio: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    mall: 'https://images.unsplash.com/photo-1555529771-835f59fc5efe?w=800&q=80',
    beach: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
    street: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&q=80',
    wedding: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80',
    rooftop: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&q=80',
  };

  await new Promise((r) => setTimeout(r, 800));

  res.json({
    success: true,
    style,
    backgroundImage: backgrounds[style] || backgrounds.studio,
    prompt: `${mood} ${style} background for fashion photography`,
    resolution: '2048x2048',
  });
});

router.post('/enhance', async (req, res) => {
  const { imageUrl, enhancements = ['hd', 'lighting', 'skin'] } = req.body;

  await new Promise((r) => setTimeout(r, 2000));

  res.json({
    success: true,
    originalImage: imageUrl,
    enhancedImage: GENERATED_LOOKS[Math.floor(Math.random() * GENERATED_LOOKS.length)],
    appliedEnhancements: enhancements,
    qualityScore: Math.floor(92 + Math.random() * 8),
    resolution: '4096x4096',
  });
});

router.get('/trending', (req, res) => {
  const trending = [
    { id: '1', name: 'Luxury Black Wedding Suit', category: 'formal', image: GENERATED_LOOKS[0], saves: 4821 },
    { id: '2', name: 'Boho Summer Festival', category: 'casual', image: GENERATED_LOOKS[1], saves: 3240 },
    { id: '3', name: 'Corporate Power Look', category: 'business', image: GENERATED_LOOKS[2], saves: 2890 },
    { id: '4', name: 'Streetwear Hypebeast', category: 'street', image: GENERATED_LOOKS[3], saves: 5120 },
  ];

  res.json({ trending, lastUpdated: new Date().toISOString() });
});

module.exports = router;
