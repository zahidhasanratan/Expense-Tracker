# Quick Start Guide

## 🚀 Getting Started in 3 Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Expo

```bash
npm start
```

### 3. Run on Android

Press `a` in the terminal or run:

```bash
npm run android
```

## 📱 First Time Setup

1. **Install Expo Go** on your Android device from Google Play Store
2. **Connect your device** via USB (with USB debugging enabled) or use an emulator
3. **Scan the QR code** shown in the terminal with Expo Go app

## 🎯 What to Expect

- The app will open with an empty dashboard
- Tap the **+** button (FAB) to add your first expense
- Navigate between tabs: **Home**, **Reports**, **Settings**
- Toggle dark mode in Settings
- Export your data to CSV from Settings

## ⚠️ Important Notes

- **Assets**: You'll need to add app icons and splash screens to the `assets/` folder
- **Permissions**: The app requests storage permissions for CSV export
- **Data**: All data is stored locally on your device using MMKV

## 🐛 Troubleshooting

### "Cannot find module" errors
```bash
rm -rf node_modules
npm install
```

### Metro bundler issues
```bash
npm start -- --clear
```

### Android connection issues
- Ensure USB debugging is enabled
- Check that your device is recognized: `adb devices`
- Try restarting the Expo development server

## 📚 Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Check out the code comments for implementation details
- Customize colors and categories in `src/utils/categories.js`

