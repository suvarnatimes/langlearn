# 📱 LinguaQuest Android APK Packaging Guide

This guide provides step-by-step instructions on how to package **LinguaQuest** into a high-performance Android `.apk` file ready to be installed on any Android phone or tablet.

We have already configured full **PWA (Progressive Web App)** support for you (including an elegant custom high-resolution vector logo, custom metadata configurations, deep status bar translucent optimizations, and offline service worker caching). This unlocks **two powerful methods** to build your APK:

---

## ⚡ Method A: The 10-Second Automated Cloud Compiler (No Setup Required)

Since we have implemented full PWA standards, you can compile a highly optimized, fully signed, production-ready Android APK in under 10 seconds without installing any development tools or SDKs on your computer.

1. **Get your Deployed App URL**:
   * Use your shared live URL:
     `https://ais-pre-zertv66mhfdvzhcvxrb24j-120596532811.asia-east1.run.app`
2. **Go to PWABuilder**:
   * Open [https://www.pwabuilder.com](https://www.pwabuilder.com) in your browser (a free developer tool sponsored by Microsoft & Google for compiling web apps into native packages).
3. **Analyze and Generate**:
   * Paste your live URL into the input field and click **Start**.
   * PWABuilder will automatically read the `manifest.json`, load the vector logo, and inspect the service worker.
   * Click **Generate APK** (or **Package for Google Play**).
4. **Download**:
   * In 10 seconds, download your custom zip package containing the signed `.apk` file! Transfer the APK file to your phone, tap to open, and install!

---

## 🛠️ Method B: Native Capacitor Build (For Local Android Compilation)

If you prefer to compile a native Android wrapper from source using Android Studio and Gradle on your local computer, follow this native configuration process.

### Prerequisites (On Your Local Machine)
1. **Node.js** installed (v18 or higher)
2. **Android Studio** installed (including the Android SDK & Gradle)

### Step 1: Install Capacitor Dependencies
Open your project directory in your terminal and run:
```bash
npm install @capacitor/core @capacitor/cli
```

### Step 2: Initialize Capacitor
Initialize Capacitor with the app identity matching our native Kotlin structure:
```bash
npx cap init LinguaQuest com.linguaquest --web-dir=dist
```

### Step 3: Add Android Platform SDK Integration
```bash
npm install @capacitor/android
npx cap add android
```

### Step 4: Build and Sync Project
Compile the React frontend code and copy the assets straight into the Android Native container:
```bash
npm run build
npx cap sync
```

### Step 5: Compile Your APK in Android Studio
1. Open the android folder in Android Studio:
   ```bash
   npx cap open android
   ```
2. Wait for Gradle to finish indexing the project.
3. In the top menu bar, go to: **Build** ➜ **Build Bundle(s) / APK(s)** ➜ **Build APK(s)**.
4. Android Studio will compile the Gradle project and pop up a notification with a **Locate** button.
5. Click **Locate** to find your newly minted, high-performance `app-debug.apk` file! Transfer it to your Android device and begin learning!

---

## 🏆 Summary of Built-in Features Enabled for Android
* **Splash Screen and Orientation Locking**: Configured to load smoothly in beautiful full-screen **Portrait** mode, hiding browser navigation bars entirely.
* **Translucent Status Bar Overlays**: Integrated viewport optimizations allowing the app's high-contrast dark space background to sit comfortably behind the device's system clock and battery indicators.
* **Local Offline Cache**: Caches crucial elements like logos, layouts, and translations so the app loads instantaneously on your phone.
