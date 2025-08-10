const jwt = require('jsonwebtoken');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();


const DB_PATH = path.join(__dirname, '../../data/database.json');

async function readDb() {
    try {
        const raw = await fs.readFile(DB_PATH, 'utf8');
        return JSON.parse(raw);
    } catch (err) {
        if (err.code === 'ENOENT') {
            console.error(`Database file not found at ${DB_PATH}. Initialize it before running.`);
        }
    }
}

async function writeDb(db) {
    try {
        await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2), 'utf8');
        return true; // success flag
    } catch (err) {
        console.error(`Failed to write database file at ${DB_PATH}:`, err);
        return false; // failure flag
    }
}

async function createUser(req, res) {
    try {
        const userData = req.body || {};
        const { email, role } = userData;

        if (!email) return res.status(400).json({ error: 'Email is required.' });
        if (!role) return res.status(400).json({ error: 'Role is required.' });

        const db = await readDb();
        const userArray = Array.isArray(db.userData) ? db.userData : [];

        const exists = userArray.find(u => u.email === email);
        if (exists) return res.status(409).json({ error: 'Email already exists.' });

        // Generate a server-controlled ID;
        const id = crypto.randomUUID ? crypto.randomUUID() : crypto.randomBytes(16).toString('hex');
        const createdAt = new Date().toISOString();

        const newUser = {
            ...userData,  
            id,            
            createdAt
        };

        //in a hurry so we do not hash passwords but will do in phase 2
        userArray.push(newUser);
        db.userData = userArray;
        const saved = await writeDb(db);
        if (!saved) {
            return res.status(500).json({ error: 'Could not save user to database.' });
        }

        // Sign JWT
        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ error: 'JWT secret not configured on server.' });
        }

        const token = jwt.sign(
            { sub: id, email, role },
            process.env.JWT_SECRET,
            { expiresIn: '15m', issuer: 'watchspaces' }
        );

        return res.status(201).json({
            message: 'User created.',
            user: { id, email, role, createdAt },
            token
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message || 'Server error.' });
    }
}

module.exports = createUser;