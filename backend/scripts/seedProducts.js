const mongoose = require("mongoose")
const Product = require("../models/Product")
require("dotenv").config()

const products = [
  {
    name: "Wireless Headphones",
    description: "Premium noise-cancelling wireless headphones with 30-hour battery life",
    price: 199.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop",
    category: "Electronics",
    stock: 50,
  },
  {
    name: "Smart Watch",
    description: "Advanced fitness tracking and health monitoring smartwatch",
    price: 299.99,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop",
    category: "Electronics",
    stock: 35,
  },
  {
    name: "USB-C Cable",
    description: "Fast charging USB-C cable with 10-year durability guarantee",
    price: 19.99,
    image: "https://images.unsplash.com/photo-1625948515291-69613efd103f?w=500&h=500&fit=crop",
    category: "Accessories",
    stock: 200,
  },
  {
    name: "Portable Speaker",
    description: "Waterproof Bluetooth speaker with 360-degree sound",
    price: 79.99,
    image: "https://images.unsplash.com/photo-1589003077984-894e133da26d?w=500&h=500&fit=crop",
    category: "Electronics",
    stock: 45,
  },
  {
    name: "Phone Case",
    description: "Durable protective phone case with premium materials",
    price: 29.99,
    image: "https://images.unsplash.com/photo-1592286927505-1def25115558?w=500&h=500&fit=crop",
    category: "Accessories",
    stock: 150,
  },
  {
    name: "Screen Protector",
    description: "Tempered glass screen protector with easy installation",
    price: 14.99,
    image: "https://images.unsplash.com/photo-1611532736579-6b16e2b50449?w=500&h=500&fit=crop",
    category: "Accessories",
    stock: 300,
  },
]

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/vibe-commerce")
    console.log("Connected to MongoDB")

    // Clear existing products
    await Product.deleteMany({})
    console.log("Cleared existing products")

    // Insert new products
    const result = await Product.insertMany(products)
    console.log(`Successfully seeded ${result.length} products`)

    await mongoose.connection.close()
    console.log("Database connection closed")
  } catch (error) {
    console.error("Error seeding database:", error)
    process.exit(1)
  }
}

seedDatabase()
