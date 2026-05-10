import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { GlassCard } from '@/components/GlassCard';

const { width, height } = Dimensions.get('window');

const AR_ITEMS = [
  { id: '1', name: 'Black Blazer', emoji: '🥼' },
  { id: '2', name: 'White Tee', emoji: '👕' },
  { id: '3', name: 'Leather Jacket', emoji: '🧥' },
  { id: '4', name: 'Floral Dress', emoji: '👗' },
  { id: '5', name: 'Denim Jacket', emoji: '🧣' },
];

export default function ARTryOnScreen() {
  const [isTracking, setIsTracking] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [showPermission, setShowPermission] = useState(true);

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0a0a0f', '#12121a']} style={styles.cameraPlaceholder}>
        <View style={styles.scanLines} />

        <View style={styles.bodyOutline}>
          <LinearGradient
            colors={['rgba(139,92,246,0.3)', 'rgba(236,72,153,0.2)']}
            style={styles.bodyGlow}
          />
          <View style={styles.bodyShape}>
            <View style={styles.head} />
            <View style={styles.torso} />
            <View style={styles.legs} />
          </View>

          {isTracking && (
            <>
              <View style={[styles.trackPoint, { top: '15%', left: '30%' }]} />
              <View style={[styles.trackPoint, { top: '15%', right: '30%' }]} />
              <View style={[styles.trackPoint, { top: '35%', left: '20%' }]} />
              <View style={[styles.trackPoint, { top: '35%', right: '20%' }]} />
              <View style={[styles.trackPoint, { top: '55%', left: '25%' }]} />
              <View style={[styles.trackPoint, { top: '55%', right: '25%' }]} />
            </>
          )}
        </View>

        <View style={styles.cornerTL} />
        <View style={styles.cornerTR} />
        <View style={styles.cornerBL} />
        <View style={styles.cornerBR} />
      </LinearGradient>

      <SafeAreaView style={StyleSheet.absoluteFill} pointerEvents="box-none" edges={['top', 'bottom']}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
            <Ionicons name="close" size={22} color="#fff" />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <View style={[styles.liveIndicator, isTracking && styles.liveIndicatorActive]}>
              <View style={[styles.liveDot, isTracking && styles.liveDotActive]} />
              <Text style={styles.liveText}>{isTracking ? 'TRACKING' : 'READY'}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.flipBtn}>
            <Ionicons name="camera-reverse-outline" size={22} color="#fff" />
          </TouchableOpacity>
        </View>

        {showPermission && (
          <View style={styles.permissionOverlay}>
            <GlassCard style={styles.permissionCard} glow>
              <LinearGradient colors={['#8b5cf6', '#ec4899']} style={styles.permissionIcon}>
                <Ionicons name="videocam" size={32} color="#fff" />
              </LinearGradient>
              <Text style={styles.permissionTitle}>Live AR Try-On</Text>
              <Text style={styles.permissionText}>
                Experience real-time AI clothing overlay with body tracking. Clothes move naturally with your body!
              </Text>
              <View style={styles.permissionFeatures}>
                {[
                  '🎯 17-point body tracking',
                  '⚡ 60 FPS real-time rendering',
                  '🧵 Realistic fabric physics',
                  '💡 Auto lighting adjustment',
                ].map((f, i) => (
                  <Text key={i} style={styles.permissionFeature}>{f}</Text>
                ))}
              </View>
              <TouchableOpacity
                style={styles.permissionBtn}
                onPress={() => {
                  setShowPermission(false);
                  setIsTracking(true);
                }}
                activeOpacity={0.9}
              >
                <LinearGradient colors={['#8b5cf6', '#ec4899']} style={styles.permissionBtnGrad}>
                  <Text style={styles.permissionBtnText}>Enable AR Camera</Text>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => router.back()}>
                <Text style={styles.permissionCancel}>Not now</Text>
              </TouchableOpacity>
            </GlassCard>
          </View>
        )}

        {!showPermission && (
          <>
            <View style={styles.statusBar}>
              <GlassCard style={styles.statusCard}>
                <View style={styles.statusRow}>
                  <View style={styles.statusItem}>
                    <Ionicons name="body-outline" size={14} color={isTracking ? Colors.success : Colors.textMuted} />
                    <Text style={[styles.statusText, isTracking && { color: Colors.success }]}>
                      Body {isTracking ? 'Locked' : 'Searching'}
                    </Text>
                  </View>
                  <View style={styles.statusDivider} />
                  <View style={styles.statusItem}>
                    <Ionicons name="fitness-outline" size={14} color={Colors.primary} />
                    <Text style={[styles.statusText, { color: Colors.primary }]}>17 Points</Text>
                  </View>
                  <View style={styles.statusDivider} />
                  <View style={styles.statusItem}>
                    <Ionicons name="speedometer-outline" size={14} color={Colors.cyan} />
                    <Text style={[styles.statusText, { color: Colors.cyan }]}>60 FPS</Text>
                  </View>
                </View>
              </GlassCard>
            </View>

            <View style={styles.bottomControls}>
              <View style={styles.clothingSelector}>
                <Text style={styles.clothingSelectorLabel}>Select Item to Try</Text>
                <View style={styles.clothingItems}>
                  {AR_ITEMS.map((item) => (
                    <TouchableOpacity
                      key={item.id}
                      style={[styles.clothingItem, selectedItem === item.id && styles.clothingItemActive]}
                      onPress={() => setSelectedItem(item.id)}
                    >
                      <Text style={styles.clothingEmoji}>{item.emoji}</Text>
                      <Text style={[styles.clothingItemName, selectedItem === item.id && { color: Colors.primaryLight }]}>
                        {item.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.captureRow}>
                <TouchableOpacity style={styles.captureAction}>
                  <GlassCard style={styles.captureActionInner}>
                    <Ionicons name="images-outline" size={22} color={Colors.text} />
                  </GlassCard>
                </TouchableOpacity>

                <TouchableOpacity style={styles.captureBtn} activeOpacity={0.9}>
                  <LinearGradient colors={['#8b5cf6', '#ec4899']} style={styles.captureBtnGrad}>
                    <Ionicons name="camera" size={28} color="#fff" />
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity style={styles.captureAction}>
                  <GlassCard style={styles.captureActionInner}>
                    <Ionicons name="videocam-outline" size={22} color={Colors.text} />
                  </GlassCard>
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  cameraPlaceholder: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  scanLines: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.03,
  },
  bodyOutline: { alignItems: 'center', justifyContent: 'center', position: 'relative', height: height * 0.65 },
  bodyGlow: {
    position: 'absolute',
    width: 200,
    height: height * 0.6,
    borderRadius: 100,
    opacity: 0.3,
  },
  bodyShape: { alignItems: 'center', gap: 2, opacity: 0.4 },
  head: { width: 60, height: 60, borderRadius: 30, borderWidth: 2, borderColor: Colors.primary },
  torso: { width: 100, height: 140, borderRadius: 16, borderWidth: 2, borderColor: Colors.primary },
  legs: { width: 80, height: 160, borderRadius: 10, borderWidth: 2, borderColor: Colors.primary },
  trackPoint: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.primary,
    opacity: 0.8,
  },
  cornerTL: { position: 'absolute', top: 80, left: 20, width: 24, height: 24, borderTopWidth: 3, borderLeftWidth: 3, borderColor: Colors.primaryLight },
  cornerTR: { position: 'absolute', top: 80, right: 20, width: 24, height: 24, borderTopWidth: 3, borderRightWidth: 3, borderColor: Colors.primaryLight },
  cornerBL: { position: 'absolute', bottom: 200, left: 20, width: 24, height: 24, borderBottomWidth: 3, borderLeftWidth: 3, borderColor: Colors.primaryLight },
  cornerBR: { position: 'absolute', bottom: 200, right: 20, width: 24, height: 24, borderBottomWidth: 3, borderRightWidth: 3, borderColor: Colors.primaryLight },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: { alignItems: 'center' },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  liveIndicatorActive: { borderColor: Colors.success },
  liveDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.textMuted },
  liveDotActive: { backgroundColor: Colors.success },
  liveText: { color: '#fff', fontSize: 12, fontWeight: '800', letterSpacing: 1 },
  flipBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  permissionOverlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  permissionCard: { padding: 28, alignItems: 'center', width: '100%' },
  permissionIcon: { width: 80, height: 80, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  permissionTitle: { color: Colors.text, fontSize: 24, fontWeight: '800', marginBottom: 8 },
  permissionText: { color: Colors.textSecondary, fontSize: 14, textAlign: 'center', lineHeight: 21, marginBottom: 16 },
  permissionFeatures: { width: '100%', gap: 8, marginBottom: 24 },
  permissionFeature: { color: Colors.textSecondary, fontSize: 13 },
  permissionBtn: { width: '100%', borderRadius: 14, overflow: 'hidden', marginBottom: 12 },
  permissionBtnGrad: { paddingVertical: 16, alignItems: 'center' },
  permissionBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  permissionCancel: { color: Colors.textMuted, fontSize: 14 },
  statusBar: { paddingHorizontal: 16, paddingTop: 8 },
  statusCard: { padding: 10 },
  statusRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' },
  statusItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  statusText: { color: Colors.textSecondary, fontSize: 12, fontWeight: '600' },
  statusDivider: { width: 1, height: 16, backgroundColor: Colors.border },
  bottomControls: { position: 'absolute', bottom: 0, left: 0, right: 0 },
  clothingSelector: { paddingHorizontal: 16, marginBottom: 16 },
  clothingSelectorLabel: { color: '#fff', fontSize: 13, fontWeight: '700', marginBottom: 10 },
  clothingItems: { flexDirection: 'row', gap: 8 },
  clothingItem: {
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 14,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    minWidth: 64,
  },
  clothingItemActive: { borderColor: Colors.primary, backgroundColor: 'rgba(139,92,246,0.2)' },
  clothingEmoji: { fontSize: 24, marginBottom: 4 },
  clothingItemName: { color: 'rgba(255,255,255,0.7)', fontSize: 10, textAlign: 'center' },
  captureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  captureAction: { borderRadius: 18, overflow: 'hidden' },
  captureActionInner: { width: 52, height: 52, alignItems: 'center', justifyContent: 'center' },
  captureBtn: { width: 72, height: 72, borderRadius: 36, overflow: 'hidden' },
  captureBtnGrad: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
