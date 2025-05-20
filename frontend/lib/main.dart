import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import 'package:frontend/screens/auth_screen.dart';
import 'package:frontend/screens/subscription_screen.dart';
import 'package:frontend/providers/auth_provider.dart';
import 'package:frontend/providers/subscription_provider.dart';
import 'package:frontend/providers/delivery_provider.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  SystemChrome.setPreferredOrientations([DeviceOrientation.portraitUp]);
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider()),
        ChangeNotifierProvider(create: (_) => SubscriptionProvider()),
        ChangeNotifierProvider(create: (_) => DeliveryProvider()),
      ],
      child: Consumer<AuthProvider>(
        builder:
            (ctx, authProvider, _) => MaterialApp(
              title: 'Meal Subscription',
              debugShowCheckedModeBanner: false,
              theme: ThemeData(
                primarySwatch: Colors.blueGrey,
                colorScheme: ColorScheme.fromSeed(seedColor: Colors.black),
                appBarTheme: const AppBarTheme(
                  backgroundColor: Colors.black,
                  foregroundColor: Colors.white,
                  elevation: 0,
                ),
                scaffoldBackgroundColor: Colors.white,
              ),
              home:
                  authProvider.isAuthenticated
                      ? const SubscriptionScreen()
                      : const AuthScreen(),
            ),
      ),
    );
  }
}
