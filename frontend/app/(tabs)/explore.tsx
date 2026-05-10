import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Image, TextInput, Dimensions, FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const COL_W = (width - 36) / 2;

const CATEGORIES = [
  { id: 'all', label: 'All', icon: '✨' },
  { id: 'women', label: 'Women', icon: '👗' },
  { id: 'men', label: 'Men', icon: '👔' },
  { id: 'eastern', label: 'Eastern', icon: '🥻' },
  { id: 'bridal', label: 'Bridal', icon: '👰' },
  { id: 'luxury', label: 'Luxury', icon: '💎' },
  { id: 'street', label: 'Street', icon: '🧢' },
];

const EXPLORE_ITEMS = [
  { id: '1', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=80', likes: 4820, category: 'women', height: 240, user: 'Sofia R.', isAI: true },
  { id: '2', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80', likes: 3240, category: 'men', height: 290, user: 'James K.', isAI: false },
  { id: '3', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&q=80', likes: 6120, category: 'luxury', height: 270, user: 'Mia C.', isAI: true },
  { id: '4', image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&q=80', likes: 2890, category: 'women', height: 210, user: 'Zara N.', isAI: true },
  { id: '5', image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&q=80', likes: 1740, category: 'street', height: 250, user: 'Ryan P.', isAI: false },
  { id: '6', image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&q=80', likes: 8930, category: 'bridal', height: 310, user: 'Laila M.', isAI: true },
  { id: '7', image: 'https://images.unsplash.com/photo-1495385794356-15371f348c31?w=400&q=80', likes: 3560, category: 'women', height: 230, user: 'Emma T.', isAI: false },
  { id: '8', image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&q=80', likes: 2120, category: 'street', height: 200, user: 'Kai S.', isAI: true },
  { id: '9', image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&q=80', likes: 5640, category: 'eastern', height: 260, user: 'Amara K.', isAI: true },
  { id: '10', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80', likes: 3100, category: 'men', height: 230, user: 'Omar H.', isAI: false },
];

const CREATORS = [
  { id: '1', name: 'Sofia Reyes', followers: '48.2K', avatar: 'https://i.pravatar.cc/150?img=5', specialty: 'Luxury', verified: true },
  { id: '2', name: 'Mia Chen', followers: '32.1K', avatar: 'https://i.pravatar.cc/150?img=9', specialty: 'Bridal', verified: true },
  { id: '3', name: 'Zara Nguyen', followers: '28.7K', avatar: 'https://i.pravatar.cc/150?img=25', specialty: 'Streetwear', verified: false },
  { id: '4', name: 'James Kim', followers: '19.4K', avatar: 'https://i.pravatar.cc/150?img=12', specialty: 'Menswear', verified: true },
];

function formatNum(n: number) {
  return n >= 1000 ? (n / 1000).toFixed(1) + 'k' : n.toString();
}

export default function ExploreScreen() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchText, setSearchText] = useState('');
  const [likedItems, setLikedItems] = useState<Set<string>>(new Set());

  const filtered = EXPLORE_ITEMS.filter((item) =>
    (activeCategory === 'all' || item.category === activeCategory)
  );

  const leftCol = filtered.filter((_, i) => i % 2 === 0);
  const rightCol = filtered.filter((_, i) => i % 2 !== 0);

  const toggleLike = (id: string) => {
    setLikedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const renderItem = (item: any) => (
    <TouchableOpacity key={item.id} style={[styles.masonryItem, { height: item.height }]} activeOpacity={0.88}>
      <Image source={{ uri: item.image }} style={styles.masonryImg} />
      <LinearGradient colors={['transparent', 'rgba(0,0,0,0.88)']} style={styles.masonryOverlay}>
        {item.isAI && (
          <View style={styles.aiChip}>
            <Ionicons name="sparkles" size={9} color="#fff" />
            <Text style={styles.aiChipText}>AI</Text>
          </View>
        )}
        <View style={styles.masonryBottom}>
          <Text style={styles.masonryUser} numberOfLines={1}>{item.user}</Text>
          <TouchableOpacity style={styles.likeBtn} onPress={() => toggleLike(item.id)}>
            <Ionicons name={likedItems.has(item.id) ? 'heart' : 'heart-outline'} size={14} color={likedItems.has(item.id) ? '#ec4899' : '#fff'} />
            <Text style={styles.likeBtnText}>{formatNum(item.likes + (likedItems.has(item.id) ? 1 : 0))}</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Explore</Text>
          <TouchableOpacity style={styles.filterBtn}>
            <Ionicons name="options-outline" size={20} color="#f8fafc" />
          </TouchableOpacity>
        </View>

        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={18} color="#475569" />
          <TextInput
            style={styles.searchInput}
            value={searchText}
            onChangeText={setSearchText}
            placeholder="Search styles, creators..."
            placeholderTextColor="#475569"
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText('')}>
              <Ionicons name="close-circle" size={17} color="#475569" />
            </TouchableOpacity>
          )}
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catsRow}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[styles.catChip, activeCategory === cat.id && styles.catChipActive]}
              onPress={() => setActiveCategory(cat.id)}
              activeOpacity={0.8}
            >
              {activeCategory === cat.id ? (
                <LinearGradient colors={['#7c3aed', '#ec4899']} style={styles.catChipGrad}>
                  <Text style={styles.catEmojiActive}>{cat.icon}</Text>
                  <Text style={styles.catLabelActive}>{cat.label}</Text>
                </LinearGradient>
              ) : (
                <>
                  <Text style={styles.catEmoji}>{cat.icon}</Text>
                  <Text style={styles.catLabel}>{cat.label}</Text>
                </>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <Text style={styles.sectionLabel}>Top Creators</Text>
          <FlatList
            data={CREATORS}
            keyExtractor={(c) => c.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.creatorsRow}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.creatorCard} activeOpacity={0.85}>
                <View style={styles.creatorAvatarWrap}>
                  <LinearGradient colors={['#7c3aed', '#ec4899']} style={styles.creatorRing}>
                    <Image source={{ uri: item.avatar }} style={styles.creatorAvatar} />
                  </LinearGradient>
                  {item.verified && (
                    <View style={styles.verifiedBadge}>
                      <Ionicons name="checkmark" size={9} color="#fff" />
                    </View>
                  )}
                </View>
                <Text style={styles.creatorName} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.creatorSpecialty}>{item.specialty}</Text>
                <Text style={styles.creatorFollowers}>{item.followers}</Text>
                <TouchableOpacity style={styles.followBtn}>
                  <LinearGradient colors={['#7c3aed', '#ec4899']} style={styles.followBtnGrad}>
                    <Text style={styles.followBtnText}>Follow</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </TouchableOpacity>
            )}
          />

          <View style={styles.masonryHeader}>
            <Text style={styles.sectionLabel}>
              {activeCategory === 'all' ? 'Trending Now' : `${CATEGORIES.find(c => c.id === activeCategory)?.label} Looks`}
            </Text>
            <Text style={styles.countLabel}>{filtered.length} looks</Text>
          </View>

          <View style={styles.masonryCols}>
            <View style={styles.masonryCol}>{leftCol.map(renderItem)}</View>
            <View style={styles.masonryCol}>{rightCol.map(renderItem)}</View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0f' },
  safeArea: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 18, paddingTop: 10, paddingBottom: 12 },
  headerTitle: { color: '#f8fafc', fontSize: 24, fontWeight: '800' },
  filterBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#16161f', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)' },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    marginHorizontal: 16, backgroundColor: '#16161f',
    borderRadius: 14, paddingHorizontal: 14, paddingVertical: 11,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)', marginBottom: 14,
  },
  searchInput: { flex: 1, color: '#f8fafc', fontSize: 14 },
  catsRow: { paddingHorizontal: 16, gap: 8, paddingBottom: 14 },
  catChip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20,
    backgroundColor: '#16161f', borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)',
    overflow: 'hidden',
  },
  catChipActive: { backgroundColor: 'transparent', borderColor: 'transparent', padding: 0 },
  catChipGrad: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20 },
  catEmoji: { fontSize: 14 },
  catEmojiActive: { fontSize: 14 },
  catLabel: { color: '#64748b', fontSize: 13, fontWeight: '600' },
  catLabelActive: { color: '#fff', fontSize: 13, fontWeight: '700' },
  scrollContent: { paddingBottom: 110 },
  sectionLabel: { color: '#f8fafc', fontSize: 16, fontWeight: '700', paddingHorizontal: 16, marginBottom: 12 },
  creatorsRow: { paddingHorizontal: 16, gap: 12, paddingBottom: 4 },
  creatorCard: {
    width: 130, backgroundColor: '#12121a', borderRadius: 18,
    padding: 14, alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
  },
  creatorAvatarWrap: { position: 'relative', marginBottom: 8 },
  creatorRing: { width: 60, height: 60, borderRadius: 30, padding: 2, alignItems: 'center', justifyContent: 'center' },
  creatorAvatar: { width: 56, height: 56, borderRadius: 28, borderWidth: 2, borderColor: '#0a0a0f' },
  verifiedBadge: {
    position: 'absolute', bottom: 0, right: 0,
    width: 18, height: 18, borderRadius: 9,
    backgroundColor: '#7c3aed', alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderColor: '#0a0a0f',
  },
  creatorName: { color: '#f8fafc', fontWeight: '700', fontSize: 13, textAlign: 'center' },
  creatorSpecialty: { color: '#475569', fontSize: 11, marginTop: 2 },
  creatorFollowers: { color: '#7c3aed', fontSize: 12, fontWeight: '600', marginTop: 4, marginBottom: 10 },
  followBtn: { width: '100%', borderRadius: 12, overflow: 'hidden' },
  followBtnGrad: { paddingVertical: 7, alignItems: 'center' },
  followBtnText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  masonryHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, marginTop: 20, marginBottom: 12 },
  countLabel: { color: '#475569', fontSize: 13 },
  masonryCols: { flexDirection: 'row', paddingHorizontal: 10, gap: 8 },
  masonryCol: { flex: 1, gap: 8 },
  masonryItem: { borderRadius: 16, overflow: 'hidden', position: 'relative' },
  masonryImg: { width: '100%', height: '100%' },
  masonryOverlay: { position: 'absolute', inset: 0, justifyContent: 'flex-end', padding: 10 },
  aiChip: {
    position: 'absolute', top: 8, left: 8,
    flexDirection: 'row', alignItems: 'center', gap: 3,
    backgroundColor: 'rgba(124,58,237,0.85)', paddingHorizontal: 7, paddingVertical: 3, borderRadius: 8,
  },
  aiChipText: { color: '#fff', fontSize: 9, fontWeight: '800' },
  masonryBottom: { flexDirection: 'row', alignItems: 'center' },
  masonryUser: { flex: 1, color: '#fff', fontSize: 11, fontWeight: '600' },
  likeBtn: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  likeBtnText: { color: '#fff', fontSize: 11 },
});
