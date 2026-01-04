# 👟 Sneaker Market Web App

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/BlackCoffeeCode/SneakerMarketWebApp)
<br />
**[🔴 Live Demo](https://sneakermarketwebapp.onrender.com/)**

A modern, full-stack e-commerce platform designed for sneaker enthusiasts. built with the **MERN Stack** (MongoDB, Express.js, React, Node.js) and styled with **Tailwind CSS**.

## 🚀 Features

-   **User Authentication**: Secure Login & Registration (JWT-based).
-   **Product Catalog**: Browse sneakers with advanced filtering (Category, Brand, Price, Search).
-   **Product Details**: High-quality images, sizing options, and detailed descriptions.
-   **Shopping Cart**: dynamic cart management with real-time price updates.
-   **Checkout Flow**: Integrated checkout process with address validation and payment method selection.
-   **Admin Dashboard**: Manage products, view orders, and control inventory.
-   **Responsive Design**: Fully optimized for mobile, tablet, and desktop.
-   **AR Preview**: (Experimental) View sneakers in 3D/AR.

## 🛠️ Tech Stack

-   **Frontend**: React.js, Vite, Tailwind CSS, Framer Motion, Lucide React
-   **Backend**: Node.js, Express.js
-   **Database**: MongoDB (Mongoose)
-   **State Management**: React Context API
-   **Routing**: React Router DOM

## ⚙️ Installation & Setup

### Prerequisites

-   Node.js (v14+)
-   MongoDB Atlas URI (or local instance)

### 1. Clone the Repository

```bash
git clone https://github.com/BlackCoffeeCode/SneakerMarketWebApp.git
cd SneakerMarketWebApp
```

### 2. Backend Setup

Navigate to the backend directory and install dependencies:

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder with the following credentials:

```env
PORT=5001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

Start the backend server:

```bash
npm run dev
```

### 3. Frontend Setup

Navigate to the frontend directory and install dependencies:

```bash
cd ../frontend
npm install
```

Start the frontend development server:

```bash
npm run dev
```

The application should now be running at `http://localhost:5173`.

## 📂 Project Structure

```
Sneaker-app/
├── backend/            # Express API & Database Models
│   ├── config/         # DB Connection
│   ├── controllers/    # Route Logic
│   ├── models/         # Mongoose Schemas (Sneaker, User, Order)
│   ├── routes/         # API Routes
│   └── seed.js         # Database Seeding Script
│
└── frontend/           # React Client
    ├── public/         # Static Assets
    └── src/
        ├── components/ # Reusable UI Components
        ├── context/    # Global State (Auth, Cart)
        ├── pages/      # Page Views (Home, Product, Cart)
        └── services/   # API Helpers
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🤝 Team
Piyush Dhakad - Ethical Hacker, Gen AI, Prompt Engineer | 
Roshni Dodani - Full Stack Developer, UI/UX Designer

## 📄 License

This project is licensed under the MIT License.
