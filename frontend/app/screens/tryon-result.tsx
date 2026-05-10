import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Share,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { GlassCard } from '@/components/GlassCard';
import { GradientButton } from '@/components/GradientButton';

const { width, height } = Dimensions.get('window');

const BG_OPTIONS = [
  { id: 'studio', label: 'Studio', emoji: '🎬' },
  { id: 'mall', label: 'Mall', emoji: '🏬' },
  { id: 'beach', label: 'Beach', emoji: '🏖️' },
  { id: 'street', label: 'Street', emoji: '🌆' },
];

export default function TryOnResultScreen() {
  const params = useLocalSearchParams<{
    resultImage: string;
    clothingName: string;
    originalPhoto: string;
  }>();

  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [selectedBg, setSelectedBg] = useState('studio');
  const [view, setView] = useState<'result' | 'compare'>('result');

  const resultImage = params.resultImage || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80';
  const clothingName = params.clothingName || 'Outfit';

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out my AI virtual try-on with "${clothingName}" on Try Clothes On Me! ✨`,
        url: resultImage,
      });
    } catch (e) {}
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['rgba(139,92,246,0.2)', 'transparent']}
        style={styles.bgGrad}
        pointerEvents="none"
      />

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
            <Ionicons name="close" size={22} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Your AI Look ✨</Text>
          <TouchableOpacity style={styles.shareBtn} onPress={handleShare}>
            <Ionicons name="share-social-outline" size={22} color={Colors.text} />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={styles.imageContainer}>
            <Image source={{ uri: resultImage }} style={styles.resultImage} resizeMode="cover" />

            <LinearGradient
              colors={['transparent', 'rgba(10,10,15,0.8)']}
              style={styles.imageOverlay}
              pointerEvents="none"
            />

            <View style={styles.imageBadges}>
              <View style={styles.aiBadge}>
                <Ionicons name="sparkles" size={12} color="#fff" />
                <Text style={styles.aiBadgeText}>AI Generated</Text>
              </View>
              <View style={styles.hdBadge}>
                <Text style={styles.hdBadgeText}>HD</Text>
              </View>
            </View>

            <View style={styles.imageActions}>
              <TouchableOpacity
                style={[styles.imageAction, liked && styles.imageActionActive]}
                onPress={() => setLiked(!liked)}
              >
                <Ionicons name={liked ? 'heart' : 'heart-outline'} size={22} color={liked ? Colors.accent : '#fff'} />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.imageAction, saved && styles.imageActionSaved]}
                onPress={() => setSaved(!saved)}
              >
                <Ionicons name={saved ? 'bookmark' : 'bookmark-outline'} size={22} color={saved ? Colors.primary : '#fff'} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.clothingInfo}>
            <Text style={styles.clothingName}>{clothingName}</Text>
            <View style={styles.ratingRow}>
              {[1, 2, 3, 4, 5].map((i) => (
                <Ionicons key={i} name="star" size={14} color={Colors.gold} />
              ))}
              <Text style={styles.ratingText}>AI Quality Score: 9.8/10</Text>
            </View>
          </View>

          <View style={styles.viewToggle}>
            {['result', 'compare'].map((v) => (
              <TouchableOpacity
                key={v}
                style={[styles.viewBtn, view === v && styles.viewBtnActive]}
                onPress={() => setView(v as any)}
              >
                {view === v ? (
                  <LinearGradient colors={['#8b5cf6', '#ec4899']} style={styles.viewBtnGrad}>
                    <Text style={styles.viewBtnTextActive}>{v === 'result' ? 'AI Result' : 'Before/After'}</Text>
                  </LinearGradient>
                ) : (
                  <Text style={styles.viewBtnText}>{v === 'result' ? 'AI Result' : 'Before/After'}</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>

          {view === 'compare' && params.originalPhoto && (
            <View style={styles.compareRow}>
              <View style={styles.compareItem}>
                <Image source={{ uri: params.originalPhoto }} style={styles.compareImage} />
                <View style={styles.compareLabel}>
                  <Text style={styles.compareLabelText}>Before</Text>
                </View>
              </View>
              <View style={styles.compareArrow}>
                <LinearGradient colors={['#8b5cf6', '#ec4899']} style={styles.compareArrowGrad}>
                  <Ionicons name="arrow-forward" size={18} color="#fff" />
                </LinearGradient>
              </View>
              <View style={styles.compareItem}>
                <Image source={{ uri: resultImage }} style={styles.compareImage} />
                <View style={[styles.compareLabel, { backgroundColor: Colors.primary }]}>
                  <Text style={styles.compareLabelText}>After AI</Text>
                </View>
              </View>
            </View>
          )}

          <View style={styles.bgSection}>
            <Text style={styles.sectionTitle}>Change Background</Text>
            <View style={styles.bgOptions}>
              {BG_OPTIONS.map((bg) => (
                <TouchableOpacity
                  key={bg.id}
                  style={[styles.bgOption, selectedBg === bg.id && styles.bgOptionActive]}
                  onPress={() => setSelectedBg(bg.id)}
                >
                  <Text style={styles.bgEmoji}>{bg.emoji}</Text>
                  <Text style={[styles.bgLabel, selectedBg === bg.id && { color: Colors.primaryLight }]}>
                    {bg.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <GlassCard style={styles.statsCard}>
            <Text style={styles.statsTitle}>AI Analysis</Text>
            <View style={styles.statsList}>
              {[
                { label: 'Fit Score', value: '97%', color: Colors.success },
                { label: 'Style Match', value: '94%', color: Colors.primary },
                { label: 'Color Harmony', value: '91%', color: Colors.cyan },
                { label: 'Body Shape Fit', value: '98%', color: Colors.gold },
              ].map((stat, i) => (
                <View key={i} style={styles.statRow}>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                  <View style={styles.statBar}>
                    <LinearGradient
                      colors={[stat.color, `${stat.color}80`]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={[styles.statBarFill, { width: stat.value }]}
                    />
                  </View>
                  <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
                </View>
              ))}
            </View>
          </GlassCard>

          <View style={styles.actionsSection}>
            <GradientButton
              title="Post to Feed 🔥"
              onPress={() => router.back()}
              size="lg"
            />
            <View style={styles.secondaryActions}>
              <TouchableOpacity style={styles.secondaryBtn} onPress={handleShare}>
                <GlassCard style={styles.secondaryBtnInner}>
                  <Ionicons name="share-social" size={20} color={Colors.primary} />
                  <Text style={styles.secondaryBtnText}>Share</Text>
                </GlassCard>
              </TouchableOpacity>
              <TouchableOpacity style={styles.secondaryBtn}>
                <GlassCard style={styles.secondaryBtnInner}>
                  <Ionicons name="download" size={20} color={Colors.cyan} />
                  <Text style={[styles.secondaryBtnText, { color: Colors.cyan }]}>Save HD</Text>
                </GlassCard>
              </TouchableOpacity>
              <TouchableOpacity style={styles.secondaryBtn} onPress={() => router.back()}>
                <GlassCard style={styles.secondaryBtnInner}>
                  <Ionicons name="refresh" size={20} color={Colors.textSecondary} />
                  <Text style={styles.secondaryBtnText}>Retry</Text>
                </GlassCard>
              </TouchableOpacity>
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
    paddingVertical: 12,
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { color: Colors.text, fontSize: 18, fontWeight: '800' },
  shareBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: { paddingBottom: 60 },
  imageContainer: { position: 'relative', marginHorizontal: 16, borderRadius: 24, overflow: 'hidden' },
  resultImage: { width: '100%', height: 420, resizeMode: 'cover' },
  imageOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 120 },
  imageBadges: { position: 'absolute', top: 12, left: 12, flexDirection: 'row', gap: 8 },
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(139,92,246,0.8)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  aiBadgeText: { color: '#fff', fontSize: 11, fontWeight: '800' },
  hdBadge: {
    backgroundColor: 'rgba(245,158,11,0.8)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  hdBadgeText: { color: '#fff', fontSize: 11, fontWeight: '800' },
  imageActions: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    gap: 10,
  },
  imageAction: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageActionActive: { backgroundColor: 'rgba(236,72,153,0.3)' },
  imageActionSaved: { backgroundColor: 'rgba(139,92,246,0.3)' },
  clothingInfo: { paddingHorizontal: 20, paddingVertical: 14 },
  clothingName: { color: Colors.text, fontSize: 22, fontWeight: '800' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 },
  ratingText: { color: Colors.textSecondary, fontSize: 12, marginLeft: 6 },
  viewToggle: {
    flexDirection: 'row',
    marginHorizontal: 16,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 14,
    padding: 4,
    marginBottom: 16,
  },
  viewBtn: { flex: 1, borderRadius: 10, overflow: 'hidden', alignItems: 'center', justifyContent: 'center', paddingVertical: 8 },
  viewBtnActive: { padding: 0 },
  viewBtnGrad: { flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center', paddingVertical: 8 },
  viewBtnText: { color: Colors.textSecondary, fontSize: 13, fontWeight: '600' },
  viewBtnTextActive: { color: '#fff', fontSize: 13, fontWeight: '700' },
  compareRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, gap: 10, marginBottom: 16 },
  compareItem: { flex: 1, position: 'relative' },
  compareImage: { width: '100%', height: 200, borderRadius: 16, resizeMode: 'cover' },
  compareArrow: { width: 36, height: 36, borderRadius: 18, overflow: 'hidden' },
  compareArrowGrad: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  compareLabel: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  compareLabelText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  bgSection: { paddingHorizontal: 16, marginBottom: 16 },
  sectionTitle: { color: Colors.text, fontSize: 16, fontWeight: '700', marginBottom: 12 },
  bgOptions: { flexDirection: 'row', gap: 10 },
  bgOption: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  bgOptionActive: { borderColor: Colors.primary, backgroundColor: 'rgba(139,92,246,0.12)' },
  bgEmoji: { fontSize: 20, marginBottom: 4 },
  bgLabel: { color: Colors.textSecondary, fontSize: 11, fontWeight: '600' },
  statsCard: { marginHorizontal: 16, padding: 16, marginBottom: 20 },
  statsTitle: { color: Colors.text, fontWeight: '700', marginBottom: 14 },
  statsList: { gap: 12 },
  statRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  statLabel: { color: Colors.textSecondary, fontSize: 13, width: 110 },
  statBar: { flex: 1, height: 6, backgroundColor: Colors.surfaceElevated, borderRadius: 3, overflow: 'hidden' },
  statBarFill: { height: '100%', borderRadius: 3 },
  statValue: { fontSize: 13, fontWeight: '700', width: 40, textAlign: 'right' },
  actionsSection: { paddingHorizontal: 16, gap: 12 },
  secondaryActions: { flexDirection: 'row', gap: 10 },
  secondaryBtn: { flex: 1 },
  secondaryBtnInner: { padding: 12, alignItems: 'center', gap: 4 },
  secondaryBtnText: { color: Colors.textSecondary, fontSize: 12, fontWeight: '600' },
});
