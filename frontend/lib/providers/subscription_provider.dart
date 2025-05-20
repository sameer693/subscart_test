import 'package:flutter/foundation.dart';
import '../services/api_service.dart';
import '../models/subscription.dart';

class SubscriptionProvider with ChangeNotifier {
  List<Subscription> _subscriptions = [];
  bool _isLoading = false;
  String? _error;
  final ApiService _apiService = ApiService();

  List<Subscription> get subscriptions => _subscriptions;
  bool get isLoading => _isLoading;
  String? get error => _error;

  Future<void> fetchSubscriptions() async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final response = await _apiService.get('/subscriptions');
      final List<Subscription> loadedSubscriptions = [];
      print(response['data']);
      for (var subscriptionData in response['data']) {
        loadedSubscriptions.add(Subscription.fromJson(subscriptionData));
      }

      _subscriptions = loadedSubscriptions;
      _isLoading = false;
      notifyListeners();
    } catch (error) {
      _error = error.toString();
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> pauseSubscription(String subscriptionId) async {
    try {
      await _apiService.put('/subscriptions/$subscriptionId/pause', {});
      await fetchSubscriptions();
    } catch (error) {
      _error = error.toString();
      notifyListeners();
    }
  }

  Future<void> resumeSubscription(String subscriptionId) async {
    try {
      await _apiService.put('/subscriptions/$subscriptionId/resume', {});
      await fetchSubscriptions();
    } catch (error) {
      _error = error.toString();
      notifyListeners();
    }
  }
}
