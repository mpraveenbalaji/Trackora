# Trackora Version 2 APK — Build Instructions

## Why This Folder Exists

Version 2 of the Trackora mobile app corresponds to the **Backend-Connected** release.
The `version2` APK needs to be built from the Flutter project at `Trackora/mobile/`.

## Prerequisites (Install If Not Present)

1. **Flutter SDK** — Download from https://flutter.dev/docs/get-started/install/windows
   ```
   # After installing, add to PATH:
   C:\flutter\bin
   ```

2. **Android Studio** with Android SDK (build-tools 35.0.0+, platform android-36)
   - Already detected on this machine at: `C:\Users\ASUS\AppData\Local\Android\Sdk`

3. **Java JDK 17+**
   ```
   # Check: java -version
   ```

## Build the APK

```bash
# 1. Navigate to the Flutter mobile project
cd D:\internprojects\Trackora-main\Trackora\mobile

# 2. Get packages
flutter pub get

# 3. Run Flutter doctor to verify setup
flutter doctor

# 4. Build the release APK
flutter build apk --release

# 5. Copy the built APK here
copy build\app\outputs\flutter-apk\app-release.apk ..\..\..\apk's\version2\trackora_version2.apk
```

## Version 2 Changes (vs Version 1)

- **Backend Connected**: All data comes from the real REST API (http://server:5000)
- **Real Authentication**: JWT login replacing hardcoded test users
- **Live Visit Logging**: Visits stored in SQLite database via API
- **Real GPS Attendance**: Check-in/out data persisted in backend
- **Real-time Dashboard**: KPIs calculated from actual database records
- **Manager Approval Flow**: Real-time notification on visit approval/rejection

## Backend Server (Version 2 requires running backend)

```bash
# Start the backend server
cd D:\internprojects\Trackora-main\Trackora\backend
npm install
npm start
# Server runs on http://localhost:5000 (or your server IP)
```

## Test Credentials

| Email | Password | Role |
|-------|----------|------|
| praveen@trackora.in | sales123 | Sales Rep |
| inthiyaz@trackora.in | sales123 | Sales Rep |
| rajesh@trackora.in | manager123 | Manager |
| admin@trackora.in | admin123 | Admin |

---
*Once Flutter SDK is installed, run the build commands above and place the APK in this folder.*
