import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  Switch,
  ImageBackground,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, backgroundPresets } from '../../constants/theme';
import { useSettings } from '../../hooks/useSettings';

export default function Settings() {
  const insets = useSafeAreaInsets();
  const { settings, updateSettings, resetSettings } = useSettings();

  const handleBackgroundSelect = (uri: string | null, name: string) => {
    updateSettings({ backgroundUri: uri, backgroundName: name });
  };

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

  return (
    <BackgroundWrapper>
      <View style={[styles.overlay, { paddingTop: insets.top }]}>
        {/* Header */}
        <View style={styles.header}>
          <Ionicons name="settings" size={28} color={colors.terminal.primary} />
          <Text style={styles.headerText}>Settings // Configuration</Text>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Background Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Background Theme</Text>
            <Text style={styles.sectionSubtitle}>
              Current: {settings.backgroundName}
            </Text>

            <View style={styles.backgroundGrid}>
              {backgroundPresets.map((preset) => (
                <TouchableOpacity
                  key={preset.id}
                  style={[
                    styles.backgroundCard,
                    settings.backgroundName === preset.name && styles.backgroundCardActive,
                  ]}
                  onPress={() => handleBackgroundSelect(preset.uri, preset.name)}
                >
                  {preset.uri ? (
                    <Image source={{ uri: preset.uri }} style={styles.backgroundPreview} />
                  ) : (
                    <View style={[styles.backgroundPreview, styles.backgroundPreviewBlack]}>
                      <Ionicons name="square" size={40} color={colors.terminal.background} />
                    </View>
                  )}
                  <Text style={styles.backgroundName}>{preset.name}</Text>
                  {settings.backgroundName === preset.name && (
                    <View style={styles.activeIndicator}>
                      <Ionicons name="checkmark-circle" size={24} color={colors.terminal.primary} />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Behavior Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Behavior</Text>
            
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Auto-expand on launch</Text>
                <Text style={styles.settingDescription}>
                  Skip floating button, go straight to chat
                </Text>
              </View>
              <Switch
                value={settings.autoExpand}
                onValueChange={(value) => updateSettings({ autoExpand: value })}
                trackColor={{ false: colors.terminal.inputBg, true: colors.terminal.secondary }}
                thumbColor={settings.autoExpand ? colors.terminal.primary : colors.terminal.hint}
              />
            </View>
          </View>

          {/* About Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            
            <View style={styles.aboutCard}>
              <Image
                source={{ uri: 'https://cdn-ai.onspace.ai/onspace/files/Q4fNwr5Pspg7uczryNFvQd/Screenshot_20251124-003129~2.png' }}
                style={styles.aboutLogo}
              />
              <Text style={styles.aboutTitle}>Simple Rick AI</Text>
              <Text style={styles.aboutVersion}>Version 1.0.0</Text>
              <Text style={styles.aboutDescription}>
                AI-powered code assistant with Rick's personality.
                Specialized in debugging, code analysis, and React development.
              </Text>
            </View>
          </View>

          {/* Reset Section */}
          <View style={styles.section}>
            <TouchableOpacity style={styles.resetButton} onPress={resetSettings}>
              <Ionicons name="refresh" size={20} color={colors.rick.error} />
              <Text style={styles.resetText}>Reset to Defaults</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.bottomSpacer} />
        </ScrollView>
      </View>
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
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
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
  headerText: {
    flex: 1,
    marginLeft: spacing.md,
    fontFamily: typography.terminal.fontFamily,
    fontSize: typography.terminal.sizes.lg,
    fontWeight: 'bold',
    color: colors.terminal.primary,
  },
  content: {
    flex: 1,
  },
  section: {
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.terminal.inputBg,
  },
  sectionTitle: {
    fontFamily: typography.terminal.fontFamily,
    fontSize: typography.terminal.sizes.lg,
    fontWeight: 'bold',
    color: colors.terminal.primary,
    marginBottom: spacing.xs,
  },
  sectionSubtitle: {
    fontFamily: typography.terminal.fontFamily,
    fontSize: typography.terminal.sizes.sm,
    color: colors.terminal.hint,
    marginBottom: spacing.md,
  },
  backgroundGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -spacing.xs,
  },
  backgroundCard: {
    width: '48%',
    margin: '1%',
    backgroundColor: colors.terminal.darkBg,
    borderRadius: 8,
    padding: spacing.sm,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  backgroundCardActive: {
    borderColor: colors.terminal.primary,
  },
  backgroundPreview: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 4,
    marginBottom: spacing.xs,
  },
  backgroundPreviewBlack: {
    backgroundColor: colors.terminal.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundName: {
    fontFamily: typography.terminal.fontFamily,
    fontSize: typography.terminal.sizes.sm,
    color: colors.terminal.text,
    textAlign: 'center',
  },
  activeIndicator: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.terminal.darkBg,
    padding: spacing.md,
    borderRadius: 8,
    marginBottom: spacing.sm,
  },
  settingInfo: {
    flex: 1,
    marginRight: spacing.md,
  },
  settingLabel: {
    fontFamily: typography.terminal.fontFamily,
    fontSize: typography.terminal.sizes.md,
    color: colors.terminal.text,
    marginBottom: spacing.xs / 2,
  },
  settingDescription: {
    fontFamily: typography.terminal.fontFamily,
    fontSize: typography.terminal.sizes.sm,
    color: colors.terminal.hint,
  },
  aboutCard: {
    backgroundColor: colors.terminal.darkBg,
    borderRadius: 8,
    padding: spacing.lg,
    alignItems: 'center',
  },
  aboutLogo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: spacing.md,
  },
  aboutTitle: {
    fontFamily: typography.terminal.fontFamily,
    fontSize: typography.terminal.sizes.xl,
    fontWeight: 'bold',
    color: colors.terminal.primary,
    marginBottom: spacing.xs,
  },
  aboutVersion: {
    fontFamily: typography.terminal.fontFamily,
    fontSize: typography.terminal.sizes.sm,
    color: colors.terminal.hint,
    marginBottom: spacing.md,
  },
  aboutDescription: {
    fontFamily: typography.terminal.fontFamily,
    fontSize: typography.terminal.sizes.md,
    color: colors.terminal.text,
    textAlign: 'center',
    lineHeight: 20,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
    padding: spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.rick.error,
  },
  resetText: {
    fontFamily: typography.terminal.fontFamily,
    fontSize: typography.terminal.sizes.md,
    color: colors.rick.error,
    marginLeft: spacing.sm,
  },
  bottomSpacer: {
    height: 100,
  },
});
