import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeStore } from '../store/useThemeStore';
import { useCurrencyStore } from '../store/useCurrencyStore';

/**
 * Sidebar Component
 * Custom sidebar navigation menu
 */
const Sidebar = ({ visible, onClose, navigation, currentRoute }) => {
  const theme = useThemeStore((state) => state.theme);
  const currency = useCurrencyStore((state) => state.currency);
  const isDark = theme === 'dark';

  const slideAnim = React.useRef(new Animated.Value(-300)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 50,
        friction: 7,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -300,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const menuItems = [
    {
      name: 'Home',
      route: 'Home',
      icon: 'home-outline',
      activeIcon: 'home',
    },
    {
      name: 'Reports',
      route: 'Reports',
      icon: 'bar-chart-outline',
      activeIcon: 'bar-chart',
    },
    {
      name: 'Settings',
      route: 'Settings',
      icon: 'settings-outline',
      activeIcon: 'settings',
    },
  ];

  const handleNavigate = (route) => {
    if (navigation) {
      const routeMap = {
        'Home': 'HomeMain',
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
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <Animated.View
          style={[
            styles.sidebar,
            {
              transform: [{ translateX: slideAnim }],
            },
          ]}
        >
          <View style={styles.sidebarContent}>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.headerContent}>
                <View style={styles.logoContainer}>
                  <Ionicons name="wallet" size={32} color="#4CAF50" />
                </View>
                <View style={styles.headerText}>
                  <Text style={styles.appName}>Expense Tracker</Text>
                  {currency && (
                    <Text style={styles.currencyText}>
                      {currency.flag} {currency.code}
                    </Text>
                  )}
                </View>
              </View>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Ionicons name="close" size={24} color={isDark ? '#FFFFFF' : '#212121'} />
              </TouchableOpacity>
            </View>

            {/* Menu Items */}
            <View style={styles.menuContainer}>
              {menuItems.map((item) => {
                const isActive = currentRoute === item.route;
                return (
                  <TouchableOpacity
                    key={item.route}
                    style={[styles.menuItem, isActive && styles.activeMenuItem]}
                    onPress={() => handleNavigate(item.route)}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name={isActive ? item.activeIcon : item.icon}
                      size={24}
                      color={isActive ? '#4CAF50' : (isDark ? '#B0B0B0' : '#757575')}
                    />
                    <Text
                      style={[
                        styles.menuText,
                        isActive && styles.activeMenuText,
                      ]}
                    >
                      {item.name}
                    </Text>
                    {isActive && <View style={styles.activeIndicator} />}
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>Version 1.0.0</Text>
            </View>
          </View>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
};

const getStyles = (isDark) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      flexDirection: 'row',
    },
    sidebar: {
      width: 280,
      height: '100%',
      backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
      shadowColor: '#000',
      shadowOffset: { width: 2, height: 0 },
      shadowOpacity: 0.25,
      shadowRadius: 8,
      elevation: 8,
    },
    sidebarContent: {
      flex: 1,
      paddingTop: 50,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingBottom: 20,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#3C3C3C' : '#E0E0E0',
    },
    headerContent: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    logoContainer: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: '#4CAF5020',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    headerText: {
      flex: 1,
    },
    appName: {
      fontSize: 18,
      fontWeight: '700',
      color: isDark ? '#FFFFFF' : '#212121',
      marginBottom: 4,
    },
    currencyText: {
      fontSize: 14,
      color: isDark ? '#B0B0B0' : '#757575',
    },
    closeButton: {
      padding: 4,
    },
    menuContainer: {
      flex: 1,
      paddingTop: 20,
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 16,
      paddingHorizontal: 20,
      marginHorizontal: 12,
      marginVertical: 4,
      borderRadius: 12,
      position: 'relative',
    },
    activeMenuItem: {
      backgroundColor: isDark ? '#2C2C2C' : '#F1F8E9',
    },
    menuText: {
      fontSize: 16,
      fontWeight: '500',
      color: isDark ? '#B0B0B0' : '#757575',
      marginLeft: 16,
    },
    activeMenuText: {
      color: '#4CAF50',
      fontWeight: '700',
    },
    activeIndicator: {
      position: 'absolute',
      left: 0,
      width: 4,
      height: '70%',
      backgroundColor: '#4CAF50',
      borderRadius: 2,
    },
    footer: {
      padding: 20,
      borderTopWidth: 1,
      borderTopColor: isDark ? '#3C3C3C' : '#E0E0E0',
    },
    footerText: {
      fontSize: 12,
      color: isDark ? '#555555' : '#9E9E9E',
      textAlign: 'center',
    },
  });

export default Sidebar;

