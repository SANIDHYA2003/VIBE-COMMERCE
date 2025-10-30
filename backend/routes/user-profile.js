const express = require("express")
const router = express.Router()
const UserProfile = require("../models/UserProfile")

// Get user profile
// Get user profile (with live recalculation)
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params
    let profile = await UserProfile.findOne({ userId })
    const Order = require("../models/Order")

    // Always calculate live totals from Order collection
    const orders = await Order.find({ userId })
    const totalOrders = orders.length
    const totalSpent = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0)

    // Create if missing
    if (!profile) {
      profile = new UserProfile({
        userId,
        totalOrders,
        totalSpent,
      })
      await profile.save()
    } else {
      // Update stored totals to keep synced
      profile.totalOrders = totalOrders
      profile.totalSpent = totalSpent
      await profile.save()
    }

    res.json(profile)
  } catch (error) {
    console.error("Error fetching profile:", error)
    res.status(500).json({ message: error.message })
  }
})


// Update user profile
router.put("/:userId", async (req, res) => {
  try {
    let profile = await UserProfile.findOne({ userId: req.params.userId })

    if (!profile) {
      profile = new UserProfile({ userId: req.params.userId })
    }

    const { firstName, lastName, email, phoneNumber, bio, preferences } = req.body

    if (firstName) profile.firstName = firstName
    if (lastName) profile.lastName = lastName
    if (email) profile.email = email
    if (phoneNumber) profile.phoneNumber = phoneNumber
    if (bio) profile.bio = bio
    if (preferences) profile.preferences = { ...profile.preferences, ...preferences }

    profile.updatedAt = new Date()
    const updatedProfile = await profile.save()
    res.json(updatedProfile)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// Update last login
router.patch("/:userId/last-login", async (req, res) => {
  try {
    const profile = await UserProfile.findOneAndUpdate(
      { userId: req.params.userId },
      { lastLogin: new Date() },
      { new: true, upsert: true },
    )
    res.json(profile)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router
