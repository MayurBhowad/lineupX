const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Candidate = require('../models/Candidate');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('home', { title: 'candidate' });
});

/**
 * provide registration page to frontent
 */
router.get('/register', (req, res) => {
    let action = '/candidate/register';
    res.render('Register', { user: 'Candidate', action, client: false })
})

/**
 * get POST data from front end registration form
 */
router.post('/register', (req, res) => {
    const { name, email, password } = req.body;
    console.log('candidate: ', name, email, password);
})

router.get('/login', (req, res) => {
    let action = '/candidate/login';
    res.render('Login', { user: 'Candidate', action })
})

router.post('/login', (req, res) => {
    const { email, password } = req.body;
    console.log('candidate: ', email, password);
})

module.exports = router;
