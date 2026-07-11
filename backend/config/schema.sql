-- ============================================================
-- Restaurant Ordering System - Database Schema Migration
-- Run this file to initialize all required tables.
-- Each CREATE TABLE uses IF NOT EXISTS to be safely re-runnable.
-- ============================================================

-- 1. Users Table
CREATE TABLE IF NOT EXISTS Users (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  fullname      VARCHAR(150)  NOT NULL,
  email         VARCHAR(150)  NOT NULL UNIQUE,
  password      VARCHAR(255)  NOT NULL,
  phone         VARCHAR(20),
  address       VARCHAR(255),
  role          VARCHAR(20)   NOT NULL DEFAULT 'customer',
  profile_image VARCHAR(255)
);

-- 2. Categories Table
CREATE TABLE IF NOT EXISTS Categories (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  category_name VARCHAR(100)  NOT NULL UNIQUE
);

-- 3. Foods Table
CREATE TABLE IF NOT EXISTS Foods (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  food_name   VARCHAR(150)   NOT NULL,
  category_id INT            NOT NULL,
  price       DECIMAL(10,2)  NOT NULL,
  description TEXT,
  ingredients TEXT,
  quantity    INT            NOT NULL DEFAULT 0,
  image       VARCHAR(255),
  CONSTRAINT fk_foods_category
    FOREIGN KEY (category_id) REFERENCES Categories(id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
);

-- 4. Orders Table
CREATE TABLE IF NOT EXISTS Orders (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  user_id     INT            NOT NULL,
  food_id     INT            NOT NULL,
  quantity    INT            NOT NULL DEFAULT 1,
  total_price DECIMAL(10,2)  NOT NULL,
  order_date  TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  status      VARCHAR(50)    NOT NULL DEFAULT 'Pending',
  CONSTRAINT fk_orders_user
    FOREIGN KEY (user_id)  REFERENCES Users(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_orders_food
    FOREIGN KEY (food_id)  REFERENCES Foods(id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
);
