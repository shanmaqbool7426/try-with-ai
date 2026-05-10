# Try Clothes On Me

An AI-powered virtual fashion try-on app built with React Native (Expo Web) and Node.js.

## Architecture

- **Frontend**: Expo React Native (web mode) running on port 5000
- **Backend**: Node.js/Express API running on port 3001

## Project Structure

```
frontend/      - Expo React Native app (runs as web on port 5000)
  app/         - Expo Router screens
    (tabs)/    - Main tab navigation
    screens/   - Modal screens
  components/  - Reusable UI components
  constants/   - Colors, styles
  store/       - Zustand state management
  services/    - API service layer
backend/       - Node.js Express API (port 3001)
  src/
    routes/    - API route handlers
    middleware/ - Auth, validation
```

## Features

- AI Virtual Try-On (upload photo + clothing → AI fits it)
- Live AR Try-On with body tracking
- AI Fashion Stylist chatbot
- AI Outfit Generator
- AI Background Generator
- Social feed (posts, likes, comments)
- Premium subscription features

## Running

- Frontend: `cd frontend && npm start` (port 5000)
- Backend: `cd backend && npm start` (port 3001)

## User Preferences

- Luxury dark UI with glassmorphism
- Mobile-first design
- TypeScript for frontend
