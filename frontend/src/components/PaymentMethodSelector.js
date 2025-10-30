"use client"

import { useState, useEffect, useCallback } from "react"
import "../styles/PaymentMethodSelector.css"

function PaymentMethodSelector({ userId, onSelectPayment, selectedPaymentId }) {
  const [paymentMethods, setPaymentMethods] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [methodType, setMethodType] = useState("credit_card")
  const [formData, setFormData] = useState({
    cardholderName: "",
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
    cardBrand: "visa",
    walletProvider: "",
    walletEmail: "",
    bankName: "",
    accountHolderName: "",
    accountNumber: "",
    routingNumber: "",
    accountType: "checking",
  })

  const fetchPaymentMethods = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch(`http://localhost:5000/api/payment-methods/user/${userId}`)
      const data = await response.json()
      setPaymentMethods(data)
      if (data.length > 0 && !selectedPaymentId) {
        const defaultMethod = data.find((m) => m.isDefault) || data[0]
        onSelectPayment(defaultMethod._id, defaultMethod)
      }
    } catch (error) {
      console.log("[v0] Error fetching payment methods:", error)
    } finally {
      setLoading(false)
    }
  }, [userId, selectedPaymentId, onSelectPayment])

  useEffect(() => {
    fetchPaymentMethods()
  }, [fetchPaymentMethods])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate based on method type
    if (methodType === "credit_card" || methodType === "debit_card") {
      if (!formData.cardholderName || !formData.cardNumber || !formData.expiryMonth || !formData.expiryYear) {
        alert("Please fill in all card fields")
        return
      }
    } else if (methodType === "digital_wallet") {
      if (!formData.walletProvider || !formData.walletEmail) {
        alert("Please fill in all wallet fields")
        return
      }
    } else if (methodType === "bank_transfer") {
      if (!formData.bankName || !formData.accountHolderName || !formData.accountNumber) {
        alert("Please fill in all bank fields")
        return
      }
    }

    try {
      const payload = {
        userId,
        methodType,
        ...formData,
      }

      const response = await fetch("http://localhost:5000/api/payment-methods", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        alert("Payment method added!")
        resetForm()
        await fetchPaymentMethods()
      }
    } catch (error) {
      console.log("[v0] Error saving payment method:", error)
      alert("Failed to save payment method")
    }
  }

  const handleDelete = async (methodId) => {
    if (!window.confirm("Are you sure you want to delete this payment method?")) return

    try {
      const response = await fetch(`http://localhost:5000/api/payment-methods/${methodId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        alert("Payment method deleted!")
        await fetchPaymentMethods()
      }
    } catch (error) {
      console.log("[v0] Error deleting payment method:", error)
      alert("Failed to delete payment method")
    }
  }

  const handleSetDefault = async (methodId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/payment-methods/${methodId}/set-default`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      })

      if (response.ok) {
        await fetchPaymentMethods()
      }
    } catch (error) {
      console.log("[v0] Error setting default payment method:", error)
    }
  }

  const resetForm = () => {
    setFormData({
      cardholderName: "",
      cardNumber: "",
      expiryMonth: "",
      expiryYear: "",
      cvv: "",
      cardBrand: "visa",
      walletProvider: "",
      walletEmail: "",
      bankName: "",
      accountHolderName: "",
      accountNumber: "",
      routingNumber: "",
      accountType: "checking",
    })
    setMethodType("credit_card")
    setShowForm(false)
  }

  const getMethodDisplay = (method) => {
    switch (method.methodType) {
      case "credit_card":
      case "debit_card":
        return `${method.cardBrand?.toUpperCase() || "Card"} •••• ${method.cardNumber?.slice(-4)}`
      case "digital_wallet":
        return `${method.walletProvider} (${method.walletEmail})`
      case "bank_transfer":
        return `${method.bankName} •••• ${method.accountNumber?.slice(-4)}`
      default:
        return "Payment Method"
    }
  }

  if (loading) return <div className="loading">Loading payment methods...</div>

  return (
    <div className="payment-method-selector">
      <div className="payment-header">
        <h3>Payment Method</h3>
        <button onClick={() => setShowForm(!showForm)} className="add-payment-btn">
          {showForm ? "Cancel" : "+ Add Payment Method"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="payment-form">
          <div className="form-group">
            <label>Payment Method Type</label>
            <select value={methodType} onChange={(e) => setMethodType(e.target.value)} className="form-select">
              <option value="credit_card">Credit Card</option>
              <option value="debit_card">Debit Card</option>
              <option value="digital_wallet">Digital Wallet</option>
              <option value="bank_transfer">Bank Transfer</option>
            </select>
          </div>

          {(methodType === "credit_card" || methodType === "debit_card") && (
            <>
              <div className="form-group">
                <label>Cardholder Name</label>
                <input
                  type="text"
                  name="cardholderName"
                  value={formData.cardholderName}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                />
              </div>

              <div className="form-group">
                <label>Card Number</label>
                <input
                  type="text"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleChange}
                  placeholder="1234 5678 9012 3456"
                  maxLength="19"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Card Brand</label>
                  <select name="cardBrand" value={formData.cardBrand} onChange={handleChange}>
                    <option value="visa">Visa</option>
                    <option value="mastercard">Mastercard</option>
                    <option value="amex">American Express</option>
                    <option value="discover">Discover</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Expiry Month</label>
                  <input
                    type="text"
                    name="expiryMonth"
                    value={formData.expiryMonth}
                    onChange={handleChange}
                    placeholder="MM"
                    maxLength="2"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Expiry Year</label>
                  <input
                    type="text"
                    name="expiryYear"
                    value={formData.expiryYear}
                    onChange={handleChange}
                    placeholder="YY"
                    maxLength="2"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>CVV</label>
                  <input
                    type="text"
                    name="cvv"
                    value={formData.cvv}
                    onChange={handleChange}
                    placeholder="123"
                    maxLength="4"
                    required
                  />
                </div>
              </div>
            </>
          )}

          {methodType === "digital_wallet" && (
            <>
              <div className="form-group">
                <label>Wallet Provider</label>
                <select name="walletProvider" value={formData.walletProvider} onChange={handleChange} required>
                  <option value="">Select a provider</option>
                  <option value="Apple Pay">Apple Pay</option>
                  <option value="Google Pay">Google Pay</option>
                  <option value="PayPal">PayPal</option>
                </select>
              </div>

              <div className="form-group">
                <label>Wallet Email</label>
                <input
                  type="email"
                  name="walletEmail"
                  value={formData.walletEmail}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  required
                />
              </div>
            </>
          )}

          {methodType === "bank_transfer" && (
            <>
              <div className="form-group">
                <label>Bank Name</label>
                <input
                  type="text"
                  name="bankName"
                  value={formData.bankName}
                  onChange={handleChange}
                  placeholder="Your Bank"
                  required
                />
              </div>

              <div className="form-group">
                <label>Account Holder Name</label>
                <input
                  type="text"
                  name="accountHolderName"
                  value={formData.accountHolderName}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Account Number</label>
                  <input
                    type="text"
                    name="accountNumber"
                    value={formData.accountNumber}
                    onChange={handleChange}
                    placeholder="••••••••1234"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Routing Number</label>
                  <input
                    type="text"
                    name="routingNumber"
                    value={formData.routingNumber}
                    onChange={handleChange}
                    placeholder="021000021"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Account Type</label>
                <select name="accountType" value={formData.accountType} onChange={handleChange}>
                  <option value="checking">Checking</option>
                  <option value="savings">Savings</option>
                </select>
              </div>
            </>
          )}

          <div className="form-actions">
            <button type="button" onClick={resetForm} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" className="save-btn">
              Save Payment Method
            </button>
          </div>
        </form>
      )}

      <div className="payment-methods-list">
        {paymentMethods.length === 0 ? (
          <p className="no-methods">No payment methods saved. Add one to get started!</p>
        ) : (
          paymentMethods.map((method) => (
            <div
              key={method._id}
              className={`payment-card ${selectedPaymentId === method._id ? "selected" : ""}`}
              onClick={() => onSelectPayment(method._id, method)}
            >
              <div className="payment-content">
                <div className="payment-info">
                  <h4>{getMethodDisplay(method)}</h4>
                  <p className="payment-type">{method.methodType.replace(/_/g, " ")}</p>
                  {method.isDefault && <span className="default-badge">Default</span>}
                </div>
              </div>
              <div className="payment-actions">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDelete(method._id)
                  }}
                  className="delete-btn"
                >
                  Delete
                </button>
                {!method.isDefault && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleSetDefault(method._id)
                    }}
                    className="default-btn"
                  >
                    Set Default
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default PaymentMethodSelector
