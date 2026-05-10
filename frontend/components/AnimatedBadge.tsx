import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/Colors';

interface BadgeProps {
  label: string;
  variant?: 'primary' | 'gold' | 'cool' | 'success';
  style?: ViewStyle;
}

const gradients = {
  primary: [Colors.primary, Colors.primaryDark] as [string, string],
  gold: [Colors.gold, '#d97706'] as [string, string],
  cool: [Colors.cyan, Colors.primary] as [string, string],
  success: [Colors.success, '#059669'] as [string, string],
};

export function AnimatedBadge({ label, variant = 'primary', style }: BadgeProps) {
  return (
    <LinearGradient
      colors={gradients[variant]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={[styles.badge, style]}
    >
      <Text style={styles.label}>{label}</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  label: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});

export default AnimatedBadge;
