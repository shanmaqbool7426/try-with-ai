import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { GlassCard } from '@/components/GlassCard';
import { GradientButton } from '@/components/GradientButton';
import { useAppStore } from '@/store/useAppStore';

const { width } = Dimensions.get('window');
const GRID_SIZE = (width - 40) / 3;

const HISTORY_IMAGES = [
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300&q=80',
  'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=300&q=80',
  'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=300&q=80',
  'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=300&q=80',
  'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&q=80',
  'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&q=80',
];

const SETTINGS_MENU = [
  { icon: 'diamond-outline', label: 'Upgrade to Premium', sub: 'Unlock unlimited try-ons', route: '/screens/premium', gradient: true },
  { icon: 'person-outline', label: 'Edit Profile', sub: 'Update your info' },
  { icon: 'notifications-outline', label: 'Notifications', sub: 'Manage your alerts' },
  { icon: 'lock-closed-outline', label: 'Privacy & Security', sub: 'Control your data' },
  { icon: 'color-palette-outline', label: 'Appearance', sub: 'Dark mode settings' },
  { icon: 'help-circle-outline', label: 'Help & Support', sub: 'FAQ and contact us' },
  { icon: 'log-out-outline', label: 'Sign Out', sub: 'See you soon!', danger: true },
];

const ACHIEVEMENTS = [
  { icon: '🔥', label: 'Early Adopter', earned: true },
  { icon: '👗', label: '10 Try-Ons', earned: true },
  { icon: '💎', label: 'Style Icon', earned: false },
  { icon: '🌟', label: 'Trendsetter', earned: false },
];

export default function ProfileScreen() {
  const { user } = useAppStore();
  const [activeTab, setActiveTab] = useState<'tryons' | 'saved' | 'posts'>('tryons');

  if (!user) return null;

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerBg}>
          <LinearGradient
            colors={['rgba(139,92,246,0.4)', 'rgba(236,72,153,0.2)', 'transparent']}
            style={styles.headerGrad}
          />
        </View>

        <SafeAreaView edges={['top']}>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerBtn}>
              <Ionicons name="share-social-outline" size={20} color={Colors.text} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerBtn}>
              <Ionicons name="settings-outline" size={20} color={Colors.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.profileSection}>
            <View style={styles.avatarWrapper}>
              <LinearGradient colors={['#8b5cf6', '#ec4899']} style={styles.avatarRing}>
                <Image source={{ uri: user.avatar }} style={styles.avatar} />
              </LinearGradient>
              <TouchableOpacity style={styles.editAvatarBtn}>
                <Ionicons name="camera" size={14} color="#fff" />
              </TouchableOpacity>
            </View>

            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>

            {!user.isPremium && (
              <TouchableOpacity onPress={() => router.push('/screens/premium')} activeOpacity={0.85}>
                <LinearGradient colors={['#f59e0b', '#ec4899']} style={styles.premiumBanner}>
                  <Ionicons name="diamond" size={14} color="#fff" />
                  <Text style={styles.premiumBannerText}>Upgrade to Premium</Text>
                  <Ionicons name="chevron-forward" size={14} color="#fff" />
                </LinearGradient>
              </TouchableOpacity>
            )}

            <View style={styles.statsRow}>
              <View style={styles.stat}>
                <Text style={styles.statValue}>{user.tryOnsRemaining}</Text>
                <Text style={styles.statLabel}>Try-Ons Left</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.stat}>
                <Text style={styles.statValue}>{user.followers.toLocaleString()}</Text>
                <Text style={styles.statLabel}>Followers</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.stat}>
                <Text style={styles.statValue}>{user.following}</Text>
                <Text style={styles.statLabel}>Following</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.stat}>
                <Text style={styles.statValue}>{user.posts}</Text>
                <Text style={styles.statLabel}>Posts</Text>
              </View>
            </View>

            <View style={styles.actionBtns}>
              <TouchableOpacity style={styles.editProfileBtn}>
                <GlassCard style={styles.editProfileBtnInner}>
                  <Text style={styles.editProfileBtnText}>Edit Profile</Text>
                </GlassCard>
              </TouchableOpacity>
              <TouchableOpacity style={styles.shareBtn} onPress={() => router.push('/tryon')}>
                <LinearGradient colors={['#8b5cf6', '#ec4899']} style={styles.shareBtnGrad}>
                  <Ionicons name="shirt" size={16} color="#fff" />
                  <Text style={styles.shareBtnText}>Try On</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.achievementsSection}>
            <Text style={styles.sectionTitle}>Achievements</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {ACHIEVEMENTS.map((ach, i) => (
                <View key={i} style={[styles.achievement, !ach.earned && styles.achievementLocked]}>
                  <Text style={styles.achievementIcon}>{ach.icon}</Text>
                  <Text style={[styles.achievementLabel, !ach.earned && { color: Colors.textMuted }]}>
                    {ach.label}
                  </Text>
                  {!ach.earned && (
                    <View style={styles.achievementLock}>
                      <Ionicons name="lock-closed" size={10} color={Colors.textMuted} />
                    </View>
                  )}
                </View>
              ))}
            </ScrollView>
          </View>

          <View style={styles.galleryTabs}>
            {[
              { id: 'tryons', label: 'Try-Ons', icon: 'shirt-outline' },
              { id: 'saved', label: 'Saved', icon: 'bookmark-outline' },
              { id: 'posts', label: 'Posts', icon: 'grid-outline' },
            ].map((tab) => (
              <TouchableOpacity
                key={tab.id}
                style={[styles.galleryTab, activeTab === tab.id && styles.galleryTabActive]}
                onPress={() => setActiveTab(tab.id as any)}
              >
                <Ionicons
                  name={tab.icon as any}
                  size={18}
                  color={activeTab === tab.id ? Colors.primary : Colors.textMuted}
                />
                <Text style={[styles.galleryTabLabel, activeTab === tab.id && { color: Colors.primary }]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {HISTORY_IMAGES.length > 0 ? (
            <View style={styles.gallery}>
              {HISTORY_IMAGES.map((img, i) => (
                <TouchableOpacity key={i} style={styles.galleryItem} activeOpacity={0.9}>
                  <Image source={{ uri: img }} style={styles.galleryImage} />
                  <View style={styles.galleryItemOverlay}>
                    <Ionicons name="sparkles" size={14} color="rgba(255,255,255,0.8)" />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View style={styles.emptyGallery}>
              <Ionicons name="shirt-outline" size={48} color={Colors.textMuted} />
              <Text style={styles.emptyTitle}>No try-ons yet</Text>
              <Text style={styles.emptySub}>Start your AI fashion journey!</Text>
              <GradientButton title="Start Try-On" onPress={() => router.push('/tryon')} size="sm" style={{ marginTop: 16 }} />
            </View>
          )}

          <View style={styles.settingsSection}>
            <Text style={styles.sectionTitle}>Settings</Text>
            {SETTINGS_MENU.map((item, i) => (
              <TouchableOpacity
                key={i}
                onPress={() => {
                  if (item.route) router.push(item.route as any);
                }}
                activeOpacity={0.8}
              >
                <GlassCard style={[styles.settingItem, item.gradient && styles.settingItemGradient]} goldGlow={item.gradient}>
                  {item.gradient ? (
                    <LinearGradient colors={['rgba(245,158,11,0.15)', 'rgba(236,72,153,0.1)']} style={styles.settingItemGrad}>
                      <LinearGradient colors={['#f59e0b', '#ec4899']} style={styles.settingIcon}>
                        <Ionicons name={item.icon as any} size={18} color="#fff" />
                      </LinearGradient>
                      <View style={styles.settingInfo}>
                        <Text style={[styles.settingLabel, { color: Colors.goldLight }]}>{item.label}</Text>
                        <Text style={styles.settingSub}>{item.sub}</Text>
                      </View>
                      <Ionicons name="chevron-forward" size={16} color={Colors.gold} />
                    </LinearGradient>
                  ) : (
                    <View style={styles.settingItemInner}>
                      <View style={[styles.settingIcon, item.danger && { backgroundColor: 'rgba(239,68,68,0.15)' }]}>
                        <Ionicons
                          name={item.icon as any}
                          size={18}
                          color={item.danger ? Colors.error : Colors.primary}
                        />
                      </View>
                      <View style={styles.settingInfo}>
                        <Text style={[styles.settingLabel, item.danger && { color: Colors.error }]}>{item.label}</Text>
                        <Text style={styles.settingSub}>{item.sub}</Text>
                      </View>
                      <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
                    </View>
                  )}
                </GlassCard>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Try Clothes On Me v1.0.0</Text>
            <Text style={styles.footerSub}>Made with ✨ AI Magic</Text>
          </View>
        </SafeAreaView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scrollContent: { paddingBottom: 100 },
  headerBg: { position: 'absolute', top: 0, left: 0, right: 0, height: 250 },
  headerGrad: { flex: 1 },
  headerActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileSection: { alignItems: 'center', paddingHorizontal: 20 },
  avatarWrapper: { position: 'relative', marginBottom: 12 },
  avatarRing: { width: 96, height: 96, borderRadius: 48, padding: 3 },
  avatar: { width: 90, height: 90, borderRadius: 45 },
  editAvatarBtn: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.background,
  },
  userName: { color: Colors.text, fontSize: 22, fontWeight: '800', marginBottom: 2 },
  userEmail: { color: Colors.textSecondary, fontSize: 14, marginBottom: 14 },
  premiumBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 16,
  },
  premiumBannerText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 16,
    padding: 16,
    width: '100%',
    marginBottom: 16,
  },
  stat: { flex: 1, alignItems: 'center' },
  statValue: { color: Colors.text, fontSize: 18, fontWeight: '800' },
  statLabel: { color: Colors.textMuted, fontSize: 11, marginTop: 2 },
  statDivider: { width: 1, height: 32, backgroundColor: Colors.border },
  actionBtns: { flexDirection: 'row', gap: 12, width: '100%' },
  editProfileBtn: { flex: 1 },
  editProfileBtnInner: { padding: 10, alignItems: 'center' },
  editProfileBtnText: { color: Colors.text, fontWeight: '700', fontSize: 14 },
  shareBtn: { flex: 1, borderRadius: 14, overflow: 'hidden' },
  shareBtnGrad: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, padding: 10 },
  shareBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  achievementsSection: { paddingHorizontal: 20, marginTop: 20 },
  sectionTitle: { color: Colors.text, fontSize: 18, fontWeight: '700', marginBottom: 12 },
  achievement: {
    alignItems: 'center',
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 14,
    padding: 14,
    marginRight: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    width: 90,
    position: 'relative',
  },
  achievementLocked: { opacity: 0.4 },
  achievementIcon: { fontSize: 28, marginBottom: 6 },
  achievementLabel: { color: Colors.textSecondary, fontSize: 11, textAlign: 'center' },
  achievementLock: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 8,
    padding: 2,
  },
  galleryTabs: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 24,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    marginBottom: 2,
  },
  galleryTab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 12 },
  galleryTabActive: { borderBottomWidth: 2, borderBottomColor: Colors.primary },
  galleryTabLabel: { color: Colors.textMuted, fontSize: 13, fontWeight: '600' },
  gallery: { flexDirection: 'row', flexWrap: 'wrap', gap: 2, paddingHorizontal: 16, marginTop: 8 },
  galleryItem: { width: GRID_SIZE, height: GRID_SIZE, position: 'relative' },
  galleryImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  galleryItemOverlay: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 6,
    padding: 3,
  },
  emptyGallery: { alignItems: 'center', padding: 40 },
  emptyTitle: { color: Colors.text, fontSize: 18, fontWeight: '700', marginTop: 12 },
  emptySub: { color: Colors.textSecondary, fontSize: 14, marginTop: 4 },
  settingsSection: { paddingHorizontal: 20, marginTop: 24 },
  settingItem: { marginBottom: 10, overflow: 'hidden' },
  settingItemGradient: {},
  settingItemGrad: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 14 },
  settingItemInner: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 14 },
  settingIcon: {
    width: 38,
    height: 38,
    borderRadius: 11,
    backgroundColor: 'rgba(139,92,246,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingInfo: { flex: 1 },
  settingLabel: { color: Colors.text, fontSize: 14, fontWeight: '700' },
  settingSub: { color: Colors.textMuted, fontSize: 12, marginTop: 2 },
  footer: { alignItems: 'center', padding: 32 },
  footerText: { color: Colors.textMuted, fontSize: 12 },
  footerSub: { color: Colors.textMuted, fontSize: 11, marginTop: 4 },
});
