import 'package:flutter/material.dart';
import '../models/delivery.dart';

class DeliveryItem extends StatelessWidget {
  final Delivery delivery;
  final VoidCallback onSkip;
  final Function(int, Map<String, dynamic>) onSwap;
  final VoidCallback onMove;

  const DeliveryItem({
    Key? key,
    required this.delivery,
    required this.onSkip,
    required this.onSwap,
    required this.onMove,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    // Format the delivery date to a readable format and local timezone
    final formattedDate = delivery.deliveryDate.toLocal().toString().split(' ')[0];
    

    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Delivery header with date and time
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Delivery on $formattedDate',
                  style: const TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 16,
                  ),
                ),
                Text(
                  'Time: ${delivery.deliveryTime}',
                  style: TextStyle(color: Colors.grey[700], fontSize: 14),
                ),
              ],
            ),

            const SizedBox(height: 8),

            // Delivery status
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
              decoration: BoxDecoration(
                color: _getStatusColor(delivery.status),
                borderRadius: BorderRadius.circular(4),
              ),
              child: Text(
                delivery.status.toUpperCase(),
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 12,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),

            const SizedBox(height: 16),

            // Display delivery items if available
            if (delivery.items != null && delivery.items!.isNotEmpty)
              ...delivery.items!.asMap().entries.map((entry) {
                // Added null check for delivery.items
                final index = entry.key;
                final item = entry.value; // Get the item data
                return Padding(
                  padding: const EdgeInsets.only(bottom: 8),
                  child: Row(
                    children: [
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              item['name'] ?? 'Unnamed Item', // Use item name
                              style: const TextStyle(
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            if (item['description'] != null &&
                                (item['description'] as String)
                                    .isNotEmpty) // Check if description exists and is not empty
                              Padding(
                                padding: const EdgeInsets.only(top: 2.0),
                                child: Text(
                                  item['description']
                                      as String, // Use item description
                                  style: TextStyle(
                                    color: Colors.grey[600],
                                    fontSize: 12,
                                  ),
                                ),
                              ),
                            if (item['quantity'] !=
                                null) // Display quantity if available
                              Padding(
                                padding: const EdgeInsets.only(top: 2.0),
                                child: Text(
                                  'Quantity: ${item['quantity']}',
                                  style: TextStyle(
                                    color: Colors.grey[600],
                                    fontSize: 12,
                                  ),
                                ),
                              ),
                          ],
                        ),
                      ),
                      TextButton(
                        onPressed: () {
                          _showSwapDialog(context, index);
                        },
                        child: const Text('Swap'),
                      ),
                    ],
                  ),
                );
              })
            else
              const Text(
                'No delivery items assigned yet.',
                style: TextStyle(fontStyle: FontStyle.italic),
              ),

            const SizedBox(height: 16),

            // Action buttons
            Row(
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                OutlinedButton(
                  onPressed: onSkip,
                  style: OutlinedButton.styleFrom(
                    foregroundColor: Colors.red,
                    side: const BorderSide(color: Colors.red),
                  ),
                  child: const Text('Skip'),
                ),
                const SizedBox(width: 8),
                OutlinedButton(
                  onPressed: onMove,
                  child: const Text('Reschedule'),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Color _getStatusColor(String status) {
    switch (status.toLowerCase()) {
      case 'scheduled':
        return Colors.blue;
      case 'preparing':
        return Colors.orange;
      case 'delivering':
        return Colors.amber;
      case 'delivered':
        return Colors.green;
      case 'skipped':
        return Colors.red;
      default:
        return Colors.grey;
    }
  }

  void _showSwapDialog(BuildContext context, int mealIndex) {
    // This is a simplified example - in a real app, you'd have a proper meal selection UI
    showDialog(
      context: context,
      builder:
          (context) => AlertDialog(
            title: const Text('Swap Meal'),
            content: const Text('Select a replacement meal:'),
            actions: [
              TextButton(
                onPressed: () {
                  Navigator.of(context).pop();
                },
                child: const Text('Cancel'),
              ),
              TextButton(
                onPressed: () {
                  final newMeal = {
                    'name': 'Chicken Salad',
                    'description': 'Fresh greens with grilled chicken',
                    'quantity': 1,
                    'dietaryInfo': 'low-carb',
                  };
                  onSwap(mealIndex, newMeal).then((_) {
                    Navigator.of(context).pop();
                  });
                },
                child: const Text('Select'),
              ),
            ],
          ),
    );
  }
}
