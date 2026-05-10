import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { GlassCard } from '@/components/GlassCard';
import { useAppStore } from '@/store/useAppStore';

const { width } = Dimensions.get('window');

const MOCK_COMMENTS = [
  { id: '1', user: 'Sofia', avatar: 'https://i.pravatar.cc/150?img=5', text: 'This is absolutely stunning! 😍 What AI model did you use?', time: '2h ago', likes: 24 },
  { id: '2', user: 'James', avatar: 'https://i.pravatar.cc/150?img=12', text: 'The fabric texture looks so realistic! Love this 🔥', time: '1h ago', likes: 18 },
  { id: '3', user: 'Mia', avatar: 'https://i.pravatar.cc/150?img=9', text: 'Obsessed with the color palette here ✨', time: '45m ago', likes: 12 },
];

export default function PostDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { feedPosts, togglePostLike, togglePostSave } = useAppStore();
  const [comment, setComment] = useState('');

  const post = feedPosts.find((p) => p.id === id) || feedPosts[0];
  if (!post) return null;

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Post</Text>
          <TouchableOpacity style={styles.moreBtn}>
            <Ionicons name="ellipsis-horizontal" size={22} color={Colors.text} />
          </TouchableOpacity>
        </View>

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={80}
        >
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            <View style={styles.postHeader}>
              <Image source={{ uri: post.userAvatar }} style={styles.avatar} />
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{post.userName}</Text>
                <Text style={styles.postTime}>2 hours ago</Text>
              </View>
              <TouchableOpacity style={styles.followBtn}>
                <LinearGradient colors={['#8b5cf6', '#ec4899']} style={styles.followBtnGrad}>
                  <Text style={styles.followBtnText}>Follow</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            <Image source={{ uri: post.image }} style={styles.postImage} resizeMode="cover" />

            <View style={styles.actions}>
              <TouchableOpacity style={styles.action} onPress={() => togglePostLike(post.id)}>
                <Ionicons
                  name={post.isLiked ? 'heart' : 'heart-outline'}
                  size={26}
                  color={post.isLiked ? Colors.accent : Colors.text}
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.action}>
                <Ionicons name="chatbubble-outline" size={24} color={Colors.text} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.action}>
                <Ionicons name="share-social-outline" size={24} color={Colors.text} />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.action, { marginLeft: 'auto' }]} onPress={() => togglePostSave(post.id)}>
                <Ionicons
                  name={post.isSaved ? 'bookmark' : 'bookmark-outline'}
                  size={24}
                  color={post.isSaved ? Colors.primary : Colors.text}
                />
              </TouchableOpacity>
            </View>

            <Text style={styles.likesText}>{post.likes.toLocaleString()} likes</Text>

            <View style={styles.captionSection}>
              <Text style={styles.captionUser}>{post.userName} </Text>
              <Text style={styles.captionText}>{post.caption}</Text>
            </View>

            <View style={styles.tagsSection}>
              {post.tags.map((tag, i) => (
                <TouchableOpacity key={i} style={styles.tag}>
                  <Text style={styles.tagText}>#{tag}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.commentsSection}>
              <Text style={styles.commentsTitle}>{post.comments} Comments</Text>
              {MOCK_COMMENTS.map((c) => (
                <View key={c.id} style={styles.comment}>
                  <Image source={{ uri: c.avatar }} style={styles.commentAvatar} />
                  <View style={styles.commentContent}>
                    <GlassCard style={styles.commentBubble}>
                      <Text style={styles.commentUser}>{c.user}</Text>
                      <Text style={styles.commentText}>{c.text}</Text>
                    </GlassCard>
                    <View style={styles.commentMeta}>
                      <Text style={styles.commentTime}>{c.time}</Text>
                      <TouchableOpacity style={styles.commentLike}>
                        <Ionicons name="heart-outline" size={12} color={Colors.textMuted} />
                        <Text style={styles.commentLikes}>{c.likes}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity>
                        <Text style={styles.commentReply}>Reply</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>

          <View style={styles.commentInput}>
            <Image source={{ uri: 'https://i.pravatar.cc/150?img=11' }} style={styles.commentInputAvatar} />
            <TextInput
              style={styles.input}
              value={comment}
              onChangeText={setComment}
              placeholder="Add a comment..."
              placeholderTextColor={Colors.textMuted}
            />
            <TouchableOpacity disabled={!comment.trim()}>
              <Text style={[styles.postBtn, comment.trim() && { color: Colors.primary }]}>Post</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  safeArea: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { color: Colors.text, fontSize: 17, fontWeight: '800' },
  moreBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  scrollContent: { paddingBottom: 20 },
  postHeader: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 10 },
  avatar: { width: 42, height: 42, borderRadius: 21 },
  userInfo: { flex: 1 },
  userName: { color: Colors.text, fontWeight: '700', fontSize: 14 },
  postTime: { color: Colors.textMuted, fontSize: 12 },
  followBtn: { borderRadius: 12, overflow: 'hidden' },
  followBtnGrad: { paddingHorizontal: 14, paddingVertical: 6 },
  followBtnText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  postImage: { width, height: width },
  actions: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 14 },
  action: { padding: 2 },
  likesText: { paddingHorizontal: 14, color: Colors.text, fontWeight: '700', fontSize: 14 },
  captionSection: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 14, paddingTop: 6 },
  captionUser: { color: Colors.text, fontWeight: '700', fontSize: 13 },
  captionText: { color: Colors.textSecondary, fontSize: 13 },
  tagsSection: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingHorizontal: 14, paddingTop: 8 },
  tag: {
    backgroundColor: 'rgba(139,92,246,0.12)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(139,92,246,0.2)',
  },
  tagText: { color: Colors.primaryLight, fontSize: 12 },
  commentsSection: { paddingHorizontal: 14, paddingTop: 16 },
  commentsTitle: { color: Colors.text, fontWeight: '700', fontSize: 15, marginBottom: 14 },
  comment: { flexDirection: 'row', gap: 10, marginBottom: 14 },
  commentAvatar: { width: 36, height: 36, borderRadius: 18, flexShrink: 0 },
  commentContent: { flex: 1 },
  commentBubble: { padding: 10 },
  commentUser: { color: Colors.text, fontWeight: '700', fontSize: 13 },
  commentText: { color: Colors.textSecondary, fontSize: 13, marginTop: 2 },
  commentMeta: { flexDirection: 'row', alignItems: 'center', gap: 14, marginTop: 6, paddingHorizontal: 2 },
  commentTime: { color: Colors.textMuted, fontSize: 11 },
  commentLike: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  commentLikes: { color: Colors.textMuted, fontSize: 11 },
  commentReply: { color: Colors.textMuted, fontSize: 11, fontWeight: '600' },
  commentInput: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.background,
  },
  commentInputAvatar: { width: 34, height: 34, borderRadius: 17 },
  input: {
    flex: 1,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    color: Colors.text,
    fontSize: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  postBtn: { color: Colors.textMuted, fontWeight: '700', fontSize: 14 },
});
