# Vibe Commerce - E-Commerce Application Setup Guide

## Project Overview
Vibe Commerce is a full-stack e-commerce application built with:
- **Backend**: Node.js + Express + MongoDB
- **Frontend**: React
- **Features**: Product browsing, shopping cart, checkout

## Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

## Installation & Setup

### 1. Backend Setup

\`\`\`bash
cd backend
npm install
\`\`\`

#### Configure Environment Variables
Create a `.env` file in the `backend` directory:

\`\`\`env
MONGODB_URI=mongodb://localhost:27017/vibe-commerce
PORT=5000
NODE_ENV=development
\`\`\`

**For MongoDB Atlas (Cloud):**
\`\`\`env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/vibe-commerce
PORT=5000
NODE_ENV=development
\`\`\`

#### Seed Sample Products
\`\`\`bash
npm run seed
\`\`\`

#### Start Backend Server
\`\`\`bash
npm run dev
\`\`\`

The backend will run on `http://localhost:5000`

### 2. Frontend Setup

\`\`\`bash
cd frontend
npm install
\`\`\`

#### Start Frontend Development Server
\`\`\`bash
npm start
\`\`\`

The frontend will run on `http://localhost:3000`

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (for testing)

### Cart
- `GET /api/cart/:userId` - Get user's cart
- `POST /api/cart/:userId/add` - Add item to cart
- `POST /api/cart/:userId/remove` - Remove item from cart
- `POST /api/cart/:userId/update` - Update item quantity
- `POST /api/cart/:userId/clear` - Clear entire cart

### Checkout
- `POST /api/checkout` - Create order from cart
- `GET /api/checkout/:userId` - Get user's orders

## Project Structure

\`\`\`
vibe-commerce/
├── backend/
│   ├── models/
│   │   ├── Product.js
│   │   ├── Cart.js
│   │   └── Order.js
|   |   |__ ...
│   ├── routes/
│   │   ├── products.js
│   │   ├── cart.js
│   │   └── checkout.js
|   |   |__ ...
│   ├── scripts/
│   │   └── seedProducts.js
│   ├── server.js
│   ├── .env
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ProductGrid.js
│   │   │   ├── ProductCard.js
│   │   │   ├── Cart.js
│   │   │   └── Checkout.js
│   │   │   └── ....
│   │   ├── styles/
│   │   │   ├── ProductGrid.css
│   │   │   ├── ProductCard.css
│   │   │   └── Checkout.css
│   │   │   └── ....`
│   │   ├── App.js
│   │   └── App.css
│   └── package.json
└── SETUP_GUIDE.md
\`\`\`

## Features

### Product Browsing
- View all available products in a responsive grid
- See product details (name, description, price, category)
- Add products to cart with custom quantity

### Shopping Cart
- View all items in cart
- Update item quantities
- Remove items from cart
- See real-time total price

### Checkout
- Enter customer information (name, email, address, city, zip)
- Place order with cart items
- Order confirmation page

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running locally or check your connection string
- For MongoDB Atlas, verify your IP is whitelisted

### CORS Error
- Backend CORS is configured to accept requests from `http://localhost:3000`
- If running on different ports, update CORS settings in `backend/server.js`

### Port Already in Use
- Backend: Change PORT in `.env` file
- Frontend: Run `PORT=3001 npm start`

## Next Steps
- Add user authentication
- Implement payment processing (Stripe)
- Add product search and filtering
- Implement order history page
- Add admin dashboard for product management

## Support
For issues or questions, check the console logs for detailed error messages.
