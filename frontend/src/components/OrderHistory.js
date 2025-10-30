"use client"

import { useState, useEffect } from "react"
import "../styles/OrderHistory.css"

function OrderHistory({ userId, onBack }) {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState(null)

  useEffect(() => {
    fetchOrders()
  }, [userId])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await fetch(`http://localhost:5000/api/checkout/${userId}`)
      const data = await response.json()
      setOrders(data)
    } catch (error) {
      console.log("[v0] Error fetching orders:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "completed"
      case "pending":
        return "pending"
      case "cancelled":
        return "cancelled"
      default:
        return "pending"
    }
  }

  if (loading) return <div className="loading">Loading orders...</div>

  return (
    <div className="order-history-container">
      <button onClick={onBack} className="back-btn">
        ← Back
      </button>

      <h2>Order History</h2>

      {selectedOrder ? (
        <div className="order-detail">
          <button onClick={() => setSelectedOrder(null)} className="back-to-list-btn">
            ← Back to Orders
          </button>

          <div className="order-detail-header">
            <h3>Order #{selectedOrder._id.slice(-8).toUpperCase()}</h3>
            <span className={`status-badge ${getStatusColor(selectedOrder.status)}`}>{selectedOrder.status}</span>
          </div>

          <div className="order-detail-content">
            <div className="detail-section">
              <h4>Customer Name</h4>
              <p>{selectedOrder.customerInfo.fullName || "N/A"}</p>
            </div>

            <div className="detail-section">
              <h4>Order Date</h4>
              <p>{new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
            </div>

            <div className="detail-section">
              <h4>Delivery Address</h4>
              <p>{selectedOrder.customerInfo.streetAddress}</p>
              <p>
                {selectedOrder.customerInfo.city}, {selectedOrder.customerInfo.state}{" "}
                {selectedOrder.customerInfo.zipCode}
              </p>
              <p>{selectedOrder.customerInfo.country}</p>
            </div>

            <div className="detail-section">
              <h4>Phone Number</h4>
              <p>{selectedOrder.customerInfo.phoneNumber || "N/A"}</p>
            </div>

            <div className="detail-section">
              <h4>Items</h4>
              <div className="items-list">
                {selectedOrder.items.map((item, index) => (
                  <div key={index} className="item-row">
                    <span className="item-name">{item.name || "Product"}</span>
                    <span className="item-qty">Qty: {item.quantity}</span>
                    <span className="item-price">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="detail-section total">
              <h4>Total Amount</h4>
              <p className="total-price">${selectedOrder.totalPrice.toFixed(2)}</p>
            </div>

            {selectedOrder.paymentMethod && (
              <div className="detail-section">
                <h4>Payment Method</h4>
                <p>{selectedOrder.paymentMethod.replace(/_/g, " ")}</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="orders-list">
          {orders.length === 0 ? (
            <div className="no-orders">
              <p>No orders yet. Start shopping!</p>
            </div>
          ) : (
            orders.map((order) => (
              <div key={order._id} className="order-card" onClick={() => setSelectedOrder(order)}>
                <div className="order-header">
                  <div className="order-id">
                    <h4>Order #{order._id.slice(-8).toUpperCase()}</h4>
                    <p className="order-date">{new Date(order.createdAt).toLocaleDateString()}</p>
                    <p className="customer-name">Customer: {order.customerInfo.fullName || "N/A"}</p>
                  </div>
                  <span className={`status-badge ${getStatusColor(order.status)}`}>{order.status}</span>
                </div>

                <div className="order-body">
                  <div className="order-items">
                    <p className="items-count">{order.items.length} item(s)</p>
                    <div className="items-preview">
                      {order.items.slice(0, 3).map((item, index) => (
                        <span key={index} className="item-tag">
                          {item.name || "Product"}
                        </span>
                      ))}
                      {order.items.length > 3 && <span className="more-items">+{order.items.length - 3} more</span>}
                    </div>
                  </div>

                  <div className="order-address">
                    <p className="address-label">Delivered to:</p>
                    <p className="address-text">
                      {order.customerInfo.city}, {order.customerInfo.state}
                    </p>
                  </div>

                  <div className="order-total">
                    <p className="total-label">Total</p>
                    <p className="total-amount">${order.totalPrice.toFixed(2)}</p>
                  </div>
                </div>

                <div className="order-footer">
                  <button className="view-details-btn">View Details →</button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

export default OrderHistory
