const express = require("express")
const router = express.Router()
const Cart = require("../models/Cart")
const Product = require("../models/Product")

// Get cart for user
router.get("/:userId", async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.params.userId })
      .populate("items.productId")
      .populate("saveForLater.productId")
    if (!cart) {
      cart = new Cart({ userId: req.params.userId, items: [], saveForLater: [] })
      await cart.save()
    }
    res.json(cart)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Add to cart
router.post("/:userId/add", async (req, res) => {
  try {
    const { productId, quantity } = req.body

    if (!productId || !quantity) {
      return res.status(400).json({ message: "Product ID and quantity are required" })
    }

    const product = await Product.findById(productId)
    if (!product) return res.status(404).json({ message: "Product not found" })

    let cart = await Cart.findOne({ userId: req.params.userId })
    if (!cart) {
      cart = new Cart({ userId: req.params.userId, items: [], saveForLater: [] })
    }

    const existingItem = cart.items.find((item) => item.productId.toString() === productId)

    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      cart.items.push({
        productId,
        quantity,
        price: product.price,
      })
    }

    cart.totalPrice = cart.items.reduce((total, item) => total + item.price * item.quantity, 0)
    cart.updatedAt = new Date()
    await cart.save()
    res.json(cart)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Remove from cart
router.post("/:userId/remove", async (req, res) => {
  try {
    const { productId } = req.body

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" })
    }

    const cart = await Cart.findOne({ userId: req.params.userId })
    if (!cart) return res.status(404).json({ message: "Cart not found" })

    cart.items = cart.items.filter((item) => item.productId.toString() !== productId)
    cart.totalPrice = cart.items.reduce((total, item) => total + item.price * item.quantity, 0)
    cart.updatedAt = new Date()
    await cart.save()
    res.json(cart)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Update cart item quantity
router.post("/:userId/update", async (req, res) => {
  try {
    const { productId, quantity } = req.body

    if (!productId || quantity === undefined) {
      return res.status(400).json({ message: "Product ID and quantity are required" })
    }

    const cart = await Cart.findOne({ userId: req.params.userId })
    if (!cart) return res.status(404).json({ message: "Cart not found" })

    const item = cart.items.find((item) => item.productId.toString() === productId)
    if (item) {
      item.quantity = quantity
    }

    cart.totalPrice = cart.items.reduce((total, item) => total + item.price * item.quantity, 0)
    cart.updatedAt = new Date()
    await cart.save()
    res.json(cart)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.post("/:userId/save-for-later", async (req, res) => {
  try {
    const { productId } = req.body

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" })
    }

    const cart = await Cart.findOne({ userId: req.params.userId })
    if (!cart) return res.status(404).json({ message: "Cart not found" })

    // Find item in cart
    const itemIndex = cart.items.findIndex((item) => item.productId.toString() === productId)
    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in cart" })
    }

    const item = cart.items[itemIndex]

    // Check if item already exists in saveForLater
    const existingSaveForLater = cart.saveForLater.find((item) => item.productId.toString() === productId)
    if (existingSaveForLater) {
      existingSaveForLater.quantity += item.quantity
    } else {
      cart.saveForLater.push({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      })
    }

    // Remove from cart
    cart.items.splice(itemIndex, 1)
    cart.totalPrice = cart.items.reduce((total, item) => total + item.price * item.quantity, 0)
    cart.updatedAt = new Date()
    await cart.save()
    res.json(cart)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.post("/:userId/move-to-cart", async (req, res) => {
  try {
    const { productId } = req.body

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" })
    }

    const cart = await Cart.findOne({ userId: req.params.userId })
    if (!cart) return res.status(404).json({ message: "Cart not found" })

    // Find item in saveForLater
    const itemIndex = cart.saveForLater.findIndex((item) => item.productId.toString() === productId)
    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in save for later" })
    }

    const item = cart.saveForLater[itemIndex]

    // Check if item already exists in cart
    const existingCartItem = cart.items.find((item) => item.productId.toString() === productId)
    if (existingCartItem) {
      existingCartItem.quantity += item.quantity
    } else {
      cart.items.push({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      })
    }

    // Remove from saveForLater
    cart.saveForLater.splice(itemIndex, 1)
    cart.totalPrice = cart.items.reduce((total, item) => total + item.price * item.quantity, 0)
    cart.updatedAt = new Date()
    await cart.save()
    res.json(cart)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.post("/:userId/remove-from-saved", async (req, res) => {
  try {
    const { productId } = req.body

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" })
    }

    const cart = await Cart.findOne({ userId: req.params.userId })
    if (!cart) return res.status(404).json({ message: "Cart not found" })

    cart.saveForLater = cart.saveForLater.filter((item) => item.productId.toString() !== productId)
    cart.updatedAt = new Date()
    await cart.save()
    res.json(cart)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Clear cart
router.post("/:userId/clear", async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId })
    if (cart) {
      cart.items = []
      cart.totalPrice = 0
      cart.updatedAt = new Date()
      await cart.save()
    }
    res.json(cart)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router
