// const express = require('express');
// const sqlite3 = require('sqlite3').verbose();
// const app = express();
// const port = 3000;

// app.use(express.json());

// // יצירת חיבור למסד הנתונים SQLite
// const db = new sqlite3.Database('./database.db', (err) => {
//   if (err) {
//     console.error('Error opening database: ' + err.message);
//   } else {
//     console.log('Connected to the SQLite database.');
//     // צור טבלה לדוגמה אם היא לא קיימת
//     db.run('CREATE TABLE IF NOT EXISTS yourTable (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, value INTEGER)');
//   }
// });

// app.get('/', (req, res) => {
//   res.send('Hello World!');
// });

// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });
// app.get('/api/data', (req, res) => {
//     db.all('SELECT * FROM yourTable', [], (err, rows) => {
//       if (err) {
//         res.status(500).send(err);
//       } else {
//         res.json(rows);
//       }
//     });
//   });
  
//   app.post('/api/data', (req, res) => {
//     const { name, value } = req.body;
//     db.run('INSERT INTO yourTable (name, value) VALUES (?, ?)', [name, value], function(err) {
//       if (err) {
//         res.status(500).send(err);
//       } else {
//         res.send('Data inserted successfully!');
//       }
//     });
//   });
// // קבלת נתונים
// fetch('http://localhost:3000/api/data')
//   .then(response => response.json())
//   .then(data => console.log(data))
//   .catch(error => console.error('Error:', error));

// // שליחת נתונים
// fetch('http://localhost:3000/api/data', {
//   method: 'POST',
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   body: JSON.stringify({ name: 'example', value: 123 }),
// })
// .then(response => response.text())
// .then(data => console.log(data))
// .catch(error => console.error('Error:', error));
  







const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const db = new sqlite3.Database(':memory:');

app.use(cors());
app.use(bodyParser.json());

db.serialize(() => {
    db.run('CREATE TABLE users (id INTEGER PRIMARY KEY, firstName TEXT, lastName TEXT, phoneNumber TEXT, email TEXT, role TEXT)');
    db.run('INSERT INTO users (firstName, lastName, phoneNumber, email, role) VALUES ("John", "Doe", "1234567890", "john@example.com", "Manager")');
    db.run('INSERT INTO users (firstName, lastName, phoneNumber, email, role) VALUES ("Jane", "Doe", "0987654321", "jane@example.com", "Waiter")');
  });
  
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
    db.run('INSERT INTO users (firstName, lastName, phoneNumber, email, role) VALUES (?, ?, ?, ?, ?)', [firstName, lastName, phoneNumber, email, role], function (err) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.json({ id: this.lastID, firstName, lastName, phoneNumber, email, role });
      }
    });
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
  
  const PORT = 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
