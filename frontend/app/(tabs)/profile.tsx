import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAppStore } from '@/store/useAppStore';

const { width } = Dimensions.get('window');
const GRID = (width - 4) / 3;

const GALLERY_IMAGES = [
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300&q=80',
  'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=300&q=80',
  'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=300&q=80',
  'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=300&q=80',
  'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&q=80',
  'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80',
  'https://images.unsplash.com/photo-1495385794356-15371f348c31?w=300&q=80',
  'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=300&q=80',
];

const SETTINGS_MENU = [
  { icon: 'diamond-outline', label: 'Upgrade to Premium', sub: 'Unlimited try-ons & HD output', route: '/screens/premium', isPremium: true },
  { icon: 'person-outline', label: 'Edit Profile', sub: 'Update your info' },
  { icon: 'notifications-outline', label: 'Notifications', sub: 'Manage alerts' },
  { icon: 'lock-closed-outline', label: 'Privacy & Security', sub: 'Your data controls' },
  { icon: 'help-circle-outline', label: 'Help & Support', sub: 'FAQ and contact' },
  { icon: 'log-out-outline', label: 'Sign Out', sub: 'See you soon!', isDanger: true },
];

const ACHIEVEMENTS = [
  { emoji: '🔥', label: 'Early Adopter', done: true },
  { emoji: '👗', label: '10 Try-Ons', done: true },
  { emoji: '💎', label: 'Style Icon', done: false },
  { emoji: '🌟', label: 'Trendsetter', done: false },
  { emoji: '🏆', label: 'Fashion Week', done: false },
];

export default function ProfileScreen() {
  const { user } = useAppStore();
  const [activeTab, setActiveTab] = useState<'tryons' | 'saved' | 'posts'>('tryons');

  if (!user) return null;

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.heroBg}>
          <LinearGradient colors={['rgba(124,58,237,0.45)', 'rgba(236,72,153,0.25)', 'transparent']} style={StyleSheet.absoluteFill} />
        </View>

        <SafeAreaView edges={['top']}>
          <View style={styles.topActions}>
            <TouchableOpacity style={styles.iconBtn}>
              <Ionicons name="share-social-outline" size={20} color="#f8fafc" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn}>
              <Ionicons name="settings-outline" size={20} color="#f8fafc" />
            </TouchableOpacity>
          </View>

          <View style={styles.profileSection}>
            <View style={styles.avatarWrap}>
              <LinearGradient colors={['#7c3aed', '#ec4899']} style={styles.avatarRing}>
                <Image source={{ uri: user.avatar }} style={styles.avatar} />
              </LinearGradient>
              <TouchableOpacity style={styles.editAvatarBtn}>
                <Ionicons name="camera" size={13} color="#fff" />
              </TouchableOpacity>
            </View>

            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userHandle}>@{user.name.toLowerCase().replace(' ', '_')}</Text>

            <TouchableOpacity onPress={() => router.push('/screens/premium')} activeOpacity={0.85}>
              <LinearGradient colors={['#f59e0b', '#ec4899']} style={styles.premiumBanner}>
                <Ionicons name="diamond" size={13} color="#fff" />
                <Text style={styles.premiumBannerText}>Upgrade to Premium</Text>
                <Ionicons name="arrow-forward" size={13} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.statsRow}>
              {[
                { label: 'Try-Ons', value: user.tryOnsRemaining },
                { label: 'Followers', value: user.followers.toLocaleString() },
                { label: 'Following', value: user.following },
                { label: 'Posts', value: user.posts },
              ].map((stat, i) => (
                <React.Fragment key={i}>
                  {i > 0 && <View style={styles.statDiv} />}
                  <View style={styles.stat}>
                    <Text style={styles.statVal}>{stat.value}</Text>
                    <Text style={styles.statLabel}>{stat.label}</Text>
                  </View>
                </React.Fragment>
              ))}
            </View>

            <View style={styles.profileBtns}>
              <TouchableOpacity style={styles.editProfileBtn}>
                <Text style={styles.editProfileTxt}>Edit Profile</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.tryOnProfileBtn} onPress={() => router.push('/tryon')}>
                <LinearGradient colors={['#7c3aed', '#ec4899']} style={styles.tryOnProfileGrad}>
                  <Ionicons name="shirt" size={15} color="#fff" />
                  <Text style={styles.tryOnProfileTxt}>Try On</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.achievementsSection}>
            <Text style={styles.sectionTitle}>Achievements</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.achievementsRow}>
              {ACHIEVEMENTS.map((ach, i) => (
                <View key={i} style={[styles.achCard, !ach.done && styles.achCardLocked]}>
                  <Text style={styles.achEmoji}>{ach.emoji}</Text>
                  <Text style={[styles.achLabel, !ach.done && { color: '#475569' }]}>{ach.label}</Text>
                  {!ach.done && (
                    <View style={styles.lockIcon}>
                      <Ionicons name="lock-closed" size={9} color="#475569" />
                    </View>
                  )}
                </View>
              ))}
            </ScrollView>
          </View>

          <View style={styles.gallerySection}>
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
                  <Ionicons name={tab.icon as any} size={18} color={activeTab === tab.id ? '#7c3aed' : '#475569'} />
                  <Text style={[styles.galleryTabTxt, activeTab === tab.id && { color: '#7c3aed' }]}>{tab.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.gallery}>
              {GALLERY_IMAGES.map((img, i) => (
                <TouchableOpacity key={i} style={styles.galleryItem} activeOpacity={0.9}>
                  <Image source={{ uri: img }} style={styles.galleryImg} />
                  {i < 3 && (
                    <View style={styles.galleryAiBadge}>
                      <Ionicons name="sparkles" size={11} color="#fff" />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.settingsSection}>
            <Text style={styles.sectionTitle}>Account</Text>
            {SETTINGS_MENU.map((item, i) => (
              <TouchableOpacity
                key={i}
                style={styles.settingRow}
                onPress={() => { if (item.route) router.push(item.route as any); }}
                activeOpacity={0.8}
              >
                {item.isPremium ? (
                  <LinearGradient colors={['rgba(245,158,11,0.15)', 'rgba(236,72,153,0.1)']} style={styles.settingRowInner}>
                    <LinearGradient colors={['#f59e0b', '#ec4899']} style={styles.settingIconWrap}>
                      <Ionicons name={item.icon as any} size={17} color="#fff" />
                    </LinearGradient>
                    <View style={styles.settingInfo}>
                      <Text style={[styles.settingLabel, { color: '#fbbf24' }]}>{item.label}</Text>
                      <Text style={styles.settingSub}>{item.sub}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={16} color="#f59e0b" />
                  </LinearGradient>
                ) : (
                  <View style={styles.settingRowInner}>
                    <View style={[styles.settingIconWrap, item.isDanger && { backgroundColor: 'rgba(239,68,68,0.12)' }]}>
                      <Ionicons name={item.icon as any} size={17} color={item.isDanger ? '#ef4444' : '#7c3aed'} />
                    </View>
                    <View style={styles.settingInfo}>
                      <Text style={[styles.settingLabel, item.isDanger && { color: '#ef4444' }]}>{item.label}</Text>
                      <Text style={styles.settingSub}>{item.sub}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={16} color="#475569" />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Try Clothes On Me • v1.0</Text>
            <Text style={styles.footerSub}>Made with AI ✨</Text>
          </View>
        </SafeAreaView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0f' },
  scroll: { paddingBottom: 110 },
  heroBg: { position: 'absolute', top: 0, left: 0, right: 0, height: 260 },
  topActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, paddingHorizontal: 18, paddingTop: 12, paddingBottom: 6 },
  iconBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.08)', alignItems: 'center', justifyContent: 'center' },
  profileSection: { alignItems: 'center', paddingHorizontal: 20, paddingBottom: 10 },
  avatarWrap: { position: 'relative', marginBottom: 12 },
  avatarRing: { width: 98, height: 98, borderRadius: 49, padding: 3 },
  avatar: { width: 92, height: 92, borderRadius: 46 },
  editAvatarBtn: {
    position: 'absolute', bottom: 2, right: 2,
    width: 27, height: 27, borderRadius: 14,
    backgroundColor: '#7c3aed', alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: '#0a0a0f',
  },
  userName: { color: '#f8fafc', fontSize: 22, fontWeight: '800', marginBottom: 2 },
  userHandle: { color: '#475569', fontSize: 14, marginBottom: 14 },
  premiumBanner: { flexDirection: 'row', alignItems: 'center', gap: 7, paddingHorizontal: 18, paddingVertical: 9, borderRadius: 20, marginBottom: 18 },
  premiumBannerText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  statsRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#12121a', borderRadius: 18, padding: 18, width: '100%', marginBottom: 16,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
  },
  stat: { flex: 1, alignItems: 'center' },
  statVal: { color: '#f8fafc', fontSize: 18, fontWeight: '800' },
  statLabel: { color: '#475569', fontSize: 11, marginTop: 3 },
  statDiv: { width: 1, height: 34, backgroundColor: 'rgba(255,255,255,0.07)' },
  profileBtns: { flexDirection: 'row', gap: 12, width: '100%' },
  editProfileBtn: {
    flex: 1, paddingVertical: 11, alignItems: 'center', borderRadius: 14,
    backgroundColor: '#16161f', borderWidth: 1, borderColor: 'rgba(255,255,255,0.09)',
  },
  editProfileTxt: { color: '#f8fafc', fontWeight: '700', fontSize: 14 },
  tryOnProfileBtn: { flex: 1, borderRadius: 14, overflow: 'hidden' },
  tryOnProfileGrad: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, paddingVertical: 11 },
  tryOnProfileTxt: { color: '#fff', fontWeight: '700', fontSize: 14 },
  achievementsSection: { paddingHorizontal: 18, marginTop: 22, marginBottom: 6 },
  sectionTitle: { color: '#f8fafc', fontSize: 17, fontWeight: '700', marginBottom: 14 },
  achievementsRow: { gap: 10, paddingBottom: 4 },
  achCard: {
    alignItems: 'center', backgroundColor: '#12121a', borderRadius: 16,
    padding: 14, width: 90, borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)',
    position: 'relative',
  },
  achCardLocked: { opacity: 0.45 },
  achEmoji: { fontSize: 28, marginBottom: 6 },
  achLabel: { color: '#94a3b8', fontSize: 11, textAlign: 'center', lineHeight: 14 },
  lockIcon: { position: 'absolute', top: 6, right: 6, backgroundColor: '#1a1a28', borderRadius: 6, padding: 2 },
  gallerySection: { marginTop: 22 },
  galleryTabs: {
    flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.07)',
    marginBottom: 2,
  },
  galleryTab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 12 },
  galleryTabActive: { borderBottomWidth: 2, borderBottomColor: '#7c3aed' },
  galleryTabTxt: { color: '#475569', fontSize: 13, fontWeight: '600' },
  gallery: { flexDirection: 'row', flexWrap: 'wrap', gap: 2 },
  galleryItem: { width: GRID, height: GRID, position: 'relative' },
  galleryImg: { width: '100%', height: '100%' },
  galleryAiBadge: {
    position: 'absolute', top: 6, right: 6,
    backgroundColor: 'rgba(124,58,237,0.85)', borderRadius: 8, padding: 4,
  },
  settingsSection: { paddingHorizontal: 18, marginTop: 26 },
  settingRow: { borderRadius: 16, overflow: 'hidden', marginBottom: 8, backgroundColor: '#12121a', borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },
  settingRowInner: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 14 },
  settingIconWrap: { width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(124,58,237,0.12)', alignItems: 'center', justifyContent: 'center' },
  settingInfo: { flex: 1 },
  settingLabel: { color: '#f8fafc', fontSize: 14, fontWeight: '700' },
  settingSub: { color: '#475569', fontSize: 12, marginTop: 2 },
  footer: { alignItems: 'center', paddingVertical: 30 },
  footerText: { color: '#475569', fontSize: 12 },
  footerSub: { color: '#475569', fontSize: 11, marginTop: 4 },
});
