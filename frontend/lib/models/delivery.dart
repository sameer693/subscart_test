import 'subscription.dart'; // Import the Subscription model

class Delivery {
  final String id;
  // subscriptionId can be a String or a Subscription object
  final dynamic subscriptionId;
  final String userId;
  final DateTime deliveryDate;
  final String deliveryTime;
  final String status;
  final List<Map<String, dynamic>>? items; // Assuming items are a list of maps
  final int? estimatedDeliveryTime; // Added this field based on your log

  Delivery({
    required this.id,
    required this.subscriptionId,
    required this.userId,
    required this.deliveryDate,
    required this.deliveryTime,
    required this.status,
    this.items,
    this.estimatedDeliveryTime,
  });

  factory Delivery.fromJson(Map<String, dynamic> json) {
    dynamic subId;
    if (json['subscriptionId'] is String) {
      subId = json['subscriptionId'] as String;
    } else if (json['subscriptionId'] is Map<String, dynamic>) {
      // If it's a map, parse it as a Subscription object
      subId = Subscription.fromJson(
        json['subscriptionId'] as Map<String, dynamic>,
      );
    } else {
      // Handle unexpected type or null if necessary, or throw an error
      // For now, let's throw an error if it's neither.
      throw ArgumentError(
        'Invalid type for subscriptionId: ${json['subscriptionId'].runtimeType}',
      );
    }

    return Delivery(
      id: json['_id'] as String,
      subscriptionId: subId,
      userId: json['userId'] as String,
      deliveryDate: DateTime.parse(json['deliveryDate'] as String),
      deliveryTime: json['deliveryTime'] as String,
      status: json['status'] as String,
      items:
          json['items'] != null
              ? List<Map<String, dynamic>>.from(
                (json['items'] as List).map(
                  (item) => item as Map<String, dynamic>,
                ),
              )
              : [],
      estimatedDeliveryTime: json['estimatedDeliveryTime'] as int?,
    );
  }

  // Helper to get subscription ID string regardless of type
  String get getSubscriptionIdString {
    if (subscriptionId is String) {
      return subscriptionId as String;
    } else if (subscriptionId is Subscription) {
      return (subscriptionId as Subscription).id;
    }
    return 'unknown'; // Or throw error
  }
}
