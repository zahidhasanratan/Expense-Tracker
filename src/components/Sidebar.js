import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Animated,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeStore } from '../store/useThemeStore';
import { useCurrencyStore } from '../store/useCurrencyStore';
import { useExpenseStore } from '../store/useExpenseStore';
import { formatCurrency } from '../utils/format';
import { getStartOfMonth, getEndOfMonth } from '../utils/format';

/**
 * Sidebar Component
 * Professional mobile app navigation sidebar
 */
const Sidebar = ({ visible, onClose, navigation, currentRoute }) => {
  const theme = useThemeStore((state) => state.theme);
  const currency = useCurrencyStore((state) => state.currency);
  const expenses = useExpenseStore((state) => state.expenses);
  const getTotalByDateRange = useExpenseStore((state) => state.getTotalByDateRange);
  const isDark = theme === 'dark';

  const slideAnim = React.useRef(new Animated.Value(-320)).current;
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  // Calculate monthly total
  const monthlyTotal = React.useMemo(() => {
    const start = getStartOfMonth(new Date());
    const end = getEndOfMonth(new Date());
    return getTotalByDateRange(start, end);
  }, [expenses, getTotalByDateRange]);

  React.useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          tension: 50,
          friction: 8,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -320,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const menuItems = [
    {
      name: 'Dashboard',
      route: 'Home',
      icon: 'home',
      activeIcon: 'home',
      color: '#4CAF50',
      description: 'Overview & Summary',
    },
    {
      name: 'Budget',
      route: 'Budget',
      icon: 'wallet',
      activeIcon: 'wallet',
      color: '#9C27B0',
      description: 'Manage Budgets',
    },
    {
      name: 'Accounts',
      route: 'Accounts',
      icon: 'card-outline',
      activeIcon: 'card',
      color: '#2196F3',
      description: 'Manage Accounts',
    },
    {
      name: 'Recurring',
      route: 'Recurring',
      icon: 'repeat-outline',
      activeIcon: 'repeat',
      color: '#FF9800',
      description: 'Recurring Transactions',
    },
    {
      name: 'Transfer',
      route: 'Transfer',
      icon: 'swap-horizontal-outline',
      activeIcon: 'swap-horizontal',
      color: '#00BCD4',
      description: 'Transfer Funds',
    },
    {
      name: 'Goals',
      route: 'Goals',
      icon: 'flag-outline',
      activeIcon: 'flag',
      color: '#E91E63',
      description: 'Financial Goals',
    },
    {
      name: 'Reports',
      route: 'Reports',
      icon: 'bar-chart',
      activeIcon: 'bar-chart',
      color: '#2196F3',
      description: 'Monthly Analytics',
    },
    {
      name: 'Settings',
      route: 'Settings',
      icon: 'settings',
      activeIcon: 'settings',
      color: '#FF9800',
      description: 'Preferences & Data',
    },
  ];

  const handleNavigate = (route) => {
    if (navigation) {
      const routeMap = {
        'Home': 'HomeMain',
        'Budget': 'BudgetMain',
        'Accounts': 'AccountsMain',
        'Recurring': 'RecurringMain',
        'Transfer': 'TransferMain',
        'Goals': 'GoalsMain',
        'Reports': 'ReportsMain',
        'Settings': 'SettingsMain',
      };
      navigation.navigate(routeMap[route] || route);
    }
    onClose();
  };

  const styles = getStyles(isDark);

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
    >
      <Animated.View
        style={[
          styles.overlay,
          {
            opacity: fadeAnim,
          },
        ]}
      >
        <TouchableOpacity
          style={styles.overlayTouchable}
          activeOpacity={1}
          onPress={onClose}
        />
        <Animated.View
          style={[
            styles.sidebar,
            {
              transform: [{ translateX: slideAnim }],
            },
          ]}
        >
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Header Section */}
            <View style={styles.headerSection}>
              <View style={styles.headerTop}>
                <View style={styles.logoContainer}>
                  <View style={styles.logoCircle}>
                    <Ionicons name="wallet" size={32} color="#FFFFFF" />
                  </View>
                </View>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <Ionicons name="close" size={24} color={isDark ? '#FFFFFF' : '#212121'} />
                </TouchableOpacity>
              </View>
              <Text style={styles.appName}>Expense Tracker</Text>
              {currency && (
                <View style={styles.currencyBadge}>
                  <Text style={styles.currencyFlag}>{currency.flag}</Text>
                  <Text style={styles.currencyCode}>{currency.code}</Text>
                </View>
              )}
            </View>

            {/* Monthly Summary Card */}
            <View style={styles.summaryCard}>
              <View style={styles.summaryHeader}>
                <Ionicons name="calendar" size={20} color={isDark ? '#B0B0B0' : '#757575'} />
                <Text style={styles.summaryLabel}>This Month</Text>
              </View>
              <Text style={styles.summaryAmount}>
                {formatCurrency(monthlyTotal, currency?.code)}
              </Text>
              <Text style={styles.summaryCount}>
                {expenses.length} {expenses.length === 1 ? 'expense' : 'expenses'}
              </Text>
            </View>

            {/* Navigation Menu */}
            <View style={styles.menuSection}>
              <Text style={styles.sectionTitle}>Navigation</Text>
              {menuItems.map((item, index) => {
                const isActive = currentRoute === item.route;
                return (
                  <TouchableOpacity
                    key={item.route}
                    style={[
                      styles.menuItem,
                      isActive && styles.activeMenuItem,
                    ]}
                    onPress={() => handleNavigate(item.route)}
                    activeOpacity={0.6}
                  >
                    <View
                      style={[
                        styles.menuIconContainer,
                        { backgroundColor: isActive ? `${item.color}20` : 'transparent' },
                      ]}
                    >
                      <Ionicons
                        name={isActive ? item.activeIcon : item.icon}
                        size={24}
                        color={isActive ? item.color : (isDark ? '#B0B0B0' : '#757575')}
                      />
                    </View>
                    <View style={styles.menuTextContainer}>
                      <Text
                        style={[
                          styles.menuText,
                          isActive && styles.activeMenuText,
                        ]}
                      >
                        {item.name}
                      </Text>
                      <Text style={styles.menuDescription}>{item.description}</Text>
                    </View>
                    {isActive && (
                      <View style={[styles.activeIndicator, { backgroundColor: item.color }]} />
                    )}
                    <Ionicons
                      name="chevron-forward"
                      size={20}
                      color={isActive ? item.color : (isDark ? '#3C3C3C' : '#E0E0E0')}
                    />
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <View style={styles.footerDivider} />
              <Text style={styles.footerText}>Version 1.0.0</Text>
              <Text style={styles.footerSubtext}>Track your expenses smartly</Text>
            </View>
          </ScrollView>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const getStyles = (isDark) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      flexDirection: 'row',
    },
    overlayTouchable: {
      flex: 1,
    },
    sidebar: {
      width: 320,
      height: '100%',
      backgroundColor: isDark ? '#1A1A1A' : '#FFFFFF',
      shadowColor: '#000',
      shadowOffset: { width: 4, height: 0 },
      shadowOpacity: 0.3,
      shadowRadius: 16,
      elevation: 16,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      paddingBottom: 20,
    },
    headerSection: {
      backgroundColor: isDark ? '#2C2C2C' : '#4CAF50',
      paddingTop: 60,
      paddingBottom: 24,
      paddingHorizontal: 20,
      borderBottomLeftRadius: 24,
      borderBottomRightRadius: 24,
    },
    headerTop: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    logoContainer: {
      alignItems: 'center',
    },
    logoCircle: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    closeButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    appName: {
      fontSize: 24,
      fontWeight: '700',
      color: '#FFFFFF',
      marginBottom: 12,
      textShadowColor: 'rgba(0, 0, 0, 0.2)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 2,
    },
    currencyBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-start',
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
    },
    currencyFlag: {
      fontSize: 18,
      marginRight: 6,
    },
    currencyCode: {
      fontSize: 14,
      fontWeight: '600',
      color: '#FFFFFF',
    },
    summaryCard: {
      backgroundColor: isDark ? '#2C2C2C' : '#F8F9FA',
      marginHorizontal: 20,
      marginTop: 20,
      padding: 20,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: isDark ? '#3C3C3C' : '#E0E0E0',
    },
    summaryHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    summaryLabel: {
      fontSize: 14,
      fontWeight: '500',
      color: isDark ? '#B0B0B0' : '#757575',
      marginLeft: 8,
    },
    summaryAmount: {
      fontSize: 28,
      fontWeight: '700',
      color: isDark ? '#FFFFFF' : '#212121',
      marginBottom: 4,
    },
    summaryCount: {
      fontSize: 12,
      color: isDark ? '#757575' : '#9E9E9E',
    },
    menuSection: {
      marginTop: 24,
      paddingHorizontal: 20,
    },
    sectionTitle: {
      fontSize: 12,
      fontWeight: '600',
      color: isDark ? '#757575' : '#9E9E9E',
      textTransform: 'uppercase',
      letterSpacing: 1,
      marginBottom: 12,
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 16,
      paddingHorizontal: 16,
      marginBottom: 8,
      borderRadius: 16,
      backgroundColor: isDark ? '#252525' : '#F8F9FA',
      position: 'relative',
    },
    activeMenuItem: {
      backgroundColor: isDark ? '#2C2C2C' : '#F1F8E9',
      borderWidth: 1,
      borderColor: isDark ? '#3C3C3C' : '#E8F5E9',
    },
    menuIconContainer: {
      width: 44,
      height: 44,
      borderRadius: 22,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
    },
    menuTextContainer: {
      flex: 1,
    },
    menuText: {
      fontSize: 16,
      fontWeight: '600',
      color: isDark ? '#B0B0B0' : '#757575',
      marginBottom: 2,
    },
    activeMenuText: {
      color: isDark ? '#FFFFFF' : '#212121',
      fontWeight: '700',
    },
    menuDescription: {
      fontSize: 12,
      color: isDark ? '#757575' : '#9E9E9E',
    },
    activeIndicator: {
      position: 'absolute',
      left: 0,
      width: 4,
      height: '60%',
      borderRadius: 2,
    },
    footer: {
      marginTop: 24,
      paddingHorizontal: 20,
      paddingBottom: 20,
    },
    footerDivider: {
      height: 1,
      backgroundColor: isDark ? '#3C3C3C' : '#E0E0E0',
      marginBottom: 16,
    },
    footerText: {
      fontSize: 12,
      fontWeight: '500',
      color: isDark ? '#555555' : '#9E9E9E',
      textAlign: 'center',
      marginBottom: 4,
    },
    footerSubtext: {
      fontSize: 11,
      color: isDark ? '#444444' : '#BDBDBD',
      textAlign: 'center',
    },
  });

export default Sidebar;

