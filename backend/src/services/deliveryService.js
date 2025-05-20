const Delivery = require("../models/Delivery");
const Subscription = require("../models/Subscription");
const mongoose = require('mongoose'); // Import mongoose

class DeliveryService {
  constructor() {
    // Bind methods to ensure 'this' context is correct
    this.createDeliveriesForSubscription =
      this.createDeliveriesForSubscription.bind(this);
    this.generateDeliveryDates = this.generateDeliveryDates.bind(this);
    this.getDeliveriesForDate = this.getDeliveriesForADate.bind(this);
    this.rescheduleDelivery = this.rescheduleDelivery.bind(this);
  }

  // Create deliveries for a subscription based on delivery days
  async createDeliveriesForSubscription(subscriptionId) {
    try {
      const subscription = await Subscription.findById(subscriptionId);
      if (!subscription) {
        throw new Error("Subscription not found");
      }

      if (subscription.status !== "active") {
        throw new Error("Cannot create deliveries for inactive subscription");
      }

      // Generate delivery dates for the next 4 weeks
      const deliveryDates = this.generateDeliveryDates(
        Date.now(),
        subscription.deliveryDays,
        1 // 4 weeks
      );

      if (deliveryDates.length === 0) {
        console.log(`No future delivery dates generated for subscription ${subscriptionId}.`);
        return true; 
      }

      // Create delivery documents
      const deliveries = deliveryDates.map((date) => ({
        subscriptionId: subscription._id,
        userId: subscription.userId, // Ensure userId is being set from the subscription
        deliveryDate: date,
        deliveryTime: subscription.deliveryTime,
        status: "scheduled",
        items: [], // Will be populated later or from meal plan
      }));

      // Insert deliveries, ignoring duplicates
      await Delivery.insertMany(deliveries, { ordered: false }).catch(
        (error) => {
          // Ignore duplicate key errors but throw other errors
          if (error.code !== 11000) {
            throw error;
          }
          console.log('Some deliveries were duplicates and were ignored during insertMany.');
        }
      );
      console.log(`Successfully created/updated ${deliveries.length} deliveries for subscription ${subscriptionId}`);
      return true;
    } catch (error) {
      console.error(`Error creating deliveries for subscription ${subscriptionId}:`, error);
      throw error;
    }
  }

  // Generate delivery dates based on subscription delivery days
  generateDeliveryDates(startDateInput, deliveryDays) {
  const dates = [];
  const subscriptionStartDate = new Date(startDateInput);
  subscriptionStartDate.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Use the later of today or subscriptionStartDate
  const baseDate = subscriptionStartDate > today ? subscriptionStartDate : today;

  const dayMap = { 'SUN': 0, 'MON': 1, 'TUE': 2, 'WED': 3, 'THU': 4, 'FRI': 5, 'SAT': 6 };
  const deliveryDayNumbers = deliveryDays
    .map(day => dayMap[day.toUpperCase()])
    .filter(num => num !== undefined);

  if (deliveryDayNumbers.length === 0) {
    console.warn('No valid delivery days provided to generateDeliveryDates.');
    return [];
  }

  // Calculate end of the current week (Saturday)
  const endOfWeek = new Date(baseDate);
  const dayOfWeek = endOfWeek.getDay();
  const daysUntilSaturday = 6 - dayOfWeek;
  endOfWeek.setDate(endOfWeek.getDate() + daysUntilSaturday);
  endOfWeek.setHours(23, 59, 59, 999);

  let currentDate = new Date(baseDate);
  while (currentDate <= endOfWeek) {
    if (deliveryDayNumbers.includes(currentDate.getDay())) {
      dates.push(new Date(currentDate));
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  const uniqueDates = [...new Set(dates.map(d => d.toISOString()))].map(ds => new Date(ds));
  return uniqueDates.sort((a, b) => a - b);
}


  // Get deliveries for a specific date and userId
  async getDeliveriesForADate(userId, date) {
    console.log("Fetching deliveries for userId:", userId, "on date:", new Date(date).toISOString());
    
    // Ensure userId is a valid ObjectId if it's coming as a string
    let validUserId;
    try {
        validUserId = new mongoose.Types.ObjectId(userId);
    } catch (error) {
        console.error("Invalid userId format:", userId);
        throw new Error("Invalid userId format.");
    }

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const foundDeliveries = await Delivery.find({
      userId: validUserId, // Use the validated ObjectId
      deliveryDate: {       // Add date range condition to the query
        $gte: startOfDay,
        $lte: endOfDay,
      },
    }).populate('subscriptionId').sort({ deliveryTime: 1 }); // Optional: populate and sort

    console.log(`Found ${foundDeliveries.length} deliveries for ${userId} on ${startOfDay.toDateString()}`);
    return foundDeliveries;
  }

  // Reschedule a delivery
  async rescheduleDelivery(deliveryId, newDate, newTime) {
    const delivery = await Delivery.findById(deliveryId);
    if (!delivery) {
      throw new Error("Delivery not found");
    }

    if (delivery.status !== "scheduled") {
      throw new Error(
        `Cannot reschedule delivery with status: ${delivery.status}`
      );
    }

    // Check if there's already a delivery for this subscription on the new date
    if (newDate) {
      const newDateObj = new Date(newDate);
      const startOfNewDay = new Date(newDateObj);
      startOfNewDay.setHours(0, 0, 0, 0);

      const endOfNewDay = new Date(newDateObj);
      endOfNewDay.setHours(23, 59, 59, 999);

      

      delivery.deliveryDate = newDateObj; // Use the Date object
    }

    if (newTime) {
      delivery.deliveryTime = newTime;
    }

    return await delivery.save();
  }
}

module.exports = new DeliveryService();
