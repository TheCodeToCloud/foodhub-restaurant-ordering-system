# 🍔 FoodHub - Restaurant Ordering System

![FoodHub](https://img.shields.io/badge/FoodHub-Restaurant%20System-orange?style=for-the-badge)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-00000F?style=for-the-badge&logo=mysql&logoColor=white)

FoodHub is a full-stack web application designed to simplify restaurant operations. It allows customers to browse menus, place food orders, and manage their profiles online. The system also equips restaurant administrators with a powerful dashboard to manage food items, categories, customer orders, and monitor daily sales.

---

## ✨ Key Features

### 🧑‍💼 Admin (Restaurant Manager)
- 📊 **Interactive Dashboard:** View total revenue, total orders, customers, and daily metrics.
- 🍔 **Food Management:** Add, edit, delete, and search food items. Upload food images directly.
- 📁 **Category Management:** Categorize food items (e.g., Pizza, Burger, Momo, Drinks).
- 📦 **Order Management:** View orders, track status (Pending, Preparing, Ready, Delivered, Cancelled).
- 👥 **Customer Management:** View registered customers and their order history.

### 🍽️ Customer/User
- 🔐 **Secure Authentication:** Register, login, and secure session management using JWT.
- 📜 **Browse Menu:** Search and filter food items by name, category, or price.
- 🛒 **Place Orders:** Easily add items to the cart and place orders.
- 🧾 **Order History:** View past orders and cancel pending orders.
- 👤 **Profile Management:** Manage personal details and profile picture.

---

## 🛠️ Technology Stack

- **Frontend:** React.js, Tailwind CSS, Vite, React Router DOM, Axios
- **Backend:** Node.js, Express.js (v5), JWT for Authentication, Multer for file uploads
- **Database:** MySQL

---

## 🚀 Getting Started

Follow these steps to set up the project locally on your machine.

### Prerequisites
- [Node.js](https://nodejs.org/) installed
- [XAMPP](https://www.apachefriends.org/) or any MySQL database server running

### 1. Database Setup
1. Open XAMPP and start the **MySQL** module.
2. Go to `phpMyAdmin` (usually `http://localhost/phpmyadmin`).
3. Create a new database named `restaurant_db`.
4. Import the `backend/config/schema.sql` file to create the tables.

### 2. Backend Setup
1. Open a terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables in `backend/.env`:
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=restaurant_db
   JWT_SECRET=your_super_secret_key
   ```
4. Start the backend server:
   ```bash
   npm run dev
   ```

### 3. Frontend Setup
1. Open a **new** terminal and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the React development server:
   ```bash
   npm run dev
   ```
4. Open your browser and visit `http://localhost:5173`.

---

## 👨‍💻 Default Admin Credentials
To access the Admin Dashboard, use the following credentials:
- **Email:** `admin@foodhub.com`
- **Password:** `admin@123`

---

## 📜 License
This project is created for educational purposes. Feel free to use and modify it.
