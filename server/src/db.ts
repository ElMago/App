import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, '../../db.sqlite');
const db = new sqlite3.Database(dbPath);

export const initDb = () => {
  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'user'
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        date TEXT NOT NULL,
        location TEXT NOT NULL,
        description TEXT
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS cars (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        eventId INTEGER NOT NULL,
        makeModel TEXT NOT NULL,
        owner TEXT NOT NULL,
        participantNumber TEXT NOT NULL,
        category TEXT NOT NULL,
        photoUrl TEXT,
        FOREIGN KEY(eventId) REFERENCES events(id)
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS votes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL,
        eventId INTEGER NOT NULL,
        carId INTEGER NOT NULL,
        UNIQUE(userId, eventId),
        FOREIGN KEY(userId) REFERENCES users(id),
        FOREIGN KEY(eventId) REFERENCES events(id),
        FOREIGN KEY(carId) REFERENCES cars(id)
      )
    `);

    console.log('Database initialized successfully');
  });
};

export default db;
