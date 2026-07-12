-- 1. Insert Dummy Categories
INSERT INTO Categories (category_name) VALUES
('Burger'), ('Pizza'), ('Beverages'), ('Desserts'), ('Salads');

-- 2. Insert Dummy Foods
INSERT INTO Foods (food_name, category_id, price, description, quantity, image) VALUES
('Classic Cheeseburger', 1, 5.99, 'Juicy beef patty with melted cheese', 50, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80'),
('Pepperoni Pizza', 2, 12.99, 'Large pizza with pepperoni and extra cheese', 20, 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500&q=80'),
('Iced Caramel Macchiato', 3, 4.50, 'Chilled espresso with caramel and milk', 100, 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=500&q=80'),
('Chocolate Lava Cake', 4, 6.99, 'Warm chocolate cake with a gooey center', 30, 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500&q=80'),
('Caesar Salad', 5, 8.99, 'Crisp romaine lettuce with Caesar dressing', 40, 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=500&q=80');

-- 3. Insert Dummy Customers
INSERT INTO Users (fullname, email, password, phone, address, role) VALUES
('John Doe', 'john@example.com', 'dummyhash1', '1234567890', '123 Main St', 'customer'),
('Jane Smith', 'jane@example.com', 'dummyhash2', '0987654321', '456 Oak Ave', 'customer'),
('Alice Johnson', 'alice@example.com', 'dummyhash3', '5551234567', '789 Pine Rd', 'customer');

-- 4. Insert Dummy Orders
-- Assuming John is id 2, Jane is 3, Alice is 4 (since id 1 is the admin seeded earlier)
-- Assuming Foods are ids 1 to 5
INSERT INTO Orders (user_id, food_id, quantity, total_price, status) VALUES
(2, 1, 2, 11.98, 'Delivered'),
(3, 2, 1, 12.99, 'Preparing'),
(4, 3, 3, 13.50, 'Pending'),
(2, 4, 1, 6.99, 'Ready'),
(3, 5, 2, 17.98, 'Delivered');
