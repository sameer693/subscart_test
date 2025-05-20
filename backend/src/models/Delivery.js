const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema({
  subscriptionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subscription',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  deliveryDate: {
    type: Date,
    required: true
  },
  deliveryTime: {
    type: String,
    required: true,
    default: '14:00' // Default time inherited from subscription
  },
  status: {
    type: String,
    enum: ['scheduled', 'preparing', 'out-for-delivery', 'delivered', 'skipped', 'cancelled'],
    default: 'scheduled'
  },
  items: [{
    name: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      default: 1
    },
    dietType: String
  }],
  estimatedDeliveryTime: {
    type: Number,
    default: 19 // in minutes
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp on save
deliverySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Ensure only one delivery per subscription per day
deliverySchema.index({ subscriptionId: 1, deliveryDate: 1 }, { unique: true });

const Delivery = mongoose.model('Delivery', deliverySchema);

module.exports = Delivery;