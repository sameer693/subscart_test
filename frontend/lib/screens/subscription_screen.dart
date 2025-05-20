import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/delivery_provider.dart';
import '../providers/subscription_provider.dart';
import '../widgets/day_selector.dart';
import '../widgets/delivery_item.dart';

class SubscriptionScreen extends StatefulWidget {
  const SubscriptionScreen({super.key});

  @override
  State<SubscriptionScreen> createState() => _SubscriptionScreenState();
}

class _SubscriptionScreenState extends State<SubscriptionScreen> {
  String selectedTester = 'Tester 1';
  String selectedTime = '14:00';

  @override
  void initState() {
    super.initState();
    Future.microtask(() {
      Provider.of<SubscriptionProvider>(
        context,
        listen: false,
      ).fetchSubscriptions();
      Provider.of<DeliveryProvider>(
        context,
        listen: false,
      ).fetchDeliveriesByDate(DateTime.now());
    });
  }

  @override
  Widget build(BuildContext context) {
    final deliveryProvider = Provider.of<DeliveryProvider>(context);

    return Scaffold(
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () {
            // Handle back button press
          },
        ),
        title: const Text('Subscriptions'),
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            Container(
              padding: const EdgeInsets.all(16),
              color: Colors.white,
              width: double.infinity,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Your meal plan',
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.w600),
                  ),
                  const SizedBox(height: 16),

                  // Day selector
                  DaySelector(
                    selectedDate: deliveryProvider.selectedDate,
                    onDateSelected: (date) {
                      deliveryProvider.setSelectedDate(date);
                    },
                  ),

                  const SizedBox(height: 8),

                  // Pause button and control
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      TextButton(
                        onPressed: () {
                          // Handle pause button press
                        },
                        style: TextButton.styleFrom(
                          foregroundColor: Colors.grey[600],
                        ),
                        child: const Text('Pause'),
                      ),
                      IconButton(
                        icon: const Icon(
                          Icons.play_circle_outline,
                          color: Colors.grey,
                        ),
                        onPressed: () {
                          // Handle play button press
                        },
                      ),
                    ],
                  ),

                  const Divider(),

                  // Reschedule controls
                  Row(
                    children: [
                      // Tester dropdown
                      Expanded(
                        child: Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 12,
                            vertical: 8,
                          ),
                          decoration: BoxDecoration(
                            color: Colors.grey[300],
                            borderRadius: BorderRadius.circular(4),
                          ),
                          child: DropdownButtonHideUnderline(
                            child: DropdownButton<String>(
                              value: selectedTester,
                              isDense: true,
                              onChanged: (newValue) {
                                setState(() {
                                  selectedTester = newValue!;
                                });
                              },
                              items:
                                  [
                                    'Tester 1',
                                    'Tester 2',
                                  ].map<DropdownMenuItem<String>>((value) {
                                    return DropdownMenuItem<String>(
                                      value: value,
                                      child: Text(
                                        value,
                                        style: const TextStyle(
                                          color: Colors.black,
                                          fontSize: 10,
                                        ),
                                      ),
                                    );
                                  }).toList(),
                            ),
                          ),
                        ),
                      ),

                      const SizedBox(width: 8),

                      // Time dropdown
                      Expanded(
                        child: Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 12,
                            vertical: 8,
                          ),
                          decoration: BoxDecoration(
                            color: Colors.grey[300],
                            borderRadius: BorderRadius.circular(4),
                          ),
                          child: DropdownButtonHideUnderline(
                            child: DropdownButton<String>(
                              value: selectedTime,
                              isDense: true,
                              onChanged: (newValue) {
                                setState(() {
                                  selectedTime = newValue!;
                                });
                              },
                              items:
                                  [
                                    '12:00',
                                    '14:00',
                                    '16:00',
                                    '18:00',
                                  ].map<DropdownMenuItem<String>>((value) {
                                    return DropdownMenuItem<String>(
                                      value: value,
                                      child: Text(
                                        value,
                                        style: const TextStyle(
                                          color: Colors.black,
                                          fontSize: 14,
                                        ),
                                      ),
                                    );
                                  }).toList(),
                            ),
                          ),
                        ),
                      ),

                      const SizedBox(width: 8),

                      // Reschedule button
                      ElevatedButton(
                        onPressed:
                            deliveryProvider.deliveries.isEmpty
                                ? null // Disable if no deliveries
                                : () {
                                  // Show date picker to choose reschedule date for all deliveries
                                  showDatePicker(
                                    context: context,
                                    initialDate: DateTime.now().add(
                                      const Duration(days: 1),
                                    ),
                                    firstDate: DateTime.now(),
                                    lastDate: DateTime.now().add(
                                      const Duration(days: 30),
                                    ),
                                  ).then((selectedDate) {
                                    if (selectedDate != null) {
                                      // Show confirmation dialog
                                      showDialog(
                                        context: context,
                                        builder:
                                            (context) => AlertDialog(
                                              title: const Text(
                                                'Reschedule All Deliveries',
                                              ),
                                              content: Text(
                                                'Are you sure you want to reschedule all ${deliveryProvider.deliveries.length} deliveries to ${selectedDate.month}/${selectedDate.day}/${selectedDate.year}?',
                                              ),
                                              actions: [
                                                TextButton(
                                                  onPressed: () {
                                                    Navigator.of(context).pop();
                                                    // Close dialog
                                                  },
                                                  child: const Text('Cancel'),
                                                ),
                                                TextButton(
                                                  onPressed: () {
                                                    Navigator.of(context).pop();
                                                    // Close dialog

                                                    // Show loading indicator
                                                    showDialog(
                                                      context: context,
                                                      barrierDismissible: false,
                                                      builder:
                                                          (
                                                            context,
                                                          ) => const AlertDialog(
                                                            content: Column(
                                                              mainAxisSize:
                                                                  MainAxisSize
                                                                      .min,
                                                              children: [
                                                                CircularProgressIndicator(),
                                                                SizedBox(
                                                                  height: 16,
                                                                ),
                                                                Text(
                                                                  'Rescheduling deliveries...',
                                                                ),
                                                              ],
                                                            ),
                                                          ),
                                                    );

                                                    // Reschedule all deliveries
                                                    final futures =
                                                        deliveryProvider
                                                            .deliveries
                                                            .map(
                                                              (
                                                                delivery,
                                                              ) => deliveryProvider
                                                                  .rescheduleDelivery(
                                                                    delivery.id,
                                                                    selectedDate,
                                                                    selectedTime,
                                                                  ),
                                                            )
                                                            .toList();
                                                  },
                                                  child: const Text(
                                                    'Reschedule All',
                                                  ),
                                                ),
                                              ],
                                            ),
                                      );
                                    }
                                  });
                                },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.black,
                          foregroundColor: Colors.white,
                          disabledBackgroundColor: Colors.grey,
                        ),
                        child: const Text('Reschedule'),
                      ),
                    ],
                  ),
                ],
              ),
            ),

            // Delivery items list
            if (deliveryProvider.isLoading)
              const Center(child: CircularProgressIndicator())
            else if (deliveryProvider.error != null)
              Center(child: Text('Error: ${deliveryProvider.error}'))
            else if (deliveryProvider.deliveries.isEmpty)
              const Center(
                child: Padding(
                  padding: EdgeInsets.all(16.0),
                  child: Text('No deliveries scheduled for this day.'),
                ),
              )
            else
              ListView.builder(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                itemCount: deliveryProvider.deliveries.length,
                itemBuilder: (ctx, index) {
                  final delivery = deliveryProvider.deliveries[index];
                  return DeliveryItem(
                    delivery: delivery,
                    onSkip: () => deliveryProvider.skipDelivery(delivery.id),
                    onSwap:
                        (mealIndex, newMeal) => deliveryProvider
                            .swapMeal(delivery.id, mealIndex, newMeal)
                            .then((_) => true),
                    onMove: () {
                      // Show date picker to move delivery
                      showDatePicker(
                        context: context,
                        initialDate: DateTime.now().add(
                          const Duration(days: 1),
                        ),
                        firstDate: DateTime.now(),
                        lastDate: DateTime.now().add(const Duration(days: 30)),
                      ).then((selectedDate) {
                        if (selectedDate != null) {
                          deliveryProvider.rescheduleDelivery(
                            delivery.id,
                            selectedDate,
                            null,
                          );
                        }
                        return Future.value(true);
                      });
                    },
                  );
                },
              ),
          ],
        ),
      ),
    );
  }
}
