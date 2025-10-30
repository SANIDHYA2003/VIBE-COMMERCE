"use client"

import { useState, useEffect } from "react"
import "../styles/ProductDetail.css"

function ProductDetail({ productId, userId, onBack, onAddToCart }) {
  const [product, setProduct] = useState(null)
  const [reviews, setReviews] = useState([])
  const [rating, setRating] = useState(5)
  const [averageRating, setAverageRating] = useState(0)
  const [totalReviews, setTotalReviews] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [submittingReview, setSubmittingReview] = useState(false)
  const [reviewTitle, setReviewTitle] = useState("")
  const [reviewComment, setReviewComment] = useState("")
  const [userName, setUserName] = useState("")

  useEffect(() => {
    fetchProductDetails()
    fetchReviews()
    fetchRating()
  }, [productId])

  const fetchProductDetails = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/products/${productId}`)
      const data = await response.json()
      setProduct(data)
    } catch (error) {
      console.log("[v0] Error fetching product:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchReviews = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/reviews/product/${productId}`)
      const data = await response.json()
      setReviews(data)
    } catch (error) {
      console.log("[v0] Error fetching reviews:", error)
    }
  }

  const fetchRating = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/reviews/product/${productId}/rating`)
      const data = await response.json()
      setAverageRating(data.averageRating)
      setTotalReviews(data.totalReviews)
    } catch (error) {
      console.log("[v0] Error fetching rating:", error)
    }
  }

  const handleSubmitReview = async (e) => {
    e.preventDefault()
    if (!userName || !reviewTitle || !reviewComment) {
      alert("Please fill in all fields")
      return
    }

    setSubmittingReview(true)
    try {
      const response = await fetch("http://localhost:5000/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          userId,
          userName,
          rating,
          title: reviewTitle,
          comment: reviewComment,
        }),
      })

      if (response.ok) {
        alert("Review submitted successfully!")
        setReviewTitle("")
        setReviewComment("")
        setUserName("")
        setRating(5)
        fetchReviews()
        fetchRating()
      }
    } catch (error) {
      console.log("[v0] Error submitting review:", error)
      alert("Failed to submit review")
    } finally {
      setSubmittingReview(false)
    }
  }

  const handleAddToCart = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/cart/${userId}/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          quantity: Number.parseInt(quantity),
        }),
      })

      if (response.ok) {
        alert("Added to cart!")
        onAddToCart()
      }
    } catch (error) {
      console.log("[v0] Error adding to cart:", error)
      alert("Failed to add to cart")
    }
  }

  const handleHelpful = async (reviewId) => {
    try {
      await fetch(`http://localhost:5000/api/reviews/${reviewId}/helpful`, {
        method: "PATCH",
      })
      fetchReviews()
    } catch (error) {
      console.log("[v0] Error marking helpful:", error)
    }
  }

  if (loading) return <div className="loading">Loading product...</div>
  if (!product) return <div className="error">Product not found</div>

  return (
    <div className="product-detail-container">
      <button onClick={onBack} className="back-btn">
        ← Back to Products
      </button>

      <div className="product-detail-main">
        <div className="product-image-section">
          <img src={product.image || "/placeholder.svg"} alt={product.name} className="product-detail-image" />
        </div>

        <div className="product-info-section">
          <h1>{product.name}</h1>
          <p className="category-badge">{product.category}</p>

          <div className="rating-section">
            <div className="stars">
              {"★".repeat(Math.round(averageRating))}
              {"☆".repeat(5 - Math.round(averageRating))}
            </div>
            <span className="rating-text">
              {averageRating.toFixed(1)} ({totalReviews} reviews)
            </span>
          </div>

          <p className="description">{product.description}</p>

          <div className="price-section">
            <span className="price">${product.price.toFixed(2)}</span>
            <span className="stock">{product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}</span>
          </div>

          <div className="add-to-cart-section">
            <input
              type="number"
              min="1"
              max={product.stock}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="quantity-input"
            />
            <button onClick={handleAddToCart} disabled={product.stock === 0} className="add-to-cart-btn">
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      <div className="reviews-section">
        <h2>Customer Reviews</h2>

        <div className="review-form">
          <h3>Write a Review</h3>
          <form onSubmit={handleSubmitReview}>
            <input
              type="text"
              placeholder="Your name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="form-input"
              required
            />

            <div className="rating-input">
              <label>Rating:</label>
              <select value={rating} onChange={(e) => setRating(Number(e.target.value))} className="form-select">
                <option value="5">5 Stars - Excellent</option>
                <option value="4">4 Stars - Good</option>
                <option value="3">3 Stars - Average</option>
                <option value="2">2 Stars - Poor</option>
                <option value="1">1 Star - Terrible</option>
              </select>
            </div>

            <input
              type="text"
              placeholder="Review title"
              value={reviewTitle}
              onChange={(e) => setReviewTitle(e.target.value)}
              className="form-input"
              required
            />

            <textarea
              placeholder="Write your review here..."
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              className="form-textarea"
              rows="4"
              required
            />

            <button type="submit" disabled={submittingReview} className="submit-review-btn">
              {submittingReview ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        </div>

        <div className="reviews-list">
          {reviews.length === 0 ? (
            <p className="no-reviews">No reviews yet. Be the first to review!</p>
          ) : (
            reviews.map((review) => (
              <div key={review._id} className="review-item">
                <div className="review-header">
                  <div className="review-user-info">
                    <h4>{review.userName}</h4>
                    <span className="review-rating">
                      {"★".repeat(review.rating)}
                      {"☆".repeat(5 - review.rating)}
                    </span>
                  </div>
                  <span className="review-date">{new Date(review.createdAt).toLocaleDateString()}</span>
                </div>
                <h5 className="review-title">{review.title}</h5>
                <p className="review-comment">{review.comment}</p>
                <button onClick={() => handleHelpful(review._id)} className="helpful-btn">
                  👍 Helpful ({review.helpful})
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductDetail
