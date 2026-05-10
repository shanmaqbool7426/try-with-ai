import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Dimensions,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { GlassCard } from '@/components/GlassCard';

const { width } = Dimensions.get('window');
const CARD_W = (width - 40) / 2;

const CATEGORIES = [
  { id: 'all', label: 'All', icon: '✨' },
  { id: 'women', label: 'Women', icon: '👗' },
  { id: 'men', label: 'Men', icon: '👔' },
  { id: 'luxury', label: 'Luxury', icon: '💎' },
  { id: 'street', label: 'Street', icon: '🧢' },
  { id: 'wedding', label: 'Wedding', icon: '💍' },
  { id: 'sport', label: 'Sport', icon: '⚡' },
];

const EXPLORE_ITEMS = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=80',
    likes: 4820,
    category: 'women',
    height: 220,
    user: 'Sofia R.',
    isAI: true,
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80',
    likes: 3240,
    category: 'men',
    height: 280,
    user: 'James K.',
    isAI: false,
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&q=80',
    likes: 6120,
    category: 'luxury',
    height: 260,
    user: 'Mia C.',
    isAI: true,
  },
  {
    id: '4',
    image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&q=80',
    likes: 2890,
    category: 'women',
    height: 200,
    user: 'Zara N.',
    isAI: true,
  },
  {
    id: '5',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&q=80',
    likes: 1740,
    category: 'street',
    height: 240,
    user: 'Ryan P.',
    isAI: false,
  },
  {
    id: '6',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&q=80',
    likes: 8930,
    category: 'wedding',
    height: 300,
    user: 'Laila M.',
    isAI: true,
  },
  {
    id: '7',
    image: 'https://images.unsplash.com/photo-1495385794356-15371f348c31?w=400&q=80',
    likes: 3560,
    category: 'women',
    height: 230,
    user: 'Emma T.',
    isAI: false,
  },
  {
    id: '8',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&q=80',
    likes: 2120,
    category: 'street',
    height: 190,
    user: 'Kai S.',
    isAI: true,
  },
];

const FEATURED_CREATORS = [
  { id: '1', name: 'Sofia Reyes', followers: '48.2K', avatar: 'https://i.pravatar.cc/150?img=5', specialty: 'Luxury Fashion' },
  { id: '2', name: 'Mia Chen', followers: '32.1K', avatar: 'https://i.pravatar.cc/150?img=9', specialty: 'Bridal Looks' },
  { id: '3', name: 'Zara Nguyen', followers: '28.7K', avatar: 'https://i.pravatar.cc/150?img=25', specialty: 'Streetwear' },
  { id: '4', name: 'James Kim', followers: '19.4K', avatar: 'https://i.pravatar.cc/150?img=12', specialty: 'Menswear' },
];

function formatNum(n: number) {
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
  return n.toString();
}

export default function ExploreScreen() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchText, setSearchText] = useState('');
  const [likedItems, setLikedItems] = useState<Set<string>>(new Set());

  const filtered = EXPLORE_ITEMS.filter((item) => {
    if (activeCategory !== 'all' && item.category !== activeCategory) return false;
    return true;
  });

  const leftCol = filtered.filter((_, i) => i % 2 === 0);
  const rightCol = filtered.filter((_, i) => i % 2 !== 0);

  const toggleLike = (id: string) => {
    setLikedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const renderItem = (item: any) => (
    <TouchableOpacity key={item.id} style={[styles.masonryItem, { height: item.height }]} activeOpacity={0.9}>
      <Image source={{ uri: item.image }} style={styles.masonryImage} />
      <LinearGradient colors={['transparent', 'rgba(0,0,0,0.85)']} style={styles.masonryOverlay}>
        {item.isAI && (
          <View style={styles.aiChip}>
            <Ionicons name="sparkles" size={10} color="#fff" />
            <Text style={styles.aiChipText}>AI</Text>
          </View>
        )}
        <Text style={styles.masonryUser}>{item.user}</Text>
        <TouchableOpacity style={styles.likeBtn} onPress={() => toggleLike(item.id)}>
          <Ionicons
            name={likedItems.has(item.id) ? 'heart' : 'heart-outline'}
            size={16}
            color={likedItems.has(item.id) ? Colors.accent : '#fff'}
          />
          <Text style={styles.likeBtnText}>{formatNum(item.likes + (likedItems.has(item.id) ? 1 : 0))}</Text>
        </TouchableOpacity>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <LinearGradient colors={['rgba(6,182,212,0.08)', 'transparent']} style={styles.bgGrad} pointerEvents="none" />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Explore Fashion</Text>
          <TouchableOpacity style={styles.filterBtn}>
            <Ionicons name="options-outline" size={20} color={Colors.text} />
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={18} color={Colors.textMuted} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            value={searchText}
            onChangeText={setSearchText}
            placeholder="Search styles, trends, creators..."
            placeholderTextColor={Colors.textMuted}
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText('')}>
              <Ionicons name="close-circle" size={18} color={Colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesScroll}
        >
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[styles.categoryChip, activeCategory === cat.id && styles.categoryChipActive]}
              onPress={() => setActiveCategory(cat.id)}
              activeOpacity={0.8}
            >
              {activeCategory === cat.id ? (
                <LinearGradient colors={['#8b5cf6', '#ec4899']} style={styles.categoryGrad}>
                  <Text style={styles.categoryEmoji}>{cat.icon}</Text>
                  <Text style={styles.categoryLabelActive}>{cat.label}</Text>
                </LinearGradient>
              ) : (
                <>
                  <Text style={styles.categoryEmoji}>{cat.icon}</Text>
                  <Text style={styles.categoryLabel}>{cat.label}</Text>
                </>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={styles.featuredSection}>
            <Text style={styles.sectionLabel}>⭐ Top Creators</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {FEATURED_CREATORS.map((creator) => (
                <TouchableOpacity key={creator.id} style={styles.creatorCard} activeOpacity={0.85}>
                  <GlassCard style={styles.creatorCardInner}>
                    <Image source={{ uri: creator.avatar }} style={styles.creatorAvatar} />
                    <LinearGradient colors={['#8b5cf6', '#ec4899']} style={styles.creatorRing} />
                    <Text style={styles.creatorName}>{creator.name}</Text>
                    <Text style={styles.creatorSpecialty}>{creator.specialty}</Text>
                    <Text style={styles.creatorFollowers}>{creator.followers} followers</Text>
                    <TouchableOpacity style={styles.followBtn}>
                      <LinearGradient colors={['#8b5cf6', '#ec4899']} style={styles.followBtnGrad}>
                        <Text style={styles.followBtnText}>Follow</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </GlassCard>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.masonrySection}>
            <Text style={styles.sectionLabel}>
              🔥 Trending {activeCategory !== 'all' ? CATEGORIES.find(c => c.id === activeCategory)?.label : 'Fashion'}
            </Text>
            <View style={styles.masonryContainer}>
              <View style={styles.masonryCol}>{leftCol.map(renderItem)}</View>
              <View style={styles.masonryCol}>{rightCol.map(renderItem)}</View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  safeArea: { flex: 1 },
  bgGrad: { position: 'absolute', top: 0, left: 0, right: 0, height: 300 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 12,
  },
  headerTitle: { color: Colors.text, fontSize: 24, fontWeight: '800' },
  filterBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 14,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 14,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, color: Colors.text, fontSize: 14, paddingVertical: 12 },
  categoriesScroll: { paddingHorizontal: 16, gap: 8, paddingBottom: 16 },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.surfaceElevated,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  categoryChipActive: { backgroundColor: 'transparent', borderColor: 'transparent', padding: 0 },
  categoryGrad: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20 },
  categoryEmoji: { fontSize: 14 },
  categoryLabel: { color: Colors.textSecondary, fontSize: 13, fontWeight: '600' },
  categoryLabelActive: { color: '#fff', fontSize: 13, fontWeight: '700' },
  scrollContent: { paddingBottom: 100 },
  featuredSection: { marginBottom: 20 },
  sectionLabel: { color: Colors.text, fontSize: 16, fontWeight: '700', paddingHorizontal: 16, marginBottom: 12 },
  creatorCard: { marginLeft: 16, width: 140 },
  creatorCardInner: { padding: 14, alignItems: 'center' },
  creatorAvatar: { width: 56, height: 56, borderRadius: 28, borderWidth: 2, borderColor: Colors.primary },
  creatorRing: {
    position: 'absolute',
    top: 12,
    left: '50%',
    marginLeft: -30,
    width: 60,
    height: 60,
    borderRadius: 30,
    opacity: 0.2,
  },
  creatorName: { color: Colors.text, fontWeight: '700', fontSize: 13, marginTop: 8, textAlign: 'center' },
  creatorSpecialty: { color: Colors.textMuted, fontSize: 11, marginTop: 2, textAlign: 'center' },
  creatorFollowers: { color: Colors.primary, fontSize: 12, fontWeight: '600', marginTop: 4 },
  followBtn: { marginTop: 10, borderRadius: 20, overflow: 'hidden', width: '100%' },
  followBtnGrad: { paddingVertical: 6, alignItems: 'center' },
  followBtnText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  masonrySection: {},
  masonryContainer: { flexDirection: 'row', paddingHorizontal: 12, gap: 8 },
  masonryCol: { flex: 1, gap: 8 },
  masonryItem: { borderRadius: 16, overflow: 'hidden', position: 'relative' },
  masonryImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  masonryOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  aiChip: {
    position: 'absolute',
    top: -60,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(139,92,246,0.8)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
  },
  aiChipText: { color: '#fff', fontSize: 10, fontWeight: '800' },
  masonryUser: { flex: 1, color: '#fff', fontSize: 11, fontWeight: '600' },
  likeBtn: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  likeBtnText: { color: '#fff', fontSize: 11, fontWeight: '600' },
});
