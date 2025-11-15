import React, { useRef, useEffect } from 'react';
import { TouchableOpacity, StyleSheet, Animated, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeStore } from '../store/useThemeStore';

/**
 * HamburgerMenu Component
 * Beautiful animated hamburger menu button with ripple effect
 */
const HamburgerMenu = ({ onPress, isOpen = false }) => {
  const theme = useThemeStore((state) => state.theme);
  const isDark = theme === 'dark';

  const rotateAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rippleAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Continuous pulse animation
  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  useEffect(() => {
    if (isOpen) {
      Animated.parallel([
        Animated.spring(rotateAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 50,
          friction: 7,
        }),
        Animated.spring(scaleAnim, {
          toValue: 0.85,
          useNativeDriver: true,
          tension: 50,
          friction: 7,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.spring(rotateAnim, {
          toValue: 0,
          useNativeDriver: true,
          tension: 50,
          friction: 7,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 50,
          friction: 7,
        }),
      ]).start();
    }
  }, [isOpen]);

  const handlePress = () => {
    // Ripple effect on press
    rippleAnim.setValue(0);
    Animated.sequence([
      Animated.timing(rippleAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(rippleAnim, {
        toValue: 0,
        duration: 0,
        useNativeDriver: true,
      }),
    ]).start();

    onPress();
  };

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '90deg'],
  });

  const rippleScale = rippleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.5],
  });

  const rippleOpacity = rippleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.6, 0],
  });

  const styles = getStyles(isDark);

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={styles.container}
      activeOpacity={0.8}
    >
      {/* Ripple effect */}
      <Animated.View
        style={[
          styles.ripple,
          {
            transform: [{ scale: rippleScale }],
            opacity: rippleOpacity,
          },
        ]}
      />
      
      {/* Main button */}
      <Animated.View
        style={[
          styles.iconContainer,
          {
            transform: [
              { rotate: rotation },
              { scale: Animated.multiply(scaleAnim, pulseAnim) },
            ],
          },
        ]}
      >
        {isOpen ? (
          <Ionicons name="close" size={22} color="#FFFFFF" />
        ) : (
          <View style={styles.hamburgerLines}>
            <Animated.View
              style={[
                styles.line,
                styles.line1,
                {
                  transform: [
                    {
                      scaleX: rotateAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, 0.8],
                      }),
                    },
                  ],
                },
              ]}
            />
            <Animated.View
              style={[
                styles.line,
                styles.line2,
                {
                  opacity: rotateAnim.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [1, 0, 0],
                  }),
                },
              ]}
            />
            <Animated.View
              style={[
                styles.line,
                styles.line3,
                {
                  transform: [
                    {
                      scaleX: rotateAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, 0.8],
                      }),
                    },
                  ],
                },
              ]}
            />
          </View>
        )}
      </Animated.View>
    </TouchableOpacity>
  );
};

const getStyles = (isDark) =>
  StyleSheet.create({
    container: {
      marginLeft: 16,
      padding: 8,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
    },
    ripple: {
      position: 'absolute',
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: '#FFFFFF',
      borderWidth: 2,
      borderColor: 'rgba(255, 255, 255, 0.5)',
    },
    iconContainer: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: 'rgba(255, 255, 255, 0.25)',
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: 'rgba(255, 255, 255, 0.4)',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.3,
      shadowRadius: 6,
      elevation: 6,
      // Subtle gradient effect simulation
      overflow: 'hidden',
    },
    hamburgerLines: {
      width: 22,
      height: 18,
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    line: {
      height: 3,
      backgroundColor: '#FFFFFF',
      borderRadius: 3,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.3,
      shadowRadius: 2,
      elevation: 2,
    },
    line1: {
      width: '100%',
    },
    line2: {
      width: '75%',
      alignSelf: 'flex-start',
    },
    line3: {
      width: '100%',
    },
  });

export default HamburgerMenu;

