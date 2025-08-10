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

async function verifyUser(req, res){
    try{
        const userData = req.body || {};

        const {email, password} = userData;

        if(!email) return res.status(400).json({error: 'Email is required'});
        if(!password) return res.status(400).json({error: 'Password is required'});

        const db = await readDb();
        const userArray = db.userData;

        //find user with email
        const exists = userArray.find(user => user.email === email);
        if(!exists) return res.status(404).json({error: "User not found"});

        //compare password
        if(exists.password !== password) return res.status(400).json({error: "Wrong credentials, try again"});

        const role = exists.role;
        const id = exists.id;

        const token = jwt.sign(
            { sub: id, email, role},
            process.env.JWT_SECRET,
            { expiresIn: '15m', issuer: 'watchspaces' }
        );

        return res.status(201).json({
            message: 'Succesful LogIn',
            user: {email, role},
            token
        });
    }
    catch(err){

    }
}

module.exports = verifyUser