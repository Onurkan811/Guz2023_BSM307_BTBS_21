const express = require('express');
const mongoose = require('mangoose');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const cors = require('cors');
const User = require('./models/User');

mongoose.connect(process.env.MONGO_URL, (err)=>{
    if (err) throw err;
});
const jwtSecret = process.env.JWT_SECRET;

const app = express();
app.use(express.json());
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
}));

app.get('/test', (req,res) => {
    res.json('test works');
});

app.post('/register', async (req,res) =>{
    const {username,password} = req.body;
    const createdUser = await User.create({username,password});
    jwt.sign({userId:createdUser, id}, jwtSecret, {}, (err,token)=>{
        if(err) throw err;
        res.status(500).json('register ok')
    });
});

app.listen(4000);
