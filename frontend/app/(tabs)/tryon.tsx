import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { useAppStore } from '@/store/useAppStore';

const { width } = Dimensions.get('window');

const CLOTHING_CATALOG = [
  { id: '1', name: 'Luxury Blazer', category: 'Formal', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80', price: '$129' },
  { id: '2', name: 'White Dress', category: 'Casual', image: 'https://images.unsplash.com/photo-1495385794356-15371f348c31?w=300&q=80', price: '$89' },
  { id: '3', name: 'Evening Gown', category: 'Luxury', image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=300&q=80', price: '$349' },
  { id: '4', name: 'Navy Suit', category: 'Formal', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&q=80', price: '$249' },
  { id: '5', name: 'Floral Sundress', category: 'Casual', image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=300&q=80', price: '$75' },
  { id: '6', name: 'Leather Jacket', category: 'Street', image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&q=80', price: '$199' },
  { id: '7', name: 'Bridal Wear', category: 'Wedding', image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=300&q=80', price: '$599' },
  { id: '8', name: 'Shalwar Kameez', category: 'Eastern', image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=300&q=80', price: '$119' },
];

const CATEGORIES_FILTER = ['All', 'Formal', 'Casual', 'Luxury', 'Street', 'Eastern', 'Wedding'];

type Step = 'upload' | 'clothing' | 'processing';

export default function TryOnScreen() {
  const { setProcessing, addTryOnResult } = useAppStore();
  const [step, setStep] = useState<Step>('upload');
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [selectedClothingId, setSelectedClothingId] = useState<string | null>(null);
  const [selectedClothing, setSelectedClothing] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [progressMsg, setProgressMsg] = useState('');
  const [catFilter, setCatFilter] = useState('All');

  const pickUserPhoto = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please allow photo access to use try-on.');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [3, 4],
        quality: 0.9,
      });
      if (!result.canceled && result.assets[0]) {
        setUserPhoto(result.assets[0].uri);
        setStep('clothing');
      }
    } catch {
      Alert.alert('Error', 'Failed to pick image.');
    }
  };

  const pickClothingPhoto = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.9,
      });
      if (!result.canceled && result.assets[0]) {
        setSelectedClothing(result.assets[0].uri);
        setSelectedClothingId('custom');
      }
    } catch {}
  };

  const startTryOn = async () => {
    if (!userPhoto || !selectedClothing) return;
    setStep('processing');
    setProgress(0);
    setProcessing(true);

    const steps = [
      { msg: 'Analyzing body shape & pose...', pct: 20 },
      { msg: 'Detecting proportions...', pct: 40 },
      { msg: 'Fitting clothing realistically...', pct: 60 },
      { msg: 'Adding fabric texture & shadows...', pct: 80 },
      { msg: 'Rendering HD output...', pct: 100 },
    ];
    for (const s of steps) {
      setProgressMsg(s.msg);
      await new Promise((r) => setTimeout(r, 750));
      setProgress(s.pct);
    }
    await new Promise((r) => setTimeout(r, 400));

    const mockResults = [
      'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=90',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=90',
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=90',
    ];

    const clothingName = selectedClothingId === 'custom'
      ? 'Custom Upload'
      : CLOTHING_CATALOG.find(c => c.id === selectedClothingId)?.name || 'Outfit';

    const result = {
      id: Date.now().toString(),
      originalPhoto: userPhoto,
      clothingImage: selectedClothing,
      resultImage: mockResults[Math.floor(Math.random() * mockResults.length)],
      timestamp: Date.now(),
      clothingName,
      liked: false,
    };

    addTryOnResult(result);
    setProcessing(false);

    router.push({
      pathname: '/screens/tryon-result',
      params: { resultImage: result.resultImage, clothingName, originalPhoto: userPhoto },
    });

    setTimeout(() => {
      setStep('upload');
      setUserPhoto(null);
      setSelectedClothing(null);
      setSelectedClothingId(null);
      setProgress(0);
    }, 300);
  };

  const filteredCatalog = catFilter === 'All'
    ? CLOTHING_CATALOG
    : CLOTHING_CATALOG.filter(c => c.category === catFilter);

  if (step === 'processing') {
    return (
      <View style={styles.container}>
        <LinearGradient colors={['#1a0a2e', '#0d0d1f', '#0a0a0f']} style={StyleSheet.absoluteFill} />
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.processingWrap}>
            <View style={styles.processingOrb}>
              <LinearGradient colors={['#7c3aed', '#ec4899']} style={styles.orbInner}>
                <Ionicons name="shirt" size={44} color="#fff" />
              </LinearGradient>
              <View style={styles.orbRing1} />
              <View style={styles.orbRing2} />
            </View>
            <Text style={styles.processingTitle}>AI Magic Happening</Text>
            <Text style={styles.processingMsg}>{progressMsg}</Text>
            <View style={styles.progressWrap}>
              <View style={styles.progressBg}>
                <LinearGradient
                  colors={['#7c3aed', '#ec4899']}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                  style={[styles.progressFill, { width: `${progress}%` as any }]}
                />
              </View>
              <Text style={styles.progressPct}>{progress}%</Text>
            </View>
            <View style={styles.processingSteps}>
              {['Body Analysis', 'AI Fitting', 'HD Render'].map((s, i) => {
                const done = progress > i * 33;
                return (
                  <View key={i} style={styles.pStep}>
                    <View style={[styles.pStepDot, done && styles.pStepDotDone]}>
                      {done
                        ? <Ionicons name="checkmark" size={12} color="#fff" />
                        : <View style={styles.pStepInner} />}
                    </View>
                    <Text style={[styles.pStepText, done && { color: '#10b981' }]}>{s}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={['rgba(124,58,237,0.12)', 'transparent']} style={styles.bgGrad} pointerEvents="none" />
      <SafeAreaView style={styles.safeArea} edges={['top']}>

        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Virtual Try-On</Text>
            <Text style={styles.headerSub}>See yourself in any outfit instantly</Text>
          </View>
          <TouchableOpacity style={styles.arBtn} onPress={() => router.push('/screens/ar-tryon')}>
            <LinearGradient colors={['#7c3aed', '#ec4899']} style={styles.arBtnGrad}>
              <Ionicons name="videocam" size={16} color="#fff" />
              <Text style={styles.arBtnText}>LIVE AR</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View style={styles.stepBar}>
          {['Your Photo', 'Pick Outfit', 'Generate'].map((label, i) => {
            const stepIdx = step === 'upload' ? 0 : step === 'clothing' ? 1 : 2;
            const active = i === stepIdx;
            const done = i < stepIdx;
            return (
              <React.Fragment key={i}>
                <View style={styles.stepItem}>
                  <View style={[styles.stepCircle, active && styles.stepCircleActive, done && styles.stepCircleDone]}>
                    {done
                      ? <Ionicons name="checkmark" size={13} color="#fff" />
                      : <Text style={[styles.stepNum, active && { color: '#fff' }]}>{i + 1}</Text>}
                  </View>
                  <Text style={[styles.stepLabel, active && { color: '#a78bfa' }, done && { color: '#10b981' }]}>{label}</Text>
                </View>
                {i < 2 && <View style={[styles.stepLine, done && styles.stepLineDone]} />}
              </React.Fragment>
            );
          })}
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
          {step === 'upload' && (
            <View style={styles.section}>
              <TouchableOpacity style={styles.uploadBox} onPress={pickUserPhoto} activeOpacity={0.85}>
                <LinearGradient
                  colors={['rgba(124,58,237,0.1)', 'rgba(236,72,153,0.06)']}
                  style={styles.uploadBoxInner}
                >
                  <LinearGradient colors={['#7c3aed', '#ec4899']} style={styles.uploadIcon}>
                    <Ionicons name="person-add" size={30} color="#fff" />
                  </LinearGradient>
                  <Text style={styles.uploadTitle}>Upload Your Photo</Text>
                  <Text style={styles.uploadSub}>Full body photo works best for accurate results</Text>
                  <View style={styles.uploadTips}>
                    {['Good lighting', 'Clear background', 'Front facing'].map((tip, i) => (
                      <View key={i} style={styles.uploadTip}>
                        <Ionicons name="checkmark-circle" size={13} color="#10b981" />
                        <Text style={styles.uploadTipText}>{tip}</Text>
                      </View>
                    ))}
                  </View>
                  <View style={styles.uploadBtn}>
                    <Text style={styles.uploadBtnText}>Choose Photo</Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>

              <View style={styles.dividerRow}>
                <View style={styles.divider} />
                <Text style={styles.dividerText}>OR</Text>
                <View style={styles.divider} />
              </View>

              <TouchableOpacity style={styles.liveArCard} onPress={() => router.push('/screens/ar-tryon')} activeOpacity={0.85}>
                <View style={styles.liveArLeft}>
                  <LinearGradient colors={['#7c3aed', '#ec4899']} style={styles.liveArIcon}>
                    <Ionicons name="videocam" size={20} color="#fff" />
                  </LinearGradient>
                  <View>
                    <Text style={styles.liveArTitle}>Live AR Try-On</Text>
                    <Text style={styles.liveArSub}>Real-time camera • Body tracking</Text>
                  </View>
                </View>
                <View style={styles.liveBadge}>
                  <View style={styles.liveDot} />
                  <Text style={styles.liveText}>LIVE</Text>
                </View>
              </TouchableOpacity>

              <View style={styles.clothingTypesSection}>
                <Text style={styles.clothingTypesTitle}>Supports All Clothing Types</Text>
                <View style={styles.clothingTypeGrid}>
                  {[
                    { icon: '👔', label: 'Shirts & Suits' },
                    { icon: '👗', label: 'Dresses' },
                    { icon: '🥻', label: 'Shalwar Kameez' },
                    { icon: '🧕', label: 'Hijab & Abaya' },
                    { icon: '👠', label: 'Shoes' },
                    { icon: '💍', label: 'Jewelry' },
                    { icon: '🧥', label: 'Coats' },
                    { icon: '👰', label: 'Bridal Wear' },
                  ].map((item, i) => (
                    <View key={i} style={styles.clothingTypeItem}>
                      <Text style={styles.clothingTypeEmoji}>{item.icon}</Text>
                      <Text style={styles.clothingTypeLabel}>{item.label}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          )}

          {step === 'clothing' && (
            <View style={styles.section}>
              <View style={styles.photoPreviewBar}>
                <Image source={{ uri: userPhoto! }} style={styles.photoThumb} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.photoPreviewLabel}>Your photo selected</Text>
                  <Text style={styles.photoPreviewSub}>Now pick an outfit to try on</Text>
                </View>
                <TouchableOpacity onPress={() => setStep('upload')}>
                  <Text style={styles.changeBtn}>Change</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.uploadClothBtn} onPress={pickClothingPhoto} activeOpacity={0.85}>
                <LinearGradient colors={['rgba(124,58,237,0.15)', 'rgba(236,72,153,0.1)']} style={styles.uploadClothInner}>
                  <LinearGradient colors={['#7c3aed', '#ec4899']} style={styles.uploadClothIcon}>
                    <Ionicons name="cloud-upload" size={18} color="#fff" />
                  </LinearGradient>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.uploadClothTitle}>Upload Clothing Image</Text>
                    <Text style={styles.uploadClothSub}>From your gallery or camera roll</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
                </LinearGradient>
              </TouchableOpacity>

              <Text style={styles.catalogLabel}>Featured Catalog</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catFilterScroll}>
                <View style={styles.catFilterRow}>
                  {CATEGORIES_FILTER.map((cat) => (
                    <TouchableOpacity
                      key={cat}
                      style={[styles.catChip, catFilter === cat && styles.catChipActive]}
                      onPress={() => setCatFilter(cat)}
                    >
                      <Text style={[styles.catChipText, catFilter === cat && styles.catChipTextActive]}>{cat}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>

              <View style={styles.catalogGrid}>
                {filteredCatalog.map((item) => {
                  const selected = selectedClothingId === item.id;
                  return (
                    <TouchableOpacity
                      key={item.id}
                      style={[styles.catalogItem, selected && styles.catalogItemSelected]}
                      onPress={() => { setSelectedClothing(item.image); setSelectedClothingId(item.id); }}
                      activeOpacity={0.85}
                    >
                      <Image source={{ uri: item.image }} style={styles.catalogImg} />
                      <LinearGradient colors={['transparent', 'rgba(0,0,0,0.85)']} style={styles.catalogOverlay}>
                        <Text style={styles.catalogName}>{item.name}</Text>
                        <Text style={styles.catalogPrice}>{item.price}</Text>
                      </LinearGradient>
                      {selected && (
                        <View style={styles.catalogCheck}>
                          <LinearGradient colors={['#7c3aed', '#ec4899']} style={styles.catalogCheckGrad}>
                            <Ionicons name="checkmark" size={16} color="#fff" />
                          </LinearGradient>
                        </View>
                      )}
                      <View style={styles.catalogCategoryBadge}>
                        <Text style={styles.catalogCategoryText}>{item.category}</Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {selectedClothing && (
                <TouchableOpacity style={styles.generateBtn} onPress={startTryOn} activeOpacity={0.9}>
                  <LinearGradient colors={['#7c3aed', '#ec4899']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.generateBtnGrad}>
                    <Ionicons name="sparkles" size={20} color="#fff" />
                    <Text style={styles.generateBtnText}>Generate AI Try-On</Text>
                    <Ionicons name="arrow-forward" size={18} color="rgba(255,255,255,0.8)" />
                  </LinearGradient>
                </TouchableOpacity>
              )}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0f' },
  safeArea: { flex: 1 },
  bgGrad: { position: 'absolute', top: 0, left: 0, right: 0, height: 350 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 12, paddingBottom: 10,
  },
  headerTitle: { color: '#f8fafc', fontSize: 22, fontWeight: '800' },
  headerSub: { color: '#64748b', fontSize: 12, marginTop: 2 },
  arBtn: { borderRadius: 20, overflow: 'hidden' },
  arBtnGrad: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 14, paddingVertical: 8 },
  arBtnText: { color: '#fff', fontSize: 12, fontWeight: '800' },
  stepBar: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 24, paddingVertical: 14,
  },
  stepItem: { alignItems: 'center', gap: 5 },
  stepCircle: {
    width: 30, height: 30, borderRadius: 15,
    backgroundColor: '#1a1a28', borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center', justifyContent: 'center',
  },
  stepCircleActive: { backgroundColor: '#7c3aed', borderColor: '#7c3aed' },
  stepCircleDone: { backgroundColor: '#10b981', borderColor: '#10b981' },
  stepNum: { color: '#475569', fontSize: 12, fontWeight: '700' },
  stepLabel: { color: '#475569', fontSize: 10, fontWeight: '600' },
  stepLine: { flex: 1, height: 1.5, backgroundColor: 'rgba(255,255,255,0.08)', marginBottom: 18 },
  stepLineDone: { backgroundColor: '#10b981' },
  scroll: { paddingBottom: 120 },
  section: { paddingHorizontal: 16 },
  uploadBox: {
    borderRadius: 24, overflow: 'hidden',
    borderWidth: 1.5, borderColor: 'rgba(124,58,237,0.35)',
    borderStyle: 'dashed', marginBottom: 16,
  },
  uploadBoxInner: { padding: 36, alignItems: 'center' },
  uploadIcon: { width: 72, height: 72, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  uploadTitle: { color: '#f8fafc', fontSize: 20, fontWeight: '800', marginBottom: 6 },
  uploadSub: { color: '#64748b', fontSize: 13, textAlign: 'center', marginBottom: 20, lineHeight: 18 },
  uploadTips: { flexDirection: 'row', gap: 14, marginBottom: 24 },
  uploadTip: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  uploadTipText: { color: '#94a3b8', fontSize: 11 },
  uploadBtn: {
    backgroundColor: 'rgba(124,58,237,0.2)', borderRadius: 14,
    paddingHorizontal: 28, paddingVertical: 12,
    borderWidth: 1, borderColor: 'rgba(124,58,237,0.4)',
  },
  uploadBtnText: { color: '#a78bfa', fontWeight: '700', fontSize: 14 },
  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  divider: { flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.06)' },
  dividerText: { color: '#475569', fontSize: 12, fontWeight: '600' },
  liveArCard: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#16161f', borderRadius: 18, padding: 16,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', marginBottom: 28,
  },
  liveArLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  liveArIcon: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  liveArTitle: { color: '#f8fafc', fontWeight: '700', fontSize: 15 },
  liveArSub: { color: '#64748b', fontSize: 12, marginTop: 2 },
  liveBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: 'rgba(239,68,68,0.15)', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12 },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#ef4444' },
  liveText: { color: '#ef4444', fontSize: 10, fontWeight: '800' },
  clothingTypesSection: { marginBottom: 20 },
  clothingTypesTitle: { color: '#f8fafc', fontSize: 16, fontWeight: '700', marginBottom: 14 },
  clothingTypeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  clothingTypeItem: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#16161f', borderRadius: 12,
    paddingHorizontal: 12, paddingVertical: 8,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
    minWidth: (width - 60) / 2 - 4,
  },
  clothingTypeEmoji: { fontSize: 16 },
  clothingTypeLabel: { color: '#94a3b8', fontSize: 12, fontWeight: '600' },
  photoPreviewBar: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#16161f', borderRadius: 16, padding: 12,
    marginBottom: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
  },
  photoThumb: { width: 52, height: 68, borderRadius: 10 },
  photoPreviewLabel: { color: '#f8fafc', fontWeight: '700', fontSize: 14 },
  photoPreviewSub: { color: '#64748b', fontSize: 12, marginTop: 2 },
  changeBtn: { color: '#a78bfa', fontSize: 13, fontWeight: '600' },
  uploadClothBtn: { borderRadius: 16, overflow: 'hidden', marginBottom: 20 },
  uploadClothInner: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  uploadClothIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  uploadClothTitle: { color: '#f8fafc', fontWeight: '700', fontSize: 14 },
  uploadClothSub: { color: '#64748b', fontSize: 12, marginTop: 2 },
  catalogLabel: { color: '#f8fafc', fontSize: 16, fontWeight: '700', marginBottom: 10 },
  catFilterScroll: { marginBottom: 12 },
  catFilterRow: { flexDirection: 'row', gap: 8, paddingBottom: 4 },
  catChip: {
    paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20,
    backgroundColor: '#16161f', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
  },
  catChipActive: { backgroundColor: 'rgba(124,58,237,0.2)', borderColor: '#7c3aed' },
  catChipText: { color: '#64748b', fontSize: 12, fontWeight: '600' },
  catChipTextActive: { color: '#a78bfa' },
  catalogGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  catalogItem: {
    width: (width - 42) / 2, borderRadius: 16, overflow: 'hidden',
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.06)',
    position: 'relative',
  },
  catalogItemSelected: { borderColor: '#7c3aed', borderWidth: 2 },
  catalogImg: { width: '100%', height: 180 },
  catalogOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 10, paddingTop: 20 },
  catalogName: { color: '#fff', fontSize: 12, fontWeight: '700' },
  catalogPrice: { color: '#a78bfa', fontSize: 11, fontWeight: '600', marginTop: 2 },
  catalogCheck: { position: 'absolute', top: 8, right: 8, borderRadius: 12, overflow: 'hidden' },
  catalogCheckGrad: { width: 28, height: 28, alignItems: 'center', justifyContent: 'center' },
  catalogCategoryBadge: {
    position: 'absolute', top: 8, left: 8,
    backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 7, paddingVertical: 3, borderRadius: 8,
  },
  catalogCategoryText: { color: '#fff', fontSize: 9, fontWeight: '700' },
  generateBtn: { borderRadius: 18, overflow: 'hidden', marginBottom: 24 },
  generateBtnGrad: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 18 },
  generateBtnText: { color: '#fff', fontSize: 17, fontWeight: '800', flex: 1, textAlign: 'center' },
  processingWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  processingOrb: { position: 'relative', marginBottom: 36, alignItems: 'center', justifyContent: 'center' },
  orbInner: { width: 100, height: 100, borderRadius: 50, alignItems: 'center', justifyContent: 'center' },
  orbRing1: { position: 'absolute', width: 128, height: 128, borderRadius: 64, borderWidth: 1, borderColor: 'rgba(124,58,237,0.3)' },
  orbRing2: { position: 'absolute', width: 160, height: 160, borderRadius: 80, borderWidth: 1, borderColor: 'rgba(124,58,237,0.15)' },
  processingTitle: { color: '#f8fafc', fontSize: 24, fontWeight: '800', textAlign: 'center', marginBottom: 10 },
  processingMsg: { color: '#94a3b8', fontSize: 14, textAlign: 'center', marginBottom: 32 },
  progressWrap: { width: '100%', marginBottom: 36 },
  progressBg: { height: 8, backgroundColor: '#1a1a28', borderRadius: 4, overflow: 'hidden', marginBottom: 8 },
  progressFill: { height: '100%', borderRadius: 4 },
  progressPct: { color: '#a78bfa', fontSize: 14, fontWeight: '700', textAlign: 'right' },
  processingSteps: { gap: 14, width: '100%' },
  pStep: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  pStepDot: {
    width: 26, height: 26, borderRadius: 13, backgroundColor: '#1a1a28',
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center', justifyContent: 'center',
  },
  pStepDotDone: { backgroundColor: '#10b981', borderColor: '#10b981' },
  pStepInner: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#475569' },
  pStepText: { color: '#64748b', fontSize: 14, fontWeight: '600' },
});
