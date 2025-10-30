const express = require("express")
const router = express.Router()
const PaymentMethod = require("../models/PaymentMethod")

// Get all payment methods for a user
router.get("/user/:userId", async (req, res) => {
  try {
    const methods = await PaymentMethod.find({ userId: req.params.userId }).sort({ createdAt: -1 })
    res.json(methods)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get single payment method
router.get("/:id", async (req, res) => {
  try {
    const method = await PaymentMethod.findById(req.params.id)
    if (!method) return res.status(404).json({ message: "Payment method not found" })
    res.json(method)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Create new payment method
router.post("/", async (req, res) => {
  const { userId, methodType } = req.body

  if (!userId || !methodType) {
    return res.status(400).json({ message: "Missing required fields: userId and methodType" })
  }

  const paymentMethod = new PaymentMethod(req.body)

  try {
    const newMethod = await paymentMethod.save()
    res.status(201).json(newMethod)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// Update payment method
router.put("/:id", async (req, res) => {
  try {
    const method = await PaymentMethod.findById(req.params.id)
    if (!method) return res.status(404).json({ message: "Payment method not found" })

    Object.assign(method, req.body)
    const updatedMethod = await method.save()
    res.json(updatedMethod)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// Delete payment method
router.delete("/:id", async (req, res) => {
  try {
    const method = await PaymentMethod.findByIdAndDelete(req.params.id)
    if (!method) return res.status(404).json({ message: "Payment method not found" })
    res.json({ message: "Payment method deleted successfully" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Set default payment method
router.patch("/:id/set-default", async (req, res) => {
  try {
    const { userId } = req.body

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" })
    }

    // Remove default from all other methods
    await PaymentMethod.updateMany({ userId, _id: { $ne: req.params.id } }, { isDefault: false })

    // Set this method as default
    const method = await PaymentMethod.findByIdAndUpdate(req.params.id, { isDefault: true }, { new: true })
    res.json(method)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router
