# Google Play Store Setup Guide

This guide will help you prepare your Expense Tracker app for publication on the Google Play Store.

## Prerequisites

- Google Play Developer Account ($25 one-time fee)
- Completed app development
- All features tested

## Step 1: Generate Production Keystore

**IMPORTANT:** You must generate a production keystore before building your release APK/AAB.

### Generate Keystore

1. Open a terminal/command prompt
2. Navigate to your project's `android/app` directory:
   ```bash
   cd android/app
   ```

3. Run the keytool command (replace with your information):
   ```bash
   keytool -genkeypair -v -storetype PKCS12 -keystore expense-tracker-release.keystore -alias expense-tracker-key -keyalg RSA -keysize 2048 -validity 10000
   ```

4. You'll be prompted to enter:
   - **Keystore password**: Choose a strong password (save this!)
   - **Key password**: Use the same password or a different one (save this!)
   - **Your name**: Your name or company name
   - **Organizational Unit**: Your department (optional)
   - **Organization**: Your company name
   - **City**: Your city
   - **State**: Your state/province
   - **Country code**: Two-letter country code (e.g., US, GB, BD)

5. **CRITICAL:** Save your keystore file and passwords in a secure location. If you lose them, you cannot update your app on Play Store!

### Configure Keystore in Project

1. Copy the example keystore properties file:
   ```bash
   cd android
   cp keystore.properties.example keystore.properties
   ```

2. Edit `android/keystore.properties` and fill in your values:
   ```properties
   storeFile=../app/expense-tracker-release.keystore
   storePassword=YOUR_ACTUAL_KEYSTORE_PASSWORD
   keyAlias=expense-tracker-key
   keyPassword=YOUR_ACTUAL_KEY_PASSWORD
   ```

3. **IMPORTANT:** Add `keystore.properties` to `.gitignore` to prevent committing sensitive data:
   ```
   android/keystore.properties
   android/app/expense-tracker-release.keystore
   ```

## Step 2: Build Release Bundle (AAB)

Google Play requires Android App Bundle (AAB) format for new apps.

### Using EAS Build (Recommended)

1. Install EAS CLI if not already installed:
   ```bash
   npm install -g eas-cli
   ```

2. Login to your Expo account:
   ```bash
   eas login
   ```

3. Configure EAS build:
   ```bash
   eas build:configure
   ```

4. Build Android AAB:
   ```bash
   eas build --platform android --profile production
   ```

### Using Local Build

1. Navigate to android directory:
   ```bash
   cd android
   ```

2. Generate release bundle:
   ```bash
   ./gradlew bundleRelease
   ```

3. Find your AAB file at:
   ```
   android/app/build/outputs/bundle/release/app-release.aab
   ```

## Step 3: Prepare Play Store Assets

### Required Assets

1. **App Icon** (512x512px PNG)
   - High-resolution icon for Play Store listing
   - Should match your app's icon

2. **Feature Graphic** (1024x500px PNG)
   - Banner image for Play Store listing
   - Should showcase your app

3. **Screenshots** (Minimum 2, up to 8)
   - Phone screenshots: 16:9 or 9:16 aspect ratio
   - Minimum width: 320px, Maximum width: 3840px
   - Recommended: 1080x1920px (portrait) or 1920x1080px (landscape)

4. **Short Description** (80 characters max)
   - Brief description of your app

5. **Full Description** (4000 characters max)
   - Detailed description
   - Features list
   - Usage instructions

### Example Description

**Short Description:**
```
Track expenses, manage budgets, and achieve financial goals with ease.
```

**Full Description:**
```
Expense Tracker - Your Personal Finance Manager

Take control of your finances with Expense Tracker, a powerful and intuitive expense management app designed to help you track spending, manage budgets, and achieve your financial goals.

✨ Key Features:
• Easy expense tracking with categories and tags
• Budget management with alerts
• Multiple accounts and payment methods
• Recurring transactions automation
• Advanced search and filtering
• Beautiful charts and reports
• Dark mode support
• Export data to CSV
• Secure local storage - your data stays on your device

📊 Smart Analytics:
• Daily, weekly, and monthly summaries
• Category breakdown charts
• Spending trends and insights
• Budget vs actual comparisons

🔔 Smart Notifications:
• Budget alerts when approaching limits
• Daily expense reminders
• Weekly summary reports

🎯 Financial Goals:
• Set and track savings goals
• Monitor progress over time
• Stay motivated to save

🔒 Privacy First:
• All data stored locally on your device
• No cloud sync - complete privacy
• Export your data anytime
• Full control over your information

Perfect for individuals and families who want to:
• Track daily expenses
• Stick to budgets
• Save money
• Understand spending habits
• Achieve financial goals

Download now and start managing your finances smarter!
```

## Step 4: Create Play Store Listing

1. Go to [Google Play Console](https://play.google.com/console)

2. Create a new app:
   - Click "Create app"
   - Fill in app details:
     - App name: "Expense Tracker"
     - Default language: Your language
     - App or game: App
     - Free or paid: Free (or Paid)
     - Declarations: Complete all required sections

3. Complete Store Listing:
   - Upload app icon (512x512px)
   - Upload feature graphic (1024x500px)
   - Add screenshots (at least 2)
   - Write short and full descriptions
   - Add privacy policy URL (see Step 5)

4. Complete Content Rating:
   - Answer the questionnaire
   - Get your rating (typically "Everyone")

5. Complete Privacy Policy:
   - Add privacy policy URL (see Step 5)

6. Complete Target Audience:
   - Select appropriate options

## Step 5: Privacy Policy

You have two options:

### Option A: Use In-App Privacy Policy
The app includes a Privacy Policy screen accessible from Settings. You can:
- Use the in-app privacy policy as your Play Store policy
- Or create a web version and link to it

### Option B: Host Privacy Policy Online
1. Create a simple web page with your privacy policy
2. Host it on:
   - GitHub Pages (free)
   - Your own website
   - Any hosting service
3. Add the URL in Play Console

**Privacy Policy URL Example:**
```
https://yourusername.github.io/expense-tracker-privacy-policy
```

## Step 6: Upload and Publish

1. **Create Release:**
   - Go to "Production" → "Create new release"
   - Upload your AAB file
   - Add release notes (what's new in this version)

2. **Review Release:**
   - Check all warnings and errors
   - Fix any issues

3. **Submit for Review:**
   - Click "Review release"
   - Complete any remaining tasks
   - Submit for review

4. **Wait for Review:**
   - Google typically reviews apps within 1-3 days
   - You'll receive email notifications about status

## Step 7: Post-Launch Checklist

- [ ] App is live on Play Store
- [ ] Test app installation from Play Store
- [ ] Monitor crash reports in Play Console
- [ ] Respond to user reviews
- [ ] Monitor analytics
- [ ] Plan future updates

## Important Notes

### Version Management
- Each release must have a higher `versionCode` than the previous
- Update `versionCode` in `android/app/build.gradle`
- Update `versionName` in both `app.json` and `build.gradle`

### Keystore Security
- **NEVER** lose your keystore file or passwords
- Store backups in multiple secure locations
- Consider using Google Play App Signing (recommended)

### Google Play App Signing (Recommended)
- Google can manage your app signing key
- Protects against key loss
- Enables key upgrade
- Enable in Play Console → Setup → App Signing

## Troubleshooting

### Build Errors
- Ensure keystore file exists and path is correct
- Verify keystore.properties has correct values
- Check keystore passwords are correct

### Upload Errors
- Verify AAB file is not corrupted
- Check version code is higher than previous
- Ensure all required permissions are declared

### Review Rejection
- Read rejection reason carefully
- Fix issues and resubmit
- Common issues: privacy policy, permissions justification, content rating

## Support

For issues or questions:
- Check [Google Play Console Help](https://support.google.com/googleplay/android-developer)
- Review [Expo Documentation](https://docs.expo.dev)
- Check React Native documentation

---

**Good luck with your app launch! 🚀**

