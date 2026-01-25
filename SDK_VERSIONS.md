# Android SDK Versions

This document describes the Android SDK versions used in the Expense Tracker app.

## Current Configuration

The SDK versions are managed by Expo and React Native. The actual values are defined in the Expo SDK and React Native dependencies.

### Typical Values (Expo SDK 54)

- **minSdkVersion**: 23 (Android 6.0 Marshmallow)
- **targetSdkVersion**: 34 (Android 14)
- **compileSdkVersion**: 34 (Android 14)

### Verification

To check the actual SDK versions in your project:

1. **Check Expo SDK version:**
   ```bash
   npx expo --version
   ```

2. **Check React Native version:**
   ```bash
   npm list react-native
   ```

3. **Check actual SDK values:**
   The SDK versions are set by Expo's build system. You can verify them by:
   - Building the app and checking the build output
   - Looking at `node_modules/expo/android/build.gradle` (if using Expo)
   - Checking the generated `android/app/build.gradle` after running `npx expo prebuild`

### Google Play Requirements

- **Minimum Target SDK**: Google Play requires apps to target API level 33 (Android 13) or higher for new apps and app updates as of August 2023.
- **Recommended Target SDK**: Target the latest stable Android version (currently API 34 - Android 14).

### Updating SDK Versions

If you need to update SDK versions:

1. **Update Expo SDK:**
   ```bash
   npx expo install expo@latest
   ```

2. **Update React Native:**
   ```bash
   npx expo install react-native@latest
   ```

3. **Rebuild native code:**
   ```bash
   npx expo prebuild --clean
   ```

### Notes

- The SDK versions are automatically managed by Expo
- Manual changes to SDK versions in `build.gradle` may be overwritten
- Always test on devices matching your minSdkVersion
- Keep targetSdkVersion up to date for Play Store compliance

---

**Last Updated**: Based on Expo SDK 54 and React Native 0.81.5

