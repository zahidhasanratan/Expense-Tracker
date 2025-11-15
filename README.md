# Expense Tracker - React Native App

A complete personal expense tracking mobile application built with Expo and React Native, featuring Android-first support.

## 📱 Features

- **Dashboard**: View daily, weekly, and monthly spending summaries with category breakdown charts
- **Add/Edit Expenses**: Create and modify expenses with title, amount, category, date/time, and notes
- **Delete Expenses**: Remove expenses with confirmation alerts
- **Monthly Reports**: View detailed monthly spending with daily line charts and category breakdown tables
- **Settings**: 
  - Dark mode toggle (persisted)
  - Export all data to CSV
  - Reset all data with confirmation
- **Local Storage**: Fast and secure data persistence using MMKV
- **Beautiful UI**: Clean, minimal design with Android-friendly interface

## 🛠️ Tech Stack

- **Expo** (~50.0.0)
- **React Native** (0.73.2)
- **Navigation**: @react-navigation/bottom-tabs + stack
- **State Management**: Zustand
- **Storage**: react-native-mmkv
- **Charts**: react-native-chart-kit
- **Icons**: @expo/vector-icons
- **Date Picker**: react-native-date-picker
- **File System**: expo-file-system, expo-sharing

## 📁 Project Structure

```
ExpenseTracker/
├── App.js                      # Main app entry point
├── app.json                    # Expo configuration
├── package.json                # Dependencies
├── babel.config.js            # Babel configuration
├── src/
│   ├── screens/               # Screen components
│   │   ├── HomeScreen.js
│   │   ├── AddExpenseScreen.js
│   │   ├── EditExpenseScreen.js
│   │   ├── ReportsScreen.js
│   │   └── SettingsScreen.js
│   ├── components/            # Reusable components
│   │   ├── ExpenseCard.js
│   │   ├── CategorySelector.js
│   │   └── SummaryBox.js
│   ├── store/                # Zustand stores
│   │   ├── useExpenseStore.js
│   │   └── useThemeStore.js
│   ├── utils/                # Utility functions
│   │   ├── format.js
│   │   └── categories.js
│   ├── storage/              # Storage utilities
│   │   └── storage.js
│   └── navigation/           # Navigation setup
│       └── AppNavigator.js
└── README.md
```

## 🚀 Installation & Setup

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Android Studio (for Android development)
- Android device or emulator

### Step 1: Install Dependencies

```bash
npm install
```

or

```bash
yarn install
```

### Step 2: Start the Development Server

```bash
npm start
```

or

```bash
expo start
```

### Step 3: Run on Android

```bash
npm run android
```

or

```bash
expo start --android
```

The app will automatically open on your connected Android device or emulator.

## 📦 Building for Production

### Build APK (Android) - EAS Build (Recommended)

The easiest and best way to build an installable APK:

#### ✅ Step 1: Install EAS CLI (required for building APK)

Run this once:

```bash
npm install -g eas-cli
```

Verify installation:

```bash
eas --version
```

#### ✅ Step 2: Login to Expo

```bash
eas login
```

> **Note:** If you don't have an Expo account, create one — it takes 1 minute at [expo.dev](https://expo.dev)

#### ✅ Step 3: Configure your project (run once)

Inside your project folder:

```bash
eas build:configure
```

This will create `eas.json` automatically.

#### ✅ Step 4: Build APK (the file you can install on your Android phone)

Use this command:

```bash
eas build -p android --profile preview
```

This command will:
- Upload your project to Expo build servers
- Create an APK
- Give you a download link

#### 📥 Step 5: Download APK

Once the build finishes, Expo will show:

```
✔ Build complete
→ Download: https://expo.dev/accounts/xxxx/builds/xxxx
```

**To install:**
1. Open that link from your phone
2. Download the APK
3. Install it on your Android device

**Done! 🎉**

### Build AAB (Android App Bundle) for Google Play Store

```bash
eas build --platform android --profile production
```

### Alternative: Local Build (Advanced)

If you prefer building locally:

```bash
# Install Android build tools
# Then run:
expo build:android
```

> **Note:** EAS Build is recommended as it handles all dependencies and configurations automatically.

## 🎨 Design & UI

- **Primary Color**: #4CAF50 (Green)
- **Accent Color**: #81C784 (Light Green)
- **Background**: #F1F8E9 (Light) / #121212 (Dark)
- **Dark Mode**: Fully supported with persisted preference

## 📊 Data Storage

The app uses **MMKV** for fast, efficient local storage:

- **Expenses**: Stored as JSON array with unique IDs
- **Theme**: Light/Dark mode preference
- **Categories**: Default categories + custom categories

### Data Format

```json
{
  "id": "timestamp-random",
  "title": "Lunch",
  "amount": 150,
  "category": "Food",
  "date": 1731631223000,
  "notes": "Biriyani"
}
```

## 🔧 Key Features Implementation

### Dashboard Calculations
- Daily total: Sum of expenses from start to end of current day
- Weekly total: Sum of expenses from Monday to Sunday of current week
- Monthly total: Sum of expenses for current month
- Category breakdown: Grouped by category with pie chart visualization

### Reports
- Monthly spending overview
- Daily spending line chart
- Category-wise breakdown with percentages
- Month navigation (previous/next)

### Validation
- Title: Required, non-empty
- Amount: Required, positive number
- Category: Must be selected from available categories

## 🐛 Troubleshooting

### Common Issues

1. **Metro bundler not starting**
   ```bash
   # Clear cache and restart
   npm start -- --clear
   ```

2. **MMKV installation issues**
   ```bash
   # Reinstall dependencies
   rm -rf node_modules
   npm install
   ```

3. **Android build errors**
   - Ensure Android Studio is installed
   - Check that ANDROID_HOME is set correctly
   - Verify Java JDK is installed

4. **Navigation errors**
   - Ensure all screens are properly imported
   - Check navigation stack configuration

## 📝 Code Comments

All major functions include JSDoc-style comments explaining:
- Purpose and functionality
- Parameters and return values
- Usage examples where applicable

## 🚀 Future Improvements

### Suggested Enhancements

1. **Biometric Lock**
   - Add fingerprint/Face ID authentication
   - Secure app access with biometrics
   - Use expo-local-authentication

2. **Cloud Backup**
   - Sync data to cloud storage (Firebase, AWS, etc.)
   - Automatic backup scheduling
   - Multi-device synchronization

3. **Multi-Currency Support**
   - Support multiple currencies
   - Currency conversion
   - Exchange rate updates

4. **Additional Features**
   - Budget setting and tracking
   - Recurring expenses
   - Expense reminders
   - Photo attachments
   - Export to PDF
   - Data analytics and insights

## 📄 License

This project is open source and available for personal use.

## 👨‍💻 Development

### Running Tests

```bash
# Install testing dependencies (if added)
npm test
```

### Code Formatting

```bash
# Using Prettier (if configured)
npx prettier --write .
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For issues and questions, please open an issue on the repository.

---

**Built with ❤️ using Expo and React Native**

