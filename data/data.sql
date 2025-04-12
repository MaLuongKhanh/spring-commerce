-- Check and create the database if it doesn't exist
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'SpringCommerceDB')
BEGIN
    CREATE DATABASE SpringCommerceDB;
END
GO

USE SpringCommerceDB;
GO

-- Check and create the Categories table if it doesn't exist
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'categories')
BEGIN
    CREATE TABLE categories (
        id BIGINT PRIMARY KEY IDENTITY(1,1),
        name NVARCHAR(255) NOT NULL UNIQUE
    );
END
GO

-- Check and create the Products table if it doesn't exist
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'products')
BEGIN
    CREATE TABLE products (
        id BIGINT PRIMARY KEY IDENTITY(1,1),
        name NVARCHAR(255) NOT NULL,
        description NVARCHAR(MAX),
        price DECIMAL(18, 2) NOT NULL,
        brand NVARCHAR(255),
        color NVARCHAR(255),
        category_id BIGINT NOT NULL,
        FOREIGN KEY (category_id) REFERENCES categories(id)
    );
END
GO

-- Check and create the ShoppingCarts table if it doesn't exist
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'shopping_carts')
BEGIN
    CREATE TABLE shopping_carts (
        id BIGINT PRIMARY KEY IDENTITY(1,1)
    );
END
GO

-- Check and create the CartItems table if it doesn't exist
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'cart_items')
BEGIN
    CREATE TABLE cart_items (
        id BIGINT PRIMARY KEY IDENTITY(1,1),
        shopping_cart_id BIGINT NOT NULL,
        product_id BIGINT NOT NULL,
        quantity INT NOT NULL,
        FOREIGN KEY (shopping_cart_id) REFERENCES shopping_carts(id),
        FOREIGN KEY (product_id) REFERENCES products(id)
    );
END
GO

-- Check and create the Orders table if it doesn't exist
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'orders')
BEGIN
    CREATE TABLE orders (
        id BIGINT PRIMARY KEY IDENTITY(1,1),
        order_date DATETIME NOT NULL,
        customer_name NVARCHAR(255) NOT NULL,
        shipping_address NVARCHAR(255) NOT NULL,
        status NVARCHAR(20) NOT NULL,
        total_amount DECIMAL(18, 2) NOT NULL
    );
END
GO

-- Check and create the OrderItems table if it doesn't exist
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'order_items')
BEGIN
    CREATE TABLE order_items (
        id BIGINT PRIMARY KEY IDENTITY(1,1),
        order_id BIGINT NOT NULL,
        product_id BIGINT NOT NULL,
        quantity INT NOT NULL,
        price DECIMAL(18, 2) NOT NULL,
        FOREIGN KEY (order_id) REFERENCES orders(id),
        FOREIGN KEY (product_id) REFERENCES products(id)
    );
END
GO

-- Check and create the _user table if it doesn't exist
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'user')
BEGIN
    CREATE TABLE user (
        id INT PRIMARY KEY IDENTITY(1,1),
        firstname NVARCHAR(255),
        lastname NVARCHAR(255),
        email NVARCHAR(255) UNIQUE,
        password NVARCHAR(255),
        role NVARCHAR(20)
    );
END
GO

-- Insert sample data into the Categories table
IF NOT EXISTS (SELECT * FROM categories)
BEGIN
    INSERT INTO categories (name) VALUES
    ('Electronics'),
    ('Clothing'),
    ('Home & Kitchen');
END
GO

-- Insert sample data into the Products table
IF NOT EXISTS (SELECT * FROM products)
BEGIN
    INSERT INTO products (name, description, price, brand, color, category_id) VALUES
    ('Laptop', 'High-performance laptop', 1200.00, 'Dell', 'Black', 1),
    ('T-Shirt', 'Comfortable cotton t-shirt', 25.00, 'Nike', 'Blue', 2),
    ('Coffee Maker', 'Automatic coffee maker', 80.00, 'Breville', 'Silver', 3);
END
GO

-- Insert sample data into the user table
IF NOT EXISTS (SELECT * FROM user)
BEGIN
    INSERT INTO user (firstname, lastname, email, password, role) VALUES
    ('John', 'Doe', 'john.doe@example.com', 'password', 'USER');
END
GO