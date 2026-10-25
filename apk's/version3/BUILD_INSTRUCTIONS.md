# Trackora Version 3 APK — Release Notes & Build Instructions

## Release: Version 3.0.0+3 (trackora_version3.apk)

This release delivers the complete overhaul based on field user requirements and screenshots 1 through 10 in `d:\prpr\updates\`.

### Key Enhancements in Version 3:

1. **System Hardware Permissions**:
   - Camera, Microphone, and High-Accuracy GPS permissions declared in `AndroidManifest.xml`.
   - Sleek on-launch permissions bottom sheet prompting user to grant Camera, Microphone & GPS with 1-tap confirmation.

2. **Expanded Field Rep Login**:
   - Added Full Name, Work Email, Password, Role, Phone No., and Base Address fields.
   - Clean session flow asking for authentication on fresh app launches.
   - 1-Tap Demo Test Accounts for Praveen Balaji (Chennai) and Inthiyaz Ahmed (Bengaluru) auto-filling all details.

3. **Complete Profile Dossier**:
   - Displays Officer Name, Work Email, Role, Phone No., Address, Active Session status, and Offline Storage Sync.
   - Today's Attendance Lock status with 12:00 AM Midnight Rollover simulation trigger.

4. **Home Screen Header & Real-time Notifications**:
   - Dynamic greeting based on current local time: *Good Morning* (< 12 PM), *Good Afternoon* (12 PM - 5 PM), *Good Evening* (>= 5 PM).
   - Bottom navigation bar left tab renamed to **Home**.
   - Interactive **GPS ON / OFF** toggle pill with live accuracy indicator.
   - Notification bell icon opening Field Notifications drawer showing:
     - Admin/Manager visit approvals/disapprovals.
     - Peer sales officers completing daily targets (e.g. Inthiyaz Ahmed, Meera Sundaram).
     - Midday pace alerts showing team leader standings.

5. **Interactive Attendance Google Map & Officer Camera**:
   - Open Google Map picker allowing manual search & pin drop anywhere on the map surface (static landmark list removed).
   - Dynamic reverse-geocoded stamp with exact Address, Stamped Day, Date, Time & Coordinates (±3m locked).
   - In-app face verification camera with shutter flash, live upload status, and ID verification badge.
   - Midnight 12:00 AM auto-rollover mechanism.

6. **Redesigned 4 Performance KPI Cards**:
   - **(i) Daily Tasks (0/5)**: Tapping opens today's completed log; shows *"No completed, complete soon"* if empty; resets daily.
   - **(ii) Weekly Tasks (18/30)**: Tapping opens weekly log with day, date & time; resets weekly.
   - **(iii) Leading (Rank #2)**: Tapping opens Territory Standings modal showing peer task completion pace (5/5, 4/5, etc.).
   - **(iv) History**: Tapping jumps directly to the Visit History tab.

7. **Hero Banner CTA**:
   - Button updated to **"New Visit"** routing directly to the New Visit screen.

8. **Recent Field Logs**:
   - Displays the last 5 completed visits history with instant click-to-inspect detail drawer.

9. **New Visit Screen Fixes**:
   - Working Back button (`<-`) navigating to Home.
   - Working Refresh button (`⟳`) clearing all form inputs, notes, photo & audio proofs.
   - Replaced raw sensor table with Google Map interactive pin dropper & verified stamp.
   - Functional Store Photo capture modal and Field Audio Note recorder.
   - Visit submitted as `Pending Approval` and queued into Visit History.

10. **Visit History & Full Dossier Inspector**:
    - Renamed from "Visits Feed" to **Visit History**.
    - Clicking any visit record opens a complete dossier displaying: Business Name, Branch, Contact Person, Phone (with call trigger), Deal Size (₹ INR), Meeting Type, Status Badge, Meeting Notes, Geotagged Store Photo, Audio Memo player, Verified Address, and Stamped Date, Time & Coordinates.

---

### Build Commands:

```bash
cd D:\prpr\Trackora\mobile
flutter pub get
flutter build apk --release
copy build\app\outputs\flutter-apk\app-release.apk ..\..\apk's\version3\trackora_version3.apk
```
