import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
  RefreshControl,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { useAppStore } from '@/store/useAppStore';
import { GlassCard } from '@/components/GlassCard';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

const TRENDING_TAGS = ['#AIFashion', '#VirtualTryOn', '#OOTD', '#StyleAI', '#FashionTech', '#LuxuryLook'];

const STORIES = [
  { id: '1', name: 'You', avatar: 'https://i.pravatar.cc/150?img=11', isYou: true },
  { id: '2', name: 'Sofia', avatar: 'https://i.pravatar.cc/150?img=5', hasStory: true },
  { id: '3', name: 'James', avatar: 'https://i.pravatar.cc/150?img=12', hasStory: true },
  { id: '4', name: 'Mia', avatar: 'https://i.pravatar.cc/150?img=9', hasStory: true },
  { id: '5', name: 'Ryan', avatar: 'https://i.pravatar.cc/150?img=15', hasStory: true },
  { id: '6', name: 'Zara', avatar: 'https://i.pravatar.cc/150?img=25', hasStory: true },
];

function formatNumber(n: number) {
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
  return n.toString();
}

function timeAgo(ts: number) {
  const diff = Date.now() - ts;
  const h = Math.floor(diff / 3600000);
  if (h < 1) return 'just now';
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function FeedScreen() {
  const { feedPosts, togglePostLike, togglePostSave, user } = useAppStore();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  }, []);

  const renderStory = ({ item }: any) => (
    <TouchableOpacity style={styles.storyItem} activeOpacity={0.8}>
      <View style={[styles.storyRing, item.isYou && styles.storyRingYou]}>
        {item.isYou ? (
          <LinearGradient colors={['#8b5cf6', '#ec4899']} style={styles.storyAvatarGrad}>
            <Image source={{ uri: item.avatar }} style={styles.storyAvatar} />
          </LinearGradient>
        ) : (
          <LinearGradient colors={['#f59e0b', '#ec4899']} style={styles.storyRingGrad}>
            <Image source={{ uri: item.avatar }} style={styles.storyAvatarBordered} />
          </LinearGradient>
        )}
        {item.isYou && (
          <View style={styles.addStoryBtn}>
            <Ionicons name="add" size={12} color="#fff" />
          </View>
        )}
      </View>
      <Text style={styles.storyName} numberOfLines={1}>
        {item.isYou ? 'Your Story' : item.name}
      </Text>
    </TouchableOpacity>
  );

  const renderPost = ({ item }: any) => (
    <TouchableOpacity
      style={styles.postCard}
      activeOpacity={0.95}
      onPress={() => router.push({ pathname: '/screens/post-detail', params: { id: item.id } })}
    >
      <GlassCard style={styles.postInner}>
        <View style={styles.postHeader}>
          <Image source={{ uri: item.userAvatar }} style={styles.postAvatar} />
          <View style={styles.postUserInfo}>
            <Text style={styles.postUserName}>{item.userName}</Text>
            <Text style={styles.postTime}>{timeAgo(item.timestamp)}</Text>
          </View>
          <TouchableOpacity style={styles.moreBtn}>
            <Ionicons name="ellipsis-horizontal" size={18} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <Image source={{ uri: item.image }} style={styles.postImage} resizeMode="cover" />

        <View style={styles.tagsRow}>
          {item.tags.map((tag: string, i: number) => (
            <View key={i} style={styles.tag}>
              <Text style={styles.tagText}>#{tag}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.postCaption} numberOfLines={2}>
          {item.caption}
        </Text>

        <View style={styles.postActions}>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => togglePostLike(item.id)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={item.isLiked ? 'heart' : 'heart-outline'}
              size={22}
              color={item.isLiked ? Colors.accent : Colors.textSecondary}
            />
            <Text style={[styles.actionCount, item.isLiked && { color: Colors.accent }]}>
              {formatNumber(item.likes)}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtn} activeOpacity={0.7}>
            <Ionicons name="chatbubble-outline" size={20} color={Colors.textSecondary} />
            <Text style={styles.actionCount}>{formatNumber(item.comments)}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtn} activeOpacity={0.7}>
            <Ionicons name="share-social-outline" size={20} color={Colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, { marginLeft: 'auto' }]}
            onPress={() => togglePostSave(item.id)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={item.isSaved ? 'bookmark' : 'bookmark-outline'}
              size={20}
              color={item.isSaved ? Colors.primary : Colors.textSecondary}
            />
          </TouchableOpacity>
        </View>
      </GlassCard>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['rgba(139,92,246,0.08)', 'transparent']}
        style={styles.topGradient}
        pointerEvents="none"
      />

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Try Clothes On Me</Text>
            <Text style={styles.headerSubtitle}>Your AI Fashion Universe ✨</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.notifBtn}>
              <Ionicons name="notifications-outline" size={22} color={Colors.text} />
              <View style={styles.notifDot} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/screens/premium')}>
              <LinearGradient colors={['#f59e0b', '#ec4899']} style={styles.premiumBadge}>
                <Ionicons name="diamond" size={12} color="#fff" />
                <Text style={styles.premiumText}>PRO</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        <FlatList
          data={feedPosts}
          keyExtractor={(item) => item.id}
          renderItem={renderPost}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.feedContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={Colors.primary}
              colors={[Colors.primary]}
            />
          }
          ListHeaderComponent={
            <View>
              <FlatList
                data={STORIES}
                keyExtractor={(item) => item.id}
                renderItem={renderStory}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.storiesContainer}
              />
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.tagsScroll}
              >
                {TRENDING_TAGS.map((tag, i) => (
                  <TouchableOpacity key={i} style={styles.trendingTag} activeOpacity={0.7}>
                    <LinearGradient
                      colors={i % 2 === 0 ? ['rgba(139,92,246,0.15)', 'rgba(236,72,153,0.15)'] : ['rgba(6,182,212,0.15)', 'rgba(139,92,246,0.15)']}
                      style={styles.trendingTagGrad}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                    >
                      <Text style={[styles.trendingTagText, { color: i % 2 === 0 ? Colors.primaryLight : Colors.cyanLight }]}>
                        {tag}
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <TouchableOpacity
                style={styles.tryOnBanner}
                onPress={() => router.push('/tryon')}
                activeOpacity={0.9}
              >
                <LinearGradient
                  colors={['#8b5cf6', '#ec4899']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.tryOnBannerGrad}
                >
                  <View>
                    <Text style={styles.tryOnBannerTitle}>✨ AI Virtual Try-On</Text>
                    <Text style={styles.tryOnBannerSub}>See yourself in any outfit instantly</Text>
                  </View>
                  <View style={styles.tryOnBannerBtn}>
                    <Text style={styles.tryOnBannerBtnText}>Try Now</Text>
                    <Ionicons name="arrow-forward" size={14} color="#fff" />
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          }
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  safeArea: { flex: 1 },
  topGradient: { position: 'absolute', top: 0, left: 0, right: 0, height: 300 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  headerTitle: { color: Colors.text, fontSize: 20, fontWeight: '800', letterSpacing: -0.5 },
  headerSubtitle: { color: Colors.textSecondary, fontSize: 12, marginTop: 2 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  notifBtn: { position: 'relative' },
  notifDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.accent,
    borderWidth: 1.5,
    borderColor: Colors.background,
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  premiumText: { color: '#fff', fontSize: 11, fontWeight: '800' },
  storiesContainer: { paddingHorizontal: 16, paddingBottom: 12, gap: 12 },
  storyItem: { alignItems: 'center', width: 64 },
  storyRing: {
    width: 62,
    height: 62,
    borderRadius: 31,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  storyRingYou: {},
  storyRingGrad: {
    width: 62,
    height: 62,
    borderRadius: 31,
    alignItems: 'center',
    justifyContent: 'center',
  },
  storyAvatarGrad: {
    width: 62,
    height: 62,
    borderRadius: 31,
    alignItems: 'center',
    justifyContent: 'center',
  },
  storyAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: Colors.background,
  },
  storyAvatarBordered: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: Colors.background,
  },
  addStoryBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.background,
  },
  storyName: { color: Colors.textSecondary, fontSize: 11, textAlign: 'center', width: 62 },
  tagsScroll: { paddingHorizontal: 16, gap: 8, paddingBottom: 16 },
  trendingTag: { borderRadius: 20, overflow: 'hidden' },
  trendingTagGrad: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  trendingTagText: { fontSize: 12, fontWeight: '600' },
  tryOnBanner: { marginHorizontal: 16, borderRadius: 18, overflow: 'hidden', marginBottom: 16 },
  tryOnBannerGrad: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 18,
  },
  tryOnBannerTitle: { color: '#fff', fontSize: 17, fontWeight: '800' },
  tryOnBannerSub: { color: 'rgba(255,255,255,0.75)', fontSize: 13, marginTop: 3 },
  tryOnBannerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  tryOnBannerBtnText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  feedContent: { paddingBottom: 100 },
  postCard: { marginHorizontal: 16, marginBottom: 16 },
  postInner: { padding: 0, overflow: 'hidden' },
  postHeader: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 10 },
  postAvatar: { width: 40, height: 40, borderRadius: 20 },
  postUserInfo: { flex: 1 },
  postUserName: { color: Colors.text, fontSize: 14, fontWeight: '700' },
  postTime: { color: Colors.textMuted, fontSize: 12, marginTop: 1 },
  moreBtn: { padding: 4 },
  postImage: { width: '100%', height: 320 },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, paddingHorizontal: 14, paddingTop: 12 },
  tag: {
    backgroundColor: 'rgba(139,92,246,0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(139,92,246,0.2)',
  },
  tagText: { color: Colors.primaryLight, fontSize: 11, fontWeight: '600' },
  postCaption: { color: Colors.textSecondary, fontSize: 13, paddingHorizontal: 14, paddingTop: 8 },
  postActions: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 16,
  },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  actionCount: { color: Colors.textSecondary, fontSize: 14, fontWeight: '600' },
});
