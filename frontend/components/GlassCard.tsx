import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '@/constants/Colors';

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  glow?: boolean;
  goldGlow?: boolean;
}

export function GlassCard({ children, style, glow = false, goldGlow = false }: GlassCardProps) {
  return (
    <View
      style={[
        styles.card,
        glow && styles.cardGlow,
        goldGlow && styles.cardGoldGlow,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(22,22,31,0.85)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },
  cardGlow: {
    borderColor: 'rgba(139,92,246,0.3)',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 15,
  },
  cardGoldGlow: {
    borderColor: 'rgba(245,158,11,0.4)',
    shadowColor: Colors.gold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 15,
  },
});

export default GlassCard;
