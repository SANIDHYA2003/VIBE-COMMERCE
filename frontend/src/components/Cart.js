"use client"

import { useState, useEffect } from "react"
import "../styles/Cart.css"

function Cart({ userId, onCheckout, onCartUpdate }) {
  const [cart, setCart] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCart()
  }, [userId])

  const fetchCart = async () => {
    try {
      setLoading(true)
      const response = await fetch(`http://localhost:5000/api/cart/${userId}`)
      const data = await response.json()
      setCart(data)
    } catch (error) {
      console.log("[v0] Error fetching cart:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveItem = async (productId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/cart/${userId}/remove`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      })

      if (response.ok) {
        fetchCart()
        if (onCartUpdate) {
          onCartUpdate()
        }
      }
    } catch (error) {
      console.log("[v0] Error removing item:", error)
    }
  }

  const handleUpdateQuantity = async (productId, quantity) => {
    if (quantity <= 0) {
      handleRemoveItem(productId)
      return
    }

    try {
      const response = await fetch(`http://localhost:5000/api/cart/${userId}/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity: Number.parseInt(quantity) }),
      })

      if (response.ok) {
        fetchCart()
        if (onCartUpdate) {
          onCartUpdate()
        }
      }
    } catch (error) {
      console.log("[v0] Error updating quantity:", error)
    }
  }

  const handleSaveForLater = async (productId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/cart/${userId}/save-for-later`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      })

      if (response.ok) {
        fetchCart()
        if (onCartUpdate) {
          onCartUpdate()
        }
      }
    } catch (error) {
      console.log("[v0] Error saving for later:", error)
    }
  }

  const handleMoveToCart = async (productId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/cart/${userId}/move-to-cart`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      })

      if (response.ok) {
        fetchCart()
        if (onCartUpdate) {
          onCartUpdate()
        }
      }
    } catch (error) {
      console.log("[v0] Error moving to cart:", error)
    }
  }

  const handleRemoveFromSaved = async (productId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/cart/${userId}/remove-from-saved`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      })

      if (response.ok) {
        fetchCart()
      }
    } catch (error) {
      console.log("[v0] Error removing from saved:", error)
    }
  }

  if (loading) return <div className="loading">Loading cart...</div>

  const hasCartItems = cart && cart.items && cart.items.length > 0
  const hasSavedItems = cart && cart.saveForLater && cart.saveForLater.length > 0

  if (!hasCartItems && !hasSavedItems) {
    return <div className="empty-cart">Your cart is empty</div>
  }

  return (
    <div className="cart-container">
      {hasCartItems && (
        <>
          <h2>Shopping Cart</h2>
          <div className="cart-items">
            {cart.items.map((item) => (
              <div key={item.productId._id} className="cart-item">
                <div className="item-details">
                  <h4>{item.productId.name}</h4>
                  <p>${item.price.toFixed(2)}</p>
                </div>
                <div className="item-quantity">
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => handleUpdateQuantity(item.productId._id, e.target.value)}
                    className="qty-input"
                  />
                </div>
                <div className="item-total">
                  <p>${(item.price * item.quantity).toFixed(2)}</p>
                </div>
                <div className="item-actions">
                  <button onClick={() => handleSaveForLater(item.productId._id)} className="save-later-btn">
                    Save for Later
                  </button>
                  <button onClick={() => handleRemoveItem(item.productId._id)} className="remove-btn">
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="cart-summary">
            <h3>Total: ${cart.totalPrice.toFixed(2)}</h3>
            <button onClick={onCheckout} className="checkout-btn">
              Proceed to Checkout
            </button>
          </div>
        </>
      )}

      {hasSavedItems && (
        <div className="save-for-later-section">
          <h2>Save for Later</h2>
          <div className="saved-items">
            {cart.saveForLater.map((item) => (
              <div key={item.productId._id} className="saved-item">
                <div className="item-details">
                  <h4>{item.productId.name}</h4>
                  <p>${item.price.toFixed(2)}</p>
                </div>
                <div className="item-quantity">
                  <span className="qty-display">Qty: {item.quantity}</span>
                </div>
                <div className="item-total">
                  <p>${(item.price * item.quantity).toFixed(2)}</p>
                </div>
                <div className="item-actions">
                  <button onClick={() => handleMoveToCart(item.productId._id)} className="move-to-cart-btn">
                    Move to Cart
                  </button>
                  <button onClick={() => handleRemoveFromSaved(item.productId._id)} className="remove-btn">
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Cart
