import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Image,
  ScrollView, Share, Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';

const { width, height } = Dimensions.get('window');

const BG_OPTIONS = [
  { id: 'studio', label: 'Studio', emoji: '🎬' },
  { id: 'mall', label: 'Mall', emoji: '🏬' },
  { id: 'beach', label: 'Beach', emoji: '🏖️' },
  { id: 'wedding', label: 'Wedding', emoji: '💍' },
  { id: 'street', label: 'Street', emoji: '🌆' },
  { id: 'rooftop', label: 'Rooftop', emoji: '🌃' },
];

const AI_SCORES = [
  { label: 'Fit Accuracy', value: 97, color: '#10b981' },
  { label: 'Style Match', value: 94, color: '#7c3aed' },
  { label: 'Color Harmony', value: 91, color: '#06b6d4' },
  { label: 'Body Preservation', value: 98, color: '#f59e0b' },
];

export default function TryOnResultScreen() {
  const params = useLocalSearchParams<{ resultImage: string; clothingName: string; originalPhoto: string }>();
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [selectedBg, setSelectedBg] = useState('studio');
  const [view, setView] = useState<'result' | 'compare'>('result');

  const resultImage = params.resultImage || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=90';
  const clothingName = params.clothingName || 'Outfit';

  const handleShare = async () => {
    try {
      await Share.share({ message: `Check out my AI try-on with "${clothingName}" on Try Clothes On Me! ✨` });
    } catch {}
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color="#f8fafc" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Your AI Look</Text>
          <TouchableOpacity style={styles.headerBtn} onPress={handleShare}>
            <Ionicons name="share-social-outline" size={22} color="#f8fafc" />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
          <View style={styles.imageWrap}>
            <Image source={{ uri: resultImage }} style={styles.resultImage} />
            <LinearGradient colors={['transparent', 'rgba(10,10,15,0.7)']} style={styles.imgOverlay} pointerEvents="none" />

            <View style={styles.imgBadges}>
              <View style={styles.aiBadge}>
                <Ionicons name="sparkles" size={11} color="#fff" />
                <Text style={styles.aiBadgeText}>AI Generated</Text>
              </View>
              <View style={styles.hdBadge}>
                <Text style={styles.hdBadgeText}>HD</Text>
              </View>
            </View>

            <View style={styles.imgSideActions}>
              <TouchableOpacity style={[styles.sideActionBtn, liked && styles.sideActionBtnLiked]} onPress={() => setLiked(!liked)}>
                <Ionicons name={liked ? 'heart' : 'heart-outline'} size={24} color={liked ? '#ec4899' : '#fff'} />
                <Text style={styles.sideActionTxt}>Like</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.sideActionBtn, saved && styles.sideActionBtnSaved]} onPress={() => setSaved(!saved)}>
                <Ionicons name={saved ? 'bookmark' : 'bookmark-outline'} size={24} color={saved ? '#7c3aed' : '#fff'} />
                <Text style={styles.sideActionTxt}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.sideActionBtn} onPress={handleShare}>
                <Ionicons name="paper-plane-outline" size={22} color="#fff" />
                <Text style={styles.sideActionTxt}>Share</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.clothingName}>{clothingName}</Text>
              <View style={styles.ratingRow}>
                {[1,2,3,4,5].map(i => <Ionicons key={i} name="star" size={13} color="#f59e0b" />)}
                <Text style={styles.ratingTxt}>AI Score: 9.7/10</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.tryAgainBtn} onPress={() => router.back()}>
              <Ionicons name="refresh" size={16} color="#a78bfa" />
              <Text style={styles.tryAgainTxt}>Retry</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.viewToggle}>
            {['result', 'compare'].map((v) => (
              <TouchableOpacity
                key={v}
                style={[styles.viewBtn, view === v && styles.viewBtnActive]}
                onPress={() => setView(v as any)}
              >
                {view === v
                  ? <LinearGradient colors={['#7c3aed', '#ec4899']} style={styles.viewBtnGrad}>
                      <Text style={styles.viewBtnTxtActive}>{v === 'result' ? 'AI Result' : 'Before / After'}</Text>
                    </LinearGradient>
                  : <Text style={styles.viewBtnTxt}>{v === 'result' ? 'AI Result' : 'Before / After'}</Text>}
              </TouchableOpacity>
            ))}
          </View>

          {view === 'compare' && params.originalPhoto && (
            <View style={styles.compareRow}>
              <View style={styles.compareItem}>
                <Image source={{ uri: params.originalPhoto }} style={styles.compareImg} />
                <View style={styles.compareLabel}>
                  <Text style={styles.compareLabelTxt}>Original</Text>
                </View>
              </View>
              <View style={styles.compareArrow}>
                <LinearGradient colors={['#7c3aed', '#ec4899']} style={styles.compareArrowGrad}>
                  <Ionicons name="arrow-forward" size={16} color="#fff" />
                </LinearGradient>
              </View>
              <View style={styles.compareItem}>
                <Image source={{ uri: resultImage }} style={styles.compareImg} />
                <View style={[styles.compareLabel, { backgroundColor: '#7c3aed' }]}>
                  <Text style={styles.compareLabelTxt}>AI Try-On</Text>
                </View>
              </View>
            </View>
          )}

          <View style={styles.bgSection}>
            <Text style={styles.sectionLabel}>Change Background</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.bgRow}>
              {BG_OPTIONS.map((bg) => (
                <TouchableOpacity
                  key={bg.id}
                  style={[styles.bgChip, selectedBg === bg.id && styles.bgChipActive]}
                  onPress={() => setSelectedBg(bg.id)}
                >
                  <Text style={styles.bgEmoji}>{bg.emoji}</Text>
                  <Text style={[styles.bgLabel, selectedBg === bg.id && { color: '#a78bfa' }]}>{bg.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.scoresCard}>
            <Text style={styles.sectionLabel}>AI Analysis</Text>
            {AI_SCORES.map((score, i) => (
              <View key={i} style={styles.scoreRow}>
                <Text style={styles.scoreLabel}>{score.label}</Text>
                <View style={styles.scoreBg}>
                  <LinearGradient
                    colors={[score.color, `${score.color}80`]}
                    start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                    style={[styles.scoreFill, { width: `${score.value}%` as any }]}
                  />
                </View>
                <Text style={[styles.scoreVal, { color: score.color }]}>{score.value}%</Text>
              </View>
            ))}
          </View>

          <View style={styles.ctaSection}>
            <TouchableOpacity style={styles.postBtn} activeOpacity={0.9}>
              <LinearGradient colors={['#7c3aed', '#ec4899']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.postBtnGrad}>
                <Ionicons name="share-social" size={18} color="#fff" />
                <Text style={styles.postBtnTxt}>Post to Feed</Text>
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.secondaryRow}>
              <TouchableOpacity style={styles.secBtn} onPress={handleShare}>
                <View style={styles.secBtnInner}>
                  <Ionicons name="share-outline" size={20} color="#7c3aed" />
                  <Text style={styles.secBtnTxt}>Share</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.secBtn}>
                <View style={styles.secBtnInner}>
                  <Ionicons name="download-outline" size={20} color="#06b6d4" />
                  <Text style={[styles.secBtnTxt, { color: '#06b6d4' }]}>Save HD</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.secBtn} onPress={() => router.push('/screens/outfit-generator')}>
                <View style={styles.secBtnInner}>
                  <Ionicons name="sparkles-outline" size={20} color="#f59e0b" />
                  <Text style={[styles.secBtnTxt, { color: '#f59e0b' }]}>Generate</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0f' },
  safeArea: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 18, paddingVertical: 12,
  },
  headerBtn: {
    width: 42, height: 42, borderRadius: 13,
    backgroundColor: 'rgba(255,255,255,0.08)', alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: { color: '#f8fafc', fontSize: 18, fontWeight: '800' },
  scroll: { paddingBottom: 60 },
  imageWrap: { position: 'relative', marginHorizontal: 16, borderRadius: 24, overflow: 'hidden', marginBottom: 16 },
  resultImage: { width: '100%', height: height * 0.52 },
  imgOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 120 },
  imgBadges: { position: 'absolute', top: 14, left: 14, flexDirection: 'row', gap: 8 },
  aiBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(124,58,237,0.85)', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20,
  },
  aiBadgeText: { color: '#fff', fontSize: 11, fontWeight: '800' },
  hdBadge: { backgroundColor: 'rgba(245,158,11,0.85)', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  hdBadgeText: { color: '#fff', fontSize: 11, fontWeight: '800' },
  imgSideActions: { position: 'absolute', bottom: 16, right: 14, gap: 14 },
  sideActionBtn: {
    alignItems: 'center', width: 46, height: 54,
    backgroundColor: 'rgba(0,0,0,0.55)', borderRadius: 16, justifyContent: 'center',
  },
  sideActionBtnLiked: { backgroundColor: 'rgba(236,72,153,0.25)' },
  sideActionBtnSaved: { backgroundColor: 'rgba(124,58,237,0.25)' },
  sideActionTxt: { color: '#fff', fontSize: 10, fontWeight: '600', marginTop: 3 },
  infoRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 18, marginBottom: 16 },
  clothingName: { color: '#f8fafc', fontSize: 20, fontWeight: '800' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 5 },
  ratingTxt: { color: '#64748b', fontSize: 12, marginLeft: 6 },
  tryAgainBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: 'rgba(124,58,237,0.12)', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 14,
    borderWidth: 1, borderColor: 'rgba(124,58,237,0.25)',
  },
  tryAgainTxt: { color: '#a78bfa', fontWeight: '700', fontSize: 13 },
  viewToggle: {
    flexDirection: 'row', marginHorizontal: 16, backgroundColor: '#16161f',
    borderRadius: 14, padding: 4, marginBottom: 16,
  },
  viewBtn: { flex: 1, borderRadius: 10, overflow: 'hidden', alignItems: 'center', justifyContent: 'center', paddingVertical: 9 },
  viewBtnActive: { padding: 0 },
  viewBtnGrad: { flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center', paddingVertical: 9 },
  viewBtnTxt: { color: '#64748b', fontSize: 13, fontWeight: '600' },
  viewBtnTxtActive: { color: '#fff', fontSize: 13, fontWeight: '700' },
  compareRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, gap: 10, marginBottom: 16 },
  compareItem: { flex: 1, position: 'relative' },
  compareImg: { width: '100%', height: 200, borderRadius: 16 },
  compareArrow: { width: 36, height: 36, borderRadius: 18, overflow: 'hidden' },
  compareArrowGrad: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  compareLabel: {
    position: 'absolute', bottom: 8, left: 8,
    backgroundColor: 'rgba(0,0,0,0.65)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8,
  },
  compareLabelTxt: { color: '#fff', fontSize: 11, fontWeight: '700' },
  bgSection: { paddingHorizontal: 16, marginBottom: 20 },
  sectionLabel: { color: '#f8fafc', fontSize: 16, fontWeight: '700', marginBottom: 12 },
  bgRow: { gap: 8 },
  bgChip: {
    alignItems: 'center', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 14,
    backgroundColor: '#16161f', borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)',
  },
  bgChipActive: { borderColor: '#7c3aed', backgroundColor: 'rgba(124,58,237,0.12)' },
  bgEmoji: { fontSize: 20, marginBottom: 4 },
  bgLabel: { color: '#64748b', fontSize: 11, fontWeight: '600' },
  scoresCard: {
    marginHorizontal: 16, backgroundColor: '#12121a', borderRadius: 20,
    padding: 18, marginBottom: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
  },
  scoreRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  scoreLabel: { color: '#94a3b8', fontSize: 13, width: 130 },
  scoreBg: { flex: 1, height: 7, backgroundColor: '#1a1a28', borderRadius: 4, overflow: 'hidden' },
  scoreFill: { height: '100%', borderRadius: 4 },
  scoreVal: { fontSize: 13, fontWeight: '800', width: 38, textAlign: 'right' },
  ctaSection: { paddingHorizontal: 16, gap: 12 },
  postBtn: { borderRadius: 18, overflow: 'hidden' },
  postBtnGrad: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 17 },
  postBtnTxt: { color: '#fff', fontSize: 16, fontWeight: '800' },
  secondaryRow: { flexDirection: 'row', gap: 10 },
  secBtn: { flex: 1, borderRadius: 14, overflow: 'hidden' },
  secBtnInner: {
    backgroundColor: '#12121a', padding: 13, alignItems: 'center', gap: 5,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', borderRadius: 14,
  },
  secBtnTxt: { color: '#64748b', fontSize: 12, fontWeight: '600' },
});
