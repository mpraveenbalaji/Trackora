import 'package:flutter/material.dart';

void main() {
  runApp(const TrackoraApp());
}

class TrackoraApp extends StatelessWidget {
  const TrackoraApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Trackora',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF0F5132),
          primary: const Color(0xFF0F5132),
          secondary: const Color(0xFF0D9488),
          surface: Colors.white,
        ),
        fontFamily: 'Roboto',
        scaffoldBackgroundColor: const Color(0xFFF8FAFC),
        appBarTheme: const AppBarTheme(
          backgroundColor: Colors.white,
          foregroundColor: Color(0xFF0F172A),
          elevation: 0,
        ),
      ),
      home: const AuthWrapper(),
    );
  }
}

// User Model
class SalesUser {
  final String id;
  final String name;
  final String email;
  final String role;
  final String territory;
  final String phone;
  final String avatarText;

  const SalesUser({
    required this.id,
    required this.name,
    required this.email,
    required this.role,
    required this.territory,
    required this.phone,
    required this.avatarText,
  });
}

// Predefined Indian Test Users
const kTestUsers = [
  SalesUser(
    id: 'u-1',
    name: 'Praveen Balaji',
    email: 'praveen@trackora.in',
    role: 'Senior Enterprise Rep',
    territory: 'Chennai & Tamil Nadu',
    phone: '+91 98401 22334',
    avatarText: 'PB',
  ),
  SalesUser(
    id: 'u-2',
    name: 'Inthiyaz Ahmed',
    email: 'inthiyaz@trackora.in',
    role: 'Territory Sales Lead',
    territory: 'Bengaluru & Karnataka',
    phone: '+91 97412 88990',
    avatarText: 'IA',
  ),
];

// Predefined Indian Clients / Locations
class ClientPreset {
  final String name;
  final String state;
  final String area;
  final double lat;
  final double lng;
  final String contactName;
  final String phone;

  const ClientPreset({
    required this.name,
    required this.state,
    required this.area,
    required this.lat,
    required this.lng,
    required this.contactName,
    required this.phone,
  });
}

const kIndianClients = [
  ClientPreset(
    name: 'SMVEC Campus / Tech Park',
    state: 'Pondicherry',
    area: 'Madagadipet, Pondicherry - 605107',
    lat: 11.942288,
    lng: 79.815606,
    contactName: 'Dean / Admin Office',
    phone: '+91 413 264 3000',
  ),
  ClientPreset(
    name: 'Pothys Flagship Store',
    state: 'Tamil Nadu',
    area: 'Usman Road, T. Nagar, Chennai - 600017',
    lat: 13.0418,
    lng: 80.2341,
    contactName: 'Murugan Swaminathan',
    phone: '+91 98400 11223',
  ),
  ClientPreset(
    name: 'Saravana Stores Elite',
    state: 'Tamil Nadu',
    area: 'Pondy Bazaar, T. Nagar, Chennai - 600017',
    lat: 13.0402,
    lng: 80.2389,
    contactName: 'R. Veeramani',
    phone: '+91 98401 55667',
  ),
  ClientPreset(
    name: 'Reliance Retail South HQ',
    state: 'Karnataka',
    area: 'MG Road / Brigade Road, Bengaluru - 560001',
    lat: 12.9716,
    lng: 77.5946,
    contactName: 'Anil Kumble',
    phone: '+91 99000 44556',
  ),
  ClientPreset(
    name: 'Tata Consultancy Services',
    state: 'Tamil Nadu',
    area: 'Siruseri IT Corridor, OMR, Chennai - 603103',
    lat: 12.8258,
    lng: 80.2241,
    contactName: 'K. Chandrasekaran',
    phone: '+91 98402 77889',
  ),
  ClientPreset(
    name: 'L&T Commercial Hub',
    state: 'Maharashtra',
    area: 'Powai Business Hub, Mumbai - 400076',
    lat: 19.1176,
    lng: 72.9060,
    contactName: 'Sachin Tendulkar',
    phone: '+91 98200 33445',
  ),
];

// Auth Wrapper
class AuthWrapper extends StatefulWidget {
  const AuthWrapper({super.key});

  @override
  State<AuthWrapper> createState() => _AuthWrapperState();
}

class _AuthWrapperState extends State<AuthWrapper> {
  SalesUser? _currentUser;

  void _login(SalesUser user) {
    setState(() {
      _currentUser = user;
    });
  }

  void _logout() {
    setState(() {
      _currentUser = null;
    });
  }

  @override
  Widget build(BuildContext context) {
    if (_currentUser == null) {
      return LoginScreen(onLogin: _login);
    }
    return MainNavigationShell(
      currentUser: _currentUser!,
      onLogout: _logout,
    );
  }
}

// -------------------------------------------------------------
// LOGIN SCREEN (Updated with actual logo.jpeg & "Trackora" footer)
// -------------------------------------------------------------
class LoginScreen extends StatefulWidget {
  final Function(SalesUser) onLogin;
  const LoginScreen({super.key, required this.onLogin});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _emailController = TextEditingController(text: 'praveen@trackora.in');
  final _passwordController = TextEditingController(text: 'sales123');
  bool _obscurePassword = true;
  String? _errorMessage;

  void _handleManualLogin() {
    final email = _emailController.text.trim().toLowerCase();
    final pass = _passwordController.text.trim();

    final user = kTestUsers.firstWhere(
      (u) => u.email.toLowerCase() == email,
      orElse: () => kTestUsers[0],
    );

    if (pass.isEmpty) {
      setState(() {
        _errorMessage = 'Please enter password';
      });
      return;
    }

    widget.onLogin(user);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [
              Color(0xFF0F172A),
              Color(0xFF0F5132),
              Color(0xFF064E3B),
            ],
          ),
        ),
        child: SafeArea(
          child: Center(
            child: SingleChildScrollView(
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  // Actual Trackora Logo from requirements_inthiyaz/logo.jpeg
                  Container(
                    width: 82,
                    height: 82,
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(24),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withAlpha(70),
                          blurRadius: 20,
                          offset: const Offset(0, 10),
                        ),
                      ],
                    ),
                    clipBehavior: Clip.antiAlias,
                    child: Image.asset(
                      'assets/images/logo.jpeg',
                      fit: BoxFit.cover,
                    ),
                  ),
                  const SizedBox(height: 16),
                  const Text(
                    'Trackora',
                    style: TextStyle(
                      fontSize: 32,
                      fontWeight: FontWeight.w900,
                      color: Colors.white,
                      letterSpacing: -0.5,
                    ),
                  ),
                  const SizedBox(height: 6),
                  const Text(
                    'Every Visit. Every Goal. Every Win.',
                    style: TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.w500,
                      color: Colors.white70,
                      letterSpacing: 0.3,
                    ),
                  ),
                  const SizedBox(height: 28),

                  // Login Card
                  Container(
                    padding: const EdgeInsets.all(24),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(28),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withAlpha(50),
                          blurRadius: 30,
                          offset: const Offset(0, 15),
                        ),
                      ],
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'Field Rep Sign In',
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.w800,
                            color: Color(0xFF0F172A),
                          ),
                        ),
                        const SizedBox(height: 4),
                        const Text(
                          'Enter your registered sales credentials or use quick-switch',
                          style: TextStyle(
                            fontSize: 12,
                            color: Color(0xFF64748B),
                          ),
                        ),
                        const SizedBox(height: 20),

                        // Email Field
                        TextField(
                          controller: _emailController,
                          keyboardType: TextInputType.emailAddress,
                          decoration: InputDecoration(
                            labelText: 'Work Email',
                            labelStyle: const TextStyle(fontSize: 13),
                            prefixIcon: const Icon(Icons.mail_outline, size: 20, color: Color(0xFF0F5132)),
                            filled: true,
                            fillColor: const Color(0xFFF8FAFC),
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(16),
                              borderSide: const BorderSide(color: Color(0xFFE2E8F0)),
                            ),
                            enabledBorder: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(16),
                              borderSide: const BorderSide(color: Color(0xFFE2E8F0)),
                            ),
                          ),
                        ),
                        const SizedBox(height: 14),

                        // Password Field
                        TextField(
                          controller: _passwordController,
                          obscureText: _obscurePassword,
                          decoration: InputDecoration(
                            labelText: 'Password',
                            labelStyle: const TextStyle(fontSize: 13),
                            prefixIcon: const Icon(Icons.lock_outline, size: 20, color: Color(0xFF0F5132)),
                            suffixIcon: IconButton(
                              icon: Icon(
                                _obscurePassword ? Icons.visibility_off : Icons.visibility,
                                size: 20,
                                color: const Color(0xFF64748B),
                              ),
                              onPressed: () {
                                setState(() {
                                  _obscurePassword = !_obscurePassword;
                                });
                              },
                            ),
                            filled: true,
                            fillColor: const Color(0xFFF8FAFC),
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(16),
                              borderSide: const BorderSide(color: Color(0xFFE2E8F0)),
                            ),
                            enabledBorder: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(16),
                              borderSide: const BorderSide(color: Color(0xFFE2E8F0)),
                            ),
                          ),
                        ),

                        if (_errorMessage != null) ...[
                          const SizedBox(height: 10),
                          Text(
                            _errorMessage!,
                            style: const TextStyle(color: Colors.red, fontSize: 12),
                          ),
                        ],

                        const SizedBox(height: 18),

                        // Submit Button
                        SizedBox(
                          width: double.infinity,
                          height: 50,
                          child: ElevatedButton(
                            onPressed: _handleManualLogin,
                            style: ElevatedButton.styleFrom(
                              backgroundColor: const Color(0xFF0F5132),
                              foregroundColor: Colors.white,
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(16),
                              ),
                              elevation: 2,
                            ),
                            child: const Text(
                              'Sign In to Dashboard',
                              style: TextStyle(
                                fontSize: 15,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),
                        ),

                        const SizedBox(height: 22),
                        const Divider(color: Color(0xFFE2E8F0)),
                        const SizedBox(height: 14),

                        // Quick Testing Credentials Box
                        const Center(
                          child: Text(
                            '⚡ 1-TAP DEMO TEST ACCOUNTS',
                            style: TextStyle(
                              fontSize: 11,
                              fontWeight: FontWeight.w800,
                              color: Color(0xFF0F5132),
                              letterSpacing: 0.8,
                            ),
                          ),
                        ),
                        const SizedBox(height: 10),

                        // Account 1: Praveen Balaji
                        InkWell(
                          onTap: () {
                            _emailController.text = kTestUsers[0].email;
                            _passwordController.text = 'sales123';
                            widget.onLogin(kTestUsers[0]);
                          },
                          borderRadius: BorderRadius.circular(14),
                          child: Container(
                            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                            decoration: BoxDecoration(
                              color: const Color(0xFFF0FDF4),
                              border: Border.all(color: const Color(0xFFBBF7D0)),
                              borderRadius: BorderRadius.circular(14),
                            ),
                            child: const Row(
                              children: [
                                CircleAvatar(
                                  radius: 16,
                                  backgroundColor: Color(0xFF0F5132),
                                  child: Text('PB', style: TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold)),
                                ),
                                SizedBox(width: 10),
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        'Praveen Balaji (Chennai)',
                                        style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
                                      ),
                                      Text(
                                        'praveen@trackora.in • Pass: sales123',
                                        style: TextStyle(fontSize: 11, color: Color(0xFF059669)),
                                      ),
                                    ],
                                  ),
                                ),
                                Icon(Icons.arrow_forward_ios, size: 12, color: Color(0xFF059669)),
                              ],
                            ),
                          ),
                        ),
                        const SizedBox(height: 8),

                        // Account 2: Inthiyaz Ahmed
                        InkWell(
                          onTap: () {
                            _emailController.text = kTestUsers[1].email;
                            _passwordController.text = 'sales123';
                            widget.onLogin(kTestUsers[1]);
                          },
                          borderRadius: BorderRadius.circular(14),
                          child: Container(
                            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                            decoration: BoxDecoration(
                              color: const Color(0xFFF8FAFC),
                              border: Border.all(color: const Color(0xFFE2E8F0)),
                              borderRadius: BorderRadius.circular(14),
                            ),
                            child: const Row(
                              children: [
                                CircleAvatar(
                                  radius: 16,
                                  backgroundColor: Color(0xFF0D9488),
                                  child: Text('IA', style: TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold)),
                                ),
                                SizedBox(width: 10),
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        'Inthiyaz Ahmed (Bengaluru)',
                                        style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
                                      ),
                                      Text(
                                        'inthiyaz@trackora.in • Pass: sales123',
                                        style: TextStyle(fontSize: 11, color: Color(0xFF0D9488)),
                                      ),
                                    ],
                                  ),
                                ),
                                Icon(Icons.arrow_forward_ios, size: 12, color: Color(0xFF64748B)),
                              ],
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 24),
                  // User specifically asked: "in bottom down remove the last line and add 'Trackora'"
                  const Text(
                    'Trackora',
                    style: TextStyle(
                      color: Colors.white70,
                      fontSize: 13,
                      fontWeight: FontWeight.bold,
                      letterSpacing: 0.5,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

// -------------------------------------------------------------
// LIVE DATE & TIME HELPERS
// -------------------------------------------------------------
String formatLiveDate(DateTime dt) {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  final dayName = days[dt.weekday - 1];
  final monthName = months[dt.month - 1];
  final hour = dt.hour == 0 ? 12 : (dt.hour > 12 ? dt.hour - 12 : dt.hour);
  final period = dt.hour >= 12 ? 'PM' : 'AM';
  final min = dt.minute.toString().padLeft(2, '0');
  return '$dayName, ${dt.day} $monthName ${dt.year} • ${hour.toString().padLeft(2, '0')}:$min $period';
}

String formatLiveTime(DateTime dt) {
  final hour = dt.hour == 0 ? 12 : (dt.hour > 12 ? dt.hour - 12 : dt.hour);
  final period = dt.hour >= 12 ? 'PM' : 'AM';
  final min = dt.minute.toString().padLeft(2, '0');
  return '${hour.toString().padLeft(2, '0')}:$min $period';
}

String getTodayDateKey() {
  final now = DateTime.now();
  return '${now.year}-${now.month.toString().padLeft(2, '0')}-${now.day.toString().padLeft(2, '0')}';
}

// -------------------------------------------------------------
// INTERACTIVE GOOGLE MAP LOCATION PICKER DIALOG
// -------------------------------------------------------------
class AttendanceMapPickerDialog extends StatefulWidget {
  final double initialLat;
  final double initialLng;
  final String initialArea;

  const AttendanceMapPickerDialog({
    super.key,
    required this.initialLat,
    required this.initialLng,
    required this.initialArea,
  });

  @override
  State<AttendanceMapPickerDialog> createState() => _AttendanceMapPickerDialogState();
}

class _AttendanceMapPickerDialogState extends State<AttendanceMapPickerDialog> {
  late double _lat;
  late double _lng;
  late String _area;
  late DateTime _selectedTime;

  @override
  void initState() {
    super.initState();
    _lat = widget.initialLat;
    _lng = widget.initialLng;
    _area = widget.initialArea;
    _selectedTime = DateTime.now();
  }

  void _selectPreset(String landmark, double lat, double lng) {
    setState(() {
      _lat = lat;
      _lng = lng;
      _area = landmark;
      _selectedTime = DateTime.now();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Dialog(
      backgroundColor: Colors.transparent,
      insetPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 20),
      child: Container(
        constraints: const BoxConstraints(maxHeight: 650),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(28),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withAlpha(50),
              blurRadius: 30,
              offset: const Offset(0, 10),
            ),
          ],
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            // Header
            Padding(
              padding: const EdgeInsets.fromLTRB(20, 18, 16, 12),
              child: Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      color: const Color(0xFFECFDF5),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: const Icon(Icons.add_location_alt, color: Color(0xFF0F5132), size: 22),
                  ),
                  const SizedBox(width: 12),
                  const Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Pin Work Location (Google Map)',
                          style: TextStyle(fontSize: 15, fontWeight: FontWeight.w800, color: Color(0xFF0F172A)),
                        ),
                        Text(
                          'Tap map or landmark to set GPS attendance pin',
                          style: TextStyle(fontSize: 11, color: Color(0xFF64748B)),
                        ),
                      ],
                    ),
                  ),
                  IconButton(
                    onPressed: () => Navigator.pop(context),
                    icon: const Icon(Icons.close, color: Color(0xFF64748B)),
                  ),
                ],
              ),
            ),
            const Divider(height: 1, color: Color(0xFFF1F5F9)),

            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Interactive Map Canvas
                    ClipRRect(
                      borderRadius: BorderRadius.circular(20),
                      child: SizedBox(
                        height: 200,
                        width: double.infinity,
                        child: GestureDetector(
                          onTapDown: (details) {
                            setState(() {
                              _lat = double.parse((_lat + (details.localPosition.dy - 100) * 0.00005).toStringAsFixed(6));
                              _lng = double.parse((_lng + (details.localPosition.dx - 150) * 0.00005).toStringAsFixed(6));
                              _selectedTime = DateTime.now();
                            });
                          },
                          child: Stack(
                            children: [
                              CustomPaint(
                                painter: MintMapPainter(),
                                size: const Size(double.infinity, 200),
                              ),
                              // Target crosshair
                              Center(
                                child: Column(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    Container(
                                      width: 48,
                                      height: 48,
                                      decoration: BoxDecoration(
                                        shape: BoxShape.circle,
                                        color: const Color(0xFF0F5132).withAlpha(45),
                                        border: Border.all(color: const Color(0xFF0F5132), width: 2),
                                      ),
                                      child: const Icon(Icons.location_on, color: Color(0xFF0F5132), size: 28),
                                    ),
                                    const SizedBox(height: 4),
                                    Container(
                                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                      decoration: BoxDecoration(
                                        color: const Color(0xFF1E293B),
                                        borderRadius: BorderRadius.circular(16),
                                        boxShadow: [
                                          BoxShadow(
                                            color: Colors.black.withAlpha(40),
                                            blurRadius: 8,
                                          ),
                                        ],
                                      ),
                                      child: Text(
                                        '${_lat.toStringAsFixed(4)}°, ${_lng.toStringAsFixed(4)}°',
                                        style: const TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold),
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                              // Guidance Tag
                              Positioned(
                                bottom: 8,
                                left: 10,
                                child: Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                  decoration: BoxDecoration(
                                    color: Colors.white.withAlpha(230),
                                    borderRadius: BorderRadius.circular(10),
                                    border: Border.all(color: const Color(0xFFE2E8F0)),
                                  ),
                                  child: const Row(
                                    children: [
                                      Icon(Icons.touch_app, size: 12, color: Color(0xFF0F5132)),
                                      SizedBox(width: 4),
                                      Text('Tap anywhere on map to reposition pin', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold)),
                                    ],
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(height: 14),

                    // Quick Select Landmarks
                    const Text(
                      'Select Indian Commercial Landmark:',
                      style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: Color(0xFF0F172A)),
                    ),
                    const SizedBox(height: 8),

                    _buildLandmarkTile('Usman Road, T. Nagar, Chennai', 13.0418, 80.2341),
                    _buildLandmarkTile('Madagadipet, Pondicherry (SMVEC Campus)', 11.9423, 79.8156),
                    _buildLandmarkTile('Pondy Bazaar, T. Nagar, Chennai', 13.0402, 80.2389),
                    _buildLandmarkTile('MG Road / Brigade Road, Bengaluru', 12.9716, 77.5946),
                    _buildLandmarkTile('Powai Business Hub, Mumbai', 19.1176, 72.9060),

                    const SizedBox(height: 14),

                    // Verified Location Card Preview
                    Container(
                      padding: const EdgeInsets.all(14),
                      decoration: BoxDecoration(
                        color: const Color(0xFFF8FAFC),
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: const Color(0xFFE2E8F0)),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              const Icon(Icons.check_circle, color: Color(0xFF059669), size: 18),
                              const SizedBox(width: 8),
                              Expanded(
                                child: Text(
                                  _area,
                                  style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 13, color: Color(0xFF0F172A)),
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 6),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text(
                                '📍 GPS Coordinates: ${_lat.toStringAsFixed(4)}° N, ${_lng.toStringAsFixed(4)}° E',
                                style: const TextStyle(fontSize: 11, color: Color(0xFF64748B)),
                              ),
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                decoration: BoxDecoration(
                                  color: const Color(0xFFECFDF5),
                                  borderRadius: BorderRadius.circular(6),
                                ),
                                child: const Text('±3m Locked', style: TextStyle(color: Color(0xFF059669), fontSize: 9, fontWeight: FontWeight.bold)),
                              ),
                            ],
                          ),
                          const SizedBox(height: 4),
                          Text(
                            '🕒 Stamped: ${formatLiveDate(_selectedTime)}',
                            style: const TextStyle(fontSize: 11, color: Color(0xFF64748B)),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),

            // Confirm Button
            Padding(
              padding: const EdgeInsets.all(16),
              child: SizedBox(
                width: double.infinity,
                height: 48,
                child: ElevatedButton.icon(
                  onPressed: () {
                    Navigator.pop(context, {
                      'area': _area,
                      'coordinates': '${_lat.toStringAsFixed(4)}° N, ${_lng.toStringAsFixed(4)}° E',
                      'lat': _lat,
                      'lng': _lng,
                      'dateTime': _selectedTime,
                      'dateTimeString': formatLiveDate(_selectedTime),
                    });
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF0F5132),
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                    elevation: 0,
                  ),
                  icon: const Icon(Icons.check, size: 18),
                  label: const Text('Confirm Pinned Location ✓', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildLandmarkTile(String landmark, double lat, double lng) {
    final isSelected = _area == landmark;
    return InkWell(
      onTap: () => _selectPreset(landmark, lat, lng),
      borderRadius: BorderRadius.circular(12),
      child: Container(
        margin: const EdgeInsets.only(bottom: 6),
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
        decoration: BoxDecoration(
          color: isSelected ? const Color(0xFFECFDF5) : Colors.white,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: isSelected ? const Color(0xFF0F5132) : const Color(0xFFE2E8F0)),
        ),
        child: Row(
          children: [
            Icon(Icons.place, size: 16, color: isSelected ? const Color(0xFF0F5132) : const Color(0xFF94A3B8)),
            const SizedBox(width: 8),
            Expanded(
              child: Text(
                landmark,
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: isSelected ? FontWeight.w800 : FontWeight.w500,
                  color: isSelected ? const Color(0xFF0F5132) : const Color(0xFF1E293B),
                ),
                overflow: TextOverflow.ellipsis,
              ),
            ),
            if (isSelected) const Icon(Icons.check_circle, size: 16, color: Color(0xFF0F5132)),
          ],
        ),
      ),
    );
  }
}

// -------------------------------------------------------------
// IN-APP CAMERA OFFICER PHOTO VERIFICATION DIALOG
// -------------------------------------------------------------
class OfficerSelfieCameraDialog extends StatefulWidget {
  final SalesUser currentUser;
  final String? pinnedLocation;

  const OfficerSelfieCameraDialog({
    super.key,
    required this.currentUser,
    this.pinnedLocation,
  });

  @override
  State<OfficerSelfieCameraDialog> createState() => _OfficerSelfieCameraDialogState();
}

class _OfficerSelfieCameraDialogState extends State<OfficerSelfieCameraDialog> {
  bool _isUploading = false;
  bool _uploadSuccess = false;

  void _capturePhoto() async {
    setState(() {
      _isUploading = true;
    });

    // Simulate shutter flash & secure upload
    await Future.delayed(const Duration(milliseconds: 700));

    if (mounted) {
      setState(() {
        _isUploading = false;
        _uploadSuccess = true;
      });
    }

    await Future.delayed(const Duration(milliseconds: 600));

    if (mounted) {
      Navigator.pop(context, {
        'success': true,
        'timestamp': formatLiveTime(DateTime.now()),
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final now = DateTime.now();
    return Dialog(
      backgroundColor: Colors.transparent,
      insetPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 24),
      child: Container(
        decoration: BoxDecoration(
          color: const Color(0xFF0F172A),
          borderRadius: BorderRadius.circular(28),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withAlpha(80),
              blurRadius: 30,
              offset: const Offset(0, 10),
            ),
          ],
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            // Top Bar
            Padding(
              padding: const EdgeInsets.fromLTRB(20, 16, 16, 12),
              child: Row(
                children: [
                  const Icon(Icons.camera_alt, color: Color(0xFF10B981), size: 20),
                  const SizedBox(width: 10),
                  const Expanded(
                    child: Text(
                      'Officer Face Verification',
                      style: TextStyle(color: Colors.white, fontSize: 15, fontWeight: FontWeight.bold),
                    ),
                  ),
                  IconButton(
                    onPressed: () => Navigator.pop(context),
                    icon: const Icon(Icons.close, color: Colors.white70),
                  ),
                ],
              ),
            ),

            // Camera Viewfinder Box
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: ClipRRect(
                borderRadius: BorderRadius.circular(24),
                child: Container(
                  height: 320,
                  width: double.infinity,
                  color: const Color(0xFF020617),
                  child: Stack(
                    alignment: Alignment.center,
                    children: [
                      // Subtle camera sensor grid
                      CustomPaint(
                        size: const Size(double.infinity, 320),
                        painter: CameraGridPainter(),
                      ),

                      // Center Face Oval Reticle
                      Center(
                        child: Column(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Container(
                              width: 150,
                              height: 190,
                              decoration: BoxDecoration(
                                borderRadius: BorderRadius.circular(80),
                                border: Border.all(
                                  color: _uploadSuccess ? const Color(0xFF10B981) : const Color(0xFF34D399).withAlpha(180),
                                  width: 2.5,
                                ),
                                color: Colors.white.withAlpha(10),
                              ),
                              child: Center(
                                child: Column(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    CircleAvatar(
                                      radius: 36,
                                      backgroundColor: const Color(0xFF0F5132),
                                      child: Text(
                                        widget.currentUser.avatarText,
                                        style: const TextStyle(color: Colors.white, fontSize: 26, fontWeight: FontWeight.bold),
                                      ),
                                    ),
                                    const SizedBox(height: 10),
                                    Text(
                                      widget.currentUser.name,
                                      style: const TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.bold),
                                    ),
                                    const SizedBox(height: 2),
                                    const Text(
                                      'ID Verified',
                                      style: TextStyle(color: Color(0xFF6EE7B7), fontSize: 10, fontWeight: FontWeight.w600),
                                    ),
                                  ],
                                ),
                              ),
                            ),
                            const SizedBox(height: 10),
                            Text(
                              _uploadSuccess ? '✔ Face Verified & Uploaded!' : 'Align your face within the frame',
                              style: TextStyle(
                                color: _uploadSuccess ? const Color(0xFF6EE7B7) : Colors.white70,
                                fontSize: 11,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ],
                        ),
                      ),

                      // Watermark Overlay on Viewfinder
                      Positioned(
                        bottom: 12,
                        left: 14,
                        right: 14,
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                          decoration: BoxDecoration(
                            color: Colors.black.withAlpha(150),
                            borderRadius: BorderRadius.circular(10),
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                '📍 ${widget.pinnedLocation ?? 'GPS Verified Location'}',
                                style: const TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold),
                                overflow: TextOverflow.ellipsis,
                              ),
                              Text(
                                '⏰ Stamped: ${formatLiveDate(now)} • Sensor Locked',
                                style: const TextStyle(color: Color(0xFF6EE7B7), fontSize: 9),
                              ),
                            ],
                          ),
                        ),
                      ),

                      // Loading Overlay
                      if (_isUploading)
                        Container(
                          color: Colors.black.withAlpha(180),
                          child: const Center(
                            child: Column(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                CircularProgressIndicator(color: Color(0xFF10B981)),
                                SizedBox(height: 14),
                                Text(
                                  'Uploading Photo to Secure Server...',
                                  style: TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.bold),
                                ),
                              ],
                            ),
                          ),
                        ),

                      // Success Overlay
                      if (_uploadSuccess)
                        Container(
                          color: const Color(0xFF0F5132).withAlpha(200),
                          child: const Center(
                            child: Column(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Icon(Icons.check_circle, color: Color(0xFF6EE7B7), size: 54),
                                SizedBox(height: 10),
                                Text(
                                  'Photo Uploaded Successfully! ✓',
                                  style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold),
                                ),
                              ],
                            ),
                          ),
                        ),
                    ],
                  ),
                ),
              ),
            ),

            // Controls Bar
            Padding(
              padding: const EdgeInsets.all(20),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: [
                  Container(
                    padding: const EdgeInsets.all(10),
                    decoration: BoxDecoration(
                      color: Colors.white.withAlpha(20),
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(Icons.flash_auto, color: Colors.white70, size: 20),
                  ),

                  // Shutter Button
                  GestureDetector(
                    onTap: _isUploading || _uploadSuccess ? null : _capturePhoto,
                    child: Container(
                      width: 68,
                      height: 68,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        border: Border.all(color: const Color(0xFF10B981), width: 4),
                        color: Colors.white,
                      ),
                      child: Center(
                        child: Container(
                          width: 52,
                          height: 52,
                          decoration: const BoxDecoration(
                            shape: BoxShape.circle,
                            color: Color(0xFF0F5132),
                          ),
                          child: const Icon(Icons.camera_alt, color: Colors.white, size: 26),
                        ),
                      ),
                    ),
                  ),

                  Container(
                    padding: const EdgeInsets.all(10),
                    decoration: BoxDecoration(
                      color: Colors.white.withAlpha(20),
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(Icons.flip_camera_ios, color: Colors.white70, size: 20),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class CameraGridPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = Colors.white.withAlpha(15)
      ..strokeWidth = 1;
    canvas.drawLine(Offset(size.width / 3, 0), Offset(size.width / 3, size.height), paint);
    canvas.drawLine(Offset(size.width * 2 / 3, 0), Offset(size.width * 2 / 3, size.height), paint);
    canvas.drawLine(Offset(0, size.height / 3), Offset(size.width, size.height / 3), paint);
    canvas.drawLine(Offset(0, size.height * 2 / 3), Offset(size.width, size.height * 2 / 3), paint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

// -------------------------------------------------------------
// MAIN NAVIGATION SHELL
// -------------------------------------------------------------
class MainNavigationShell extends StatefulWidget {
  final SalesUser currentUser;
  final VoidCallback onLogout;

  const MainNavigationShell({
    super.key,
    required this.currentUser,
    required this.onLogout,
  });

  @override
  State<MainNavigationShell> createState() => _MainNavigationShellState();
}

class _MainNavigationShellState extends State<MainNavigationShell> {
  int _currentIndex = 0;

  // Attendance State - Starts as NOT MARKED (Screenshot 1)
  bool _isCheckedIn = false;
  String? _punchedDateKey;
  String _checkInTime = '10:05 AM';
  String _checkInLocation = 'Usman Road, T. Nagar, Chennai';
  Map<String, dynamic>? _stagedLocation;
  bool _stagedPhotoCaptured = false;
  String? _stagedPhotoTime;

  // Visits in Memory
  final List<Map<String, dynamic>> _visits = [
    {
      'id': 'v-101',
      'client': 'SMVEC Campus / Tech Park',
      'contact': 'Dean / Admin Office',
      'area': 'Madagadipet, Pondicherry',
      'state': 'Pondicherry',
      'amount': '₹ 18,50,000',
      'time': '10:15 AM',
      'type': 'In-Person',
      'status': 'Approved',
      'hotLead': true,
      'hasPhoto': true,
      'hasAudio': true,
    },
    {
      'id': 'v-102',
      'client': 'Pothys Flagship Store',
      'contact': 'Murugan Swaminathan (GM)',
      'area': 'Usman Road, T. Nagar, Chennai',
      'state': 'Tamil Nadu',
      'amount': '₹ 15,00,000',
      'time': '11:45 AM',
      'type': 'In-Person',
      'status': 'Approved',
      'hotLead': true,
      'hasPhoto': true,
      'hasAudio': true,
    },
    {
      'id': 'v-103',
      'client': 'Saravana Stores Elite',
      'contact': 'R. Veeramani (Procurement)',
      'area': 'Pondy Bazaar, Chennai',
      'state': 'Tamil Nadu',
      'amount': '₹ 8,50,000',
      'time': '01:20 PM',
      'type': 'Product Demo',
      'status': 'Approved',
      'hotLead': true,
      'hasPhoto': true,
      'hasAudio': false,
    },
    {
      'id': 'v-104',
      'client': 'Reliance Retail South Hub',
      'contact': 'Anil Kumble (Regional Head)',
      'area': 'MG Road, Bengaluru',
      'state': 'Karnataka',
      'amount': '₹ 45,00,000',
      'time': '03:15 PM',
      'type': 'Contract Negotiation',
      'status': 'Pending Approval',
      'hotLead': true,
      'hasPhoto': true,
      'hasAudio': true,
    },
  ];

  @override
  void initState() {
    super.initState();
    _checkMidnightRollover();
  }

  void _checkMidnightRollover() {
    final today = getTodayDateKey();
    if (_punchedDateKey != null && _punchedDateKey != today) {
      setState(() {
        _isCheckedIn = false;
        _punchedDateKey = null;
        _stagedLocation = null;
        _stagedPhotoCaptured = false;
        _stagedPhotoTime = null;
      });
    }
  }

  void _onLocationPinned(Map<String, dynamic> loc) {
    setState(() {
      _stagedLocation = loc;
    });
  }

  void _onPhotoCaptured(String timestamp) {
    setState(() {
      _stagedPhotoCaptured = true;
      _stagedPhotoTime = timestamp;
    });
  }

  void _onPunchAttendance() {
    final now = DateTime.now();
    setState(() {
      _isCheckedIn = true;
      _punchedDateKey = getTodayDateKey();
      _checkInTime = formatLiveTime(now);
      _checkInLocation = _stagedLocation != null ? _stagedLocation!['area'] : 'Usman Road, T. Nagar, Chennai';
    });
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        backgroundColor: const Color(0xFF0F5132),
        behavior: SnackBarBehavior.floating,
        content: Row(
          children: [
            const Icon(Icons.check_circle, color: Colors.white, size: 20),
            const SizedBox(width: 10),
            Expanded(
              child: Text(
                '🎉 Daily Geo-Attendance punched successfully! Verified at $_checkInLocation at $_checkInTime.',
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _onSimulateMidnightReset() {
    setState(() {
      _isCheckedIn = false;
      _punchedDateKey = null;
      _stagedLocation = null;
      _stagedPhotoCaptured = false;
      _stagedPhotoTime = null;
    });
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        backgroundColor: Color(0xFF1E293B),
        behavior: SnackBarBehavior.floating,
        content: Row(
          children: [
            Icon(Icons.nightlight_round, color: Color(0xFFFDBA74), size: 20),
            SizedBox(width: 10),
            Expanded(
              child: Text(
                '🌙 12:00 AM Midnight Rollover Simulated! Attendance reset to NOT MARKED for the new day.',
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _addNewVisit(Map<String, dynamic> visit) {
    setState(() {
      _visits.insert(0, visit);
      _currentIndex = 2; // Switch to visits tab
    });
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        backgroundColor: const Color(0xFF0F5132),
        behavior: SnackBarBehavior.floating,
        content: Row(
          children: [
            const Icon(Icons.check_circle, color: Colors.white, size: 20),
            const SizedBox(width: 10),
            Expanded(child: Text('Visit at ${visit['client']} submitted for approval!')),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    _checkMidnightRollover();

    final screens = [
      HomeScreen(
        currentUser: widget.currentUser,
        isCheckedIn: _isCheckedIn,
        checkInTime: _checkInTime,
        checkInLocation: _checkInLocation,
        stagedLocation: _stagedLocation,
        stagedPhotoCaptured: _stagedPhotoCaptured,
        stagedPhotoTime: _stagedPhotoTime,
        visits: _visits,
        onLocationPinned: _onLocationPinned,
        onPhotoCaptured: _onPhotoCaptured,
        onPunchAttendance: _onPunchAttendance,
        onSimulateMidnightReset: _onSimulateMidnightReset,
        onNavigateToNewVisit: () {
          setState(() {
            _currentIndex = 1;
          });
        },
      ),
      NewVisitScreen(
        currentUser: widget.currentUser,
        onSubmit: _addNewVisit,
      ),
      VisitsHistoryScreen(visits: _visits),
      ProfileScreen(
        currentUser: widget.currentUser,
        isCheckedIn: _isCheckedIn,
        checkInTime: _checkInTime,
        onSimulateMidnightReset: _onSimulateMidnightReset,
        onLogout: widget.onLogout,
      ),
    ];

    return Scaffold(
      body: screens[_currentIndex],
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          boxShadow: [
            BoxShadow(
              color: Colors.black.withAlpha(15),
              blurRadius: 20,
              offset: const Offset(0, -4),
            ),
          ],
        ),
        child: NavigationBar(
          selectedIndex: _currentIndex,
          onDestinationSelected: (idx) {
            setState(() {
              _currentIndex = idx;
            });
          },
          backgroundColor: Colors.white,
          indicatorColor: const Color(0xFFE8F5EE),
          elevation: 0,
          destinations: const [
            NavigationDestination(
              icon: Icon(Icons.dashboard_outlined),
              selectedIcon: Icon(Icons.dashboard, color: Color(0xFF0F5132)),
              label: 'Overview',
            ),
            NavigationDestination(
              icon: Icon(Icons.add_location_alt_outlined),
              selectedIcon: Icon(Icons.add_location_alt, color: Color(0xFF0F5132)),
              label: 'New Visit',
            ),
            NavigationDestination(
              icon: Icon(Icons.history_outlined),
              selectedIcon: Icon(Icons.history, color: Color(0xFF0F5132)),
              label: 'Visits Feed',
            ),
            NavigationDestination(
              icon: Icon(Icons.person_outline),
              selectedIcon: Icon(Icons.person, color: Color(0xFF0F5132)),
              label: 'Profile',
            ),
          ],
        ),
      ),
    );
  }
}

// -------------------------------------------------------------
// TAB 1: HOME SCREEN
// -------------------------------------------------------------
class HomeScreen extends StatelessWidget {
  final SalesUser currentUser;
  final bool isCheckedIn;
  final String checkInTime;
  final String checkInLocation;
  final Map<String, dynamic>? stagedLocation;
  final bool stagedPhotoCaptured;
  final String? stagedPhotoTime;
  final List<Map<String, dynamic>> visits;
  final Function(Map<String, dynamic>) onLocationPinned;
  final Function(String) onPhotoCaptured;
  final VoidCallback onPunchAttendance;
  final VoidCallback onSimulateMidnightReset;
  final VoidCallback onNavigateToNewVisit;

  const HomeScreen({
    super.key,
    required this.currentUser,
    required this.isCheckedIn,
    required this.checkInTime,
    required this.checkInLocation,
    required this.stagedLocation,
    required this.stagedPhotoCaptured,
    required this.stagedPhotoTime,
    required this.visits,
    required this.onLocationPinned,
    required this.onPhotoCaptured,
    required this.onPunchAttendance,
    required this.onSimulateMidnightReset,
    required this.onNavigateToNewVisit,
  });

  void _openAttendanceMapPicker(BuildContext context) async {
    final result = await showDialog<Map<String, dynamic>>(
      context: context,
      barrierDismissible: true,
      builder: (ctx) => AttendanceMapPickerDialog(
        initialLat: stagedLocation != null ? (stagedLocation!['lat'] as double) : 13.0418,
        initialLng: stagedLocation != null ? (stagedLocation!['lng'] as double) : 80.2341,
        initialArea: stagedLocation != null ? (stagedLocation!['area'] as String) : 'Usman Road, T. Nagar, Chennai',
      ),
    );

    if (result != null) {
      onLocationPinned(result);
    }
  }

  void _openOfficerSelfieCamera(BuildContext context) async {
    final result = await showDialog<Map<String, dynamic>>(
      context: context,
      barrierDismissible: false,
      builder: (ctx) => OfficerSelfieCameraDialog(
        currentUser: currentUser,
        pinnedLocation: stagedLocation != null ? stagedLocation!['area'] : 'Usman Road, T. Nagar, Chennai',
      ),
    );

    if (result != null && result['success'] == true) {
      onPhotoCaptured(result['timestamp'] as String);
    }
  }

  void _handlePunchClick(BuildContext context) {
    if (stagedLocation == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          backgroundColor: Color(0xFFB45309),
          behavior: SnackBarBehavior.floating,
          content: Row(
            children: [
              Icon(Icons.info, color: Colors.white, size: 20),
              SizedBox(width: 10),
              Expanded(child: Text('Step 1: Please tap to pin your work location on Google Map first!')),
            ],
          ),
        ),
      );
      _openAttendanceMapPicker(context);
      return;
    }

    if (!stagedPhotoCaptured) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          backgroundColor: Color(0xFFB45309),
          behavior: SnackBarBehavior.floating,
          content: Row(
            children: [
              Icon(Icons.camera_alt, color: Colors.white, size: 20),
              SizedBox(width: 10),
              Expanded(child: Text('Step 2: Please click for officer photo before punching attendance!')),
            ],
          ),
        ),
      );
      _openOfficerSelfieCamera(context);
      return;
    }

    onPunchAttendance();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        titleSpacing: 16,
        title: Row(
          children: [
            CircleAvatar(
              radius: 18,
              backgroundColor: const Color(0xFF0F5132),
              child: Text(
                currentUser.avatarText,
                style: const TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.bold),
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Vanakkam, ${currentUser.name.split(' ').first} 👋',
                    style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w800, color: Color(0xFF0F172A)),
                    overflow: TextOverflow.ellipsis,
                  ),
                  Text(
                    currentUser.territory,
                    style: const TextStyle(fontSize: 11, color: Color(0xFF64748B), fontWeight: FontWeight.w500),
                    overflow: TextOverflow.ellipsis,
                  ),
                ],
              ),
            ),
          ],
        ),
        actions: [
          Container(
            margin: const EdgeInsets.only(right: 14),
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
            decoration: BoxDecoration(
              color: const Color(0xFFECFDF5),
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: const Color(0xFFA7F3D0)),
            ),
            child: const Row(
              children: [
                Icon(Icons.gps_fixed, size: 13, color: Color(0xFF059669)),
                SizedBox(width: 4),
                Text('GPS ±3m', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFF059669))),
              ],
            ),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Daily Geo Attendance Card (Exact match for Screenshot 1 & 2)
            Container(
              padding: const EdgeInsets.all(18),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: isCheckedIn
                      ? [const Color(0xFF0F5132), const Color(0xFF064E3B)]
                      : [const Color(0xFF0F172A), const Color(0xFF1E293B)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(24),
                boxShadow: [
                  BoxShadow(
                    color: (isCheckedIn ? const Color(0xFF0F5132) : Colors.black).withAlpha(50),
                    blurRadius: 16,
                    offset: const Offset(0, 8),
                  ),
                ],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Top Title & Status Pill
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Row(
                        children: [
                          Container(
                            padding: const EdgeInsets.all(8),
                            decoration: BoxDecoration(
                              color: Colors.white.withAlpha(40),
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: const Icon(Icons.fingerprint, color: Colors.white, size: 22),
                          ),
                          const SizedBox(width: 12),
                          const Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'Daily Geo-Attendance',
                                style: TextStyle(color: Colors.white, fontSize: 15, fontWeight: FontWeight.bold),
                              ),
                              Text(
                                'Official GPS Work Check-In',
                                style: TextStyle(color: Colors.white70, fontSize: 11),
                              ),
                            ],
                          ),
                        ],
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(
                          color: isCheckedIn ? const Color(0x3310B981) : const Color(0x33F97316),
                          borderRadius: BorderRadius.circular(14),
                        ),
                        child: Text(
                          isCheckedIn ? 'ACTIVE' : 'NOT MARKED',
                          style: TextStyle(
                            color: isCheckedIn ? const Color(0xFF6EE7B7) : const Color(0xFFFDBA74),
                            fontSize: 10,
                            fontWeight: FontWeight.w800,
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),

                  // Middle Section: Unmarked (Interactive Steps) vs Checked-In (Verified Pill)
                  if (!isCheckedIn) ...[
                    // Step 1: Tap to Pin on Google Map
                    if (stagedLocation == null)
                      InkWell(
                        onTap: () => _openAttendanceMapPicker(context),
                        borderRadius: BorderRadius.circular(16),
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                          decoration: BoxDecoration(
                            color: Colors.white.withAlpha(25),
                            borderRadius: BorderRadius.circular(16),
                            border: Border.all(color: Colors.white.withAlpha(20)),
                          ),
                          child: const Row(
                            children: [
                              Icon(Icons.place, color: Color(0xFF6EE7B7), size: 18),
                              SizedBox(width: 8),
                              Expanded(
                                child: Text(
                                  'Tap below to capture verified GPS coordinates',
                                  style: TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.w500),
                                ),
                              ),
                              Icon(Icons.touch_app, color: Color(0xFF6EE7B7), size: 16),
                            ],
                          ),
                        ),
                      )
                    else
                      Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: const Color(0xFF064E3B).withAlpha(150),
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(color: const Color(0xFF10B981).withAlpha(120)),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                const Icon(Icons.location_on, color: Color(0xFF6EE7B7), size: 18),
                                const SizedBox(width: 8),
                                Expanded(
                                  child: Text(
                                    stagedLocation!['area'] ?? '',
                                    style: const TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.bold),
                                  ),
                                ),
                                GestureDetector(
                                  onTap: () => _openAttendanceMapPicker(context),
                                  child: Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                    decoration: BoxDecoration(
                                      color: Colors.white.withAlpha(30),
                                      borderRadius: BorderRadius.circular(8),
                                    ),
                                    child: const Text('Change Pin', style: TextStyle(color: Color(0xFF6EE7B7), fontSize: 10, fontWeight: FontWeight.bold)),
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 6),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Text(
                                  '📍 Coordinates: ${stagedLocation!['coordinates']}',
                                  style: const TextStyle(color: Colors.white70, fontSize: 11),
                                ),
                                const Text(
                                  '±3m GPS Lock',
                                  style: TextStyle(color: Color(0xFF6EE7B7), fontSize: 10, fontWeight: FontWeight.bold),
                                ),
                              ],
                            ),
                            const SizedBox(height: 4),
                            Text(
                              '🕒 Date & Time: ${stagedLocation!['dateTimeString']}',
                              style: const TextStyle(color: Colors.white70, fontSize: 11),
                            ),
                          ],
                        ),
                      ),

                    // Step 2: Officer Photo Button
                    if (stagedLocation != null) ...[
                      const SizedBox(height: 10),
                      if (!stagedPhotoCaptured)
                        SizedBox(
                          width: double.infinity,
                          height: 40,
                          child: OutlinedButton.icon(
                            onPressed: () => _openOfficerSelfieCamera(context),
                            style: OutlinedButton.styleFrom(
                              side: const BorderSide(color: Color(0xFF6EE7B7), width: 1.2),
                              foregroundColor: Colors.white,
                              backgroundColor: Colors.white.withAlpha(15),
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                            ),
                            icon: const Icon(Icons.camera_alt, color: Color(0xFF6EE7B7), size: 16),
                            label: const Text(
                              'Click for Officer Photo (Selfie Proof)',
                              style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold),
                            ),
                          ),
                        )
                      else
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                          decoration: BoxDecoration(
                            color: const Color(0xFF0F5132).withAlpha(120),
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(color: const Color(0xFF10B981).withAlpha(100)),
                          ),
                          child: Row(
                            children: [
                              const CircleAvatar(
                                radius: 13,
                                backgroundColor: Color(0xFF10B981),
                                child: Icon(Icons.check, color: Colors.white, size: 14),
                              ),
                              const SizedBox(width: 10),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    const Text(
                                      '✔ Photo Uploaded Successfully',
                                      style: TextStyle(color: Color(0xFF6EE7B7), fontSize: 11, fontWeight: FontWeight.bold),
                                    ),
                                    Text(
                                      'Officer Verified • $stagedPhotoTime',
                                      style: const TextStyle(color: Colors.white70, fontSize: 10),
                                    ),
                                  ],
                                ),
                              ),
                              GestureDetector(
                                onTap: () => _openOfficerSelfieCamera(context),
                                child: const Text('Retake', style: TextStyle(color: Colors.white70, fontSize: 11, decoration: TextDecoration.underline)),
                              ),
                            ],
                          ),
                        ),
                    ],

                    const SizedBox(height: 14),

                    // Step 3: Punch Daily Geo-Attendance Button
                    SizedBox(
                      width: double.infinity,
                      height: 46,
                      child: ElevatedButton.icon(
                        onPressed: () => _handlePunchClick(context),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: (stagedLocation != null && stagedPhotoCaptured)
                              ? const Color(0xFF059669)
                              : const Color(0xFF0F5132),
                          foregroundColor: Colors.white,
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                          elevation: 0,
                        ),
                        icon: const Icon(Icons.touch_app, size: 18),
                        label: const Text(
                          'Punch Daily Geo-Attendance',
                          style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
                        ),
                      ),
                    ),
                  ] else ...[
                    // Stamped Active Checked-In View (Exact Match for Screenshot 2)
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: Colors.white.withAlpha(25),
                        borderRadius: BorderRadius.circular(16),
                      ),
                      child: Row(
                        children: [
                          const Icon(Icons.place, color: Color(0xFF6EE7B7), size: 18),
                          const SizedBox(width: 8),
                          Expanded(
                            child: Text(
                              '$checkInTime • GPS Verified: $checkInLocation (±3m)',
                              style: const TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.w600),
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 16),
                    SizedBox(
                      width: double.infinity,
                      height: 46,
                      child: ElevatedButton.icon(
                        onPressed: () {
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(
                              backgroundColor: const Color(0xFF0F5132),
                              behavior: SnackBarBehavior.floating,
                              content: Row(
                                children: [
                                  const Icon(Icons.check_circle, color: Colors.white, size: 20),
                                  const SizedBox(width: 10),
                                  Expanded(
                                    child: Text(
                                      'Attendance already marked for today at $checkInTime! Next check-in resets after 12:00 AM midnight.',
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          );
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.white,
                          foregroundColor: const Color(0xFF0F5132),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                          elevation: 0,
                        ),
                        icon: const Icon(Icons.verified, size: 18, color: Color(0xFF0F5132)),
                        label: const Text(
                          'Checked In Today ✓ (Tap to refresh)',
                          style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Color(0xFF0F5132)),
                        ),
                      ),
                    ),
                  ],
                ],
              ),
            ),

            const SizedBox(height: 20),

            // Performance KPI Grid
            const Text(
              "Today's Field Performance (India)",
              style: TextStyle(fontSize: 14, fontWeight: FontWeight.w800, color: Color(0xFF0F172A)),
            ),
            const SizedBox(height: 10),

            Row(
              children: [
                Expanded(
                  child: _buildMetricCard(
                    title: 'VISITS LOGGED',
                    value: '${visits.length} / 6',
                    subtitle: '75% of Daily Target',
                    icon: Icons.assignment_turned_in,
                    iconBg: const Color(0xFFEFF6FF),
                    iconColor: const Color(0xFF2563EB),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: _buildMetricCard(
                    title: 'PIPELINE GENERATED',
                    value: '₹ 87.0 L',
                    subtitle: '+18% above quota',
                    icon: Icons.currency_rupee,
                    iconBg: const Color(0xFFECFDF5),
                    iconColor: const Color(0xFF059669),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                Expanded(
                  child: _buildMetricCard(
                    title: 'HOT LEADS ACTIVE',
                    value: '4 Clients',
                    subtitle: 'High probability deals',
                    icon: Icons.local_fire_department,
                    iconBg: const Color(0xFFFEF2F2),
                    iconColor: const Color(0xFFDC2626),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: _buildMetricCard(
                    title: 'MANAGER AUDIT',
                    value: '3 Approved',
                    subtitle: '1 Pending verification',
                    icon: Icons.security,
                    iconBg: const Color(0xFFFFFBEB),
                    iconColor: const Color(0xFFD97706),
                  ),
                ),
              ],
            ),

            const SizedBox(height: 22),

            // Hero CTA: Log New Visit
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: const Color(0xFFF0FDF4),
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: const Color(0xFFBBF7D0)),
              ),
              child: Row(
                children: [
                  Container(
                    width: 48,
                    height: 48,
                    decoration: BoxDecoration(
                      color: const Color(0xFF0F5132),
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: const Icon(Icons.add_location_alt, color: Colors.white, size: 24),
                  ),
                  const SizedBox(width: 14),
                  const Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'At a Client Store Right Now?',
                          style: TextStyle(fontSize: 14, fontWeight: FontWeight.w800, color: Color(0xFF0F172A)),
                        ),
                        Text(
                          'Mark GPS pin & log in 30 seconds',
                          style: TextStyle(fontSize: 11, color: Color(0xFF64748B)),
                        ),
                      ],
                    ),
                  ),
                  ElevatedButton(
                    onPressed: onNavigateToNewVisit,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF0F5132),
                      foregroundColor: Colors.white,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                    ),
                    child: const Text('Log Visit', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 22),

            // Recent Visits Header
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  "Recent Field Logs",
                  style: TextStyle(fontSize: 14, fontWeight: FontWeight.w800, color: Color(0xFF0F172A)),
                ),
                Text(
                  "${visits.length} logged today",
                  style: const TextStyle(fontSize: 12, color: Color(0xFF64748B)),
                ),
              ],
            ),
            const SizedBox(height: 10),

            ...visits.map((v) => _buildVisitItem(v)),
          ],
        ),
      ),
    );
  }

  Widget _buildMetricCard({
    required String title,
    required String value,
    required String subtitle,
    required IconData icon,
    required Color iconBg,
    required Color iconColor,
  }) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: const Color(0xFFE2E8F0)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withAlpha(5),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                title,
                style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Color(0xFF64748B)),
              ),
              Container(
                padding: const EdgeInsets.all(6),
                decoration: BoxDecoration(color: iconBg, borderRadius: BorderRadius.circular(10)),
                child: Icon(icon, size: 14, color: iconColor),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Text(
            value,
            style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w900, color: Color(0xFF0F172A)),
          ),
          const SizedBox(height: 2),
          Text(
            subtitle,
            style: const TextStyle(fontSize: 10, color: Color(0xFF059669), fontWeight: FontWeight.w600),
          ),
        ],
      ),
    );
  }

  Widget _buildVisitItem(Map<String, dynamic> v) {
    final isApproved = v['status'] == 'Approved';
    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: const Color(0xFFE2E8F0)),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: const Color(0xFFF1F5F9),
              borderRadius: BorderRadius.circular(14),
            ),
            child: const Icon(Icons.storefront, color: Color(0xFF0F5132), size: 20),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Expanded(
                      child: Text(
                        v['client'],
                        style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w800, color: Color(0xFF0F172A)),
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                      decoration: BoxDecoration(
                        color: isApproved ? const Color(0xFFECFDF5) : const Color(0xFFFFFBEB),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: Text(
                        v['status'],
                        style: TextStyle(
                          fontSize: 10,
                          fontWeight: FontWeight.bold,
                          color: isApproved ? const Color(0xFF059669) : const Color(0xFFD97706),
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 4),
                Row(
                  children: [
                    const Icon(Icons.location_on, size: 12, color: Color(0xFF94A3B8)),
                    const SizedBox(width: 3),
                    Expanded(
                      child: Text(
                        v['area'],
                        style: const TextStyle(fontSize: 11, color: Color(0xFF64748B)),
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 6),
                Row(
                  children: [
                    Text(
                      v['amount'],
                      style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w800, color: Color(0xFF0F5132)),
                    ),
                    const SizedBox(width: 10),
                    Text(
                      '• ${v['time']}',
                      style: const TextStyle(fontSize: 11, color: Color(0xFF94A3B8)),
                    ),
                    if (v['hasPhoto'] == true) ...[
                      const SizedBox(width: 6),
                      const Icon(Icons.photo_camera, size: 12, color: Color(0xFF3B82F6)),
                    ],
                    if (v['hasAudio'] == true) ...[
                      const SizedBox(width: 4),
                      const Icon(Icons.mic, size: 12, color: Color(0xFF8B5CF6)),
                    ],
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

// -------------------------------------------------------------
// TAB 2: NEW VISIT SCREEN (Exact Match for Screenshot 5 & Fixed Overflows)
// -------------------------------------------------------------
class NewVisitScreen extends StatefulWidget {
  final SalesUser currentUser;
  final Function(Map<String, dynamic>) onSubmit;

  const NewVisitScreen({
    super.key,
    required this.currentUser,
    required this.onSubmit,
  });

  @override
  State<NewVisitScreen> createState() => _NewVisitScreenState();
}

class _NewVisitScreenState extends State<NewVisitScreen> {
  final _clientNameController = TextEditingController(text: 'SMVEC Campus / Tech Park');
  final _contactPersonController = TextEditingController(text: 'Dean / Admin Office');
  final _phoneController = TextEditingController(text: '+91 413 264 3000');
  final _dealSizeController = TextEditingController(text: '1850000');
  final _notesController = TextEditingController(text: 'Met with administrative board. Discussed Trackora campus and field deployment.');

  String _selectedState = 'Pondicherry';
  String _markedArea = 'Madagadipet, Pondicherry - 605107';

  // Exact coordinates from user's Screenshot 5 (11.942288, 79.815606)
  double _markedLat = 11.942288;
  double _markedLng = 79.815606;
  final double _speed = 0.2;
  final double _altitude = -60.1;

  String _selectedType = 'In-Person';
  bool _hasPhoto = true;
  bool _hasVoice = true;

  void _applyClientPreset(ClientPreset preset) {
    setState(() {
      _clientNameController.text = preset.name;
      _contactPersonController.text = preset.contactName;
      _phoneController.text = preset.phone;
      _selectedState = preset.state;
      _markedArea = preset.area;
      _markedLat = preset.lat;
      _markedLng = preset.lng;
    });
  }

  // Opens interactive manual pin dropping modal with landmark presets
  void _openInteractiveManualPinPicker() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) {
        return StatefulBuilder(
          builder: (context, setModalState) {
            return Container(
              height: MediaQuery.of(context).size.height * 0.75,
              decoration: const BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
              ),
              child: Column(
                children: [
                  Container(
                    margin: const EdgeInsets.only(top: 10, bottom: 8),
                    width: 44,
                    height: 5,
                    decoration: BoxDecoration(
                      color: const Color(0xFFCBD5E1),
                      borderRadius: BorderRadius.circular(10),
                    ),
                  ),
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Manual Pin Drop & Landmark Selector',
                              style: TextStyle(fontWeight: FontWeight.w800, fontSize: 15, color: Color(0xFF0F172A)),
                            ),
                            Text(
                              'Tap any spot or select a landmark to update verified address',
                              style: TextStyle(fontSize: 11, color: Color(0xFF64748B)),
                            ),
                          ],
                        ),
                        IconButton(
                          onPressed: () => Navigator.pop(context),
                          icon: const Icon(Icons.close),
                        ),
                      ],
                    ),
                  ),
                  const Divider(height: 1),

                  // Interactive Map Area inside bottom sheet
                  GestureDetector(
                    onTapDown: (details) {
                      setModalState(() {
                        _markedLat = NumberFormatHelper.roundCoord(11.942288 + (details.localPosition.dy - 80) * 0.0001);
                        _markedLng = NumberFormatHelper.roundCoord(79.815606 + (details.localPosition.dx - 150) * 0.0001);
                        _markedArea = 'Manual Pin: Near Location Grid #4, Pondicherry / Tamil Nadu Border';
                      });
                      setState(() {});
                    },
                    child: Container(
                      height: 180,
                      width: double.infinity,
                      margin: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: const Color(0xFFE8F5EE),
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(color: const Color(0xFFD4EFE1)),
                      ),
                      child: Stack(
                        alignment: Alignment.center,
                        children: [
                          CustomPaint(
                            size: const Size(double.infinity, 180),
                            painter: MintMapPainter(),
                          ),
                          Column(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Container(
                                width: 44,
                                height: 44,
                                decoration: BoxDecoration(
                                  shape: BoxShape.circle,
                                  color: const Color(0xFF0F5132).withAlpha(40),
                                  border: Border.all(color: const Color(0xFF0F5132), width: 2),
                                ),
                                child: const Icon(Icons.gps_fixed, color: Color(0xFF0F5132), size: 22),
                              ),
                              const SizedBox(height: 6),
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                decoration: BoxDecoration(
                                  color: const Color(0xFF1E293B),
                                  borderRadius: BorderRadius.circular(16),
                                ),
                                child: Text(
                                  '${_markedLat.toStringAsFixed(4)}°, ${_markedLng.toStringAsFixed(4)}°',
                                  style: const TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold),
                                ),
                              ),
                            ],
                          ),
                          Positioned(
                            bottom: 8,
                            child: Container(
                              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 3),
                              decoration: BoxDecoration(
                                color: Colors.white.withAlpha(220),
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: const Text('Tap anywhere on map to drop pin', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold)),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),

                  // Quick Landmark List
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    child: Align(
                      alignment: Alignment.centerLeft,
                      child: Text(
                        'Select Verified Client Landmark:',
                        style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: Colors.grey.shade700),
                      ),
                    ),
                  ),
                  const SizedBox(height: 8),
                  Expanded(
                    child: ListView.builder(
                      padding: const EdgeInsets.symmetric(horizontal: 16),
                      itemCount: kIndianClients.length,
                      itemBuilder: (context, idx) {
                        final client = kIndianClients[idx];
                        final isSelected = _clientNameController.text == client.name;
                        return InkWell(
                          onTap: () {
                            _applyClientPreset(client);
                            setModalState(() {});
                            Navigator.pop(context);
                          },
                          child: Container(
                            margin: const EdgeInsets.only(bottom: 8),
                            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                            decoration: BoxDecoration(
                              color: isSelected ? const Color(0xFFECFDF5) : const Color(0xFFF8FAFC),
                              borderRadius: BorderRadius.circular(14),
                              border: Border.all(color: isSelected ? const Color(0xFF0F5132) : const Color(0xFFE2E8F0)),
                            ),
                            child: Row(
                              children: [
                                Icon(Icons.location_on, color: isSelected ? const Color(0xFF0F5132) : Colors.grey, size: 20),
                                const SizedBox(width: 10),
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Text(client.name, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                                      Text(client.area, style: TextStyle(fontSize: 11, color: Colors.grey.shade600), overflow: TextOverflow.ellipsis),
                                    ],
                                  ),
                                ),
                                if (isSelected)
                                  const Icon(Icons.check_circle, color: Color(0xFF0F5132), size: 18),
                              ],
                            ),
                          ),
                        );
                      },
                    ),
                  ),
                ],
              ),
            );
          },
        );
      },
    );
  }

  void _submitVisit() {
    if (_clientNameController.text.trim().isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please enter client business name')),
      );
      return;
    }

    final double amount = double.tryParse(_dealSizeController.text) ?? 500000;
    final String formattedAmount = '₹ ${(amount / 100000).toStringAsFixed(2)} L';

    widget.onSubmit({
      'id': 'v-${DateTime.now().millisecondsSinceEpoch}',
      'client': _clientNameController.text.trim(),
      'contact': _contactPersonController.text.trim(),
      'area': _markedArea,
      'state': _selectedState,
      'amount': formattedAmount,
      'time': 'Just Now',
      'type': _selectedType,
      'status': 'Pending Approval',
      'hotLead': true,
      'hasPhoto': _hasPhoto,
      'hasAudio': _hasVoice,
      'lat': _markedLat,
      'lng': _markedLng,
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => Navigator.maybePop(context),
        ),
        title: const Text(
          'Live GPS Location & Map',
          style: TextStyle(fontWeight: FontWeight.w800, fontSize: 17),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: () {
              setState(() {
                _markedLat = 11.942288;
                _markedLng = 79.815606;
                _markedArea = 'Madagadipet, Pondicherry - 605107';
              });
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('GPS Sensor refreshed: Fix locked (±3m)'), duration: Duration(seconds: 1)),
              );
            },
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // EXACT MATCH FOR SCREENSHOT 5: MINT GPS MAP CARD
            Container(
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(24),
                border: Border.all(color: const Color(0xFFE2E8F0)),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withAlpha(10),
                    blurRadius: 14,
                    offset: const Offset(0, 4),
                  ),
                ],
              ),
              padding: const EdgeInsets.all(14),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Map Surface Box with Badges & Center Radar
                  GestureDetector(
                    onTap: _openInteractiveManualPinPicker,
                    child: Container(
                      height: 200,
                      width: double.infinity,
                      clipBehavior: Clip.antiAlias,
                      decoration: BoxDecoration(
                        color: const Color(0xFFEDF7F2),
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(color: const Color(0xFFD4EFE1)),
                      ),
                      child: Stack(
                        children: [
                          // Custom Painted Mint Map Grid
                          CustomPaint(
                            size: const Size(double.infinity, 200),
                            painter: MintMapPainter(),
                          ),

                          // Top-Left Badge: GPS TRACKED
                          Positioned(
                            top: 10,
                            left: 10,
                            child: Container(
                              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                              decoration: BoxDecoration(
                                color: Colors.white,
                                borderRadius: BorderRadius.circular(20),
                                border: Border.all(color: const Color(0xFFD4EFE1)),
                                boxShadow: [
                                  BoxShadow(color: Colors.black.withAlpha(10), blurRadius: 4),
                                ],
                              ),
                              child: const Row(
                                children: [
                                  Icon(Icons.satellite_alt, size: 13, color: Color(0xFF0F5132)),
                                  SizedBox(width: 4),
                                  Text(
                                    'GPS TRACKED',
                                    style: TextStyle(
                                      fontSize: 10,
                                      fontWeight: FontWeight.bold,
                                      color: Color(0xFF0F5132),
                                      letterSpacing: 0.3,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ),

                          // Top-Right Badge: Accuracy: ±3m
                          Positioned(
                            top: 10,
                            right: 10,
                            child: Container(
                              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                              decoration: BoxDecoration(
                                color: Colors.white,
                                borderRadius: BorderRadius.circular(20),
                                border: Border.all(color: const Color(0xFFE2E8F0)),
                                boxShadow: [
                                  BoxShadow(color: Colors.black.withAlpha(10), blurRadius: 4),
                                ],
                              ),
                              child: const Text(
                                'Accuracy: ±3m',
                                style: TextStyle(
                                  fontSize: 10,
                                  fontWeight: FontWeight.bold,
                                  color: Color(0xFF0F172A),
                                ),
                              ),
                            ),
                          ),

                          // Center Target Pin & Floating Coordinate Pill (Matches Screenshot 5!)
                          Center(
                            child: Column(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Container(
                                  width: 48,
                                  height: 48,
                                  decoration: BoxDecoration(
                                    shape: BoxShape.circle,
                                    color: const Color(0xFF0F5132).withAlpha(35),
                                    border: Border.all(color: const Color(0xFF0F5132).withAlpha(80), width: 1.5),
                                  ),
                                  child: Center(
                                    child: Container(
                                      width: 26,
                                      height: 26,
                                      decoration: const BoxDecoration(
                                        shape: BoxShape.circle,
                                        color: Color(0xFF0F5132),
                                      ),
                                      child: const Icon(Icons.my_location, color: Colors.white, size: 16),
                                    ),
                                  ),
                                ),
                                const SizedBox(height: 6),
                                // Dark Floating Capsule with exact coordinate values
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 5),
                                  decoration: BoxDecoration(
                                    color: const Color(0xFF1E293B),
                                    borderRadius: BorderRadius.circular(20),
                                    boxShadow: [
                                      BoxShadow(color: Colors.black.withAlpha(40), blurRadius: 6),
                                    ],
                                  ),
                                  child: Text(
                                    '${_markedLat.toStringAsFixed(4)}°, ${_markedLng.toStringAsFixed(4)}°',
                                    style: const TextStyle(
                                      color: Colors.white,
                                      fontSize: 11,
                                      fontWeight: FontWeight.bold,
                                      letterSpacing: 0.2,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),

                  const SizedBox(height: 14),

                  // Prominent "Open in Google Maps" Button (From Screenshot 5!)
                  SizedBox(
                    width: double.infinity,
                    height: 48,
                    child: ElevatedButton.icon(
                      onPressed: _openInteractiveManualPinPicker,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF0F5132),
                        foregroundColor: Colors.white,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(14),
                        ),
                        elevation: 0,
                      ),
                      icon: const Icon(Icons.map_outlined, size: 18),
                      label: const Text(
                        'Open in Google Maps',
                        style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold),
                      ),
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 20),

            // SECTION HEADING: GPS Sensor Coordinates (From Screenshot 5!)
            const Text(
              'GPS Sensor Coordinates',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w900,
                color: Color(0xFF0F172A),
              ),
            ),
            const SizedBox(height: 12),

            // 4 SENSOR COORDINATE CARDS (2x2 Grid from Screenshot 5!)
            Row(
              children: [
                Expanded(
                  child: _buildSensorCard(
                    icon: Icons.explore_outlined,
                    label: 'Latitude',
                    value: '${_markedLat.toStringAsFixed(6)}°',
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: _buildSensorCard(
                    icon: Icons.navigation_outlined,
                    label: 'Longitude',
                    value: '${_markedLng.toStringAsFixed(6)}°',
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                Expanded(
                  child: _buildSensorCard(
                    icon: Icons.speed_outlined,
                    label: 'Calculated Speed',
                    value: '$_speed km/h',
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: _buildSensorCard(
                    icon: Icons.landscape_outlined,
                    label: 'Altitude',
                    value: '$_altitude m',
                  ),
                ),
              ],
            ),

            const SizedBox(height: 14),

            // STATUS BANNER: GPS fix locked (From Screenshot 5!)
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
              decoration: BoxDecoration(
                color: const Color(0xFFF1F5F9),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: const Color(0xFFE2E8F0)),
              ),
              child: const Row(
                children: [
                  Icon(Icons.info_outline, size: 18, color: Color(0xFF475569)),
                  SizedBox(width: 10),
                  Text(
                    'GPS fix locked',
                    style: TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.w600,
                      color: Color(0xFF0F172A),
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 16),

            // DYNAMIC RESOLVED ADDRESS BANNER (User requirement: "pinned the manually then down the correct address should be shown")
            Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: const Color(0xFFF0FDF4),
                borderRadius: BorderRadius.circular(18),
                border: Border.all(color: const Color(0xFFBBF7D0)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Row(
                    children: [
                      Icon(Icons.check_circle, size: 15, color: Color(0xFF059669)),
                      SizedBox(width: 6),
                      Text(
                        'Pinned Location Address (Auto-resolved)',
                        style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFF059669)),
                      ),
                    ],
                  ),
                  const SizedBox(height: 4),
                  Text(
                    _markedArea,
                    style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w800, color: Color(0xFF0F172A)),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    'State: $_selectedState • Tap map or presets to adjust location',
                    style: const TextStyle(fontSize: 11, color: Color(0xFF64748B)),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 16),

            // Quick Client Presets Chips (Horizontally Scrollable - NO OVERFLOW!)
            const Text(
              'Select Popular Client in Territory:',
              style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: Color(0xFF64748B)),
            ),
            const SizedBox(height: 6),
            SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: Row(
                children: kIndianClients.map((client) {
                  final isSelected = _clientNameController.text == client.name;
                  return Padding(
                    padding: const EdgeInsets.only(right: 8),
                    child: FilterChip(
                      label: Text(client.name, style: TextStyle(fontSize: 11, fontWeight: isSelected ? FontWeight.bold : FontWeight.w500)),
                      selected: isSelected,
                      selectedColor: const Color(0xFFE8F5EE),
                      checkmarkColor: const Color(0xFF0F5132),
                      backgroundColor: Colors.white,
                      onSelected: (_) => _applyClientPreset(client),
                    ),
                  );
                }).toList(),
              ),
            ),

            const SizedBox(height: 16),

            // Form Inputs
            _buildInputField('Business / Store Name', _clientNameController, Icons.store),
            const SizedBox(height: 12),
            _buildInputField('Contact Person Name', _contactPersonController, Icons.person),
            const SizedBox(height: 12),
            _buildInputField('Phone Number', _phoneController, Icons.phone, keyboardType: TextInputType.phone),
            const SizedBox(height: 12),
            _buildInputField('Estimated Deal Size (₹ INR)', _dealSizeController, Icons.currency_rupee, keyboardType: TextInputType.number),
            const SizedBox(height: 14),

            // Meeting Type (Wrapped in SingleChildScrollView to ELIMINATE 29px OVERFLOW BUG!)
            const Text('Meeting Type', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: Color(0xFF64748B))),
            const SizedBox(height: 6),
            SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: Row(
                children: ['In-Person', 'Cold Call', 'Follow-up', 'Product Demo'].map((type) {
                  final isSelected = _selectedType == type;
                  return Padding(
                    padding: const EdgeInsets.only(right: 8),
                    child: ChoiceChip(
                      label: Text(type, style: TextStyle(fontSize: 11, color: isSelected ? Colors.white : const Color(0xFF0F172A))),
                      selected: isSelected,
                      selectedColor: const Color(0xFF0F5132),
                      backgroundColor: Colors.white,
                      onSelected: (_) => setState(() => _selectedType = type),
                    ),
                  );
                }).toList(),
              ),
            ),

            const SizedBox(height: 14),

            // Meeting Notes
            TextField(
              controller: _notesController,
              maxLines: 2,
              decoration: InputDecoration(
                labelText: 'Meeting Notes & Discussion Summary',
                labelStyle: const TextStyle(fontSize: 12),
                filled: true,
                fillColor: Colors.white,
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: const BorderSide(color: Color(0xFFE2E8F0))),
                enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: const BorderSide(color: Color(0xFFE2E8F0))),
              ),
            ),

            const SizedBox(height: 14),

            // Multimedia Proof Attachments (Photo & Voice Memo)
            Row(
              children: [
                Expanded(
                  child: InkWell(
                    onTap: () => setState(() => _hasPhoto = !_hasPhoto),
                    borderRadius: BorderRadius.circular(14),
                    child: Container(
                      padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 10),
                      decoration: BoxDecoration(
                        color: _hasPhoto ? const Color(0xFFEFF6FF) : Colors.white,
                        borderRadius: BorderRadius.circular(14),
                        border: Border.all(color: _hasPhoto ? const Color(0xFF93C5FD) : const Color(0xFFE2E8F0)),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(Icons.camera_alt, color: _hasPhoto ? const Color(0xFF2563EB) : const Color(0xFF64748B), size: 18),
                          const SizedBox(width: 6),
                          Text(
                            _hasPhoto ? 'Photo Attached ✓' : 'Add Store Photo',
                            style: TextStyle(
                              fontSize: 11,
                              fontWeight: FontWeight.bold,
                              color: _hasPhoto ? const Color(0xFF2563EB) : const Color(0xFF64748B),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: InkWell(
                    onTap: () => setState(() => _hasVoice = !_hasVoice),
                    borderRadius: BorderRadius.circular(14),
                    child: Container(
                      padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 10),
                      decoration: BoxDecoration(
                        color: _hasVoice ? const Color(0xFFFAF5FF) : Colors.white,
                        borderRadius: BorderRadius.circular(14),
                        border: Border.all(color: _hasVoice ? const Color(0xFFD8B4FE) : const Color(0xFFE2E8F0)),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(Icons.mic, color: _hasVoice ? const Color(0xFF9333EA) : const Color(0xFF64748B), size: 18),
                          const SizedBox(width: 6),
                          Text(
                            _hasVoice ? 'Voice Note (32s) ✓' : 'Record Audio',
                            style: TextStyle(
                              fontSize: 11,
                              fontWeight: FontWeight.bold,
                              color: _hasVoice ? const Color(0xFF9333EA) : const Color(0xFF64748B),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ],
            ),

            const SizedBox(height: 20),

            // Submit Button
            SizedBox(
              width: double.infinity,
              height: 52,
              child: ElevatedButton.icon(
                onPressed: _submitVisit,
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF0F5132),
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                  elevation: 2,
                ),
                icon: const Icon(Icons.cloud_upload_outlined, size: 20),
                label: const Text(
                  'Submit Visit for Manager Approval',
                  style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold),
                ),
              ),
            ),
            const SizedBox(height: 24),
          ],
        ),
      ),
    );
  }

  Widget _buildSensorCard({required IconData icon, required String label, required String value}) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: const Color(0xFFE2E8F0)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(icon, size: 16, color: const Color(0xFF0F5132)),
              const SizedBox(width: 6),
              Text(
                label,
                style: const TextStyle(fontSize: 11, color: Color(0xFF64748B), fontWeight: FontWeight.w600),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Text(
            value,
            style: const TextStyle(
              fontSize: 15,
              fontWeight: FontWeight.w900,
              color: Color(0xFF0F172A),
              fontFamily: 'monospace',
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildInputField(String label, TextEditingController controller, IconData icon, {TextInputType? keyboardType}) {
    return TextField(
      controller: controller,
      keyboardType: keyboardType,
      decoration: InputDecoration(
        labelText: label,
        labelStyle: const TextStyle(fontSize: 12),
        prefixIcon: Icon(icon, size: 18, color: const Color(0xFF0F5132)),
        filled: true,
        fillColor: Colors.white,
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: const BorderSide(color: Color(0xFFE2E8F0))),
        enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: const BorderSide(color: Color(0xFFE2E8F0))),
      ),
    );
  }
}

// Custom Painter for the Soft Mint GPS Map (Exact match for Screenshot 5)
class MintMapPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    // Soft Sage Background
    final bgPaint = Paint()..color = const Color(0xFFEDF7F2);
    canvas.drawRect(Rect.fromLTWH(0, 0, size.width, size.height), bgPaint);

    // Subtle Land Parcels
    final parcelPaint = Paint()..color = const Color(0xFFDCF4E7);
    canvas.drawRRect(RRect.fromRectAndRadius(const Rect.fromLTWH(20, 110, 60, 40), const Radius.circular(10)), parcelPaint);
    canvas.drawRRect(RRect.fromRectAndRadius(Rect.fromLTWH(size.width - 90, 30, 70, 50), const Radius.circular(10)), parcelPaint);

    // Grid Lines (Subtle light mint)
    final gridPaint = Paint()
      ..color = const Color(0xFFD4EFE1)
      ..strokeWidth = 1.2;

    for (double x = 40; x < size.width; x += 45) {
      canvas.drawLine(Offset(x, 0), Offset(x, size.height), gridPaint);
    }
    for (double y = 35; y < size.height; y += 45) {
      canvas.drawLine(Offset(0, y), Offset(size.width, y), gridPaint);
    }

    // White Angled Road Lines
    final roadPaint = Paint()
      ..color = Colors.white
      ..strokeWidth = 8;

    canvas.drawLine(Offset(0, size.height * 0.58), Offset(size.width, size.height * 0.68), roadPaint);
    canvas.drawLine(Offset(size.width * 0.45, 0), Offset(size.width * 0.45, size.height), roadPaint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

class NumberFormatHelper {
  static double roundCoord(double val) {
    return double.parse(val.toStringAsFixed(6));
  }
}

// -------------------------------------------------------------
// TAB 3: VISITS HISTORY SCREEN
// -------------------------------------------------------------
class VisitsHistoryScreen extends StatelessWidget {
  final List<Map<String, dynamic>> visits;

  const VisitsHistoryScreen({super.key, required this.visits});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Field Visit Records', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 16)),
      ),
      body: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: visits.length,
        itemBuilder: (context, idx) {
          final v = visits[idx];
          final isApproved = v['status'] == 'Approved';
          return Container(
            margin: const EdgeInsets.only(bottom: 12),
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: const Color(0xFFE2E8F0)),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withAlpha(5),
                  blurRadius: 10,
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Expanded(
                      child: Text(
                        v['client'],
                        style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w800, color: Color(0xFF0F172A)),
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                      decoration: BoxDecoration(
                        color: isApproved ? const Color(0xFFECFDF5) : const Color(0xFFFFFBEB),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Text(
                        v['status'],
                        style: TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.bold,
                          color: isApproved ? const Color(0xFF059669) : const Color(0xFFD97706),
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 6),
                Text(
                  '${v['contact']} • ${v['area']}',
                  style: const TextStyle(fontSize: 12, color: Color(0xFF64748B)),
                ),
                const SizedBox(height: 12),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      v['amount'],
                      style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w900, color: Color(0xFF0F5132)),
                    ),
                    Text(
                      v['type'],
                      style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: Color(0xFF334155)),
                    ),
                  ],
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}

// -------------------------------------------------------------
// TAB 4: PROFILE SCREEN
// -------------------------------------------------------------
class ProfileScreen extends StatelessWidget {
  final SalesUser currentUser;
  final bool isCheckedIn;
  final String checkInTime;
  final VoidCallback onSimulateMidnightReset;
  final VoidCallback onLogout;

  const ProfileScreen({
    super.key,
    required this.currentUser,
    required this.isCheckedIn,
    required this.checkInTime,
    required this.onSimulateMidnightReset,
    required this.onLogout,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('My Profile & Quotas', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 16)),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(24),
                border: Border.all(color: const Color(0xFFE2E8F0)),
              ),
              child: Column(
                children: [
                  CircleAvatar(
                    radius: 36,
                    backgroundColor: const Color(0xFF0F5132),
                    child: Text(
                      currentUser.avatarText,
                      style: const TextStyle(color: Colors.white, fontSize: 24, fontWeight: FontWeight.bold),
                    ),
                  ),
                  const SizedBox(height: 12),
                  Text(
                    currentUser.name,
                    style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: Color(0xFF0F172A)),
                  ),
                  Text(
                    currentUser.role,
                    style: const TextStyle(fontSize: 13, color: Color(0xFF64748B)),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    currentUser.territory,
                    style: const TextStyle(fontSize: 12, color: Color(0xFF0F5132), fontWeight: FontWeight.bold),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),

            // Daily Attendance Lock & 12 AM Reset Card
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: const Color(0xFFF8FAFC),
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: const Color(0xFFE2E8F0)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text(
                        'Today\'s Attendance Lock',
                        style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                        decoration: BoxDecoration(
                          color: isCheckedIn ? const Color(0xFFECFDF5) : const Color(0xFFFFF7ED),
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: Text(
                          isCheckedIn ? 'ACTIVE ($checkInTime)' : 'NOT MARKED',
                          style: TextStyle(
                            color: isCheckedIn ? const Color(0xFF059669) : const Color(0xFFEA580C),
                            fontSize: 10,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    'Attendance is strictly limited to once per day. It automatically resets after 12:00 AM midnight.',
                    style: TextStyle(fontSize: 11, color: Color(0xFF64748B)),
                  ),
                  const SizedBox(height: 12),
                  SizedBox(
                    width: double.infinity,
                    height: 40,
                    child: OutlinedButton.icon(
                      onPressed: onSimulateMidnightReset,
                      style: OutlinedButton.styleFrom(
                        side: const BorderSide(color: Color(0xFF0F5132)),
                        foregroundColor: const Color(0xFF0F5132),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                      icon: const Icon(Icons.nightlight_round, size: 16),
                      label: const Text('Simulate Next Day (12 AM Reset)', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),

            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: const Color(0xFFE2E8F0)),
              ),
              child: Column(
                children: [
                  _buildProfileRow('Email ID', currentUser.email),
                  const Divider(color: Color(0xFFF1F5F9)),
                  _buildProfileRow('Phone', currentUser.phone),
                  const Divider(color: Color(0xFFF1F5F9)),
                  _buildProfileRow('Offline Storage Sync', 'All Synced ✓ (0 Pending)'),
                ],
              ),
            ),
            const SizedBox(height: 24),
            SizedBox(
              width: double.infinity,
              height: 48,
              child: OutlinedButton.icon(
                onPressed: onLogout,
                style: OutlinedButton.styleFrom(
                  foregroundColor: Colors.red,
                  side: const BorderSide(color: Colors.redAccent),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                ),
                icon: const Icon(Icons.logout, size: 18),
                label: const Text('Log Out', style: TextStyle(fontWeight: FontWeight.bold)),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildProfileRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: const TextStyle(fontSize: 12, color: Color(0xFF64748B))),
          Text(value, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFF0F172A))),
        ],
      ),
    );
  }
}
