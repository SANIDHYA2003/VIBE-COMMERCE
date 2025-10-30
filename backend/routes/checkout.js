const express = require("express")
const router = express.Router()
const Order = require("../models/Order")
const Cart = require("../models/Cart")
const Address = require("../models/Address")
const UserProfile = require("../models/UserProfile")

// Create order from cart
router.post("/", async (req, res) => {
  try {
    const { userId, addressId, paymentMethodId, paymentMethod } = req.body

    const cart = await Cart.findOne({ userId })
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" })
    }

    // Get address details
    let addressInfo = {}
    if (addressId) {
      const address = await Address.findById(addressId)
      if (address) {
        addressInfo = {
          fullName: address.fullName,
          phoneNumber: address.phoneNumber,
          streetAddress: address.streetAddress,
          city: address.city,
          state: address.state,
          zipCode: address.zipCode,
          country: address.country,
        }
      }
    }

    // Create order with full details
    const order = new Order({
      userId,
      items: cart.items,
      totalPrice: cart.totalPrice,
      customerInfo: addressInfo,
      paymentMethod: paymentMethod?.methodType || "unknown",
      status: "completed",
    })

    await order.save()

    // Update user profile stats
    await UserProfile.findOneAndUpdate(
      { userId },
      {
        $inc: { totalOrders: 1, totalSpent: cart.totalPrice },
        lastLogin: new Date(),
      },
      { upsert: true },
    )

    // Clear cart after order
    await Cart.findOneAndUpdate({ userId }, { items: [], totalPrice: 0 })

    res.status(201).json(order)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get orders for user
router.get("/:userId", async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId }).sort({ createdAt: -1 })
    res.json(orders)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get single order
router.get("/:userId/:orderId", async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.orderId, userId: req.params.userId })
    if (!order) return res.status(404).json({ message: "Order not found" })
    res.json(order)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router
