import { Tabs } from 'expo-router';
import { View, StyleSheet, Platform, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

function TabIcon({ name, color, focused, label }: { name: any; color: string; focused: boolean; label: string }) {
  if (label === 'Try On' && focused) {
    return (
      <View style={styles.tryOnActive}>
        <LinearGradient colors={['#7c3aed', '#ec4899']} style={styles.tryOnGrad}>
          <Ionicons name="shirt" size={22} color="#fff" />
        </LinearGradient>
      </View>
    );
  }
  if (label === 'Try On') {
    return (
      <View style={styles.tryOnInactive}>
        <Ionicons name="shirt-outline" size={22} color={color} />
      </View>
    );
  }
  return (
    <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
      <Ionicons name={name} size={22} color={color} />
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarBackground: () =>
          Platform.OS === 'ios'
            ? <BlurView intensity={80} style={StyleSheet.absoluteFill} tint="dark" />
            : <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(10,10,15,0.97)' }]} />,
        tabBarActiveTintColor: '#a78bfa',
        tabBarInactiveTintColor: '#475569',
        tabBarShowLabel: true,
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Feed',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name={focused ? 'home' : 'home-outline'} color={color} focused={focused} label="Feed" />
          ),
        }}
      />
      <Tabs.Screen
        name="tryon"
        options={{
          title: 'Try On',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="shirt" color={color} focused={focused} label="Try On" />
          ),
          tabBarActiveTintColor: '#fff',
        }}
      />
      <Tabs.Screen
        name="stylist"
        options={{
          title: 'Stylist',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name={focused ? 'sparkles' : 'sparkles-outline'} color={color} focused={focused} label="Stylist" />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name={focused ? 'compass' : 'compass-outline'} color={color} focused={focused} label="Explore" />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name={focused ? 'person' : 'person-outline'} color={color} focused={focused} label="Profile" />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(255,255,255,0.07)',
    height: 82,
    paddingBottom: 18,
    paddingTop: 8,
    elevation: 0,
    backgroundColor: 'transparent',
  },
  tabLabel: { fontSize: 10, fontWeight: '600', letterSpacing: 0.2 },
  iconWrap: { alignItems: 'center', justifyContent: 'center', width: 46, height: 34, borderRadius: 10 },
  iconWrapActive: { backgroundColor: 'rgba(124,58,237,0.15)' },
  tryOnActive: { marginBottom: 2 },
  tryOnGrad: { width: 50, height: 34, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  tryOnInactive: { width: 50, height: 34, alignItems: 'center', justifyContent: 'center' },
});
