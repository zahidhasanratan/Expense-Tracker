import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useThemeStore } from '../store/useThemeStore';

/**
 * Privacy Policy Screen
 * Required for Google Play Store compliance
 */
const PrivacyPolicyScreen = ({ navigation }) => {
  const theme = useThemeStore((state) => state.theme);
  const isDark = theme === 'dark';

  const styles = getStyles(isDark);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <LinearGradient
        colors={isDark 
          ? ['#1a1a2e', '#16213e', '#0f3460'] 
          : ['#E8F5E9', '#C8E6C9', '#A5D6A7']
        }
        style={styles.gradient}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color={isDark ? '#FFFFFF' : '#212121'} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Privacy Policy</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <Text style={styles.lastUpdated}>Last Updated: {new Date().toLocaleDateString()}</Text>

            <Text style={styles.sectionTitle}>1. Introduction</Text>
            <Text style={styles.paragraph}>
              Expense Tracker ("we," "our," or "us") respects your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application.
            </Text>

            <Text style={styles.sectionTitle}>2. Information We Collect</Text>
            <Text style={styles.paragraph}>
              Our app stores all data locally on your device. We collect and store the following information:
            </Text>
            <Text style={styles.bulletPoint}>
              • Financial data (expenses, income, budgets, accounts)
            </Text>
            <Text style={styles.bulletPoint}>
              • Transaction details (amounts, categories, dates, notes)
            </Text>
            <Text style={styles.bulletPoint}>
              • App preferences (theme, currency, notification settings)
            </Text>
            <Text style={styles.paragraph}>
              All data is stored locally on your device using secure local storage. We do not transmit, sync, or share your financial data with any external servers or third parties.
            </Text>

            <Text style={styles.sectionTitle}>3. How We Use Your Information</Text>
            <Text style={styles.paragraph}>
              We use the information you provide solely to:
            </Text>
            <Text style={styles.bulletPoint}>
              • Provide expense tracking and budgeting features
            </Text>
            <Text style={styles.bulletPoint}>
              • Generate reports and analytics
            </Text>
            <Text style={styles.bulletPoint}>
              • Send local notifications and reminders (with your permission)
            </Text>
            <Text style={styles.paragraph}>
              Your data remains on your device and is never sent to external servers.
            </Text>

            <Text style={styles.sectionTitle}>4. Data Storage and Security</Text>
            <Text style={styles.paragraph}>
              All your financial data is stored locally on your device using secure local storage mechanisms. We implement appropriate technical measures to protect your data, including:
            </Text>
            <Text style={styles.bulletPoint}>
              • Local-only storage (no cloud sync)
            </Text>
            <Text style={styles.bulletPoint}>
              • Secure data encryption at rest
            </Text>
            <Text style={styles.bulletPoint}>
              • No network transmission of sensitive data
            </Text>

            <Text style={styles.sectionTitle}>5. Third-Party Services</Text>
            <Text style={styles.paragraph}>
              Our app uses the following third-party services:
            </Text>
            <Text style={styles.bulletPoint}>
              • <Text style={styles.bold}>Expo Notifications:</Text> For sending local notifications and reminders. Notification data is processed locally on your device.
            </Text>
            <Text style={styles.paragraph}>
              These services may have their own privacy policies. We recommend reviewing them.
            </Text>

            <Text style={styles.sectionTitle}>6. Permissions</Text>
            <Text style={styles.paragraph}>
              Our app requests the following permissions:
            </Text>
            <Text style={styles.bulletPoint}>
              • <Text style={styles.bold}>Storage:</Text> To export your data to CSV files
            </Text>
            <Text style={styles.bulletPoint}>
              • <Text style={styles.bold}>Notifications:</Text> To send reminders and budget alerts (optional, can be disabled in settings)
            </Text>
            <Text style={styles.paragraph}>
              You can revoke these permissions at any time through your device settings.
            </Text>

            <Text style={styles.sectionTitle}>7. Data Export and Deletion</Text>
            <Text style={styles.paragraph}>
              You have full control over your data:
            </Text>
            <Text style={styles.bulletPoint}>
              • Export all data to CSV format at any time
            </Text>
            <Text style={styles.bulletPoint}>
              • Delete all data using the "Reset All Data" option in settings
            </Text>
            <Text style={styles.bulletPoint}>
              • Uninstall the app to remove all local data
            </Text>

            <Text style={styles.sectionTitle}>8. Children's Privacy</Text>
            <Text style={styles.paragraph}>
              Our app is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13.
            </Text>

            <Text style={styles.sectionTitle}>9. Changes to This Privacy Policy</Text>
            <Text style={styles.paragraph}>
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
            </Text>

            <Text style={styles.sectionTitle}>10. Contact Us</Text>
            <Text style={styles.paragraph}>
              If you have any questions about this Privacy Policy, please contact us through the app settings or your app store listing.
            </Text>

            <Text style={styles.paragraph}>
              By using our app, you consent to this Privacy Policy.
            </Text>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const getStyles = (isDark) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    gradient: {
      flex: 1,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
    },
    backButton: {
      padding: 4,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: isDark ? '#FFFFFF' : '#212121',
    },
    placeholder: {
      width: 32,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      padding: 20,
      paddingBottom: 40,
    },
    content: {
      backgroundColor: isDark ? 'rgba(30, 30, 30, 0.9)' : 'rgba(255, 255, 255, 0.95)',
      borderRadius: 16,
      padding: 24,
      shadowColor: isDark ? '#000' : '#4CAF50',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 5,
      borderWidth: 1,
      borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(76, 175, 80, 0.2)',
    },
    lastUpdated: {
      fontSize: 12,
      color: isDark ? '#B0B0B0' : '#757575',
      marginBottom: 24,
      fontStyle: 'italic',
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: isDark ? '#FFFFFF' : '#212121',
      marginTop: 24,
      marginBottom: 12,
    },
    paragraph: {
      fontSize: 14,
      lineHeight: 22,
      color: isDark ? '#E0E0E0' : '#424242',
      marginBottom: 16,
    },
    bulletPoint: {
      fontSize: 14,
      lineHeight: 22,
      color: isDark ? '#E0E0E0' : '#424242',
      marginLeft: 16,
      marginBottom: 8,
    },
    bold: {
      fontWeight: '600',
      color: isDark ? '#FFFFFF' : '#212121',
    },
  });

export default PrivacyPolicyScreen;

