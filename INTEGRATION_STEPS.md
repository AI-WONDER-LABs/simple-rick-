# Step-by-Step Integration Guide

## Prerequisites
- Android Studio installed
- Basic knowledge of Kotlin/Java
- Understanding of React Native native modules (optional)

## Step 1: Eject from Expo
```bash
cd your-project-directory
npx expo prebuild
```

This will generate the `android/` and `ios/` folders.

## Step 2: Update Package Name
1. Open `android/app/src/main/AndroidManifest.xml`
2. Change package to match your app (currently `com.simplerickai`)
3. Update all Kotlin files with correct package name

## Step 3: Copy Native Files

### File Locations:
```
android/app/src/main/
├── AndroidManifest.xml (merge with existing)
├── java/com/simplerickai/
│   ├── MainActivity.kt (replace existing)
│   ├── FloatingAssistantService.kt (new file)
├── res/
│   └── layout/
│       ├── activity_main.xml (new file)
│       └── layout_floating_widget.xml (new file)
```

## Step 4: Merge AndroidManifest.xml
Add these permissions to the existing AndroidManifest.xml:
```xml
<uses-permission android:name="android.permission.SYSTEM_ALERT_WINDOW" />
<uses-permission android:name="android.permission.INTERNET" />
```

Add the service inside `<application>`:
```xml
<service
    android:name=".FloatingAssistantService"
    android:enabled="true"
    android:exported="false"/>
```

## Step 5: Add Logo/Icon
1. Place your logo in `android/app/src/main/res/mipmap/`
2. Update image references in layout files

## Step 6: Build and Test
```bash
cd android
./gradlew clean
./gradlew assembleDebug
```

## Step 7: Request Permission at Runtime
The app will automatically request SYSTEM_ALERT_WINDOW permission on first launch.

## Optional: Create Native Module Bridge
To control overlay from React Native JavaScript:

1. Create `NativeOverlayModule.kt`
2. Implement methods: `startOverlay()`, `stopOverlay()`, `sendMessage()`
3. Register module in `MainApplication.kt`
4. Create TypeScript types in React Native

## Troubleshooting

### Permission Denied
- Go to Settings → Apps → Your App → Display over other apps → Enable

### Overlay Not Showing
- Check WindowManager parameters
- Verify service is running
- Check Android version compatibility

### Build Errors
- Clean project: `./gradlew clean`
- Invalidate cache in Android Studio
- Check package names match

## Current Limitations
- Only works on Android (iOS doesn't support system overlays)
- Requires special permission from user
- May not work on some OEM ROMs (MIUI, ColorOS)
- Battery optimization may kill service

## Next Steps
1. Add AI API integration (OpenAI, etc.)
2. Implement notification for overlay status
3. Add settings for overlay size/position
4. Persist chat history
5. Add voice input capability
