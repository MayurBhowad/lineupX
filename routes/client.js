const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Client = require('../models/Client');

/* GET home page. */
router.get('/', (req, res, next) => {
    res.render('home', { title: 'client' });
});

router.get('/register', (req, res) => {
    let action = '/client/register';

    res.render('Register', { user: 'Employer', action, client: true })
})

router.post('/register', async (req, res) => {
    const { name, email, company, password } = req.body;
    const newClient = new Client({ name, email, company, password });
    const hashed = await bcrypt.hash(password, 10);
    newClient.password = hashed;
    newClient.save().then(client => res.status(201).json(client)).catch(err => console.log(err));
})

router.get('/login', (req, res) => {
    let action = '/client/login';
    res.render('Login', { user: 'Employer', action })
})

router.post('/login', async (req, res) => {
    let action = '/client/login';
    const { email, password } = req.body;
    const client = await Client.findOne({ email });
    if (!client) {
        let error = 'User not Found!';
        res.render('Login', { user: 'Employer', action, error })
    }
    const valid = await bcrypt.compare(password, client.password)
    if (!valid) {
        let error = 'Password is incorrect!';
        res.render('Login', { user: 'Employer', action, error })
    }
    res.render("Dashboard", { name: client.name })
})

module.exports = router;
