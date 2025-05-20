import 'package:flutter/foundation.dart';
import 'package:intl/intl.dart';
import '../services/api_service.dart';
import '../models/delivery.dart';

class DeliveryProvider with ChangeNotifier {
  List<Delivery> _deliveries = [];
  DateTime _selectedDate = DateTime.now();
  bool _isLoading = false;
  String? _error;
  final ApiService _apiService = ApiService();

  List<Delivery> get deliveries => _deliveries;
  DateTime get selectedDate => _selectedDate;
  bool get isLoading => _isLoading;
  String? get error => _error;

  void setSelectedDate(DateTime date) {
    _selectedDate = date;
    notifyListeners();
    // Fetch deliveries for the new date
    fetchDeliveriesByDate(date);
  }

  Future<void> fetchDeliveriesByDate(DateTime date) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      // Format date as YYYY-MM-DD
      final formattedDate = DateFormat('yyyy-MM-dd').format(date);

      final response = await _apiService.get(
        '/deliveries/by-date?date=$formattedDate',
      );
    print(response['data']);
      if (response['success'] == true && response['data'] != null) {
        _deliveries =
            (response['data'] as List)
                .map((item) => Delivery.fromJson(item))
                .toList();

        // If we just rescheduled all to this date but API hasn't caught up yet
        if (_deliveries.isEmpty) {
          // Set the selected date anyway
          _selectedDate = date;
        }
      } else {
        _error = response['message'] ?? 'Failed to fetch deliveries';
        _deliveries = [];
      }
      print(_deliveries);
    } catch (error) {
      _error = 'Error fetching deliveries: $error';
      _deliveries = [];
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> rescheduleDelivery(
    String deliveryId,
    DateTime date,
    String? time,
  ) async {
    _isLoading = true;
    notifyListeners();

    try {
      final formattedDate = DateFormat('yyyy-MM-dd').format(date);

      final Map<String, dynamic> body = {'newDate': formattedDate};

      if (time != null) {
        body['newTime'] = time;
      }
      body['id'] = deliveryId;
      clearDeliveries();
      await _apiService.put('/deliveries/$deliveryId/reschedule', body);

      // Refresh deliveries after rescheduling
      await fetchDeliveriesByDate(_selectedDate);
    } catch (error) {
      _error = 'Error rescheduling delivery: $error';
      notifyListeners();
    }
  }

  Future<void> skipDelivery(String deliveryId) async {
    _isLoading = true;
    notifyListeners();

    try {
      await _apiService.put('/deliveries/$deliveryId/skip', {});

      // Refresh deliveries after skipping
      await fetchDeliveriesByDate(_selectedDate);
    } catch (error) {
      _error = 'Error skipping delivery: $error';
      notifyListeners();
    }
  }

  Future<void> swapMeal(
    String deliveryId,
    int mealIndex,
    Map<String, dynamic> newMeal,
  ) async {
    _isLoading = true;
    notifyListeners();

    try {
      await _apiService.put('/deliveries/$deliveryId/swap-meal', {
        'mealIndex': mealIndex,
        'newMeal': newMeal,
      });

      // Refresh deliveries after swapping
      await fetchDeliveriesByDate(_selectedDate);
    } catch (error) {
      _error = 'Error swapping meal: $error';
      notifyListeners();
    }
  }

  Future<void> clearDeliveries() async {
    _deliveries = [];
    notifyListeners();
  }
}
