const express = require("express")
const router = express.Router()
const Review = require("../models/Review")
const Product = require("../models/Product")

// Get all reviews for a product
router.get("/product/:productId", async (req, res) => {
  try {
    const reviews = await Review.find({ productId: req.params.productId }).sort({ createdAt: -1 })
    res.json(reviews)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get average rating for a product
router.get("/product/:productId/rating", async (req, res) => {
  try {
    const reviews = await Review.find({ productId: req.params.productId })
    if (reviews.length === 0) {
      return res.json({ averageRating: 0, totalReviews: 0 })
    }
    const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    res.json({ averageRating: Math.round(averageRating * 10) / 10, totalReviews: reviews.length })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Create a review
router.post("/", async (req, res) => {
  const { productId, userId, userName, rating, title, comment } = req.body

  if (!productId || !userId || !userName || !rating || !title || !comment) {
    return res.status(400).json({ message: "Missing required fields" })
  }

  const review = new Review({
    productId,
    userId,
    userName,
    rating,
    title,
    comment,
  })

  try {
    const newReview = await review.save()
    res.status(201).json(newReview)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// Update review helpful count
router.patch("/:id/helpful", async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)
    if (!review) return res.status(404).json({ message: "Review not found" })
    review.helpful += 1
    const updatedReview = await review.save()
    res.json(updatedReview)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router
