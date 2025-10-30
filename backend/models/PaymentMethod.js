const mongoose = require("mongoose")

const paymentMethodSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  methodType: {
    type: String,
    enum: ["credit_card", "debit_card", "digital_wallet", "bank_transfer"],
    required: true,
  },
  isDefault: {
    type: Boolean,
    default: false,
  },
  // Credit/Debit Card fields
  cardholderName: String,
  cardNumber: String, // Last 4 digits only for security
  expiryMonth: String,
  expiryYear: String,
  cvv: String, // Should be encrypted in production
  cardBrand: String, // Visa, Mastercard, etc.

  // Digital Wallet fields (Apple Pay, Google Pay, PayPal)
  walletProvider: String,
  walletEmail: String,

  // Bank Transfer fields
  bankName: String,
  accountHolderName: String,
  accountNumber: String, // Last 4 digits only
  routingNumber: String,
  accountType: String, // Checking, Savings

  createdAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model("PaymentMethod", paymentMethodSchema)
