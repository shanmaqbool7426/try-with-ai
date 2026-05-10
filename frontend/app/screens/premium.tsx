import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { GlassCard } from '@/components/GlassCard';

const { width } = Dimensions.get('window');

const PLANS = [
  {
    id: 'monthly',
    name: 'Monthly',
    price: '$9.99',
    period: '/month',
    badge: null,
    savings: null,
  },
  {
    id: 'annual',
    name: 'Annual',
    price: '$4.99',
    period: '/month',
    badge: 'BEST VALUE',
    savings: 'Save 50%',
    billedAs: 'Billed as $59.99/year',
  },
  {
    id: 'lifetime',
    name: 'Lifetime',
    price: '$149',
    period: ' once',
    badge: 'FOREVER',
    savings: 'Best Deal',
  },
];

const FEATURES = [
  { icon: '✨', label: 'Unlimited AI Try-Ons', free: '5/day', pro: 'Unlimited' },
  { icon: '🎬', label: 'Video Try-On & Reels', free: false, pro: true },
  { icon: '🖼️', label: '4K HD Export', free: false, pro: true },
  { icon: '🚫', label: 'Remove Watermarks', free: false, pro: true },
  { icon: '💎', label: 'Premium Catalog (500+)', free: false, pro: true },
  { icon: '🤖', label: 'Priority AI Processing', free: false, pro: true },
  { icon: '🌟', label: 'Advanced AR Filters', free: false, pro: true },
  { icon: '📱', label: 'Instagram Story Export', free: false, pro: true },
  { icon: '🎨', label: 'AI Background Gen', free: '3/day', pro: 'Unlimited' },
  { icon: '💬', label: 'AI Stylist Unlimited', free: '10 msg/day', pro: 'Unlimited' },
];

export default function PremiumScreen() {
  const [selectedPlan, setSelectedPlan] = useState('annual');

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['rgba(245,158,11,0.15)', 'rgba(236,72,153,0.1)', 'transparent']}
        style={styles.bgGrad}
        pointerEvents="none"
      />

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="close" size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Premium</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={styles.heroSection}>
            <LinearGradient colors={['#f59e0b', '#ec4899']} style={styles.heroIcon}>
              <Ionicons name="diamond" size={48} color="#fff" />
            </LinearGradient>
            <Text style={styles.heroTitle}>Unlock Full AI Fashion</Text>
            <Text style={styles.heroSub}>
              Join 500,000+ fashion lovers using AI to transform their style
            </Text>

            <View style={styles.heroBadges}>
              {['HD Quality', 'Unlimited', 'No Watermarks'].map((b, i) => (
                <View key={i} style={styles.heroBadge}>
                  <Ionicons name="checkmark-circle" size={14} color={Colors.success} />
                  <Text style={styles.heroBadgeText}>{b}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.plansSection}>
            {PLANS.map((plan) => (
              <TouchableOpacity
                key={plan.id}
                style={[styles.planCard, selectedPlan === plan.id && styles.planCardSelected]}
                onPress={() => setSelectedPlan(plan.id)}
                activeOpacity={0.85}
              >
                {selectedPlan === plan.id ? (
                  <LinearGradient
                    colors={['rgba(245,158,11,0.15)', 'rgba(236,72,153,0.1)']}
                    style={styles.planCardGrad}
                  >
                    {plan.badge && (
                      <LinearGradient colors={['#f59e0b', '#ec4899']} style={styles.planBadge}>
                        <Text style={styles.planBadgeText}>{plan.badge}</Text>
                      </LinearGradient>
                    )}
                    <View style={styles.planContent}>
                      <View style={styles.planLeft}>
                        <View style={[styles.planRadio, { borderColor: Colors.gold }]}>
                          <View style={[styles.planRadioFill, { backgroundColor: Colors.gold }]} />
                        </View>
                        <View>
                          <Text style={styles.planName}>{plan.name}</Text>
                          {plan.billedAs && <Text style={styles.planBilledAs}>{plan.billedAs}</Text>}
                          {plan.savings && (
                            <LinearGradient colors={['#f59e0b', '#ec4899']} style={styles.savingsBadge}>
                              <Text style={styles.savingsText}>{plan.savings}</Text>
                            </LinearGradient>
                          )}
                        </View>
                      </View>
                      <View style={styles.planPricing}>
                        <Text style={[styles.planPrice, { color: Colors.goldLight }]}>{plan.price}</Text>
                        <Text style={styles.planPeriod}>{plan.period}</Text>
                      </View>
                    </View>
                  </LinearGradient>
                ) : (
                  <View style={styles.planCardInner}>
                    {plan.badge && (
                      <View style={[styles.planBadge, { backgroundColor: Colors.surfaceElevated }]}>
                        <Text style={[styles.planBadgeText, { color: Colors.textMuted }]}>{plan.badge}</Text>
                      </View>
                    )}
                    <View style={styles.planContent}>
                      <View style={styles.planLeft}>
                        <View style={styles.planRadio}>
                          <View style={styles.planRadioEmpty} />
                        </View>
                        <Text style={styles.planName}>{plan.name}</Text>
                      </View>
                      <View style={styles.planPricing}>
                        <Text style={styles.planPrice}>{plan.price}</Text>
                        <Text style={styles.planPeriod}>{plan.period}</Text>
                      </View>
                    </View>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.ctaBtn} activeOpacity={0.9}>
            <LinearGradient colors={['#f59e0b', '#ec4899']} style={styles.ctaBtnGrad}>
              <Ionicons name="diamond" size={20} color="#fff" />
              <Text style={styles.ctaBtnText}>
                Start Premium — {PLANS.find((p) => p.id === selectedPlan)?.price}
                {PLANS.find((p) => p.id === selectedPlan)?.period}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <Text style={styles.ctaDisclaimer}>7-day free trial • Cancel anytime • Secure payment</Text>

          <View style={styles.featuresSection}>
            <Text style={styles.featuresTitle}>What's Included</Text>
            <GlassCard style={styles.featuresTable}>
              <View style={styles.featuresHeader}>
                <Text style={styles.featuresHeaderCol} />
                <Text style={[styles.featuresHeaderCol, { color: Colors.textSecondary }]}>Free</Text>
                <LinearGradient colors={['#f59e0b', '#ec4899']} style={styles.proHeader}>
                  <Text style={styles.proHeaderText}>PRO</Text>
                </LinearGradient>
              </View>
              {FEATURES.map((feature, i) => (
                <View key={i} style={[styles.featureRow, i % 2 === 0 && styles.featureRowAlt]}>
                  <View style={styles.featureName}>
                    <Text style={styles.featureIcon}>{feature.icon}</Text>
                    <Text style={styles.featureLabel}>{feature.label}</Text>
                  </View>
                  <View style={styles.featureCell}>
                    {typeof feature.free === 'boolean' ? (
                      <Ionicons
                        name={feature.free ? 'checkmark-circle' : 'close-circle'}
                        size={18}
                        color={feature.free ? Colors.success : Colors.error}
                      />
                    ) : (
                      <Text style={styles.featureCellText}>{feature.free}</Text>
                    )}
                  </View>
                  <View style={styles.featureCell}>
                    {typeof feature.pro === 'boolean' ? (
                      <Ionicons name="checkmark-circle" size={18} color={Colors.success} />
                    ) : (
                      <Text style={[styles.featureCellText, { color: Colors.goldLight }]}>{feature.pro}</Text>
                    )}
                  </View>
                </View>
              ))}
            </GlassCard>
          </View>

          <View style={styles.trustSection}>
            {[
              { num: '500K+', label: 'Happy Users' },
              { num: '4.9★', label: 'App Rating' },
              { num: '10M+', label: 'Try-Ons Generated' },
            ].map((stat, i) => (
              <View key={i} style={styles.trustStat}>
                <Text style={styles.trustNum}>{stat.num}</Text>
                <Text style={styles.trustLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
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
  headerTitle: { color: Colors.text, fontSize: 18, fontWeight: '800' },
  scrollContent: { paddingBottom: 40 },
  heroSection: { alignItems: 'center', paddingHorizontal: 24, paddingTop: 20, paddingBottom: 28 },
  heroIcon: { width: 90, height: 90, borderRadius: 28, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  heroTitle: { color: Colors.text, fontSize: 28, fontWeight: '900', textAlign: 'center', letterSpacing: -0.5 },
  heroSub: { color: Colors.textSecondary, fontSize: 15, textAlign: 'center', marginTop: 8, lineHeight: 22 },
  heroBadges: { flexDirection: 'row', gap: 16, marginTop: 18 },
  heroBadge: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  heroBadgeText: { color: Colors.textSecondary, fontSize: 12 },
  plansSection: { paddingHorizontal: 16, gap: 10, marginBottom: 20 },
  planCard: {
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  planCardSelected: { borderColor: Colors.gold, borderWidth: 2 },
  planCardGrad: { padding: 16 },
  planCardInner: { padding: 16 },
  planBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    marginBottom: 10,
  },
  planBadgeText: { color: '#fff', fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  planContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  planLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  planRadio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  planRadioFill: { width: 10, height: 10, borderRadius: 5 },
  planRadioEmpty: {},
  planName: { color: Colors.text, fontSize: 16, fontWeight: '700' },
  planBilledAs: { color: Colors.textMuted, fontSize: 11, marginTop: 2 },
  savingsBadge: { marginTop: 4, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8, alignSelf: 'flex-start' },
  savingsText: { color: '#fff', fontSize: 10, fontWeight: '800' },
  planPricing: { alignItems: 'flex-end' },
  planPrice: { color: Colors.text, fontSize: 22, fontWeight: '900' },
  planPeriod: { color: Colors.textMuted, fontSize: 12 },
  ctaBtn: { marginHorizontal: 16, borderRadius: 18, overflow: 'hidden', marginBottom: 10 },
  ctaBtnGrad: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, padding: 18 },
  ctaBtnText: { color: '#fff', fontSize: 17, fontWeight: '800' },
  ctaDisclaimer: { color: Colors.textMuted, fontSize: 12, textAlign: 'center', marginBottom: 28 },
  featuresSection: { paddingHorizontal: 16 },
  featuresTitle: { color: Colors.text, fontSize: 20, fontWeight: '800', marginBottom: 14 },
  featuresTable: { overflow: 'hidden' },
  featuresHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: Colors.border },
  featuresHeaderCol: { flex: 1, fontSize: 12, fontWeight: '700', color: Colors.textMuted, textAlign: 'center' },
  proHeader: { flex: 1, paddingVertical: 4, borderRadius: 8, alignItems: 'center' },
  proHeaderText: { color: '#fff', fontSize: 12, fontWeight: '800' },
  featureRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 10 },
  featureRowAlt: { backgroundColor: 'rgba(255,255,255,0.02)' },
  featureName: { flex: 2, flexDirection: 'row', alignItems: 'center', gap: 8 },
  featureIcon: { fontSize: 14 },
  featureLabel: { color: Colors.textSecondary, fontSize: 12, flex: 1 },
  featureCell: { flex: 1, alignItems: 'center' },
  featureCellText: { color: Colors.textSecondary, fontSize: 11, fontWeight: '600', textAlign: 'center' },
  trustSection: { flexDirection: 'row', justifyContent: 'space-around', paddingHorizontal: 20, paddingVertical: 24 },
  trustStat: { alignItems: 'center' },
  trustNum: { color: Colors.text, fontSize: 22, fontWeight: '900' },
  trustLabel: { color: Colors.textMuted, fontSize: 12, marginTop: 2 },
});
