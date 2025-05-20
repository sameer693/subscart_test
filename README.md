# Delivery and Subscription Management System

## Overview

This project is a comprehensive system for managing user subscriptions and their associated deliveries. It features a Node.js backend handling business logic and data persistence, and a Flutter frontend providing a user-friendly interface for customers to manage their plans and deliveries.

## Features

### Subscription Management
*   Users can create new subscriptions for various meal plans.
*   View active subscriptions.
*   Pause and resume subscriptions.
*   (Implicit) Subscriptions have a start date, delivery days, and preferred delivery time.

### Delivery Management
*   Deliveries are automatically generated based on active subscriptions and their schedules.
*   Users can view their scheduled deliveries for specific dates.
*   Reschedule individual deliveries to a new date and/or time.
*   Reschedule all deliveries for a specific date to a new date.
*   Skip individual deliveries.
*   Swap meals within a delivery (basic implementation).

## Technology Stack

### Backend
*   **Node.js:** JavaScript runtime environment.
*   **Express.js:** Web application framework for Node.js, used for building RESTful APIs.
*   **MongoDB:** NoSQL database for storing user, subscription, and delivery data.
*   **Mongoose:** ODM (Object Data Modeling) library for MongoDB and Node.js.
*   **JWT (JSON Web Tokens):** For securing API endpoints and managing user authentication (assumed, as `req.user` is used).

### Frontend
*   **Flutter:** UI toolkit for building natively compiled applications for mobile, web, and desktop from a single codebase.
*   **Dart:** Programming language used by Flutter.
*   **Provider:** State management solution for Flutter.
*   **http:** Package for making HTTP requests to the backend API.
*   **intl:** Package for date formatting.
*   **shared_preferences:** For storing simple data like authentication tokens locally.

## Project Structure (High-Level)

### Backend (`/backend`)
```
src/
├── controllers/    # Handles incoming requests, interacts with services
│   ├── deliveryController.js
│   └── subscriptionController.js
│   └── (authController.js) # Likely for user login/registration
├── services/       # Business logic, interacts with models
│   ├── deliveryService.js
│   └── subscriptionService.js
│   └── (userService.js)
│   └── (authService.js)
├── models/         # Mongoose schemas and models for database interaction
│   ├── Delivery.js
│   ├── Subscription.js
│   └── User.js
├── routes/         # Defines API endpoints and maps them to controllers
│   ├── deliveryRoutes.js
│   └── subscriptionRoutes.js
│   └── (authRoutes.js)
├── middleware/     # Custom middleware (e.g., authentication)
│   └── (authMiddleware.js)
└── app.js          # Main application file, sets up Express, middleware, routes
(config/)           # Database configuration, environment variables
```

### Frontend (`/frontend`)
```
lib/
├── screens/        # UI screens/pages
│   └── subscription_screen.dart
│   └── (login_screen.dart)
│   └── (home_screen.dart)
├── widgets/        # Reusable UI components
│   ├── delivery_item.dart
│   └── day_selector.dart
├── providers/      # State management using Provider
│   ├── delivery_provider.dart
│   └── subscription_provider.dart
│   └── (auth_provider.dart)
├── models/         # Dart classes representing data structures
│   ├── delivery.dart
│   └── subscription.dart
│   └── (user.dart)
├── services/       # Services for API communication, etc.
│   └── api_service.dart
└── main.dart       # Main application entry point
```

## Core Workflows/Flows

### 1. User Authentication (Assumed)
1.  **Frontend:** User logs in via a login screen.
2.  **Frontend:** `AuthService` (via `AuthProvider`) sends credentials to the backend.
3.  **Backend:** `authController` receives credentials, `authService` validates them against the `User` model.
4.  **Backend:** If valid, a JWT is generated and sent back.
5.  **Frontend:** Token is received and stored securely (e.g., using `shared_preferences`). `ApiService` is configured to include this token in headers for subsequent authenticated requests.

### 2. Subscription Creation
1.  **Frontend:** User selects a plan, delivery days, time, and start date on a subscription creation screen.
2.  **Frontend:** `SubscriptionProvider` calls `ApiService` to send subscription data to the backend.
3.  **Backend:** `subscriptionController.createSubscription` receives the request.
4.  **Backend:** `SubscriptionService.createSubscription`:
    *   Finds the user by email (or uses `req.user.id` if authenticated).
    *   Creates and saves a new `Subscription` document.
    *   Calls `DeliveryService.createDeliveriesForSubscription` with the new subscription ID.
5.  **Backend:** `DeliveryService.createDeliveriesForSubscription`:
    *   Retrieves the subscription details.
    *   Calls `generateDeliveryDates` to get a list of delivery dates for the upcoming period (e.g., 4 weeks) based on `subscription.startDate` and `subscription.deliveryDays`.
    *   Creates `Delivery` documents for each generated date, linking them to the subscription and user.
    *   Uses `Delivery.insertMany` with `ordered: false` to insert deliveries, ignoring duplicates (based on the unique index on `subscriptionId` and `deliveryDate` in the `Delivery` model).
6.  **Backend:** Responds with the created subscription.
7.  **Frontend:** Updates UI, potentially fetching the new list of subscriptions.

### 3. Fetching Deliveries by Date
1.  **Frontend:** User selects a date in `SubscriptionScreen` using `DaySelector`.
2.  **Frontend:** `DeliveryProvider.setSelectedDate` is called, which then triggers `fetchDeliveriesByDate`.
3.  **Frontend:** `ApiService.get` sends a request to `/api/deliveries/by-date?date=YYYY-MM-DD`.
4.  **Backend:** `deliveryController.getDeliveriesByDate`:
    *   Extracts the `date` from `req.query`.
    *   Uses `req.user.id` (assuming authentication middleware has run and populated `req.user`) to get the `userId`.
    *   Calls `DeliveryService.getDeliveriesForADate(userId, date)`.
5.  **Backend:** `DeliveryService.getDeliveriesForADate`:
    *   Constructs a date range for the start and end of the given day.
    *   Queries the `Delivery` model for deliveries matching `userId` and the `deliveryDate` range.
    *   Populates `subscriptionId` details.
    *   Returns the found deliveries.
6.  **Backend:** If no deliveries are found for the date, it checks for active subscriptions for the user. If found, it attempts to call `DeliveryService.createDeliveriesForSubscription` for each active subscription to ensure deliveries are generated if they were missed, then re-queries.
7.  **Backend:** Responds with the list of deliveries (or an empty list).
8.  **Frontend:** `DeliveryProvider` updates its `_deliveries` list and notifies listeners, causing the UI to rebuild and display the deliveries in `ListView.builder` using `DeliveryItem` widgets.

### 4. Rescheduling a Delivery (Individual or All)
*   **Individual Delivery (from `DeliveryItem`):**
    1.  **Frontend:** User clicks "Reschedule" on a `DeliveryItem`.
    2.  **Frontend:** A `showDatePicker` dialog appears.
    3.  **Frontend:** Upon selecting a new date, `DeliveryProvider.rescheduleDelivery(delivery.id, newSelectedDate, null)` is called.
*   **All Deliveries for a Day (from `SubscriptionScreen` header):**
    1.  **Frontend:** User clicks "Reschedule" in the header.
    2.  **Frontend:** `showDatePicker` appears to select the new target date. `selectedTime` from the screen is also available.
    3.  **Frontend:** Upon confirmation, a loop iterates through `deliveryProvider.deliveries` for the currently displayed day.
    4.  **Frontend:** For each delivery, `DeliveryProvider.rescheduleDelivery(delivery.id, newTargetDate, selectedTime)` is called.
*   **Common Reschedule Flow:**
    1.  **Frontend:** `DeliveryProvider.rescheduleDelivery` prepares the request body (`newDate`, `newTime`, `id`).
    2.  **Frontend:** `ApiService.put` sends a request to `/api/deliveries/:deliveryId/reschedule` (where `:deliveryId` is `delivery.id`).
    3.  **Backend:** `deliveryController.rescheduleDelivery`:
        *   Ensures `req.user` is present (auth middleware).
        *   Validates `newDate` or `newTime` is provided.
        *   Finds the `Delivery` by `req.body.id`.
        *   (Implicitly, after auth middleware fix) Verifies `delivery.userId` matches `req.user.id`.
        *   Calls `DeliveryService.rescheduleDelivery(deliveryId, newDate, newTime)`.
    4.  **Backend:** `DeliveryService.rescheduleDelivery`:
        *   Finds the delivery.
        *   Checks if its status is 'scheduled'.
        *   (Optionally) Checks for conflicts if a delivery from the same subscription already exists on the `newDate`.
        *   Updates `delivery.deliveryDate` and/or `delivery.deliveryTime`.
        *   Saves the updated delivery.
    5.  **Backend:** Responds with the updated delivery.
    6.  **Frontend:** `DeliveryProvider` calls `fetchDeliveriesByDate` for the currently selected date to refresh the list.

### 5. Skipping a Delivery
1.  **Frontend:** User clicks "Skip" on a `DeliveryItem`.
2.  **Frontend:** `DeliveryProvider.skipDelivery(delivery.id)` is called.
3.  **Frontend:** `ApiService.put` sends a request to `/api/deliveries/:deliveryId/skip`.
4.  **Backend:** `deliveryController.skipDelivery`:
    *   Ensures `req.user` is present.
    *   Finds the `Delivery` by `req.params.id`.
    *   Verifies `delivery.userId` matches `req.user.id`.
    *   Checks if status is 'scheduled'.
    *   Updates `delivery.status` to 'skipped'.
    *   Saves the delivery.
5.  **Backend:** Responds with the updated delivery.
6.  **Frontend:** `DeliveryProvider` calls `fetchDeliveriesByDate` to refresh the list.

### 6. Pausing/Resuming Subscription (Conceptual)
1.  **Frontend:** User interacts with a "Pause" or "Resume" button for a subscription.
2.  **Frontend:** `SubscriptionProvider.pauseSubscription(subscriptionId)` or `resumeSubscription(subscriptionId)` is called.
3.  **Frontend:** `ApiService.put` sends a request to `/api/subscriptions/:subscriptionId/pause` or `/resume`.
4.  **Backend:** A `subscriptionController` method handles this:
    *   Updates the `Subscription` status to 'paused' or 'active'.
    *   (Important) When resuming, the backend might need logic to regenerate deliveries from the resume date onwards if they were previously stopped or missed. `createDeliveriesForSubscription` could be adapted or a new service method created.
5.  **Backend:** Responds with success/updated subscription.
6.  **Frontend:** `SubscriptionProvider` fetches all subscriptions again to update the UI.

## Backend API Endpoints (Key Examples)

*   `POST /api/subscriptions`: Create a new subscription.
*   `GET /api/subscriptions`: Get all subscriptions for the authenticated user.
*   `PUT /api/subscriptions/:id/pause`: Pause a subscription.
*   `PUT /api/subscriptions/:id/resume`: Resume a subscription.
*   `GET /api/deliveries/by-date?date=YYYY-MM-DD`: Get deliveries for a specific date for the authenticated user.
*   `GET /api/deliveries/upcoming`: Get upcoming deliveries for the authenticated user.
*   `GET /api/deliveries/:id`: Get a specific delivery.
*   `PUT /api/deliveries/:id/reschedule`: Reschedule a specific delivery. (Note: `:id` here is the delivery ID from the URL path, while the controller uses `req.body.id`).
*   `PUT /api/deliveries/:id/skip`: Skip a specific delivery.
*   `PUT /api/deliveries/:id/swap-meal`: Swap a meal in a delivery.
*   `POST /api/auth/login` (Example for authentication)
*   `POST /api/auth/register` (Example for authentication)

## Frontend Screens/Providers (Key Examples)

*   **Screens:**
    *   `SubscriptionScreen`: Main screen for viewing and managing deliveries for a selected date, rescheduling, skipping.
    *   (Likely) `LoginScreen`, `RegistrationScreen`, `ProfileScreen`, `SubscriptionListScreen`.
*   **Providers:**
    *   `DeliveryProvider`: Manages fetching, displaying, and updating delivery data. Handles actions like rescheduling, skipping, swapping meals.
    *   `SubscriptionProvider`: Manages fetching and updating subscription data (e.g., pausing, resuming).
    *   (Likely) `AuthProvider`: Manages user authentication state and token.
*   **Services:**
    *   `ApiService`: Centralized service for making HTTP requests to the backend, handling headers (including auth token), and basic response parsing.

## Setup and Installation (Placeholder)

### Backend
1.  Clone the repository.
2.  Navigate to the `backend` directory.
3.  Install dependencies: `npm install`
4.  Set up environment variables (e.g., in a `.env` file) for database connection, JWT secret, etc.
5.  Start the server: `npm start` or `npm run dev`

### Frontend
1.  Clone the repository.
2.  Navigate to the `frontend` directory.
3.  Install dependencies: `flutter pub get`
4.  Ensure the `ApiService` in `lib/services/api_service.dart` has the correct `baseUrl` pointing to your running backend (consider ngrok for local development with mobile devices).
5.  Run the app: `flutter run`

