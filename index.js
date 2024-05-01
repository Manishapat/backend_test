// index.js
const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Create MySQL connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '12345',
    database: 'backend_test'
});

connection.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL database:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// Middleware
app.use(bodyParser.json());

// Routes
// Get all products
app.get('/api/products', (req, res) => {
    connection.query('SELECT * FROM products', (err, results) => {
        if (err) {
            console.error('Error retrieving products:', err);
            res.status(500).json({ error: 'Server error' });
            return;
        }
        res.json(results);
    });
});

// Insert a new product
app.post('/api/products', (req, res) => {
    const { name, description, price, availability } = req.body;
    connection.query('INSERT INTO products (name, description, price, availability) VALUES (?, ?, ?, ?)', 
        [name, description, price, availability], (err, result) => {
        if (err) {
            console.error('Error inserting product:', err);
            res.status(500).json({ error: 'Server error' });
            return;
        }
        res.status(201).json({ message: 'Product created successfully', id: result.insertId });
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
