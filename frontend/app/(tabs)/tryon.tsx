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
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { GlassCard } from '@/components/GlassCard';
import { GradientButton } from '@/components/GradientButton';
import { useAppStore } from '@/store/useAppStore';

const { width } = Dimensions.get('window');

const STYLE_OPTIONS = [
  { id: 'casual', label: 'Casual', icon: '👕' },
  { id: 'formal', label: 'Formal', icon: '👔' },
  { id: 'luxury', label: 'Luxury', icon: '💎' },
  { id: 'sport', label: 'Sport', icon: '🏃' },
  { id: 'street', label: 'Street', icon: '🧢' },
  { id: 'bohemian', label: 'Boho', icon: '🌸' },
];

const CLOTHING_CATALOG = [
  {
    id: '1',
    name: 'Black Blazer',
    category: 'Formal',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80',
    price: '$129',
  },
  {
    id: '2',
    name: 'White Linen Dress',
    category: 'Casual',
    image: 'https://images.unsplash.com/photo-1495385794356-15371f348c31?w=300&q=80',
    price: '$89',
  },
  {
    id: '3',
    name: 'Luxury Evening Gown',
    category: 'Luxury',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=300&q=80',
    price: '$349',
  },
  {
    id: '4',
    name: 'Navy Suit',
    category: 'Formal',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&q=80',
    price: '$249',
  },
  {
    id: '5',
    name: 'Floral Sundress',
    category: 'Casual',
    image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=300&q=80',
    price: '$75',
  },
  {
    id: '6',
    name: 'Leather Jacket',
    category: 'Street',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&q=80',
    price: '$199',
  },
];

const BG_OPTIONS = [
  { id: 'studio', label: 'Studio', icon: '🎬' },
  { id: 'mall', label: 'Luxury Mall', icon: '🏬' },
  { id: 'wedding', label: 'Wedding', icon: '💍' },
  { id: 'street', label: 'Street', icon: '🌆' },
  { id: 'beach', label: 'Beach', icon: '🏖️' },
  { id: 'rooftop', label: 'Rooftop', icon: '🌃' },
];

type Step = 'upload' | 'clothing' | 'settings' | 'processing';

export default function TryOnScreen() {
  const { isProcessing, setProcessing, addTryOnResult, selectedStyle, setSelectedStyle, backgroundStyle, setBackgroundStyle } = useAppStore();
  const [step, setStep] = useState<Step>('upload');
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [selectedClothing, setSelectedClothing] = useState<string | null>(null);
  const [selectedClothingId, setSelectedClothingId] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [progressMsg, setProgressMsg] = useState('');

  const pickUserPhoto = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please allow access to your photos to use this feature.');
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
    } catch (err) {
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const selectCatalogItem = (item: any) => {
    setSelectedClothing(item.image);
    setSelectedClothingId(item.id);
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
    } catch (err) {
      Alert.alert('Error', 'Failed to pick clothing image.');
    }
  };

  const startTryOn = async () => {
    if (!userPhoto || !selectedClothing) return;
    setStep('processing');
    setProgress(0);
    setProcessing(true);

    const steps = [
      { msg: 'Analyzing your body shape...', pct: 15 },
      { msg: 'Detecting pose & proportions...', pct: 30 },
      { msg: 'Fitting clothing realistically...', pct: 55 },
      { msg: 'Adding fabric texture & shadows...', pct: 75 },
      { msg: 'Enhancing lighting & details...', pct: 90 },
      { msg: 'Finalizing HD output...', pct: 100 },
    ];

    for (const s of steps) {
      setProgressMsg(s.msg);
      await new Promise((r) => setTimeout(r, 700));
      setProgress(s.pct);
    }

    await new Promise((r) => setTimeout(r, 500));

    const mockResultImages = [
      'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&q=80',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80',
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80',
    ];

    const result = {
      id: Date.now().toString(),
      originalPhoto: userPhoto,
      clothingImage: selectedClothing,
      resultImage: mockResultImages[Math.floor(Math.random() * mockResultImages.length)],
      timestamp: Date.now(),
      clothingName: selectedClothingId === 'custom' ? 'Custom Upload' : CLOTHING_CATALOG.find(c => c.id === selectedClothingId)?.name || 'Outfit',
      liked: false,
    };

    addTryOnResult(result);
    setProcessing(false);

    router.push({
      pathname: '/screens/tryon-result',
      params: {
        resultImage: result.resultImage,
        clothingName: result.clothingName,
        originalPhoto: userPhoto,
      },
    });

    setTimeout(() => {
      setStep('upload');
      setUserPhoto(null);
      setSelectedClothing(null);
      setSelectedClothingId(null);
      setProgress(0);
    }, 300);
  };

  if (step === 'processing') {
    return (
      <View style={styles.container}>
        <LinearGradient colors={['rgba(139,92,246,0.15)', 'rgba(236,72,153,0.1)', 'transparent']} style={styles.bgGrad} pointerEvents="none" />
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.processingContainer}>
            <View style={styles.processingOrb}>
              <LinearGradient colors={['#8b5cf6', '#ec4899']} style={styles.orbGrad}>
                <Ionicons name="shirt" size={48} color="#fff" />
              </LinearGradient>
            </View>

            <Text style={styles.processingTitle}>AI Magic in Progress</Text>
            <Text style={styles.processingMsg}>{progressMsg}</Text>

            <View style={styles.progressBarContainer}>
              <View style={styles.progressBarBg}>
                <LinearGradient
                  colors={['#8b5cf6', '#ec4899']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[styles.progressBarFill, { width: `${progress}%` }]}
                />
              </View>
              <Text style={styles.progressPct}>{progress}%</Text>
            </View>

            <View style={styles.processingSteps}>
              {['Body Analysis', 'AI Fitting', 'HD Rendering'].map((s, i) => (
                <View key={i} style={[styles.processingStep, progress > i * 33 && styles.processingStepDone]}>
                  <Ionicons
                    name={progress > i * 33 ? 'checkmark-circle' : 'ellipse-outline'}
                    size={18}
                    color={progress > i * 33 ? Colors.success : Colors.textMuted}
                  />
                  <Text style={[styles.processingStepText, progress > i * 33 && { color: Colors.success }]}>{s}</Text>
                </View>
              ))}
            </View>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={['rgba(139,92,246,0.1)', 'transparent']} style={styles.bgGrad} pointerEvents="none" />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>AI Virtual Try-On</Text>
          <Text style={styles.headerSub}>Powered by advanced AI models</Text>
        </View>

        <View style={styles.stepIndicator}>
          {['Upload', 'Clothing', 'Settings'].map((s, i) => {
            const stepIndex = ['upload', 'clothing', 'settings'].indexOf(step);
            const isActive = i === stepIndex;
            const isDone = i < stepIndex;
            return (
              <React.Fragment key={i}>
                <View style={styles.stepItem}>
                  <View style={[styles.stepCircle, isActive && styles.stepCircleActive, isDone && styles.stepCircleDone]}>
                    {isDone ? (
                      <Ionicons name="checkmark" size={14} color="#fff" />
                    ) : (
                      <Text style={[styles.stepNum, isActive && { color: '#fff' }]}>{i + 1}</Text>
                    )}
                  </View>
                  <Text style={[styles.stepLabel, isActive && { color: Colors.primaryLight }]}>{s}</Text>
                </View>
                {i < 2 && <View style={[styles.stepLine, isDone && styles.stepLineDone]} />}
              </React.Fragment>
            );
          })}
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {step === 'upload' && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Upload Your Photo</Text>
              <Text style={styles.sectionSub}>Full-body or upper-body photo works best</Text>

              <TouchableOpacity
                style={styles.uploadArea}
                onPress={pickUserPhoto}
                activeOpacity={0.85}
              >
                <LinearGradient
                  colors={['rgba(139,92,246,0.08)', 'rgba(236,72,153,0.05)']}
                  style={styles.uploadGrad}
                >
                  <View style={styles.uploadIcon}>
                    <LinearGradient colors={['#8b5cf6', '#ec4899']} style={styles.uploadIconGrad}>
                      <Ionicons name="person-add" size={32} color="#fff" />
                    </LinearGradient>
                  </View>
                  <Text style={styles.uploadTitle}>Tap to Upload Photo</Text>
                  <Text style={styles.uploadSub}>JPG, PNG • Recommended: full body shot</Text>

                  <View style={styles.uploadTips}>
                    {['Good lighting', 'Clear background', 'Front-facing'].map((tip, i) => (
                      <View key={i} style={styles.uploadTip}>
                        <Ionicons name="checkmark-circle" size={14} color={Colors.success} />
                        <Text style={styles.uploadTipText}>{tip}</Text>
                      </View>
                    ))}
                  </View>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cameraBtn}
                onPress={() => router.push('/screens/ar-tryon')}
                activeOpacity={0.85}
              >
                <GlassCard style={styles.cameraBtnInner} glow>
                  <Ionicons name="videocam" size={22} color={Colors.primary} />
                  <Text style={styles.cameraBtnText}>Live AR Try-On</Text>
                  <Text style={styles.cameraBtnSub}>Real-time camera • Body tracking</Text>
                  <View style={styles.liveChip}>
                    <View style={styles.liveDot} />
                    <Text style={styles.liveText}>LIVE</Text>
                  </View>
                </GlassCard>
              </TouchableOpacity>
            </View>
          )}

          {step === 'clothing' && (
            <View style={styles.section}>
              {userPhoto && (
                <View style={styles.userPhotoPreview}>
                  <Image source={{ uri: userPhoto }} style={styles.userPhotoSmall} />
                  <View>
                    <Text style={styles.userPhotoLabel}>Your Photo</Text>
                    <TouchableOpacity onPress={() => setStep('upload')}>
                      <Text style={styles.changePhotoBtn}>Change Photo</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              <Text style={styles.sectionTitle}>Choose Clothing</Text>
              <Text style={styles.sectionSub}>Select from catalog or upload your own</Text>

              <TouchableOpacity style={styles.uploadClothBtn} onPress={pickClothingPhoto} activeOpacity={0.85}>
                <GlassCard style={styles.uploadClothBtnInner}>
                  <LinearGradient colors={['#8b5cf6', '#ec4899']} style={styles.uploadClothIcon}>
                    <Ionicons name="cloud-upload" size={20} color="#fff" />
                  </LinearGradient>
                  <Text style={styles.uploadClothText}>Upload Clothing Image</Text>
                  <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
                </GlassCard>
              </TouchableOpacity>

              <Text style={styles.catalogTitle}>✨ Featured Catalog</Text>
              <View style={styles.catalogGrid}>
                {CLOTHING_CATALOG.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={[styles.catalogItem, selectedClothingId === item.id && styles.catalogItemSelected]}
                    onPress={() => selectCatalogItem(item)}
                    activeOpacity={0.85}
                  >
                    <Image source={{ uri: item.image }} style={styles.catalogImage} />
                    <LinearGradient
                      colors={['transparent', 'rgba(0,0,0,0.8)']}
                      style={styles.catalogOverlay}
                    >
                      <Text style={styles.catalogName}>{item.name}</Text>
                      <Text style={styles.catalogPrice}>{item.price}</Text>
                    </LinearGradient>
                    {selectedClothingId === item.id && (
                      <View style={styles.catalogSelectedBadge}>
                        <Ionicons name="checkmark-circle" size={24} color={Colors.primary} />
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </View>

              {selectedClothingId && (
                <GradientButton
                  title="Continue to Settings"
                  onPress={() => setStep('settings')}
                  style={{ marginTop: 16 }}
                  icon={<Ionicons name="settings-outline" size={18} color="#fff" />}
                />
              )}
            </View>
          )}

          {step === 'settings' && (
            <View style={styles.section}>
              <View style={styles.previewRow}>
                {userPhoto && (
                  <View style={styles.previewItem}>
                    <Image source={{ uri: userPhoto }} style={styles.previewImg} />
                    <Text style={styles.previewLabel}>Your Photo</Text>
                  </View>
                )}
                <View style={styles.previewArrow}>
                  <Ionicons name="add" size={24} color={Colors.primary} />
                </View>
                {selectedClothing && (
                  <View style={styles.previewItem}>
                    <Image source={{ uri: selectedClothing }} style={styles.previewImg} />
                    <Text style={styles.previewLabel}>Clothing</Text>
                  </View>
                )}
                <View style={styles.previewArrow}>
                  <Ionicons name="arrow-forward" size={20} color={Colors.textSecondary} />
                </View>
                <View style={[styles.previewItem, styles.previewResult]}>
                  <LinearGradient colors={['#8b5cf6', '#ec4899']} style={styles.previewResultGrad}>
                    <Ionicons name="sparkles" size={28} color="#fff" />
                  </LinearGradient>
                  <Text style={styles.previewLabel}>AI Result</Text>
                </View>
              </View>

              <Text style={styles.settingsSection}>Style Mode</Text>
              <View style={styles.optionsRow}>
                {STYLE_OPTIONS.map((opt) => (
                  <TouchableOpacity
                    key={opt.id}
                    style={[styles.optionChip, selectedStyle === opt.id && styles.optionChipActive]}
                    onPress={() => setSelectedStyle(opt.id)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.optionEmoji}>{opt.icon}</Text>
                    <Text style={[styles.optionLabel, selectedStyle === opt.id && { color: Colors.primaryLight }]}>
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.settingsSection}>Background</Text>
              <View style={styles.optionsRow}>
                {BG_OPTIONS.map((opt) => (
                  <TouchableOpacity
                    key={opt.id}
                    style={[styles.optionChip, backgroundStyle === opt.id && styles.optionChipActive]}
                    onPress={() => setBackgroundStyle(opt.id)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.optionEmoji}>{opt.icon}</Text>
                    <Text style={[styles.optionLabel, backgroundStyle === opt.id && { color: Colors.primaryLight }]}>
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <GlassCard style={styles.featuresCard}>
                <Text style={styles.featuresTitle}>AI Features Enabled</Text>
                {[
                  { icon: 'body-outline', label: 'Body shape preservation' },
                  { icon: 'person-outline', label: 'Face & skin tone matching' },
                  { icon: 'layers-outline', label: 'Fabric texture & shadows' },
                  { icon: 'sunny-outline', label: 'Cinematic lighting' },
                  { icon: 'resize-outline', label: 'Proper fit & proportions' },
                ].map((f, i) => (
                  <View key={i} style={styles.featureRow}>
                    <Ionicons name={f.icon as any} size={16} color={Colors.primary} />
                    <Text style={styles.featureText}>{f.label}</Text>
                    <Ionicons name="checkmark-circle" size={16} color={Colors.success} />
                  </View>
                ))}
              </GlassCard>

              <GradientButton
                title="Generate AI Try-On ✨"
                onPress={startTryOn}
                size="lg"
                style={{ marginTop: 20 }}
              />

              <TouchableOpacity style={styles.backBtn} onPress={() => setStep('clothing')}>
                <Text style={styles.backBtnText}>← Back to Clothing Selection</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  safeArea: { flex: 1 },
  bgGrad: { position: 'absolute', top: 0, left: 0, right: 0, height: 400 },
  header: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8 },
  headerTitle: { color: Colors.text, fontSize: 24, fontWeight: '800', letterSpacing: -0.5 },
  headerSub: { color: Colors.textSecondary, fontSize: 13, marginTop: 2 },
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  stepItem: { alignItems: 'center', gap: 4 },
  stepCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.surfaceElevated,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepCircleActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  stepCircleDone: { backgroundColor: Colors.success, borderColor: Colors.success },
  stepNum: { color: Colors.textMuted, fontSize: 12, fontWeight: '700' },
  stepLabel: { color: Colors.textMuted, fontSize: 11, fontWeight: '600' },
  stepLine: { flex: 1, height: 1, backgroundColor: Colors.border, marginBottom: 16 },
  stepLineDone: { backgroundColor: Colors.success },
  scrollContent: { paddingBottom: 120 },
  section: { paddingHorizontal: 20 },
  sectionTitle: { color: Colors.text, fontSize: 20, fontWeight: '700', marginBottom: 4 },
  sectionSub: { color: Colors.textSecondary, fontSize: 13, marginBottom: 20 },
  uploadArea: { borderRadius: 20, overflow: 'hidden', borderWidth: 2, borderColor: 'rgba(139,92,246,0.3)', borderStyle: 'dashed' },
  uploadGrad: { padding: 40, alignItems: 'center' },
  uploadIcon: { marginBottom: 16 },
  uploadIconGrad: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center' },
  uploadTitle: { color: Colors.text, fontSize: 18, fontWeight: '700', marginBottom: 6 },
  uploadSub: { color: Colors.textSecondary, fontSize: 13, marginBottom: 20 },
  uploadTips: { flexDirection: 'row', gap: 16 },
  uploadTip: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  uploadTipText: { color: Colors.textSecondary, fontSize: 12 },
  cameraBtn: { marginTop: 14 },
  cameraBtnInner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  cameraBtnText: { flex: 1, color: Colors.text, fontSize: 16, fontWeight: '700' },
  cameraBtnSub: { color: Colors.textMuted, fontSize: 11, position: 'absolute', bottom: 16, left: 60 },
  liveChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(239,68,68,0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.error },
  liveText: { color: Colors.error, fontSize: 10, fontWeight: '800' },
  userPhotoPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 14,
    padding: 12,
    marginBottom: 20,
  },
  userPhotoSmall: { width: 48, height: 64, borderRadius: 10, resizeMode: 'cover' },
  userPhotoLabel: { color: Colors.text, fontWeight: '600' },
  changePhotoBtn: { color: Colors.primary, fontSize: 12, marginTop: 2 },
  uploadClothBtn: { marginBottom: 20 },
  uploadClothBtnInner: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 },
  uploadClothIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  uploadClothText: { flex: 1, color: Colors.text, fontWeight: '600' },
  catalogTitle: { color: Colors.text, fontSize: 16, fontWeight: '700', marginBottom: 12 },
  catalogGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  catalogItem: {
    width: (width - 52) / 2,
    height: 180,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  catalogItemSelected: { borderColor: Colors.primary },
  catalogImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  catalogOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
  },
  catalogName: { color: '#fff', fontSize: 12, fontWeight: '700' },
  catalogPrice: { color: 'rgba(255,255,255,0.7)', fontSize: 11 },
  catalogSelectedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: Colors.background,
    borderRadius: 12,
  },
  settingsSection: { color: Colors.text, fontSize: 16, fontWeight: '700', marginBottom: 12, marginTop: 20 },
  optionsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  optionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  optionChipActive: { borderColor: Colors.primary, backgroundColor: 'rgba(139,92,246,0.12)' },
  optionEmoji: { fontSize: 16 },
  optionLabel: { color: Colors.textSecondary, fontSize: 13, fontWeight: '600' },
  previewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 24,
    marginTop: 8,
  },
  previewItem: { alignItems: 'center', gap: 6 },
  previewImg: { width: 70, height: 90, borderRadius: 12, resizeMode: 'cover' },
  previewResult: {},
  previewResultGrad: { width: 70, height: 90, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  previewArrow: { alignItems: 'center', marginBottom: 20 },
  previewLabel: { color: Colors.textSecondary, fontSize: 10, fontWeight: '600' },
  featuresCard: { padding: 16, marginTop: 20 },
  featuresTitle: { color: Colors.text, fontWeight: '700', marginBottom: 12 },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  featureText: { flex: 1, color: Colors.textSecondary, fontSize: 13 },
  backBtn: { alignItems: 'center', padding: 16 },
  backBtnText: { color: Colors.textSecondary, fontSize: 14 },
  processingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  processingOrb: { marginBottom: 32 },
  orbGrad: { width: 120, height: 120, borderRadius: 60, alignItems: 'center', justifyContent: 'center' },
  processingTitle: { color: Colors.text, fontSize: 26, fontWeight: '800', marginBottom: 8, textAlign: 'center' },
  processingMsg: { color: Colors.textSecondary, fontSize: 15, textAlign: 'center', marginBottom: 32 },
  progressBarContainer: { width: '100%', alignItems: 'center', gap: 10 },
  progressBarBg: { width: '100%', height: 8, backgroundColor: Colors.surfaceElevated, borderRadius: 4, overflow: 'hidden' },
  progressBarFill: { height: '100%', borderRadius: 4 },
  progressPct: { color: Colors.primaryLight, fontSize: 14, fontWeight: '700' },
  processingSteps: { gap: 14, marginTop: 28, width: '100%' },
  processingStep: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  processingStepDone: {},
  processingStepText: { color: Colors.textMuted, fontSize: 14 },
});
