const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

const FEED_IMAGES = [
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80',
  'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80',
  'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&q=80',
  'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80',
  'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&q=80',
  'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80',
];

const MOCK_USERS = [
  { id: '2', name: 'Sofia Reyes', avatar: 'https://i.pravatar.cc/150?img=5' },
  { id: '3', name: 'James Kim', avatar: 'https://i.pravatar.cc/150?img=12' },
  { id: '4', name: 'Mia Chen', avatar: 'https://i.pravatar.cc/150?img=9' },
  { id: '5', name: 'Ryan Patel', avatar: 'https://i.pravatar.cc/150?img=15' },
  { id: '6', name: 'Zara Nguyen', avatar: 'https://i.pravatar.cc/150?img=25' },
];

const posts = new Map();

const initializePosts = () => {
  const captions = [
    'Obsessed with this AI try-on result! ✨ The blazer fits perfectly',
    'Summer vibes with the AI Outfit Generator 🌊',
    'Generated a luxury wedding look with AI 💍 Stunning!',
    'Tried 20 suits in 2 minutes ⚡ Shopping changed forever',
    'The AR live try-on feature is INSANE 🔥',
  ];

  const tags = [
    ['fashion', 'aitryon', 'style'],
    ['summer', 'vibes', 'aioutfit'],
    ['wedding', 'luxury', 'aibridal'],
    ['suits', 'mensfashion', 'efficiency'],
    ['artryon', 'tech', 'fashion'],
  ];

  FEED_IMAGES.forEach((img, i) => {
    const id = (i + 1).toString();
    const user = MOCK_USERS[i % MOCK_USERS.length];
    posts.set(id, {
      id,
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      image: img,
      caption: captions[i % captions.length],
      likes: Math.floor(1000 + Math.random() * 5000),
      comments: Math.floor(50 + Math.random() * 300),
      isLiked: false,
      isSaved: false,
      tags: tags[i % tags.length],
      timestamp: Date.now() - i * 3600000,
      isAI: i % 2 === 0,
    });
  });
};

initializePosts();

router.get('/feed', (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const allPosts = Array.from(posts.values()).sort((a, b) => b.timestamp - a.timestamp);
  const start = (Number(page) - 1) * Number(limit);
  const paginated = allPosts.slice(start, start + Number(limit));

  res.json({
    posts: paginated,
    total: allPosts.length,
    page: Number(page),
    hasMore: start + Number(limit) < allPosts.length,
  });
});

router.get('/posts/:id', (req, res) => {
  const post = posts.get(req.params.id);
  if (!post) return res.status(404).json({ error: 'Post not found' });
  res.json(post);
});

router.post('/posts/:id/like', (req, res) => {
  const post = posts.get(req.params.id);
  if (!post) return res.status(404).json({ error: 'Post not found' });

  post.isLiked = !post.isLiked;
  post.likes = post.isLiked ? post.likes + 1 : post.likes - 1;
  posts.set(req.params.id, post);

  res.json({ isLiked: post.isLiked, likes: post.likes });
});

router.post('/posts/:id/save', (req, res) => {
  const post = posts.get(req.params.id);
  if (!post) return res.status(404).json({ error: 'Post not found' });

  post.isSaved = !post.isSaved;
  posts.set(req.params.id, post);

  res.json({ isSaved: post.isSaved });
});

router.post('/posts', (req, res) => {
  const { imageUri, caption, tags = [] } = req.body;

  if (!imageUri || !caption) {
    return res.status(400).json({ error: 'Image and caption are required' });
  }

  const newPost = {
    id: uuidv4(),
    userId: '1',
    userName: 'Alex Rivera',
    userAvatar: 'https://i.pravatar.cc/150?img=11',
    image: imageUri,
    caption,
    likes: 0,
    comments: 0,
    isLiked: false,
    isSaved: false,
    tags,
    timestamp: Date.now(),
    isAI: true,
  };

  posts.set(newPost.id, newPost);
  res.status(201).json(newPost);
});

router.get('/explore', (req, res) => {
  const { category = 'all', page = 1, limit = 20 } = req.query;
  const allPosts = Array.from(posts.values());
  const sorted = allPosts.sort((a, b) => b.likes - a.likes);

  res.json({
    posts: sorted.slice(0, Number(limit)),
    trending: sorted.slice(0, 5),
    featured: sorted.slice(0, 3),
  });
});

router.get('/creators', (req, res) => {
  res.json({
    creators: MOCK_USERS.map((u, i) => ({
      ...u,
      followers: Math.floor(10000 + Math.random() * 50000),
      following: Math.floor(200 + Math.random() * 800),
      posts: Math.floor(20 + Math.random() * 100),
      specialty: ['Luxury Fashion', 'Streetwear', 'Bridal', 'Menswear', 'Casual'][i],
    })),
  });
});

module.exports = router;
