require("dotenv").config();

const { Client } = require("pg");

const SQL = `
    CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(45) UNIQUE NOT NULL,
        description TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS items (
        id SERIAL PRIMARY KEY,
        name VARCHAR(45) UNIQUE NOT NULL,
        quantity INTEGER CHECK (quantity >= 0) NOT NULL,
        price DECIMAL CHECK (price >= 0) NOT NULL,
        description TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        category_id INTEGER NOT NULL,
        FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE CASCADE
    );

    INSERT INTO categories (name, description)
    VALUES 
        ('Electronics', 'All kinds of electronic items'),
        ('Furniture', 'Various types of furniture for your home'),
        ('Books', 'A collection of books across genres and subjects'),
        ('Clothing', 'Trendy and comfortable clothing for all seasons');

    INSERT INTO items (name, quantity, price, description, category_id)
    VALUES
        ('Laptop', 50, 999.99, 'High-performance laptop for work and play', 1),
        ('Smartphone', 100, 599.99, 'Latest model with advanced features', 1),
        ('Headphones', 75, 49.99, 'Noise-cancelling over-ear headphones', 1),
        ('Dining Table', 20, 299.99, 'Wooden dining table for six people', 2),
        ('Office Chair', 40, 89.99, 'Ergonomic office chair with adjustable height', 2),
        ('Bookshelf', 15, 129.99, 'Spacious wooden bookshelf with multiple shelves', 2),
        ('Fiction Novel', 200, 15.99, 'Bestselling fiction novel by a popular author', 3),
        ('Cookbook', 50, 25.99, 'A cookbook with 100+ recipes from around the world', 3),
        ('Textbook', 30, 49.99, 'Comprehensive textbook for computer science students', 3),
        ('T-shirt', 150, 9.99, 'Casual cotton T-shirt available in multiple colors', 4),
        ('Jeans', 80, 39.99, 'Denim jeans for everyday wear', 4),
        ('Jacket', 30, 59.99, 'Winter jacket with thermal insulation', 4);
`;

async function main() {
    const client = new Client({
        host: process.env.PGHOST,
        user: process.env.PGUSER,
        database: process.env.PGDATABASE,
        password: process.env.PGPASSWORD,
        port: process.env.PGPORT
    });
    await client.connect();
    await client.query(SQL);
    await client.end();
}

main();