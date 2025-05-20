const Delivery = require("../models/Delivery");
const deliveryService = require("../services/deliveryService");
const subscriptionService = require("../services/subscriptionService");

// Get deliveries for a specific date
exports.getDeliveriesByDate = async (req, res) => {
  try {
    console.log("Requesting deliveries for date:", req.query);
    const { date } = req.query;
    if (!date) {
      return res.status(400).json({
        success: false,
        message: "Date parameter is required",
      });
    }

    const userId = "682b0caaf8ed2e7104a54fb9"; // Assuming user info is attached by auth middleware

    // Fetch deliveries for the specified date
    const deliveries = await deliveryService.getDeliveriesForADate(
      userId,
      new Date(date)
    );
    if (!deliveries || deliveries.length === 0) {
      const subscriptionIds = await subscriptionService.getActiveSubscriptions(
        userId
      );
      if (!subscriptionIds || subscriptionIds.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No active subscriptions found for this user",
        });
      }
      subscriptionIds.forEach(async (subscriptionId) => {
        await deliveryService.createDeliveriesForSubscription(subscriptionId);
      });
      // Retry fetching deliveries after creating them
      const deliveriesAgain = await deliveryService.getDeliveriesForADate(
        userId,
        new Date(date)
      );
      return res.status(200).json({
        success: true,
        count: deliveriesAgain.length,
        data: deliveriesAgain,
      });
    }
    return res.status(200).json({
      success: true,
      count: deliveries.length,
      data: deliveries,
    });
  } catch (error) {
    console.error("Error fetching deliveries:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Get a specific delivery by ID
exports.getDelivery = async (req, res) => {
  try {
    console.log("Requesting delivery with ID:", req.params.id);
    const { id } = req.params;
    const delivery = await Delivery.findById(id).populate("subscriptionId");

    if (!delivery) {
      return res.status(404).json({
        success: false,
        message: "Delivery not found",
      });
    }

    // Check if delivery belongs to the requesting user
    if (delivery.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to access this delivery",
      });
    }

    return res.status(200).json({
      success: true,
      data: delivery,
    });
  } catch (error) {
    console.error("Error fetching delivery:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Reschedule a delivery
exports.rescheduleDelivery = async (req, res) => {
  try {
    const { newDate, newTime, id } = req.body;
    console.log(
      "Rescheduling delivery with ID:",
      id,
      "to new date:",
      newDate,
      "and time:",
      newTime
    );
    if (!newDate && !newTime) {
      return res.status(400).json({
        success: false,
        message: "Either newDate or newTime must be provided",
      });
    }

    // First check if the delivery exists and belongs to the user
    const delivery = await Delivery.findById(id);
    if (!delivery) {
      return res.status(404).json({
        success: false,
        message: "Delivery not found",
      });
    }

    // Attempt to reschedule
    const updatedDelivery = await deliveryService.rescheduleDelivery(
      id,
      newDate,
      newTime
    );

    return res.status(200).json({
      success: true,
      message: "Delivery rescheduled successfully",
      data: updatedDelivery,
    });
  } catch (error) {
    console.error("Error rescheduling delivery:", error);
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Skip a delivery
exports.skipDelivery = async (req, res) => {
  try {
    const { id } = req.params;

    // First check if the delivery exists and belongs to the user
    const delivery = await Delivery.findById(id);
    if (!delivery) {
      return res.status(404).json({
        success: false,
        message: "Delivery not found",
      });
    }

    if (delivery.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to modify this delivery",
      });
    }

    if (delivery.status !== "scheduled") {
      return res.status(400).json({
        success: false,
        message: `Cannot skip delivery with status: ${delivery.status}`,
      });
    }

    delivery.status = "skipped";
    await delivery.save();

    return res.status(200).json({
      success: true,
      message: "Delivery skipped successfully",
      data: delivery,
    });
  } catch (error) {
    console.error("Error skipping delivery:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Get upcoming deliveries
exports.getUpcomingDeliveries = async (req, res) => {
  try {
    const userId = req.user.id;
    const now = new Date();

    const deliveries = await Delivery.find({
      userId,
      deliveryDate: { $gte: now },
      status: { $in: ["scheduled", "preparing"] },
    })
      .sort({ deliveryDate: 1 })
      .populate("subscriptionId");

    return res.status(200).json({
      success: true,
      count: deliveries.length,
      data: deliveries,
    });
  } catch (error) {
    console.error("Error fetching upcoming deliveries:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
