"use client"

import { useState } from "react"
import AddressManager from "./AddressManager"
import PaymentMethodSelector from "./PaymentMethodSelector"
import "../styles/Checkout.css"

function Checkout({ userId, onBack, onOrderComplete }) {
  const [selectedAddressId, setSelectedAddressId] = useState(null)
  const [selectedPaymentId, setSelectedPaymentId] = useState(null)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null)
  const [loading, setLoading] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)

  const handleSelectAddress = (addressId) => {
    setSelectedAddressId(addressId)
  }

  const handleSelectPayment = (paymentId, paymentMethod) => {
    setSelectedPaymentId(paymentId)
    setSelectedPaymentMethod(paymentMethod)
  }

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      alert("Please select a delivery address")
      return
    }

    if (!selectedPaymentId) {
      alert("Please select a payment method")
      return
    }

    try {
      setLoading(true)
      const response = await fetch("http://localhost:5000/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          addressId: selectedAddressId,
          paymentMethodId: selectedPaymentId,
          paymentMethod: selectedPaymentMethod,
        }),
      })

      if (response.ok) {
        const order = await response.json()
        setOrderPlaced(true)
        console.log("[v0] Order placed:", order)
        if (onOrderComplete) {
          setTimeout(() => {
            onOrderComplete()
          }, 2000)
        }
      } else {
        alert("Failed to place order")
      }
    } catch (error) {
      console.log("[v0] Error placing order:", error)
      alert("Error placing order")
    } finally {
      setLoading(false)
    }
  }

  if (orderPlaced) {
    return (
      <div className="checkout-container">
        <div className="order-success">
          <h2>Order Placed Successfully!</h2>
          <p>Thank you for your purchase. Your order has been confirmed.</p>
          <button onClick={() => onOrderComplete && onOrderComplete()} className="back-btn">
            Continue Shopping
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>
      <div className="checkout-form">
        <AddressManager userId={userId} onSelectAddress={handleSelectAddress} selectedAddressId={selectedAddressId} />

        <PaymentMethodSelector
          userId={userId}
          onSelectPayment={handleSelectPayment}
          selectedPaymentId={selectedPaymentId}
        />

        <div className="form-actions">
          <button type="button" onClick={onBack} className="back-btn">
            Back to Cart
          </button>
          <button
            type="button"
            onClick={handlePlaceOrder}
            disabled={loading || !selectedAddressId || !selectedPaymentId}
            className="submit-btn"
          >
            {loading ? "Processing..." : "Place Order"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Checkout
