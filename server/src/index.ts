/* eslint-disable @typescript-eslint/no-explicit-any */
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import db, { initDb } from './db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;
const JWT_SECRET = 'de-la-ribera-racing-secret-key-123';

app.use(cors());
app.use(express.json());

const uploadsDir = path.resolve(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

initDb();

// Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage });

// --- AUTH ROUTES ---

// Register
app.post('/api/auth/register', async (req, res) => {
  const { username, password, role } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const userRole = role === 'admin' ? 'admin' : 'user';

  db.run('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', [username, hashedPassword, userRole], function(err) {
    if (err) {
      if (err.message.includes('UNIQUE')) {
        return res.status(400).json({ error: 'Username already exists' });
      }
      return res.status(500).json({ error: 'Database error' });
    }
    res.status(201).json({ message: 'User registered successfully', userId: this.lastID });
  });
});

// Login
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user: any) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (!user) return res.status(400).json({ error: 'User not found' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: 'Invalid password' });

    const token = jwt.sign({ userId: user.id, role: user.role, username: user.username }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
  });
});

// Auth Middleware
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

const isAdmin = (req: any, res: any, next: any) => {
  if (req.user.role !== 'admin') return res.sendStatus(403);
  next();
};

// --- EVENTS ROUTES ---

app.get('/api/events', authenticateToken, (req, res) => {
  db.all('SELECT * FROM events', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.get('/api/events/:id', authenticateToken, (req, res) => {
  db.get('SELECT * FROM events WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(row);
  });
});

app.post('/api/events', authenticateToken, isAdmin, (req, res) => {
  const { name, date, location, description } = req.body;
  db.run('INSERT INTO events (name, date, location, description) VALUES (?, ?, ?, ?)',
    [name, date, location, description], function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID });
  });
});

app.put('/api/events/:id', authenticateToken, isAdmin, (req, res) => {
  const { name, date, location, description } = req.body;
  db.run('UPDATE events SET name = ?, date = ?, location = ?, description = ? WHERE id = ?',
    [name, date, location, description, req.params.id], function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
  });
});

app.delete('/api/events/:id', authenticateToken, isAdmin, (req, res) => {
  db.run('DELETE FROM events WHERE id = ?', [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    // Also delete associated cars and votes
    db.run('DELETE FROM cars WHERE eventId = ?', [req.params.id]);
    db.run('DELETE FROM votes WHERE eventId = ?', [req.params.id]);
    res.json({ success: true });
  });
});

// --- CARS ROUTES ---

app.get('/api/events/:eventId/cars', authenticateToken, (req, res) => {
  db.all('SELECT * FROM cars WHERE eventId = ?', [req.params.eventId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/events/:eventId/cars', authenticateToken, isAdmin, upload.single('photo'), (req, res) => {
  const { makeModel, owner, participantNumber, category } = req.body;
  const photoUrl = req.file ? `/uploads/${req.file.filename}` : null;

  db.run('INSERT INTO cars (eventId, makeModel, owner, participantNumber, category, photoUrl) VALUES (?, ?, ?, ?, ?, ?)',
    [req.params.eventId, makeModel, owner, participantNumber, category, photoUrl], function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, photoUrl });
  });
});

app.put('/api/cars/:id', authenticateToken, isAdmin, upload.single('photo'), (req, res) => {
  const { makeModel, owner, participantNumber, category } = req.body;
  let updateQuery = 'UPDATE cars SET makeModel = ?, owner = ?, participantNumber = ?, category = ? WHERE id = ?';
  let params = [makeModel, owner, participantNumber, category, req.params.id];

  if (req.file) {
    updateQuery = 'UPDATE cars SET makeModel = ?, owner = ?, participantNumber = ?, category = ?, photoUrl = ? WHERE id = ?';
    params = [makeModel, owner, participantNumber, category, `/uploads/${req.file.filename}`, req.params.id];
  }

  db.run(updateQuery, params, function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

app.delete('/api/cars/:id', authenticateToken, isAdmin, (req, res) => {
  db.run('DELETE FROM cars WHERE id = ?', [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    db.run('DELETE FROM votes WHERE carId = ?', [req.params.id]);
    res.json({ success: true });
  });
});

// --- VOTING ROUTES ---

app.post('/api/events/:eventId/vote', authenticateToken, (req: any, res) => {
  const { carId } = req.body;
  const userId = req.user.userId;
  const eventId = req.params.eventId;

  db.run('INSERT INTO votes (userId, eventId, carId) VALUES (?, ?, ?)',
    [userId, eventId, carId], function(err) {
      if (err) {
        if (err.message.includes('UNIQUE')) {
          return res.status(400).json({ error: 'You have already voted in this event' });
        }
        return res.status(500).json({ error: err.message });
      }
      res.json({ success: true });
  });
});

app.get('/api/events/:eventId/votes', authenticateToken, (req, res) => {
  db.all('SELECT carId, COUNT(*) as voteCount FROM votes WHERE eventId = ? GROUP BY carId', [req.params.eventId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.get('/api/events/:eventId/myvote', authenticateToken, (req: any, res) => {
  db.get('SELECT carId FROM votes WHERE eventId = ? AND userId = ?', [req.params.eventId, req.user.userId], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(row || { carId: null });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
