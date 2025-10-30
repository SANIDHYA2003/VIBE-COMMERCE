const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")
const mongoose = require("mongoose")

dotenv.config()

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/vibe-commerce")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err))

// Routes
app.use("/api/products", require("./routes/products"))
app.use("/api/cart", require("./routes/cart"))
app.use("/api/checkout", require("./routes/checkout"))
app.use("/api/payment", require("./routes/payment"))
app.use("/api/reviews", require("./routes/reviews"))
app.use("/api/addresses", require("./routes/addresses"))
app.use("/api/payment-methods", require("./routes/payment-methods"))
app.use("/api/user-profile", require("./routes/user-profile"))

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "Server is running" })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
