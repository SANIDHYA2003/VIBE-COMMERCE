const express = require("express")
const router = express.Router()
const Address = require("../models/Address")

// Get all addresses for a user
router.get("/user/:userId", async (req, res) => {
  try {
    const addresses = await Address.find({ userId: req.params.userId }).sort({ createdAt: -1 })
    res.json(addresses)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get single address
router.get("/:id", async (req, res) => {
  try {
    const address = await Address.findById(req.params.id)
    if (!address) return res.status(404).json({ message: "Address not found" })
    res.json(address)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Create new address
router.post("/", async (req, res) => {
  const { userId, fullName, phoneNumber, streetAddress, city, state, zipCode, country, addressType } = req.body

  if (!userId || !fullName || !phoneNumber || !streetAddress || !city || !state || !zipCode || !country) {
    return res.status(400).json({ message: "Missing required fields" })
  }

  const address = new Address({
    userId,
    fullName,
    phoneNumber,
    streetAddress,
    city,
    state,
    zipCode,
    country,
    addressType: addressType || "home",
  })

  try {
    const newAddress = await address.save()
    res.status(201).json(newAddress)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// Update address
router.put("/:id", async (req, res) => {
  try {
    const address = await Address.findById(req.params.id)
    if (!address) return res.status(404).json({ message: "Address not found" })

    const { fullName, phoneNumber, streetAddress, city, state, zipCode, country, addressType, isDefault } = req.body

    if (fullName) address.fullName = fullName
    if (phoneNumber) address.phoneNumber = phoneNumber
    if (streetAddress) address.streetAddress = streetAddress
    if (city) address.city = city
    if (state) address.state = state
    if (zipCode) address.zipCode = zipCode
    if (country) address.country = country
    if (addressType) address.addressType = addressType
    if (isDefault !== undefined) address.isDefault = isDefault

    const updatedAddress = await address.save()
    res.json(updatedAddress)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// Delete address
router.delete("/:id", async (req, res) => {
  try {
    const address = await Address.findByIdAndDelete(req.params.id)
    if (!address) return res.status(404).json({ message: "Address not found" })
    res.json({ message: "Address deleted successfully" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Set default address
router.patch("/:id/set-default", async (req, res) => {
  try {
    const { userId } = req.body

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" })
    }

    // Remove default from all other addresses
    await Address.updateMany({ userId, _id: { $ne: req.params.id } }, { isDefault: false })

    // Set this address as default
    const address = await Address.findByIdAndUpdate(req.params.id, { isDefault: true }, { new: true })
    res.json(address)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router
