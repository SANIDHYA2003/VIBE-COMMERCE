"use client"

import { useState } from "react"
import "../styles/ProductCard.css"

function ProductCard({ product, userId, onCartUpdate, onViewProduct }) {
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(false)

  const handleAddToCart = async () => {
    try {
      setLoading(true)
      const response = await fetch(`http://localhost:5000/api/cart/${userId}/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product._id,
          quantity: Number.parseInt(quantity),
        }),
      })

      if (response.ok) {
        alert("Added to cart!")
        setQuantity(1)
        onCartUpdate()
      }
    } catch (error) {
      console.log("[v0] Error adding to cart:", error)
      alert("Failed to add to cart")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="product-card">
      <img
        src={product.image || "/placeholder.svg"}
        alt={product.name}
        className="product-image"
        onClick={() => onViewProduct(product._id)}
        style={{ cursor: "pointer" }}
      />
      <div className="product-info">
        <h3 onClick={() => onViewProduct(product._id)} style={{ cursor: "pointer", color: "#0066cc" }}>
          {product.name}
        </h3>
        <p className="description">{product.description}</p>
        <p className="category">{product.category}</p>
        <div className="product-footer">
          <span className="price">${product.price.toFixed(2)}</span>
          <div className="add-to-cart">
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="quantity-input"
            />
            <button onClick={handleAddToCart} disabled={loading} className="add-btn">
              {loading ? "Adding..." : "Add"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
