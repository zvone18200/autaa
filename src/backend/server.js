import express from 'express';
import { createConnection } from 'mysql';
import pkg from 'bcryptjs';
import cors from 'cors';
import bodyParser from 'body-parser';

const { hashSync, compareSync } = pkg;

const app = express();
const port = 5001;

app.use(cors());  // Ensure this is present and configured properly
app.use(bodyParser.json());

const db = createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'car_rental'
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        process.exit(1);
    }
    console.log('MySQL connected...');
});

app.post('/signup', (req, res) => {
    const { email, password } = req.body;
    const hashedPassword = hashSync(password, 8);

    const query = 'INSERT INTO users (email, password) VALUES (?, ?)';
    db.query(query, [email, hashedPassword], (err, result) => {
        if (err) {
            console.error('Error during user signup:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.status(201).send('User registered successfully!');
    });
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;

    const query = 'SELECT * FROM users WHERE email = ?';
    db.query(query, [email], (err, results) => {
        if (err) {
            console.error('Error during user login:', err);
            return res.status(500).send('Internal Server Error');
        }
        if (results.length === 0) {
            return res.status(404).send('User not found');
        }

        const user = results[0];
        const passwordIsValid = compareSync(password, user.password);
        if (!passwordIsValid) {
            return res.status(401).send('Invalid password');
        }

        res.status(200).json({ user: { email: user.email, id: user.id, isAdmin: user.isAdmin } });
    });
});




// Query to select all users
const query = 'SELECT * FROM users';

app.get('/users', (req, res) => {
    const query = 'SELECT * FROM users';

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error retrieving users:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.status(200).json(results);
    });
});

// Route to get car data
app.get('/cars', (req, res) => {
    const query = 'SELECT * FROM cars';
    db.query(query, (err, results) => {
      if (err) {
        console.error('Error fetching cars:', err);
        return res.status(500).send('Internal Server Error');
      }
      res.json(results);
    });
  });

  app.post('/add-car', (req, res) => {
    const { name, price, mileage } = req.body;

    const query = 'INSERT INTO cars (name, price, mileage) VALUES (?, ?, ?)';
    db.query(query, [name, price, mileage], (err, result) => {
        if (err) {
            console.error('Error adding car:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.status(201).send('Car added successfully!');
    });
});

app.get('/cars/:id', (req, res) => {
    const carId = req.params.id;
    const query = 'SELECT * FROM cars WHERE id = ?';

    db.query(query, [carId], (err, results) => {
        if (err) {
            console.error('Error fetching car:', err);
            return res.status(500).send('Internal Server Error');
        }
        if (results.length === 0) {
            return res.status(404).send('Car not found');
        }
        res.json(results[0]);
    });
});
  
  
app.post('/reservations', (req, res) => {
    const { userId, carId, startDate, endDate } = req.body;
    console.log("Received reservation request:", { userId, carId, startDate, endDate });
    
    const query = 'INSERT INTO reservations (user_id, car_id, start_date, end_date) VALUES (?, ?, ?, ?)';
    db.query(query, [userId, carId, startDate, endDate], (err, result) => {
        if (err) {
            console.error('Error making reservation:', err);
            return res.status(500).send('Internal Server Error');
        }
        console.log('Reservation successfully made:', result);
        res.status(200).send('Reservation successful');
    });
});

app.delete('/reservations/:id', (req, res) => {
    const reservationId = req.params.id;
    const query = 'DELETE FROM reservations WHERE id = ?';
  
    db.query(query, [reservationId], (err, result) => {
      if (err) {
        console.error('Error deleting reservation:', err);
        return res.status(500).send('Internal Server Error');
      }
      res.status(200).send('Reservation deleted successfully');
    });
  });
  

app.get('/reservations/:userId', (req, res) => {
    const userId = req.params.userId;
    const query = `
        SELECT reservations.*, cars.name as carName, cars.price as carPrice 
        FROM reservations 
        JOIN cars ON reservations.car_id = cars.id 
        WHERE reservations.user_id = ?
    `;

    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Error fetching reservations:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.json(results);
    });
});

app.get('/admin/reservations', (req, res) => {
    const query = `
        SELECT reservations.*, cars.name as carName, cars.price as carPrice, users.email as userEmail 
        FROM reservations 
        JOIN cars ON reservations.car_id = cars.id 
        JOIN users ON reservations.user_id = users.id
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching reservations:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.json(results);
    });
});


  

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
