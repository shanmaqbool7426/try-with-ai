const express = require('express');
const router = express.Router();

const FASHION_RESPONSES = [
  "Based on current trends and your style profile, I'd recommend focusing on clean silhouettes with bold accessories. The key is balancing proportion — if you go bold on top, keep the bottom minimal. Consider investing in quality basics that you can mix and match.",
  "For this look, think about color theory. Complementary colors create visual interest, while analogous palettes feel more harmonious. Your best bet would be to anchor the outfit with a neutral base and add pops of your signature color.",
  "This season, the 'quiet luxury' aesthetic is dominating — think cashmere, clean lines, muted palettes with exquisite tailoring. I'd suggest a structured blazer in camel or cream as your investment piece.",
  "Your body type would look amazing in wrap silhouettes that cinch at the waist, emphasizing your proportions beautifully. High-waisted pieces with cropped tops create the illusion of longer legs.",
  "For your event, I'd go with something between cocktail and black-tie. A sophisticated midi dress in a jewel tone would be perfect — it photographs beautifully and reads as effortlessly chic without being overdressed.",
];

const OUTFIT_SUGGESTIONS = [
  {
    name: 'Quiet Luxury Look',
    items: ['Cashmere crew neck', 'Tailored trousers', 'Loafers', 'Minimal gold jewelry'],
    colors: ['Cream', 'Camel', 'Navy'],
    occasions: ['Work', 'Business casual', 'Lunch'],
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&q=80',
  },
  {
    name: 'Effortless Chic',
    items: ['Silk slip dress', 'Leather mule heels', 'Structured mini bag', 'Dainty necklace'],
    colors: ['Ivory', 'Blush', 'Cognac'],
    occasions: ['Date night', 'Dinner', 'Gallery opening'],
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&q=80',
  },
  {
    name: 'Power Suit Energy',
    items: ['Oversized blazer', 'Matching wide-leg trousers', 'White tee', 'Chunky sneakers'],
    colors: ['Charcoal', 'Black', 'White'],
    occasions: ['Office', 'Creative workspace', 'Meetings'],
    image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&q=80',
  },
];

router.post('/chat', (req, res) => {
  const { message, context } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  const response = FASHION_RESPONSES[Math.floor(Math.random() * FASHION_RESPONSES.length)];

  const suggestions = [
    'Show me similar styles',
    'What colors work for my skin tone?',
    'Generate this outfit',
    'Style for different occasions',
  ];

  res.json({
    response,
    suggestions: suggestions.slice(0, 3),
    outfits: Math.random() > 0.5 ? [OUTFIT_SUGGESTIONS[Math.floor(Math.random() * OUTFIT_SUGGESTIONS.length)]] : null,
    timestamp: new Date().toISOString(),
  });
});

router.post('/suggestions', (req, res) => {
  const { bodyType = 'hourglass', preferences = [], occasion = 'casual' } = req.body;

  res.json({
    suggestions: OUTFIT_SUGGESTIONS,
    bodyTypeAdvice: `For ${bodyType} body type: Emphasize your natural proportions with tailored pieces that highlight your best features.`,
    colorPalette: ['#C5A880', '#7B9E87', '#B5789F', '#7098B8'],
    trendingNow: ['Quiet Luxury', 'Mob Wife Aesthetic', 'Coastal Grandma'],
  });
});

router.get('/trends', (req, res) => {
  const trends = [
    { name: 'Quiet Luxury', score: 98, description: 'Understated elegance with premium fabrics', hashtags: ['#QuietLuxury', '#OldMoney'] },
    { name: 'Mob Wife Aesthetic', score: 94, description: 'Bold, opulent, unapologetically glamorous', hashtags: ['#MobWife', '#MaximalistFashion'] },
    { name: 'Coastal Grandma', score: 89, description: 'Relaxed sophistication with natural textures', hashtags: ['#CoastalGrandma', '#SummerVibes'] },
    { name: 'Dark Academia', score: 85, description: 'Intellectual chic with moody palettes', hashtags: ['#DarkAcademia', '#BookishFashion'] },
    { name: 'Y2K Revival', score: 82, description: 'Early 2000s nostalgia meets modern sensibility', hashtags: ['#Y2K', '#2000sFashion'] },
  ];

  res.json({ trends, lastUpdated: new Date().toISOString() });
});

router.post('/color-analysis', (req, res) => {
  const { skinTone = 'medium', undertone = 'warm', preferences = [] } = req.body;

  const palettes = {
    warm: { best: ['Terracotta', 'Olive', 'Warm Beige', 'Rust', 'Gold'], avoid: ['Cool Greys', 'Icy Blues'] },
    cool: { best: ['Lavender', 'Navy', 'Emerald', 'Rose', 'Silver'], avoid: ['Warm Yellows', 'Oranges'] },
    neutral: { best: ['Most colors work!', 'Earth tones', 'Deep jewel tones', 'Pastels'], avoid: [] },
  };

  res.json({
    undertone,
    skinTone,
    recommendedPalette: palettes[undertone] || palettes.neutral,
    signatureColor: undertone === 'warm' ? '#C47A3A' : undertone === 'cool' ? '#7B9EC8' : '#8B7BA8',
    seasonalType: undertone === 'warm' ? 'Autumn/Spring' : 'Winter/Summer',
  });
});

module.exports = router;
