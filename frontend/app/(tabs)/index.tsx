import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAppStore } from '@/store/useAppStore';

const { width } = Dimensions.get('window');

const STORIES = [
  { id: 'you', name: 'Your Story', avatar: 'https://i.pravatar.cc/150?img=11', isYou: true },
  { id: '1', name: 'Sofia', avatar: 'https://i.pravatar.cc/150?img=5' },
  { id: '2', name: 'James', avatar: 'https://i.pravatar.cc/150?img=12' },
  { id: '3', name: 'Mia', avatar: 'https://i.pravatar.cc/150?img=9' },
  { id: '4', name: 'Ryan', avatar: 'https://i.pravatar.cc/150?img=15' },
  { id: '5', name: 'Zara', avatar: 'https://i.pravatar.cc/150?img=25' },
  { id: '6', name: 'Laila', avatar: 'https://i.pravatar.cc/150?img=20' },
];

const TAGS = ['#AIFashion', '#VirtualTryOn', '#OOTD', '#StyleAI', '#FashionTech', '#LuxuryLook', '#Bridal'];

function timeAgo(ts: number) {
  const diff = Date.now() - ts;
  const h = Math.floor(diff / 3600000);
  if (h < 1) return 'just now';
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function formatNum(n: number) {
  return n >= 1000 ? (n / 1000).toFixed(1) + 'k' : n.toString();
}

export default function FeedScreen() {
  const { feedPosts, togglePostLike, togglePostSave } = useAppStore();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1400);
  }, []);

  const renderStory = ({ item }: any) => (
    <TouchableOpacity style={styles.storyItem} activeOpacity={0.8}>
      {item.isYou ? (
        <View style={styles.storyYouWrap}>
          <LinearGradient colors={['#7c3aed', '#ec4899']} style={styles.storyRingGrad}>
            <Image source={{ uri: item.avatar }} style={styles.storyImg} />
          </LinearGradient>
          <View style={styles.storyAddBtn}>
            <Ionicons name="add" size={12} color="#fff" />
          </View>
        </View>
      ) : (
        <LinearGradient colors={['#f59e0b', '#ec4899', '#7c3aed']} style={styles.storyRingGrad}>
          <Image source={{ uri: item.avatar }} style={styles.storyImg} />
        </LinearGradient>
      )}
      <Text style={styles.storyName} numberOfLines={1}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderPost = ({ item }: any) => (
    <TouchableOpacity
      style={styles.postCard}
      activeOpacity={0.97}
      onPress={() => router.push({ pathname: '/screens/post-detail', params: { id: item.id } })}
    >
      <View style={styles.postHeader}>
        <Image source={{ uri: item.userAvatar }} style={styles.postAvatar} />
        <View style={styles.postUserInfo}>
          <View style={styles.postUserRow}>
            <Text style={styles.postUserName}>{item.userName}</Text>
            {item.isAI && (
              <View style={styles.aiTag}>
                <Ionicons name="sparkles" size={9} color="#7c3aed" />
                <Text style={styles.aiTagText}>AI Try-On</Text>
              </View>
            )}
          </View>
          <Text style={styles.postTime}>{timeAgo(item.timestamp)}</Text>
        </View>
        <TouchableOpacity style={styles.moreBtn}>
          <Ionicons name="ellipsis-horizontal" size={18} color="#475569" />
        </TouchableOpacity>
      </View>

      <Image source={{ uri: item.image }} style={styles.postImage} />

      <View style={styles.postFooter}>
        <View style={styles.postActions}>
          <TouchableOpacity style={styles.actionBtn} onPress={() => togglePostLike(item.id)}>
            <Ionicons name={item.isLiked ? 'heart' : 'heart-outline'} size={24} color={item.isLiked ? '#ec4899' : '#475569'} />
            <Text style={[styles.actionCount, item.isLiked && { color: '#ec4899' }]}>{formatNum(item.likes)}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn}>
            <Ionicons name="chatbubble-outline" size={22} color="#475569" />
            <Text style={styles.actionCount}>{formatNum(item.comments)}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn}>
            <Ionicons name="paper-plane-outline" size={22} color="#475569" />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, { marginLeft: 'auto' }]} onPress={() => togglePostSave(item.id)}>
            <Ionicons name={item.isSaved ? 'bookmark' : 'bookmark-outline'} size={22} color={item.isSaved ? '#7c3aed' : '#475569'} />
          </TouchableOpacity>
        </View>

        <View style={styles.postCaption}>
          <Text style={styles.captionUser}>{item.userName} </Text>
          <Text style={styles.captionText} numberOfLines={2}>{item.caption}</Text>
        </View>

        <View style={styles.tagsRow}>
          {item.tags?.slice(0, 3).map((tag: string, i: number) => (
            <Text key={i} style={styles.tagText}>#{tag} </Text>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );

  const ListHeader = (
    <View>
      <View style={styles.appHeader}>
        <View>
          <Text style={styles.appTitle}>Try Clothes On Me</Text>
          <Text style={styles.appSubtitle}>Your AI Fashion Universe</Text>
        </View>
        <View style={styles.appHeaderRight}>
          <TouchableOpacity style={styles.headerIconBtn}>
            <Ionicons name="search-outline" size={22} color="#f8fafc" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIconBtn}>
            <Ionicons name="notifications-outline" size={22} color="#f8fafc" />
            <View style={styles.notifDot} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/screens/premium')}>
            <LinearGradient colors={['#7c3aed', '#ec4899']} style={styles.proBadge}>
              <Ionicons name="diamond" size={11} color="#fff" />
              <Text style={styles.proText}>PRO</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={STORIES}
        keyExtractor={(i) => i.id}
        renderItem={renderStory}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.storiesRow}
      />

      <FlatList
        data={TAGS}
        keyExtractor={(t) => t}
        renderItem={({ item, index }) => (
          <TouchableOpacity style={styles.tagChip} activeOpacity={0.7}>
            <LinearGradient
              colors={index % 2 === 0 ? ['rgba(124,58,237,0.18)', 'rgba(236,72,153,0.12)'] : ['rgba(6,182,212,0.15)', 'rgba(124,58,237,0.15)']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={styles.tagChipGrad}
            >
              <Text style={[styles.tagChipText, { color: index % 2 === 0 ? '#a78bfa' : '#22d3ee' }]}>{item}</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tagsRow2}
      />

      <TouchableOpacity style={styles.tryOnBanner} onPress={() => router.push('/tryon')} activeOpacity={0.9}>
        <LinearGradient colors={['#7c3aed', '#c026d3', '#ec4899']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.bannerGrad}>
          <View style={styles.bannerLeft}>
            <Text style={styles.bannerEmoji}>✨</Text>
            <View>
              <Text style={styles.bannerTitle}>AI Virtual Try-On</Text>
              <Text style={styles.bannerSub}>Upload photo • See yourself in any outfit</Text>
            </View>
          </View>
          <View style={styles.bannerBtn}>
            <Text style={styles.bannerBtnText}>Try Now</Text>
            <Ionicons name="arrow-forward" size={13} color="#fff" />
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <FlatList
          data={feedPosts}
          keyExtractor={(item) => item.id}
          renderItem={renderPost}
          ListHeaderComponent={ListHeader}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.feedContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#7c3aed" colors={['#7c3aed']} />
          }
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0f' },
  safeArea: { flex: 1 },
  appHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 18, paddingTop: 10, paddingBottom: 14,
  },
  appTitle: { color: '#f8fafc', fontSize: 20, fontWeight: '800', letterSpacing: -0.3 },
  appSubtitle: { color: '#475569', fontSize: 12, marginTop: 2 },
  appHeaderRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  headerIconBtn: { position: 'relative', padding: 2 },
  notifDot: {
    position: 'absolute', top: 0, right: 0,
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: '#ec4899', borderWidth: 1.5, borderColor: '#0a0a0f',
  },
  proBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20,
  },
  proText: { color: '#fff', fontSize: 11, fontWeight: '800' },
  storiesRow: { paddingHorizontal: 16, paddingBottom: 14, gap: 14 },
  storyItem: { alignItems: 'center', width: 64 },
  storyYouWrap: { position: 'relative' },
  storyRingGrad: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center', padding: 2.5 },
  storyImg: { width: 58, height: 58, borderRadius: 29, borderWidth: 2, borderColor: '#0a0a0f' },
  storyAddBtn: {
    position: 'absolute', bottom: 0, right: 0,
    width: 20, height: 20, borderRadius: 10,
    backgroundColor: '#7c3aed', alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: '#0a0a0f',
  },
  storyName: { color: '#64748b', fontSize: 11, marginTop: 5, textAlign: 'center', width: 64 },
  tagsRow2: { paddingHorizontal: 16, gap: 8, paddingBottom: 14 },
  tagChip: { borderRadius: 20, overflow: 'hidden' },
  tagChipGrad: {
    paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)',
  },
  tagChipText: { fontSize: 12, fontWeight: '600' },
  tryOnBanner: { marginHorizontal: 16, borderRadius: 20, overflow: 'hidden', marginBottom: 18 },
  bannerGrad: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 18 },
  bannerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  bannerEmoji: { fontSize: 28 },
  bannerTitle: { color: '#fff', fontSize: 16, fontWeight: '800' },
  bannerSub: { color: 'rgba(255,255,255,0.7)', fontSize: 12, marginTop: 2 },
  bannerBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: 'rgba(255,255,255,0.18)', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20,
  },
  bannerBtnText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  feedContent: { paddingBottom: 110 },
  postCard: { marginBottom: 1, backgroundColor: '#0f0f18' },
  postHeader: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 10 },
  postAvatar: { width: 40, height: 40, borderRadius: 20 },
  postUserInfo: { flex: 1 },
  postUserRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  postUserName: { color: '#f8fafc', fontSize: 14, fontWeight: '700' },
  aiTag: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    backgroundColor: 'rgba(124,58,237,0.12)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8,
  },
  aiTagText: { color: '#7c3aed', fontSize: 10, fontWeight: '700' },
  postTime: { color: '#475569', fontSize: 12, marginTop: 2 },
  moreBtn: { padding: 4 },
  postImage: { width, height: width * 1.05 },
  postFooter: { padding: 12 },
  postActions: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, marginRight: 14 },
  actionCount: { color: '#64748b', fontSize: 14, fontWeight: '600' },
  postCaption: { flexDirection: 'row', marginBottom: 6 },
  captionUser: { color: '#f8fafc', fontWeight: '700', fontSize: 13 },
  captionText: { color: '#94a3b8', fontSize: 13, flex: 1, lineHeight: 18 },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap' },
  tagText: { color: '#7c3aed', fontSize: 12, fontWeight: '600' },
});
