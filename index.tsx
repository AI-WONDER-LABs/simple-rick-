import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Animated,
  Platform,
  KeyboardAvoidingView,
  Image,
  ImageBackground,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../constants/theme';
import { generateRickResponse } from '../../services/aiCodeAnalyzer';
import { useSettings } from '../../hooks/useSettings';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export default function SimpleRickAI() {
  const insets = useSafeAreaInsets();
  const { settings, isLoading } = useSettings();
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Simple Rick AI Terminal initialized. Ready to assist with code analysis and debugging.',
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (settings.autoExpand && !isLoading) {
      setIsExpanded(true);
    }
  }, [settings.autoExpand, isLoading]);

  const handleFloatingPress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    setIsExpanded(true);
  };

  const handleSend = () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      const response = generateRickResponse(inputText);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1000);
  };

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const BackgroundWrapper = ({ children }: { children: React.ReactNode }) => {
    if (settings.backgroundUri) {
      return (
        <ImageBackground
          source={{ uri: settings.backgroundUri }}
          style={styles.container}
          imageStyle={styles.backgroundImage}
        >
          {children}
        </ImageBackground>
      );
    }
    return <View style={styles.container}>{children}</View>;
  };

  if (!isExpanded) {
    return (
      <BackgroundWrapper>
        <View style={[styles.floatingOverlay, { paddingTop: insets.top }]}>
          <Animated.View
            style={[
              styles.floatingContainer,
              {
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <TouchableOpacity
              style={styles.floatingButton}
              onPress={handleFloatingPress}
              activeOpacity={0.8}
            >
              <Image
                source={{ uri: 'https://cdn-ai.onspace.ai/onspace/files/Q4fNwr5Pspg7uczryNFvQd/Screenshot_20251124-003129~2.png' }}
                style={styles.logoImage}
              />
              <View style={styles.onlineIndicator} />
            </TouchableOpacity>
          </Animated.View>
          
          <View style={styles.instructionContainer}>
            <Text style={styles.instructionText}>Tap Rick to start coding</Text>
            <Text style={[styles.instructionText, styles.instructionSubtext]}>
              AI Code Assistant
            </Text>
          </View>
        </View>
      </BackgroundWrapper>
    );
  }

  return (
    <BackgroundWrapper>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={[styles.expandedContainer, { paddingTop: insets.top }]}>
          {/* Header */}
          <View style={styles.header}>
            <Image
              source={{ uri: 'https://cdn-ai.onspace.ai/onspace/files/Q4fNwr5Pspg7uczryNFvQd/Screenshot_20251124-003129~2.png' }}
              style={styles.headerLogo}
            />
            <Text style={styles.headerText}>Simple Rick AI // Terminal</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setIsExpanded(false)}
            >
              <Ionicons name="close" size={24} color={colors.terminal.text} />
            </TouchableOpacity>
          </View>

          {/* Chat History */}
          <ScrollView
            ref={scrollViewRef}
            style={styles.chatHistory}
            contentContainerStyle={styles.chatContent}
            showsVerticalScrollIndicator={false}
          >
            {messages.map((message) => (
              <View
                key={message.id}
                style={[
                  styles.messageContainer,
                  message.isUser && styles.userMessageContainer,
                ]}
              >
                <Text
                  style={[
                    styles.messageText,
                    message.isUser ? styles.userMessage : styles.aiMessage,
                  ]}
                >
                  {message.isUser ? `> ${message.text}` : message.text}
                </Text>
              </View>
            ))}
            
            {isTyping && (
              <View style={styles.typingContainer}>
                <Text style={styles.typingText}>Rick: Analyzing code...</Text>
              </View>
            )}
          </ScrollView>

          {/* Input Area */}
          <View style={[styles.inputContainer, { paddingBottom: Math.max(insets.bottom, spacing.sm) }]}>
            <TextInput
              style={styles.input}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Paste code or ask a question..."
              placeholderTextColor={colors.terminal.hint}
              multiline
              maxLength={1000}
              onSubmitEditing={handleSend}
            />
            <TouchableOpacity
              style={styles.sendButton}
              onPress={handleSend}
              disabled={!inputText.trim()}
            >
              <Ionicons
                name="send"
                size={24}
                color={inputText.trim() ? colors.terminal.primary : colors.terminal.hint}
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </BackgroundWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.terminal.background,
  },
  backgroundImage: {
    opacity: 0.3,
  },
  keyboardView: {
    flex: 1,
  },
  floatingOverlay: {
    flex: 1,
  },
  floatingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  floatingButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.terminal.darkBg,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: colors.terminal.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  logoImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
  },
  onlineIndicator: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.terminal.primary,
  },
  instructionContainer: {
    position: 'absolute',
    bottom: 100,
    alignSelf: 'center',
    alignItems: 'center',
  },
  instructionText: {
    fontFamily: typography.terminal.fontFamily,
    fontSize: typography.terminal.sizes.lg,
    color: colors.terminal.primary,
    textAlign: 'center',
  },
  instructionSubtext: {
    fontSize: typography.terminal.sizes.md,
    marginTop: spacing.xs,
    opacity: 0.7,
  },
  expandedContainer: {
    flex: 1,
    backgroundColor: 'rgba(30, 30, 30, 0.95)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.terminal.headerBg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.terminal.primary,
  },
  headerLogo: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: spacing.sm,
  },
  headerText: {
    flex: 1,
    fontFamily: typography.terminal.fontFamily,
    fontSize: typography.terminal.sizes.lg,
    fontWeight: 'bold',
    color: colors.terminal.primary,
  },
  closeButton: {
    padding: spacing.xs,
  },
  chatHistory: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  chatContent: {
    padding: spacing.md,
  },
  messageContainer: {
    marginBottom: spacing.md,
  },
  userMessageContainer: {
    alignItems: 'flex-end',
  },
  messageText: {
    fontFamily: typography.terminal.fontFamily,
    fontSize: typography.terminal.sizes.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 8,
    maxWidth: '90%',
  },
  userMessage: {
    color: colors.rick.user,
    backgroundColor: colors.terminal.inputBg,
  },
  aiMessage: {
    color: colors.terminal.primary,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  typingContainer: {
    marginBottom: spacing.md,
  },
  typingText: {
    fontFamily: typography.terminal.fontFamily,
    fontSize: typography.terminal.sizes.md,
    color: colors.terminal.primary,
    fontStyle: 'italic',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: colors.terminal.headerBg,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.terminal.primary,
  },
  input: {
    flex: 1,
    backgroundColor: colors.terminal.inputBg,
    color: colors.terminal.text,
    fontFamily: typography.terminal.fontFamily,
    fontSize: typography.terminal.sizes.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: 8,
    maxHeight: 100,
  },
  sendButton: {
    padding: spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.sm,
  },
});
