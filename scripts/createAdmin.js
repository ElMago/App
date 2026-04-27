import sqlite3 from 'sqlite3';
import bcrypt from 'bcrypt';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, '../db.sqlite');
const db = new sqlite3.Database(dbPath);

async function createAdmin() {
  const hashedPassword = await bcrypt.hash('admin123', 10);
  db.run('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', ['admin', hashedPassword, 'admin'], function(err) {
    if (err) {
      if (err.message.includes('UNIQUE')) {
        console.log('Admin user already exists.');
      } else {
        console.error('Error creating admin:', err.message);
      }
    } else {
      console.log('Admin user created successfully (username: admin, password: admin123)');
    }
    db.close();
  });
}

createAdmin();
