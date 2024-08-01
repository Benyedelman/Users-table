const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const db = new sqlite3.Database('./database.db');

app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 


// db.serialize(() => {
db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, firstName TEXT, lastName TEXT, phoneNumber TEXT, email TEXT, role TEXT)');
// });

// Get all users
app.get('/users', (req, res) => {
    db.all('SELECT * FROM users', (err, rows) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(rows);
        }
    });
});

// Add a new user
app.post('/users', (req, res) => {
    const { firstName, lastName, phoneNumber, email, role } = req.body;
    db.run('INSERT INTO users (firstName, lastName, phoneNumber, email, role) VALUES (?, ?, ?, ?, ?)', 
        [firstName, lastName, phoneNumber, email, role], 
        function (err) {
            if (err) {
                res.status(500).send(err);
            } else {
                res.json({ id: this.lastID, firstName, lastName, phoneNumber, email, role });
            }
        }
    );
});

app.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const { firstName, lastName, phoneNumber, email, role } = req.body;
    db.run('UPDATE users SET firstName = ?, lastName = ?, phoneNumber = ?, email = ?, role = ? WHERE id = ?', 
        [firstName, lastName, phoneNumber, email, role, id], 
        function (err) {
            if (err) {
                res.status(500).send(err);
            } else {
                res.json({ id, firstName, lastName, phoneNumber, email, role });
            }
        }
    );
});

// Delete a user
app.delete('/users/:id', (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM users WHERE id = ?', id, function (err) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send({ message: 'User deleted successfully' });
        }
    });
});

// התחלת השרת
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://192.168.1.44:${PORT}`);
});

