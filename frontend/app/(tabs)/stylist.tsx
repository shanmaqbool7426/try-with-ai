import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, KeyboardAvoidingView, Platform, Image, Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: number;
  suggestions?: string[];
  outfits?: { name: string; image: string }[];
}

const INIT_MESSAGES: Message[] = [
  {
    id: '1', role: 'assistant',
    text: "Hi! I'm your AI Fashion Stylist ✨ I can help with outfits, body type styling, color analysis, and the latest trends. What are we creating today?",
    timestamp: Date.now() - 5000,
    suggestions: ['Outfit for a job interview', 'Beach vacation look', 'Bridal styling tips', 'Eastern wear ideas'],
  },
];

const AI_RESPONSES = [
  "Based on current trends, I'd suggest a clean silhouette with bold accessories. Balance is key — if you go statement on top, keep the bottom minimal.",
  "For your occasion, I recommend rich jewel tones — emerald, sapphire, or burgundy. These colors photograph beautifully and feel timeless.",
  "For eastern wear, a flowy shalwar kameez with intricate embroidery paired with minimal jewelry creates the perfect balance of tradition and modernity.",
  "For a bridal look, consider layering — a fitted bodice with a flowing lehenga creates an hourglass illusion. Add a dupatta for that elegant finishing touch.",
  "Streetwear is all about proportion play — oversized top with slim bottoms, or vice versa. Add a statement sneaker and minimal jewelry.",
];

const QUICK_PROMPTS = [
  'Luxury wedding outfit', 'Office power look', 'Casual Friday', 'Eid outfit ideas',
  'Date night dress', 'Traditional abaya', 'Beach vacation', 'Streetwear fit',
];

const TRENDS_2025 = [
  { name: 'Quiet Luxury', desc: 'Understated, logo-free elegance', color: '#8b5cf6', emoji: '💎' },
  { name: 'Mob Wife Aesthetic', desc: 'Bold furs, dramatic & opulent', color: '#ec4899', emoji: '🐆' },
  { name: 'Coastal Grandmother', desc: 'Linen, stripes & relaxed chic', color: '#06b6d4', emoji: '🌊' },
  { name: 'Dark Academia', desc: 'Tweed, oxfords & intellectual tones', color: '#f59e0b', emoji: '📚' },
  { name: 'Brat Summer', desc: 'Lime green, crop tops & attitude', color: '#84cc16', emoji: '✌️' },
  { name: 'Boho Revival', desc: 'Flowing, earthy & free-spirited', color: '#f97316', emoji: '🌸' },
];

const BODY_TYPES = [
  { id: 'hourglass', label: 'Hourglass', emoji: '⌛' },
  { id: 'pear', label: 'Pear', emoji: '🍐' },
  { id: 'apple', label: 'Apple', emoji: '🍎' },
  { id: 'rectangle', label: 'Rectangle', emoji: '▬' },
  { id: 'petite', label: 'Petite', emoji: '🌸' },
  { id: 'tall', label: 'Tall', emoji: '🦒' },
];

export default function StylistScreen() {
  const [messages, setMessages] = useState<Message[]>(INIT_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'trends' | 'body'>('chat');
  const scrollRef = useRef<ScrollView>(null);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), role: 'user', text, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);
    await new Promise(r => setTimeout(r, 1000 + Math.random() * 800));
    const aiMsg: Message = {
      id: (Date.now() + 1).toString(), role: 'assistant', timestamp: Date.now(),
      text: AI_RESPONSES[Math.floor(Math.random() * AI_RESPONSES.length)],
      suggestions: ['Tell me more', 'Show me examples', 'Generate this outfit'],
      outfits: [
        { name: 'Look 1', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300&q=80' },
        { name: 'Look 2', image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=300&q=80' },
      ],
    };
    setIsTyping(false);
    setMessages(prev => [...prev, aiMsg]);
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const TABS = [
    { id: 'chat', label: 'Chat', icon: 'chatbubbles-outline' },
    { id: 'trends', label: '2025 Trends', icon: 'trending-up-outline' },
    { id: 'body', label: 'Body Type', icon: 'body-outline' },
  ];

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <LinearGradient colors={['#7c3aed', '#ec4899']} style={styles.headerAvatar}>
            <Text style={{ fontSize: 20 }}>✨</Text>
          </LinearGradient>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>AI Fashion Stylist</Text>
            <View style={styles.onlineRow}>
              <View style={styles.onlineDot} />
              <Text style={styles.onlineText}>Online • Trend-aware AI</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.outfitGenBtn} onPress={() => router.push('/screens/outfit-generator')}>
            <LinearGradient colors={['#f59e0b', '#ec4899']} style={styles.outfitGenGrad}>
              <Ionicons name="sparkles" size={14} color="#fff" />
              <Text style={styles.outfitGenText}>Generate</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View style={styles.tabRow}>
          {TABS.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tab, activeTab === tab.id && styles.tabActive]}
              onPress={() => setActiveTab(tab.id as any)}
            >
              {activeTab === tab.id
                ? <LinearGradient colors={['#7c3aed', '#ec4899']} style={styles.tabGrad}>
                    <Ionicons name={tab.icon as any} size={14} color="#fff" />
                    <Text style={styles.tabTextActive}>{tab.label}</Text>
                  </LinearGradient>
                : <>
                    <Ionicons name={tab.icon as any} size={14} color="#475569" />
                    <Text style={styles.tabText}>{tab.label}</Text>
                  </>}
            </TouchableOpacity>
          ))}
        </View>

        {activeTab === 'chat' && (
          <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={90}>
            <ScrollView
              ref={scrollRef}
              style={styles.chatScroll}
              contentContainerStyle={styles.chatContent}
              showsVerticalScrollIndicator={false}
            >
              {messages.map((msg) => (
                <View key={msg.id} style={[styles.msgRow, msg.role === 'user' && styles.msgRowUser]}>
                  {msg.role === 'assistant' && (
                    <LinearGradient colors={['#7c3aed', '#ec4899']} style={styles.aiAvatar}>
                      <Text>✨</Text>
                    </LinearGradient>
                  )}
                  <View style={[styles.msgBubble, msg.role === 'user' ? styles.userBubble : styles.aiBubble]}>
                    <Text style={[styles.msgText, msg.role === 'user' && styles.userMsgText]}>{msg.text}</Text>
                    {msg.outfits && (
                      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.outfitScroll}>
                        {msg.outfits.map((o, i) => (
                          <TouchableOpacity key={i} style={styles.outfitCard} onPress={() => router.push('/tryon')}>
                            <Image source={{ uri: o.image }} style={styles.outfitImg} />
                            <Text style={styles.outfitCardName}>{o.name}</Text>
                            <Text style={styles.tryOnLink}>Try On →</Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    )}
                    {msg.suggestions && (
                      <View style={styles.suggestions}>
                        {msg.suggestions.map((s, i) => (
                          <TouchableOpacity key={i} style={styles.suggestionChip} onPress={() => sendMessage(s)}>
                            <Text style={styles.suggestionText}>{s}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}
                  </View>
                </View>
              ))}
              {isTyping && (
                <View style={styles.msgRow}>
                  <LinearGradient colors={['#7c3aed', '#ec4899']} style={styles.aiAvatar}>
                    <Text>✨</Text>
                  </LinearGradient>
                  <View style={styles.typingBubble}>
                    {[0, 1, 2].map(i => (
                      <View key={i} style={[styles.typingDot, { opacity: 0.4 + i * 0.25 }]} />
                    ))}
                  </View>
                </View>
              )}
            </ScrollView>

            <View style={styles.quickRow}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.quickRowInner}>
                  {QUICK_PROMPTS.map((p, i) => (
                    <TouchableOpacity key={i} style={styles.quickChip} onPress={() => sendMessage(p)}>
                      <Text style={styles.quickChipText}>{p}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>

            <View style={styles.inputArea}>
              <TextInput
                style={styles.input}
                value={inputText}
                onChangeText={setInputText}
                placeholder="Ask your stylist anything..."
                placeholderTextColor="#475569"
                multiline
                maxLength={500}
              />
              <TouchableOpacity
                style={[styles.sendBtn, !inputText.trim() && { opacity: 0.4 }]}
                onPress={() => sendMessage(inputText)}
                disabled={!inputText.trim()}
              >
                <LinearGradient colors={['#7c3aed', '#ec4899']} style={styles.sendBtnGrad}>
                  <Ionicons name="send" size={18} color="#fff" />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        )}

        {activeTab === 'trends' && (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.tabContent}>
            <Text style={styles.tabSectionTitle}>2025 Fashion Trends</Text>
            <Text style={styles.tabSectionSub}>AI-curated from global runways & social media</Text>
            {TRENDS_2025.map((trend, i) => (
              <TouchableOpacity
                key={i}
                style={styles.trendCard}
                activeOpacity={0.85}
                onPress={() => { setActiveTab('chat'); sendMessage(`Tell me about ${trend.name} trend and outfit ideas`); }}
              >
                <View style={[styles.trendEmojiBg, { backgroundColor: `${trend.color}20` }]}>
                  <Text style={styles.trendEmoji}>{trend.emoji}</Text>
                </View>
                <View style={styles.trendInfo}>
                  <Text style={styles.trendName}>{trend.name}</Text>
                  <Text style={styles.trendDesc}>{trend.desc}</Text>
                </View>
                <View style={[styles.trendExploreBtn, { borderColor: `${trend.color}50`, backgroundColor: `${trend.color}15` }]}>
                  <Text style={[styles.trendExploreTxt, { color: trend.color }]}>Explore</Text>
                </View>
              </TouchableOpacity>
            ))}
            <Text style={styles.tabSectionTitle} >2025 Colors</Text>
            <View style={styles.colorsGrid}>
              {['#C5A880', '#7B9E87', '#B5789F', '#7098B8', '#C17F6E', '#9B8EC4', '#D4B896', '#6B8F71'].map((color, i) => (
                <TouchableOpacity key={i} style={[styles.colorSwatch, { backgroundColor: color }]}>
                  <Text style={styles.colorHex} numberOfLines={1}>{color}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        )}

        {activeTab === 'body' && (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.tabContent}>
            <Text style={styles.tabSectionTitle}>Body Type Styling</Text>
            <Text style={styles.tabSectionSub}>Get personalized outfit recommendations for your shape</Text>
            <View style={styles.bodyGrid}>
              {BODY_TYPES.map((bt) => (
                <TouchableOpacity
                  key={bt.id}
                  style={styles.bodyCard}
                  activeOpacity={0.85}
                  onPress={() => { setActiveTab('chat'); sendMessage(`Give me outfit tips for ${bt.label} body type`); }}
                >
                  <Text style={styles.bodyEmoji}>{bt.emoji}</Text>
                  <Text style={styles.bodyLabel}>{bt.label}</Text>
                  <Text style={styles.bodyAction}>Get tips →</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.colorAnalysisCard}>
              <LinearGradient colors={['rgba(124,58,237,0.12)', 'rgba(236,72,153,0.08)']} style={styles.colorAnalysisGrad}>
                <Text style={styles.colorAnalysisTitle}>Skin Tone Color Analysis</Text>
                <Text style={styles.colorAnalysisSub}>Discover which colors suit you best</Text>
                <View style={styles.undertoneRow}>
                  {['Warm', 'Cool', 'Neutral', 'Olive'].map((u) => (
                    <TouchableOpacity
                      key={u}
                      style={styles.undertoneChip}
                      onPress={() => { setActiveTab('chat'); sendMessage(`What colors suit ${u} skin undertone?`); }}
                    >
                      <Text style={styles.undertoneText}>{u}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </LinearGradient>
            </View>
          </ScrollView>
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0f' },
  safeArea: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 18, paddingTop: 10, paddingBottom: 14 },
  headerAvatar: { width: 46, height: 46, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { color: '#f8fafc', fontSize: 18, fontWeight: '800' },
  onlineRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 2 },
  onlineDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#10b981' },
  onlineText: { color: '#475569', fontSize: 12 },
  outfitGenBtn: { borderRadius: 20, overflow: 'hidden' },
  outfitGenGrad: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 12, paddingVertical: 7 },
  outfitGenText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  tabRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 8, marginBottom: 14 },
  tab: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5,
    paddingVertical: 9, paddingHorizontal: 6, borderRadius: 12,
    backgroundColor: '#16161f', borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)', overflow: 'hidden',
  },
  tabActive: { backgroundColor: 'transparent', borderColor: 'transparent', padding: 0 },
  tabGrad: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, paddingVertical: 9, paddingHorizontal: 6, width: '100%' },
  tabText: { color: '#475569', fontSize: 11, fontWeight: '600' },
  tabTextActive: { color: '#fff', fontSize: 11, fontWeight: '700' },
  chatScroll: { flex: 1 },
  chatContent: { padding: 16, gap: 16, paddingBottom: 16 },
  msgRow: { flexDirection: 'row', gap: 10, alignItems: 'flex-end' },
  msgRowUser: { justifyContent: 'flex-end' },
  aiAvatar: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  msgBubble: { maxWidth: width * 0.75, borderRadius: 18, padding: 13 },
  aiBubble: { backgroundColor: '#16161f', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', borderBottomLeftRadius: 4 },
  userBubble: { backgroundColor: '#7c3aed', borderBottomRightRadius: 4 },
  msgText: { color: '#f8fafc', fontSize: 14, lineHeight: 21 },
  userMsgText: { color: '#fff' },
  outfitScroll: { marginTop: 12 },
  outfitCard: { marginRight: 10, width: 100 },
  outfitImg: { width: 100, height: 120, borderRadius: 12 },
  outfitCardName: { color: '#94a3b8', fontSize: 11, marginTop: 5, textAlign: 'center' },
  tryOnLink: { color: '#a78bfa', fontSize: 11, fontWeight: '700', textAlign: 'center', marginTop: 2 },
  suggestions: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 10 },
  suggestionChip: {
    backgroundColor: 'rgba(124,58,237,0.15)', borderRadius: 12,
    paddingHorizontal: 10, paddingVertical: 5,
    borderWidth: 1, borderColor: 'rgba(124,58,237,0.3)',
  },
  suggestionText: { color: '#a78bfa', fontSize: 12 },
  typingBubble: { backgroundColor: '#16161f', borderRadius: 18, borderBottomLeftRadius: 4, padding: 14, flexDirection: 'row', gap: 5 },
  typingDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#7c3aed' },
  quickRow: { paddingBottom: 6 },
  quickRowInner: { flexDirection: 'row', gap: 8, paddingHorizontal: 16, paddingBottom: 4 },
  quickChip: {
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16,
    backgroundColor: '#16161f', borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)',
  },
  quickChipText: { color: '#64748b', fontSize: 12 },
  inputArea: {
    flexDirection: 'row', alignItems: 'flex-end', padding: 12, gap: 10,
    borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.06)',
  },
  input: {
    flex: 1, backgroundColor: '#16161f', borderRadius: 20,
    paddingHorizontal: 16, paddingVertical: 10, color: '#f8fafc',
    fontSize: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)', maxHeight: 100,
  },
  sendBtn: { width: 44, height: 44, borderRadius: 22, overflow: 'hidden' },
  sendBtnGrad: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  tabContent: { padding: 18, paddingBottom: 120 },
  tabSectionTitle: { color: '#f8fafc', fontSize: 20, fontWeight: '800', marginBottom: 6, marginTop: 8 },
  tabSectionSub: { color: '#64748b', fontSize: 13, marginBottom: 20 },
  trendCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: '#12121a', borderRadius: 18, padding: 14,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', marginBottom: 10,
  },
  trendEmojiBg: { width: 50, height: 50, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  trendEmoji: { fontSize: 24 },
  trendInfo: { flex: 1 },
  trendName: { color: '#f8fafc', fontWeight: '700', fontSize: 15 },
  trendDesc: { color: '#64748b', fontSize: 12, marginTop: 3 },
  trendExploreBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, borderWidth: 1 },
  trendExploreTxt: { fontSize: 12, fontWeight: '700' },
  colorsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 16 },
  colorSwatch: { width: (width - 66) / 4, height: 60, borderRadius: 14, alignItems: 'center', justifyContent: 'flex-end', padding: 4 },
  colorHex: { color: 'rgba(255,255,255,0.7)', fontSize: 8, fontWeight: '600' },
  bodyGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  bodyCard: {
    width: (width - 56) / 2, backgroundColor: '#12121a', borderRadius: 18,
    padding: 16, alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
  },
  bodyEmoji: { fontSize: 32, marginBottom: 8 },
  bodyLabel: { color: '#f8fafc', fontWeight: '700', fontSize: 14, marginBottom: 4 },
  bodyAction: { color: '#a78bfa', fontSize: 12 },
  colorAnalysisCard: { borderRadius: 18, overflow: 'hidden' },
  colorAnalysisGrad: { padding: 20 },
  colorAnalysisTitle: { color: '#f8fafc', fontSize: 17, fontWeight: '800', marginBottom: 4 },
  colorAnalysisSub: { color: '#64748b', fontSize: 13, marginBottom: 16 },
  undertoneRow: { flexDirection: 'row', gap: 10, flexWrap: 'wrap' },
  undertoneChip: {
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20,
    backgroundColor: 'rgba(124,58,237,0.2)', borderWidth: 1, borderColor: 'rgba(124,58,237,0.4)',
  },
  undertoneText: { color: '#a78bfa', fontSize: 13, fontWeight: '600' },
});
