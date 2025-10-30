"use client"

import { useState } from "react"
import "../styles/PaymentForm.css"

function PaymentForm({ totalAmount, onPaymentSuccess, onPaymentFail }) {
  const [cardData, setCardData] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
  })
  const [loading, setLoading] = useState(false)

  const handleCardChange = (e) => {
    const { name, value } = e.target
    setCardData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const validateCardData = () => {
    if (!cardData.cardNumber || !cardData.cardName || !cardData.expiryDate || !cardData.cvv) {
      alert("Please fill in all card details")
      return false
    }

    if (cardData.cardNumber.length < 13) {
      alert("Invalid card number")
      return false
    }

    if (cardData.cvv.length < 3) {
      alert("Invalid CVV")
      return false
    }

    return true
  }

  const handlePayment = async (e) => {
    e.preventDefault()

    if (!validateCardData()) return

    try {
      setLoading(true)

      // Simulate payment processing
      const response = await fetch("http://localhost:5000/api/payment/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: totalAmount,
          cardToken: cardData.cardNumber.slice(-4),
          customerInfo: cardData,
        }),
      })

      if (response.ok) {
        const result = await response.json()
        console.log("[v0] Payment successful:", result)
        onPaymentSuccess(result)
      } else {
        onPaymentFail("Payment failed")
      }
    } catch (error) {
      console.log("[v0] Payment error:", error)
      onPaymentFail("Payment processing error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handlePayment} className="payment-form">
      <h3>Payment Details</h3>

      <div className="form-group">
        <label>Cardholder Name</label>
        <input
          type="text"
          name="cardName"
          value={cardData.cardName}
          onChange={handleCardChange}
          placeholder="John Doe"
          required
        />
      </div>

      <div className="form-group">
        <label>Card Number</label>
        <input
          type="text"
          name="cardNumber"
          value={cardData.cardNumber}
          onChange={handleCardChange}
          placeholder="1234 5678 9012 3456"
          maxLength="19"
          required
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Expiry Date</label>
          <input
            type="text"
            name="expiryDate"
            value={cardData.expiryDate}
            onChange={handleCardChange}
            placeholder="MM/YY"
            maxLength="5"
            required
          />
        </div>
        <div className="form-group">
          <label>CVV</label>
          <input
            type="text"
            name="cvv"
            value={cardData.cvv}
            onChange={handleCardChange}
            placeholder="123"
            maxLength="4"
            required
          />
        </div>
      </div>

      <div className="payment-summary">
        <p>
          Total Amount: <strong>${totalAmount.toFixed(2)}</strong>
        </p>
      </div>

      <button type="submit" disabled={loading} className="pay-btn">
        {loading ? "Processing Payment..." : `Pay $${totalAmount.toFixed(2)}`}
      </button>
    </form>
  )
}

export default PaymentForm
