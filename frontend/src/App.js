"use client"

import { useState, useEffect, useCallback } from "react"
import "./App.css"
import ProductGrid from "./components/ProductGrid"
import ProductDetail from "./components/ProductDetail"
import Cart from "./components/Cart"
import Checkout from "./components/Checkout"
import UserProfile from "./components/UserProfile"
import OrderHistory from "./components/OrderHistory"

function App() {
  const [currentPage, setCurrentPage] = useState("products")
  const [selectedProductId, setSelectedProductId] = useState(null)
  const [userId, setUserId] = useState(() => {
    const savedUserId = localStorage.getItem("vibeComerceUserId")
    if (savedUserId) {
      return savedUserId
    }
    const newUserId = "user-" + Math.random().toString(36).substr(2, 9)
    localStorage.setItem("vibeComerceUserId", newUserId)
    return newUserId
  })
  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    fetchCartCount()
  }, [userId])

  const fetchCartCount = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/cart/${userId}`)
      if (!response.ok) throw new Error("Failed to fetch cart")
      const cart = await response.json()
      setCartCount(cart.items ? cart.items.length : 0)
    } catch (error) {
      console.log("[v0] Error fetching cart:", error)
      setCartCount(0)
    }
  }, [userId])

  const handleCartUpdate = useCallback(() => {
    fetchCartCount()
  }, [fetchCartCount])

  const handleOrderComplete = useCallback(() => {
    setCartCount(0)
    setCurrentPage("products")
  }, [])

  const handleViewProduct = (productId) => {
    setSelectedProductId(productId)
    setCurrentPage("product-detail")
  }

  const handleBackFromDetail = () => {
    setCurrentPage("products")
    setSelectedProductId(null)
  }

  return (
    <div className="App">
      <header className="header">
        <div className="header-container">
          <h1 className="logo" onClick={() => setCurrentPage("products")} style={{ cursor: "pointer" }}>
            Vibe Commerce
          </h1>
          <nav className="nav">
            <button
              className={`nav-btn ${currentPage === "products" ? "active" : ""}`}
              onClick={() => setCurrentPage("products")}
            >
              Products
            </button>
            <button
              className={`nav-btn ${currentPage === "cart" ? "active" : ""}`}
              onClick={() => setCurrentPage("cart")}
            >
              Cart ({cartCount})
            </button>
            <button
              className={`nav-btn ${currentPage === "orders" ? "active" : ""}`}
              onClick={() => setCurrentPage("orders")}
            >
              Orders
            </button>
            <button
              className={`nav-btn ${currentPage === "profile" ? "active" : ""}`}
              onClick={() => setCurrentPage("profile")}
            >
              Profile
            </button>
          </nav>
        </div>
      </header>

      <main className="main-content">
        {currentPage === "products" && (
          <ProductGrid userId={userId} onCartUpdate={handleCartUpdate} onViewProduct={handleViewProduct} />
        )}
        {currentPage === "product-detail" && (
          <ProductDetail
            productId={selectedProductId}
            userId={userId}
            onBack={handleBackFromDetail}
            onAddToCart={handleCartUpdate}
          />
        )}
        {currentPage === "cart" && (
          <Cart userId={userId} onCheckout={() => setCurrentPage("checkout")} onCartUpdate={handleCartUpdate} />
        )}
        {currentPage === "checkout" && (
          <Checkout userId={userId} onBack={() => setCurrentPage("cart")} onOrderComplete={handleOrderComplete} />
        )}
        {currentPage === "orders" && <OrderHistory userId={userId} onBack={() => setCurrentPage("products")} />}
        {currentPage === "profile" && <UserProfile userId={userId} onBack={() => setCurrentPage("products")} />}
      </main>
    </div>
  )
}

export default App
