# Development Guide

This guide explains how to develop and test the Expense Tracker app, including handling Expo Go limitations.

## ⚠️ Important: Expo Go Limitations

**Expo Go** (the standard Expo development client) has limitations with certain native modules:

### Modules Requiring Development Build

The following features **will not work** in Expo Go but **will work** in production builds:

1. **expo-notifications** (Local notifications)
   - ✅ Works in: Development builds, Production builds
   - ❌ Does NOT work in: Expo Go
   - **Impact**: Notifications won't work during development in Expo Go
   - **Solution**: Use a development build or test in production build

2. **expo-image-picker** (Receipt photos - optional)
   - ✅ Works in: Development builds, Production builds
   - ⚠️ Partially works in: Expo Go (may have limitations)
   - **Impact**: Receipt photo feature may not work in Expo Go
   - **Solution**: Feature gracefully handles missing package

## 🛠️ Development Options

### Option 1: Development Build (Recommended)

Create a development build that includes all native modules:

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure EAS
eas build:configure

# Build development client for Android
eas build --profile development --platform android

# Or build locally
npx expo run:android
```

**Advantages:**
- All features work (notifications, image picker, etc.)
- Closer to production environment
- Better for testing

**Disadvantages:**
- Requires building native code
- Slower iteration for JS-only changes

### Option 2: Expo Go (Quick Development)

Use Expo Go for rapid JavaScript development:

```bash
npx expo start
```

**Advantages:**
- Fast iteration
- No build required
- Easy to test on multiple devices

**Disadvantages:**
- Notifications won't work
- Some native features unavailable
- Not representative of production

### Option 3: Production Build Testing

Test with production builds:

```bash
# Build production AAB
cd android
./gradlew bundleRelease

# Or use EAS
eas build --profile production --platform android
```

## 📱 Testing Notifications

Since notifications don't work in Expo Go, use one of these methods:

### Method 1: Development Build
```bash
npx expo run:android
# Or
eas build --profile development --platform android
```

### Method 2: Production Build
```bash
cd android
./gradlew bundleRelease
# Install the AAB on device
```

### Method 3: Test in Production
- Build and install production build
- Test notifications on real device
- This is the most accurate test

## 🖼️ Testing Image Picker (Receipt Photos)

The image picker feature is **optional** and gracefully handles missing package:

- If `expo-image-picker` is installed: Full functionality
- If not installed: Feature shows "Feature Unavailable" message

To enable receipt photos:

```bash
npx expo install expo-image-picker
```

Then rebuild:
```bash
npx expo run:android
```

## 🔧 Current Warnings Explained

### 1. baseline-browser-mapping
```
[baseline-browser-mapping] The data in this module is over two months old.
```
**Status**: ✅ Fixed - Updated to latest version
**Impact**: None - just a dev dependency warning

### 2. expo-image-picker
```
LOG  expo-image-picker not available
```
**Status**: ✅ Expected - Package is optional
**Impact**: Receipt photo feature unavailable (gracefully handled)
**Solution**: Install if needed: `npx expo install expo-image-picker`

### 3. expo-notifications
```
ERROR  expo-notifications: Android Push notifications functionality was removed from Expo Go
WARN  expo-notifications functionality is not fully supported in Expo Go
```
**Status**: ✅ Expected - Known Expo Go limitation
**Impact**: Notifications won't work in Expo Go
**Solution**: Use development build or production build

## ✅ Production Build Status

**Good News**: All features will work correctly in production builds!

- ✅ Notifications: Full support in production
- ✅ Image Picker: Works if package installed
- ✅ All other features: Fully functional

The warnings you see are **only for Expo Go**. Production builds include all native modules and will work perfectly.

## 🚀 Recommended Development Workflow

1. **For UI/JS Development**: Use Expo Go
   ```bash
   npx expo start
   ```
   - Fast iteration
   - Test UI changes quickly
   - Ignore notification warnings (they're expected)

2. **For Feature Testing**: Use Development Build
   ```bash
   npx expo run:android
   ```
   - Test notifications
   - Test all native features
   - More accurate to production

3. **For Pre-Release Testing**: Use Production Build
   ```bash
   cd android
   ./gradlew bundleRelease
   ```
   - Final testing before Play Store
   - Exact production environment
   - Test everything

## 📝 Summary

| Feature | Expo Go | Dev Build | Production |
|---------|---------|-----------|------------|
| Basic App | ✅ | ✅ | ✅ |
| Notifications | ❌ | ✅ | ✅ |
| Image Picker | ⚠️ | ✅ | ✅ |
| All Features | ⚠️ | ✅ | ✅ |

**For Play Store**: Production builds have full functionality. The Expo Go warnings don't affect your published app.

---

**Next Steps:**
1. Continue development in Expo Go (ignore notification warnings)
2. Build development build when testing notifications
3. Build production build for final testing and Play Store

