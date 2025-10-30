const mongoose = require("mongoose")

const orderSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
      name: String,
      quantity: Number,
      price: Number,
    },
  ],
  totalPrice: {
    type: Number,
    required: true,
  },
  customerInfo: {
    fullName: String,
    phoneNumber: String,
    streetAddress: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
  },
  paymentMethod: {
    type: String,
    default: "unknown",
  },
  status: {
    type: String,
    enum: ["pending", "completed", "cancelled"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model("Order", orderSchema)
