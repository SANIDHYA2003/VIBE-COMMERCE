"use client"

import { useState } from "react"
import PaymentForm from "./PaymentForm"
import "../styles/CheckoutWithPayment.css"

function CheckoutWithPayment({ userId, onBack }) {
  const [step, setStep] = useState("shipping") // shipping, payment, confirmation
  const [shippingInfo, setShippingInfo] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    zipCode: "",
  })
  const [cartTotal, setCartTotal] = useState(0)
  const [orderData, setOrderData] = useState(null)

  const handleShippingChange = (e) => {
    const { name, value } = e.target
    setShippingInfo((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleShippingSubmit = async (e) => {
    e.preventDefault()

    if (
      !shippingInfo.name ||
      !shippingInfo.email ||
      !shippingInfo.address ||
      !shippingInfo.city ||
      !shippingInfo.zipCode
    ) {
      alert("Please fill in all shipping details")
      return
    }

    // Fetch cart total
    try {
      const response = await fetch(`http://localhost:5000/api/cart/${userId}`)
      const cart = await response.json()
      setCartTotal(cart.totalPrice)
      setStep("payment")
    } catch (error) {
      console.log("[v0] Error fetching cart:", error)
      alert("Error loading cart")
    }
  }

  const handlePaymentSuccess = async (paymentResult) => {
    try {
      // Create order
      const response = await fetch("http://localhost:5000/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          customerInfo: shippingInfo,
        }),
      })

      if (response.ok) {
        const order = await response.json()
        setOrderData({
          ...order,
          paymentId: paymentResult.paymentId,
        })
        setStep("confirmation")
      }
    } catch (error) {
      console.log("[v0] Error creating order:", error)
      alert("Error creating order")
    }
  }

  const handlePaymentFail = (error) => {
    alert("Payment failed: " + error)
  }

  return (
    <div className="checkout-with-payment">
      {step === "shipping" && (
        <div className="checkout-step">
          <h2>Shipping Information</h2>
          <form onSubmit={handleShippingSubmit} className="shipping-form">
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" name="name" value={shippingInfo.name} onChange={handleShippingChange} required />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" name="email" value={shippingInfo.email} onChange={handleShippingChange} required />
            </div>
            <div className="form-group">
              <label>Address</label>
              <input type="text" name="address" value={shippingInfo.address} onChange={handleShippingChange} required />
            </div>
            <div className="form-group">
              <label>City</label>
              <input type="text" name="city" value={shippingInfo.city} onChange={handleShippingChange} required />
            </div>
            <div className="form-group">
              <label>Zip Code</label>
              <input type="text" name="zipCode" value={shippingInfo.zipCode} onChange={handleShippingChange} required />
            </div>
            <div className="form-actions">
              <button type="button" onClick={onBack} className="back-btn">
                Back to Cart
              </button>
              <button type="submit" className="next-btn">
                Continue to Payment
              </button>
            </div>
          </form>
        </div>
      )}

      {step === "payment" && (
        <div className="checkout-step">
          <PaymentForm
            totalAmount={cartTotal}
            onPaymentSuccess={handlePaymentSuccess}
            onPaymentFail={handlePaymentFail}
          />
          <button onClick={() => setStep("shipping")} className="back-btn">
            Back to Shipping
          </button>
        </div>
      )}

      {step === "confirmation" && (
        <div className="checkout-step confirmation">
          <div className="success-message">
            <h2>Order Confirmed!</h2>
            <p>Thank you for your purchase.</p>

            <div className="order-details">
              <h3>Order Summary</h3>
              <p>
                <strong>Order ID:</strong> {orderData._id}
              </p>
              <p>
                <strong>Payment ID:</strong> {orderData.paymentId}
              </p>
              <p>
                <strong>Total Amount:</strong> ${orderData.totalPrice.toFixed(2)}
              </p>
              <p>
                <strong>Shipping To:</strong> {orderData.customerInfo.address}, {orderData.customerInfo.city}{" "}
                {orderData.customerInfo.zipCode}
              </p>
              <p>
                <strong>Status:</strong> <span className="status-badge">{orderData.status}</span>
              </p>
            </div>

            <button onClick={onBack} className="continue-btn">
              Continue Shopping
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default CheckoutWithPayment
