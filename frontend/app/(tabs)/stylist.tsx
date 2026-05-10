import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  Dimensions,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { GlassCard } from '@/components/GlassCard';
import { GradientButton } from '@/components/GradientButton';

const { width } = Dimensions.get('window');

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: number;
  suggestions?: string[];
  outfits?: { name: string; image: string }[];
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: '1',
    role: 'assistant',
    text: "Hey! I'm your AI Fashion Stylist ✨ I can help you find the perfect outfit for any occasion, analyze your body type, suggest color palettes, and keep you on trend. What are we styling today?",
    timestamp: Date.now() - 5000,
    suggestions: ['Outfit for a job interview', 'Beach vacation look', 'Date night outfit', 'Casual weekend style'],
  },
];

const OUTFIT_PROMPTS = [
  'Luxury black wedding suit',
  'Boho summer festival look',
  'Corporate power outfit',
  'Streetwear hypebeast',
  'Elegant cocktail dress',
  'Casual everyday look',
];

const AI_RESPONSES: Record<string, Message> = {
  default: {
    id: 'r1',
    role: 'assistant',
    text: "Great choice! Based on current trends and your style profile, here are my recommendations. I'd suggest focusing on clean silhouettes with bold accessories for maximum impact. The key is balancing proportion — if you go bold on top, keep the bottom minimal.",
    timestamp: Date.now(),
    suggestions: ['Show me similar styles', 'What colors work for me?', 'Generate this outfit'],
    outfits: [
      { name: 'Classic Power Look', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&q=80' },
      { name: 'Modern Chic', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300&q=80' },
    ],
  },
};

const BODY_TYPES = [
  { id: 'hourglass', label: 'Hourglass', icon: '⌛' },
  { id: 'pear', label: 'Pear', icon: '🍐' },
  { id: 'apple', label: 'Apple', icon: '🍎' },
  { id: 'rectangle', label: 'Rectangle', icon: '▬' },
  { id: 'inverted', label: 'Inverted △', icon: '🔺' },
];

const TRENDS = [
  { name: 'Quiet Luxury', desc: 'Understated elegance', color: '#8b5cf6' },
  { name: 'Mob Wife', desc: 'Bold & opulent', color: '#ec4899' },
  { name: 'Coastal Grandma', desc: 'Relaxed sophistication', color: '#06b6d4' },
  { name: 'Dark Academia', desc: 'Intellectual chic', color: '#f59e0b' },
];

export default function StylistScreen() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'generator' | 'trends'>('chat');
  const [generatorPrompt, setGeneratorPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedOutfit, setGeneratedOutfit] = useState<string | null>(null);
  const scrollRef = useRef<ScrollView>(null);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    await new Promise((r) => setTimeout(r, 1200 + Math.random() * 800));

    const aiMsg: Message = {
      ...AI_RESPONSES.default,
      id: Date.now().toString(),
      timestamp: Date.now(),
    };

    setIsTyping(false);
    setMessages((prev) => [...prev, aiMsg]);

    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const generateOutfit = async () => {
    if (!generatorPrompt.trim()) return;
    setIsGenerating(true);
    setGeneratedOutfit(null);

    await new Promise((r) => setTimeout(r, 2500));

    const mockOutfits = [
      'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&q=80',
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80',
    ];

    setGeneratedOutfit(mockOutfits[Math.floor(Math.random() * mockOutfits.length)]);
    setIsGenerating(false);
  };

  const renderMessage = (msg: Message) => (
    <View key={msg.id} style={[styles.messageRow, msg.role === 'user' && styles.messageRowUser]}>
      {msg.role === 'assistant' && (
        <LinearGradient colors={['#8b5cf6', '#ec4899']} style={styles.aiAvatar}>
          <Text style={styles.aiAvatarText}>✨</Text>
        </LinearGradient>
      )}

      <View style={[styles.messageBubble, msg.role === 'user' ? styles.userBubble : styles.aiBubble]}>
        <Text style={[styles.messageText, msg.role === 'user' && styles.userMessageText]}>
          {msg.text}
        </Text>

        {msg.outfits && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.outfitScroll}>
            {msg.outfits.map((outfit, i) => (
              <View key={i} style={styles.outfitCard}>
                <Image source={{ uri: outfit.image }} style={styles.outfitImage} />
                <Text style={styles.outfitName}>{outfit.name}</Text>
              </View>
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
  );

  return (
    <View style={styles.container}>
      <LinearGradient colors={['rgba(139,92,246,0.1)', 'transparent']} style={styles.bgGrad} pointerEvents="none" />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <LinearGradient colors={['#8b5cf6', '#ec4899']} style={styles.headerIcon}>
            <Ionicons name="sparkles" size={20} color="#fff" />
          </LinearGradient>
          <View>
            <Text style={styles.headerTitle}>AI Fashion Stylist</Text>
            <View style={styles.onlineRow}>
              <View style={styles.onlineDot} />
              <Text style={styles.onlineText}>Online • Trend Analysis Active</Text>
            </View>
          </View>
        </View>

        <View style={styles.tabs}>
          {[
            { id: 'chat', label: 'Chat Stylist', icon: 'chatbubbles-outline' },
            { id: 'generator', label: 'Outfit Gen', icon: 'sparkles-outline' },
            { id: 'trends', label: 'Trends', icon: 'trending-up-outline' },
          ].map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tab, activeTab === tab.id && styles.tabActive]}
              onPress={() => setActiveTab(tab.id as any)}
            >
              {activeTab === tab.id ? (
                <LinearGradient colors={['#8b5cf6', '#ec4899']} style={styles.tabGrad}>
                  <Ionicons name={tab.icon as any} size={14} color="#fff" />
                  <Text style={styles.tabTextActive}>{tab.label}</Text>
                </LinearGradient>
              ) : (
                <>
                  <Ionicons name={tab.icon as any} size={14} color={Colors.textMuted} />
                  <Text style={styles.tabText}>{tab.label}</Text>
                </>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {activeTab === 'chat' && (
          <KeyboardAvoidingView
            style={styles.chatContainer}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={90}
          >
            <ScrollView
              ref={scrollRef}
              style={styles.messagesScroll}
              contentContainerStyle={styles.messagesContent}
              showsVerticalScrollIndicator={false}
              onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
            >
              {messages.map(renderMessage)}

              {isTyping && (
                <View style={styles.messageRow}>
                  <LinearGradient colors={['#8b5cf6', '#ec4899']} style={styles.aiAvatar}>
                    <Text style={styles.aiAvatarText}>✨</Text>
                  </LinearGradient>
                  <View style={styles.typingBubble}>
                    <View style={styles.typingDots}>
                      {[0, 1, 2].map((i) => (
                        <View key={i} style={[styles.typingDot, { opacity: 0.3 + i * 0.3 }]} />
                      ))}
                    </View>
                  </View>
                </View>
              )}
            </ScrollView>

            <View style={styles.inputArea}>
              <TextInput
                style={styles.input}
                value={inputText}
                onChangeText={setInputText}
                placeholder="Ask your AI stylist anything..."
                placeholderTextColor={Colors.textMuted}
                multiline
                maxLength={500}
                onSubmitEditing={() => sendMessage(inputText)}
              />
              <TouchableOpacity
                style={[styles.sendBtn, !inputText.trim() && styles.sendBtnDisabled]}
                onPress={() => sendMessage(inputText)}
                disabled={!inputText.trim()}
              >
                <LinearGradient
                  colors={inputText.trim() ? ['#8b5cf6', '#ec4899'] : [Colors.surfaceElevated, Colors.surfaceElevated]}
                  style={styles.sendBtnGrad}
                >
                  <Ionicons name="send" size={18} color={inputText.trim() ? '#fff' : Colors.textMuted} />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        )}

        {activeTab === 'generator' && (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.genContent}>
            <Text style={styles.genTitle}>AI Outfit Generator</Text>
            <Text style={styles.genSub}>Describe any fashion look and AI creates it</Text>

            <TextInput
              style={styles.genInput}
              value={generatorPrompt}
              onChangeText={setGeneratorPrompt}
              placeholder='e.g. "Luxury black wedding suit with gold accessories"'
              placeholderTextColor={Colors.textMuted}
              multiline
              numberOfLines={3}
            />

            <Text style={styles.quickPromptsLabel}>Quick Prompts</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.quickPromptsRow}>
                {OUTFIT_PROMPTS.map((p, i) => (
                  <TouchableOpacity
                    key={i}
                    style={styles.quickPrompt}
                    onPress={() => setGeneratorPrompt(p)}
                  >
                    <Text style={styles.quickPromptText}>{p}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            <GradientButton
              title={isGenerating ? 'Generating...' : 'Generate Outfit ✨'}
              onPress={generateOutfit}
              loading={isGenerating}
              disabled={!generatorPrompt.trim()}
              style={{ marginTop: 20 }}
              size="lg"
              variant="gold"
            />

            {generatedOutfit && (
              <View style={styles.generatedResult}>
                <Text style={styles.generatedLabel}>Your AI-Generated Outfit</Text>
                <Image source={{ uri: generatedOutfit }} style={styles.generatedImage} />
                <View style={styles.generatedActions}>
                  <TouchableOpacity style={styles.genAction}>
                    <Ionicons name="heart-outline" size={22} color={Colors.textSecondary} />
                    <Text style={styles.genActionText}>Save</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.genAction}>
                    <Ionicons name="share-social-outline" size={22} color={Colors.textSecondary} />
                    <Text style={styles.genActionText}>Share</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.genAction} onPress={() => router.push('/tryon')}>
                    <Ionicons name="shirt-outline" size={22} color={Colors.primary} />
                    <Text style={[styles.genActionText, { color: Colors.primary }]}>Try On</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            <Text style={styles.bodyTypeLabel}>Body Type Styling</Text>
            <View style={styles.bodyTypes}>
              {BODY_TYPES.map((bt) => (
                <TouchableOpacity key={bt.id} style={styles.bodyTypeChip} onPress={() => sendMessage(`Style tips for ${bt.label} body type`)}>
                  <Text style={styles.bodyTypeIcon}>{bt.icon}</Text>
                  <Text style={styles.bodyTypeText}>{bt.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        )}

        {activeTab === 'trends' && (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.trendsContent}>
            <Text style={styles.genTitle}>2025 Fashion Trends</Text>
            <Text style={styles.genSub}>AI-curated from global runways & social media</Text>

            {TRENDS.map((trend, i) => (
              <GlassCard key={i} style={styles.trendCard}>
                <LinearGradient
                  colors={[`${trend.color}20`, 'transparent']}
                  style={styles.trendGrad}
                >
                  <View style={[styles.trendDot, { backgroundColor: trend.color }]} />
                  <View style={styles.trendInfo}>
                    <Text style={styles.trendName}>{trend.name}</Text>
                    <Text style={styles.trendDesc}>{trend.desc}</Text>
                  </View>
                  <TouchableOpacity
                    style={[styles.trendBtn, { backgroundColor: `${trend.color}20`, borderColor: `${trend.color}40` }]}
                    onPress={() => {
                      setActiveTab('chat');
                      sendMessage(`Tell me about the ${trend.name} fashion trend`);
                    }}
                  >
                    <Text style={[styles.trendBtnText, { color: trend.color }]}>Explore</Text>
                  </TouchableOpacity>
                </LinearGradient>
              </GlassCard>
            ))}

            <GlassCard style={styles.colorCard}>
              <Text style={styles.colorTitle}>2025 Color Palette</Text>
              <View style={styles.colorsRow}>
                {['#C5A880', '#7B9E87', '#B5789F', '#7098B8', '#C17F6E', '#9B8EC4'].map((color, i) => (
                  <TouchableOpacity key={i} style={[styles.colorSwatch, { backgroundColor: color }]}>
                    <Text style={styles.colorSwatchLabel}>{color}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </GlassCard>
          </ScrollView>
        )}
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
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
  },
  headerIcon: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { color: Colors.text, fontSize: 20, fontWeight: '800' },
  onlineRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 2 },
  onlineDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: Colors.success },
  onlineText: { color: Colors.textSecondary, fontSize: 12 },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderRadius: 12,
    backgroundColor: Colors.surfaceElevated,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  tabActive: { borderColor: Colors.primary, backgroundColor: 'transparent', padding: 0 },
  tabGrad: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, paddingVertical: 8, paddingHorizontal: 6, width: '100%' },
  tabText: { color: Colors.textMuted, fontSize: 11, fontWeight: '600' },
  tabTextActive: { color: '#fff', fontSize: 11, fontWeight: '700' },
  chatContainer: { flex: 1 },
  messagesScroll: { flex: 1 },
  messagesContent: { padding: 16, gap: 16, paddingBottom: 20 },
  messageRow: { flexDirection: 'row', gap: 10, alignItems: 'flex-end' },
  messageRowUser: { justifyContent: 'flex-end' },
  aiAvatar: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  aiAvatarText: { fontSize: 16 },
  messageBubble: { maxWidth: width * 0.72, borderRadius: 18, padding: 14 },
  aiBubble: { backgroundColor: Colors.surfaceElevated, borderWidth: 1, borderColor: Colors.border, borderBottomLeftRadius: 4 },
  userBubble: {
    borderBottomRightRadius: 4,
    overflow: 'hidden',
    backgroundColor: Colors.primary,
  },
  messageText: { color: Colors.text, fontSize: 14, lineHeight: 20 },
  userMessageText: { color: '#fff' },
  outfitScroll: { marginTop: 12 },
  outfitCard: { marginRight: 12, width: 100 },
  outfitImage: { width: 100, height: 120, borderRadius: 12, resizeMode: 'cover' },
  outfitName: { color: Colors.textSecondary, fontSize: 11, marginTop: 4, textAlign: 'center' },
  suggestions: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 10 },
  suggestionChip: {
    backgroundColor: 'rgba(139,92,246,0.12)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: 'rgba(139,92,246,0.25)',
  },
  suggestionText: { color: Colors.primaryLight, fontSize: 12 },
  typingBubble: { backgroundColor: Colors.surfaceElevated, borderRadius: 18, borderBottomLeftRadius: 4, padding: 14 },
  typingDots: { flexDirection: 'row', gap: 4 },
  typingDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.primary },
  inputArea: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 12,
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.background,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    color: Colors.text,
    fontSize: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    maxHeight: 100,
  },
  sendBtn: { width: 44, height: 44, borderRadius: 22, overflow: 'hidden' },
  sendBtnDisabled: { opacity: 0.5 },
  sendBtnGrad: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  genContent: { padding: 20, paddingBottom: 120 },
  genTitle: { color: Colors.text, fontSize: 22, fontWeight: '800', marginBottom: 4 },
  genSub: { color: Colors.textSecondary, fontSize: 13, marginBottom: 20 },
  genInput: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 16,
    padding: 16,
    color: Colors.text,
    fontSize: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  quickPromptsLabel: { color: Colors.textSecondary, fontSize: 13, fontWeight: '600', marginBottom: 10 },
  quickPromptsRow: { flexDirection: 'row', gap: 8, paddingBottom: 4 },
  quickPrompt: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  quickPromptText: { color: Colors.textSecondary, fontSize: 12 },
  generatedResult: { marginTop: 24 },
  generatedLabel: { color: Colors.text, fontSize: 16, fontWeight: '700', marginBottom: 12 },
  generatedImage: { width: '100%', height: 300, borderRadius: 20, resizeMode: 'cover' },
  generatedActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 16,
    padding: 12,
  },
  genAction: { alignItems: 'center', gap: 4 },
  genActionText: { color: Colors.textSecondary, fontSize: 12 },
  bodyTypeLabel: { color: Colors.text, fontSize: 16, fontWeight: '700', marginTop: 28, marginBottom: 12 },
  bodyTypes: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  bodyTypeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  bodyTypeIcon: { fontSize: 18 },
  bodyTypeText: { color: Colors.textSecondary, fontSize: 13 },
  trendsContent: { padding: 20, paddingBottom: 120 },
  trendCard: { marginBottom: 12 },
  trendGrad: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16 },
  trendDot: { width: 14, height: 14, borderRadius: 7 },
  trendInfo: { flex: 1 },
  trendName: { color: Colors.text, fontWeight: '700', fontSize: 15 },
  trendDesc: { color: Colors.textSecondary, fontSize: 12, marginTop: 2 },
  trendBtn: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 12, borderWidth: 1 },
  trendBtnText: { fontSize: 12, fontWeight: '700' },
  colorCard: { padding: 16, marginTop: 8 },
  colorTitle: { color: Colors.text, fontWeight: '700', marginBottom: 14 },
  colorsRow: { flexDirection: 'row', gap: 10, flexWrap: 'wrap' },
  colorSwatch: { width: 48, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'flex-end', padding: 2 },
  colorSwatchLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 7, fontWeight: '600' },
});
