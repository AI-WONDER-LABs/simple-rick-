# Native Android Overlay Setup

⚠️ **IMPORTANT**: This folder contains reference files for native Android overlay functionality. These files **CANNOT** be used directly in Expo managed workflow.

## Required Steps to Implement Overlay

### 1. Eject from Expo
```bash
npx expo prebuild
# or
npx expo eject
```

### 2. Add Native Files
Copy files from this folder to:
- `MainActivity.kt` → `android/app/src/main/java/com/simplerickai/MainActivity.kt`
- `FloatingAssistantService.kt` → `android/app/src/main/java/com/simplerickai/FloatingAssistantService.kt`
- `AndroidManifest.xml` → Update `android/app/src/main/AndroidManifest.xml`
- `layout_floating_widget.xml` → `android/app/src/main/res/layout/layout_floating_widget.xml`

### 3. Configure Permissions
Ensure AndroidManifest.xml includes:
```xml
<uses-permission android:name="android.permission.SYSTEM_ALERT_WINDOW" />
<uses-permission android:name="android.permission.INTERNET" />
```

### 4. Build Native Bridge (Optional)
Create React Native native module to control overlay from JavaScript.

### 5. Build APK
```bash
cd android
./gradlew assembleRelease
```

## Current Project
This is an **Expo managed workflow** project. Native code is not supported without ejecting.

## Files in This Folder
Reference implementations based on your original code.
