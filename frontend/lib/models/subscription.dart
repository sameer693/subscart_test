class Subscription {
  final String id;
  final String userId;
  final String plan;
  final String status;
  final List<String> deliveryDays;
  final String deliveryTime;
  final DateTime startDate;

  Subscription({
    required this.id,
    required this.userId,
    required this.plan,
    required this.status,
    required this.deliveryDays,
    required this.deliveryTime,
    required this.startDate,
  });

  factory Subscription.fromJson(Map<String, dynamic> json) {
    return Subscription(
      id: json['_id'] as String,
      userId: json['userId'] as String,
      plan: json['plan'] as String,
      status: json['status'] as String,
      deliveryDays: List<String>.from(
        json['deliveryDays'].map((day) => day as String),
      ),
      deliveryTime: json['deliveryTime'] as String,
      startDate: DateTime.parse(json['startDate'] as String),
    );
  }
}
