import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
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

const { width } = Dimensions.get('window');

const STYLE_PRESETS = [
  { id: 'luxury', label: 'Luxury', emoji: '💎', desc: 'High-end designer looks' },
  { id: 'casual', label: 'Casual', emoji: '👕', desc: 'Everyday comfortable style' },
  { id: 'formal', label: 'Formal', emoji: '👔', desc: 'Business & professional' },
  { id: 'street', label: 'Streetwear', emoji: '🧢', desc: 'Urban fashion edge' },
  { id: 'boho', label: 'Bohemian', emoji: '🌸', desc: 'Free-spirited & natural' },
  { id: 'athleisure', label: 'Athleisure', emoji: '⚡', desc: 'Sport meets fashion' },
];

const QUICK_PROMPTS = [
  'Luxury black wedding suit with gold accessories',
  'Elegant red carpet evening gown',
  'Minimalist business casual look',
  'Streetwear hypebeast outfit with sneakers',
  'Boho beach summer look with floral prints',
  'Dark academia inspired fall outfit',
  'Monochromatic all-white luxury ensemble',
  'Y2K inspired colorful party look',
];

const GENERATED_IMAGES = [
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80',
  'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&q=80',
  'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80',
  'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80',
];

export default function OutfitGeneratorScreen() {
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('luxury');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [generationCount, setGenerationCount] = useState(0);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setGeneratedImage(null);

    await new Promise((r) => setTimeout(r, 2200));

    const img = GENERATED_IMAGES[generationCount % GENERATED_IMAGES.length];
    setGeneratedImage(img);
    setGenerationCount((c) => c + 1);
    setIsGenerating(false);
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['rgba(245,158,11,0.12)', 'rgba(139,92,246,0.08)', 'transparent']}
        style={styles.bgGrad}
        pointerEvents="none"
      />

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
            <Ionicons name="close" size={22} color={Colors.text} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>AI Outfit Generator</Text>
          </View>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={styles.heroSection}>
            <LinearGradient colors={['#f59e0b', '#ec4899']} style={styles.heroIcon}>
              <Ionicons name="sparkles" size={32} color="#fff" />
            </LinearGradient>
            <Text style={styles.heroTitle}>Describe Your Dream Look</Text>
            <Text style={styles.heroSub}>
              AI generates any fashion outfit from your description
            </Text>
          </View>

          <View style={styles.inputSection}>
            <TextInput
              style={styles.promptInput}
              value={prompt}
              onChangeText={setPrompt}
              placeholder='e.g. "Luxury black suit with gold tie and pocket square"'
              placeholderTextColor={Colors.textMuted}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />

            <Text style={styles.quickLabel}>Quick Prompts ⚡</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.quickRow}>
                {QUICK_PROMPTS.map((p, i) => (
                  <TouchableOpacity
                    key={i}
                    style={styles.quickChip}
                    onPress={() => setPrompt(p)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.quickChipText} numberOfLines={2}>{p}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          <View style={styles.styleSection}>
            <Text style={styles.styleLabel}>Style Preset</Text>
            <View style={styles.styleGrid}>
              {STYLE_PRESETS.map((style) => (
                <TouchableOpacity
                  key={style.id}
                  style={[styles.styleCard, selectedStyle === style.id && styles.styleCardActive]}
                  onPress={() => setSelectedStyle(style.id)}
                  activeOpacity={0.85}
                >
                  {selectedStyle === style.id ? (
                    <LinearGradient
                      colors={['rgba(245,158,11,0.15)', 'rgba(236,72,153,0.1)']}
                      style={styles.styleCardGrad}
                    >
                      <Text style={styles.styleEmoji}>{style.emoji}</Text>
                      <Text style={[styles.styleName, { color: Colors.goldLight }]}>{style.label}</Text>
                      <Text style={styles.styleDesc}>{style.desc}</Text>
                    </LinearGradient>
                  ) : (
                    <View style={styles.styleCardInner}>
                      <Text style={styles.styleEmoji}>{style.emoji}</Text>
                      <Text style={styles.styleName}>{style.label}</Text>
                      <Text style={styles.styleDesc}>{style.desc}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <GradientButton
            title={isGenerating ? 'Generating Your Look...' : 'Generate Outfit ✨'}
            onPress={handleGenerate}
            loading={isGenerating}
            disabled={!prompt.trim()}
            size="lg"
            variant="gold"
            style={styles.generateBtn}
          />

          {generatedImage && (
            <View style={styles.resultSection}>
              <View style={styles.resultHeader}>
                <Text style={styles.resultTitle}>Your AI-Generated Look</Text>
                <View style={styles.resultBadge}>
                  <Ionicons name="sparkles" size={12} color="#fff" />
                  <Text style={styles.resultBadgeText}>AI Generated</Text>
                </View>
              </View>

              <View style={styles.resultImageContainer}>
                <Image source={{ uri: generatedImage }} style={styles.resultImage} resizeMode="cover" />
                <LinearGradient
                  colors={['transparent', 'rgba(10,10,15,0.9)']}
                  style={styles.resultOverlay}
                  pointerEvents="none"
                />
                <View style={styles.resultInfo}>
                  <Text style={styles.resultPrompt} numberOfLines={2}>{prompt}</Text>
                  <Text style={styles.resultStyle}>Style: {STYLE_PRESETS.find(s => s.id === selectedStyle)?.label}</Text>
                </View>
              </View>

              <View style={styles.resultActions}>
                <TouchableOpacity style={styles.resultAction} onPress={() => router.push('/tryon')}>
                  <LinearGradient colors={['#8b5cf6', '#ec4899']} style={styles.resultActionGrad}>
                    <Ionicons name="shirt" size={18} color="#fff" />
                    <Text style={styles.resultActionText}>Try It On</Text>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity style={styles.resultAction}>
                  <GlassCard style={styles.resultActionSecondary}>
                    <Ionicons name="heart-outline" size={18} color={Colors.accent} />
                    <Text style={[styles.resultActionText, { color: Colors.accent }]}>Save</Text>
                  </GlassCard>
                </TouchableOpacity>

                <TouchableOpacity style={styles.resultAction}>
                  <GlassCard style={styles.resultActionSecondary}>
                    <Ionicons name="share-social-outline" size={18} color={Colors.cyan} />
                    <Text style={[styles.resultActionText, { color: Colors.cyan }]}>Share</Text>
                  </GlassCard>
                </TouchableOpacity>

                <TouchableOpacity style={styles.resultAction} onPress={handleGenerate}>
                  <GlassCard style={styles.resultActionSecondary}>
                    <Ionicons name="refresh" size={18} color={Colors.textSecondary} />
                    <Text style={styles.resultActionText}>Retry</Text>
                  </GlassCard>
                </TouchableOpacity>
              </View>

              <GlassCard style={styles.detailsCard}>
                <Text style={styles.detailsTitle}>AI Analysis</Text>
                <View style={styles.detailsList}>
                  {[
                    { label: 'Prompt Accuracy', value: '96%', color: Colors.success },
                    { label: 'Style Score', value: '94%', color: Colors.primary },
                    { label: 'Trend Relevance', value: '91%', color: Colors.gold },
                  ].map((item, i) => (
                    <View key={i} style={styles.detailRow}>
                      <Text style={styles.detailLabel}>{item.label}</Text>
                      <View style={styles.detailBar}>
                        <LinearGradient
                          colors={[item.color, `${item.color}70`]}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 0 }}
                          style={[styles.detailBarFill, { width: item.value }]}
                        />
                      </View>
                      <Text style={[styles.detailValue, { color: item.color }]}>{item.value}</Text>
                    </View>
                  ))}
                </View>
              </GlassCard>
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
  headerCenter: { flex: 1, alignItems: 'center' },
  headerTitle: { color: Colors.text, fontSize: 18, fontWeight: '800' },
  scrollContent: { paddingBottom: 60 },
  heroSection: { alignItems: 'center', padding: 24, paddingBottom: 16 },
  heroIcon: { width: 72, height: 72, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  heroTitle: { color: Colors.text, fontSize: 22, fontWeight: '800', textAlign: 'center' },
  heroSub: { color: Colors.textSecondary, fontSize: 14, textAlign: 'center', marginTop: 6 },
  inputSection: { paddingHorizontal: 16, marginBottom: 20 },
  promptInput: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 16,
    padding: 16,
    color: Colors.text,
    fontSize: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    minHeight: 90,
    marginBottom: 16,
    textAlignVertical: 'top',
  },
  quickLabel: { color: Colors.textSecondary, fontSize: 13, fontWeight: '600', marginBottom: 10 },
  quickRow: { flexDirection: 'row', gap: 8, paddingBottom: 4 },
  quickChip: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    maxWidth: 180,
  },
  quickChipText: { color: Colors.textSecondary, fontSize: 12, lineHeight: 16 },
  styleSection: { paddingHorizontal: 16, marginBottom: 20 },
  styleLabel: { color: Colors.text, fontSize: 16, fontWeight: '700', marginBottom: 12 },
  styleGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  styleCard: {
    width: (width - 42) / 2,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  styleCardActive: { borderColor: Colors.gold, borderWidth: 2 },
  styleCardGrad: { padding: 14 },
  styleCardInner: { padding: 14, backgroundColor: Colors.surfaceElevated },
  styleEmoji: { fontSize: 24, marginBottom: 6 },
  styleName: { color: Colors.text, fontSize: 14, fontWeight: '700', marginBottom: 3 },
  styleDesc: { color: Colors.textMuted, fontSize: 11 },
  generateBtn: { marginHorizontal: 16, marginBottom: 24 },
  resultSection: { paddingHorizontal: 16 },
  resultHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  resultTitle: { color: Colors.text, fontSize: 18, fontWeight: '800' },
  resultBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(139,92,246,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  resultBadgeText: { color: Colors.primaryLight, fontSize: 11, fontWeight: '700' },
  resultImageContainer: { borderRadius: 20, overflow: 'hidden', position: 'relative', marginBottom: 14 },
  resultImage: { width: '100%', height: 380, resizeMode: 'cover' },
  resultOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 120 },
  resultInfo: { position: 'absolute', bottom: 14, left: 14, right: 14 },
  resultPrompt: { color: '#fff', fontSize: 14, fontWeight: '700', marginBottom: 4 },
  resultStyle: { color: 'rgba(255,255,255,0.6)', fontSize: 12 },
  resultActions: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  resultAction: { flex: 1, borderRadius: 14, overflow: 'hidden' },
  resultActionGrad: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 12 },
  resultActionSecondary: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, padding: 10 },
  resultActionText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  detailsCard: { padding: 16, marginBottom: 24 },
  detailsTitle: { color: Colors.text, fontWeight: '700', marginBottom: 14 },
  detailsList: { gap: 12 },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  detailLabel: { color: Colors.textSecondary, fontSize: 13, width: 120 },
  detailBar: { flex: 1, height: 6, backgroundColor: Colors.surfaceElevated, borderRadius: 3, overflow: 'hidden' },
  detailBarFill: { height: '100%', borderRadius: 3 },
  detailValue: { fontSize: 13, fontWeight: '700', width: 40, textAlign: 'right' },
});
