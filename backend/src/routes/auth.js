const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const JWT_SECRET = process.env.JWT_SECRET || 'tryclothes-secret-key-2024';
const users = new Map();

users.set('demo@example.com', {
  id: '1',
  name: 'Alex Rivera',
  email: 'demo@example.com',
  password: bcrypt.hashSync('demo123', 10),
  avatar: 'https://i.pravatar.cc/150?img=11',
  isPremium: false,
  tryOnsRemaining: 5,
  followers: 1243,
  following: 389,
  posts: 47,
  createdAt: new Date().toISOString(),
});

router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email and password are required' });
    }

    if (users.has(email)) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: uuidv4(),
      name,
      email,
      password: hashedPassword,
      avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
      isPremium: false,
      tryOnsRemaining: 5,
      followers: 0,
      following: 0,
      posts: 0,
      createdAt: new Date().toISOString(),
    };

    users.set(email, newUser);

    const token = jwt.sign({ userId: newUser.id, email }, JWT_SECRET, { expiresIn: '30d' });

    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json({ user: userWithoutPassword, token });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = users.get(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id, email }, JWT_SECRET, { expiresIn: '30d' });

    const { password: _, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword, token });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
});

router.get('/me', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = Array.from(users.values()).find((u) => u.id === decoded.userId);

    if (!user) return res.status(404).json({ error: 'User not found' });

    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

router.post('/demo', (req, res) => {
  const demoUser = users.get('demo@example.com');
  const token = jwt.sign({ userId: demoUser.id, email: demoUser.email }, JWT_SECRET, { expiresIn: '24h' });

  const { password: _, ...userWithoutPassword } = demoUser;
  res.json({ user: userWithoutPassword, token, isDemo: true });
});

module.exports = router;
