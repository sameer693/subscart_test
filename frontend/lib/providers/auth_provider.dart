import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../services/api_service.dart';

class AuthProvider with ChangeNotifier {
  bool _isAuthenticated = false;
  String? _userId;
  final ApiService _apiService = ApiService();

  bool get isAuthenticated => _isAuthenticated;
  String? get userId => _userId;

  AuthProvider() {
    checkAuthStatus();
  }

  Future<void> checkAuthStatus() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('token');
    if (token != null) {
      _isAuthenticated = true;
      _userId = prefs.getString('userId');
      notifyListeners();
    }
  }

  Future<bool> login(String email, String password) async {
    try {
      final response = await _apiService.post('/users/login', {
        'email': email,
        'password': password,
      });

      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('token', response['token']);
      await prefs.setString('userId', response['user']['_id']);

      _isAuthenticated = true;
      _userId = response['user']['_id'];
      notifyListeners();
      return true;
    } catch (error) {
      print('Login error: $error');
      return false;
    }
  }

  Future<bool> register(String name, String email, String password) async {
    try {
      final response = await _apiService.post('/users/register', {
        'name': name,
        'email': email,
        'password': password,
      });

      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('token', response['token']);
      await prefs.setString('userId', response['user']['_id']);

      _isAuthenticated = true;
      _userId = response['user']['_id'];
      notifyListeners();
      return true;
    } catch (error) {
      print('Registration error: $error');
      return false;
    }
  }

  Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('token');
    await prefs.remove('userId');

    _isAuthenticated = false;
    _userId = null;
    notifyListeners();
  }
}
