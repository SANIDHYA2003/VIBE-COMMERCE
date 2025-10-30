const mongoose = require("mongoose")

const userProfileSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  firstName: String,
  lastName: String,
  email: String,
  phoneNumber: String,
  profileImage: String,
  bio: String,
  totalOrders: {
    type: Number,
    default: 0,
  },
  totalSpent: {
    type: Number,
    default: 0,
  },
  memberSince: {
    type: Date,
    default: Date.now,
  },
  lastLogin: Date,
  preferences: {
    newsletter: {
      type: Boolean,
      default: true,
    },
    notifications: {
      type: Boolean,
      default: true,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model("UserProfile", userProfileSchema)
