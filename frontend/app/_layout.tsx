import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5,
    },
  },
});

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <QueryClientProvider client={queryClient}>
        <StatusBar style="light" backgroundColor="#0a0a0f" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="screens/tryon-result" options={{ headerShown: false, presentation: 'modal' }} />
          <Stack.Screen name="screens/outfit-generator" options={{ headerShown: false, presentation: 'modal' }} />
          <Stack.Screen name="screens/ar-tryon" options={{ headerShown: false, presentation: 'fullScreenModal' }} />
          <Stack.Screen name="screens/post-detail" options={{ headerShown: false, presentation: 'modal' }} />
          <Stack.Screen name="screens/premium" options={{ headerShown: false, presentation: 'modal' }} />
        </Stack>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0a0a0f',
  },
});
