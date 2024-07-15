require('dotenv').config();
const mysql = require('mysql2');

// MySQL database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the MySQL database.');
});

// Function to get all events from AllEvents
const getAllEvents = (req, res) => {
  const sql = 'SELECT EventID, Name, Date, Place FROM AllEvents';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching events:', err);
      return res.status(500).json({ error: err });
    }
    res.json(results);
  });
};

// Function to create a new event in AllEvents
const createEvent = (req, res) => {
  const { Name, Date, Place } = req.body;

  const sql = 'INSERT INTO AllEvents (Name, Date, Place) VALUES (?, ?, ?)';
  db.query(sql, [Name, Date, Place], (err, results) => {
    if (err) {
      console.error('Error creating event:', err);
      return res.status(500).json({ error: 'Internal Server Error', details: err.message });
    }
    res.json({ message: 'Event created successfully', eventId: results.insertId });
  });
};

// Function to update an event in AllEvents
const updateEvent = (req, res) => {
  const { id } = req.params;
  const { Name, Date, Place } = req.body;

  const sql = 'UPDATE AllEvents SET Name = ?, Date = ?, Place = ? WHERE EventID = ?';
  db.query(sql, [Name, Date, Place, id], (err, results) => {
    if (err) {
      console.error('Error updating event:', err);
      return res.status(500).json({ error: err });
    }
    res.json({ message: 'Event updated successfully' });
  });
};

// Function to delete an event from AllEvents
const deleteEvent = (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM AllEvents WHERE EventID = ?';
  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error('Error deleting event:', err);
      return res.status(500).json({ error: err });
    }
    res.json({ message: 'Event deleted successfully' });
  });
};

// Function to create a new user
const UserData = (req, res) => {
  const { username, email, password } = req.body;
  
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const sql = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
  db.query(sql, [username, email, password], (err, results) => {
    if (err) {
      console.error('Error creating user data:', err);
      return res.status(500).json({ error: err });
    }
    res.json({ message: 'User data created successfully' });
  });
};

// Function to get all users
const getUsers = (req, res) => {
  const sql = 'SELECT id, username, email, password FROM users';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching users:', err);
      return res.status(500).json({ error: err });
    }
    res.json(results);
  });
};

module.exports = { getAllEvents, createEvent, updateEvent, deleteEvent, UserData, getUsers };
