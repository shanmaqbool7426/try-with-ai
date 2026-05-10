import { create } from 'zustand';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  isPremium: boolean;
  tryOnsRemaining: number;
  followers: number;
  following: number;
  posts: number;
}

export interface TryOnResult {
  id: string;
  originalPhoto: string;
  clothingImage: string;
  resultImage: string;
  timestamp: number;
  clothingName: string;
  liked: boolean;
}

export interface OutfitPost {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  image: string;
  caption: string;
  likes: number;
  comments: number;
  isLiked: boolean;
  isSaved: boolean;
  tags: string[];
  timestamp: number;
}

interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  tryOnHistory: TryOnResult[];
  feedPosts: OutfitPost[];
  isProcessing: boolean;
  processingStep: string;
  selectedStyle: string;
  backgroundStyle: string;

  setUser: (user: User | null) => void;
  setAuthenticated: (auth: boolean) => void;
  addTryOnResult: (result: TryOnResult) => void;
  setFeedPosts: (posts: OutfitPost[]) => void;
  togglePostLike: (postId: string) => void;
  togglePostSave: (postId: string) => void;
  setProcessing: (processing: boolean, step?: string) => void;
  setSelectedStyle: (style: string) => void;
  setBackgroundStyle: (style: string) => void;
  logout: () => void;
}

const mockUser: User = {
  id: '1',
  name: 'Alex Rivera',
  email: 'alex@example.com',
  avatar: 'https://i.pravatar.cc/150?img=11',
  isPremium: false,
  tryOnsRemaining: 5,
  followers: 1243,
  following: 389,
  posts: 47,
};

const mockPosts: OutfitPost[] = [
  {
    id: '1',
    userId: '2',
    userName: 'Sofia Reyes',
    userAvatar: 'https://i.pravatar.cc/150?img=5',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80',
    caption: 'Obsessed with this AI try-on result! ✨ The black blazer fits perfectly',
    likes: 2847,
    comments: 142,
    isLiked: false,
    isSaved: false,
    tags: ['fashion', 'aitryron', 'style'],
    timestamp: Date.now() - 3600000,
  },
  {
    id: '2',
    userId: '3',
    userName: 'James Kim',
    userAvatar: 'https://i.pravatar.cc/150?img=12',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80',
    caption: 'Summer vibes with the AI Outfit Generator 🌊 What do you think?',
    likes: 1923,
    comments: 98,
    isLiked: true,
    isSaved: true,
    tags: ['summer', 'vibes', 'aioutfit'],
    timestamp: Date.now() - 7200000,
  },
  {
    id: '3',
    userId: '4',
    userName: 'Mia Chen',
    userAvatar: 'https://i.pravatar.cc/150?img=9',
    image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&q=80',
    caption: 'Generated a luxury wedding look with AI 💍 Absolutely stunning',
    likes: 4521,
    comments: 267,
    isLiked: false,
    isSaved: false,
    tags: ['wedding', 'luxury', 'aibridal'],
    timestamp: Date.now() - 14400000,
  },
  {
    id: '4',
    userId: '5',
    userName: 'Ryan Patel',
    userAvatar: 'https://i.pravatar.cc/150?img=15',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&q=80',
    caption: 'Tried on 20 suits in 2 minutes with AI ⚡ Shopping is never the same',
    likes: 3102,
    comments: 189,
    isLiked: false,
    isSaved: true,
    tags: ['suits', 'mensfashion', 'efficiency'],
    timestamp: Date.now() - 21600000,
  },
  {
    id: '5',
    userId: '6',
    userName: 'Zara Nguyen',
    userAvatar: 'https://i.pravatar.cc/150?img=25',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80',
    caption: 'The AR live try-on feature is INSANE 🔥 No more fitting room queues!',
    likes: 5847,
    comments: 342,
    isLiked: true,
    isSaved: false,
    tags: ['artryron', 'tech', 'fashion'],
    timestamp: Date.now() - 28800000,
  },
];

export const useAppStore = create<AppState>((set) => ({
  user: mockUser,
  isAuthenticated: true,
  tryOnHistory: [],
  feedPosts: mockPosts,
  isProcessing: false,
  processingStep: '',
  selectedStyle: 'casual',
  backgroundStyle: 'studio',

  setUser: (user) => set({ user }),
  setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),

  addTryOnResult: (result) =>
    set((state) => ({
      tryOnHistory: [result, ...state.tryOnHistory],
    })),

  setFeedPosts: (feedPosts) => set({ feedPosts }),

  togglePostLike: (postId) =>
    set((state) => ({
      feedPosts: state.feedPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1,
            }
          : post
      ),
    })),

  togglePostSave: (postId) =>
    set((state) => ({
      feedPosts: state.feedPosts.map((post) =>
        post.id === postId ? { ...post, isSaved: !post.isSaved } : post
      ),
    })),

  setProcessing: (isProcessing, processingStep = '') =>
    set({ isProcessing, processingStep }),

  setSelectedStyle: (selectedStyle) => set({ selectedStyle }),
  setBackgroundStyle: (backgroundStyle) => set({ backgroundStyle }),

  logout: () => set({ user: null, isAuthenticated: false }),
}));
