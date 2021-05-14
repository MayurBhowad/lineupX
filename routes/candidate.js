const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Candidate = require('../models/Candidate');
const Job = require('../models/Jobs');

const { canRedirectDashboard, canRedirectLogin } = require('../middleware/candidateRedirect')

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('home', { title: 'candidate' });
});

// provide registration page to frontent
router.get('/register', canRedirectDashboard, (req, res) => {
    let action = '/candidate/register';
    res.render('Register', { user: 'Candidate', action, client: false })
})

// get POST data from front end registration form
router.post('/register', canRedirectDashboard, async (req, res) => {
    const { name, email, password, skills } = req.body;

    const newCandidate = new Candidate({ name, email, password, skills })
    if (typeof skills !== 'undefined') { newCandidate.skills = await skills.split(',') }
    const hashed = await bcrypt.hash(password, 10);
    newCandidate.password = hashed;
    newCandidate.save().then(candidate => res.redirect('/candidate/login')).catch(err => console.log(err));
})

router.get('/login', canRedirectDashboard, async (req, res) => {
    let action = '/candidate/login';
    res.render('Login', { user: 'Candidate', action })
})

router.post('/login', canRedirectDashboard, async (req, res) => {
    let action = '/candidate/login';
    const { email, password } = req.body;
    const candidate = await Candidate.findOne({ email });
    if (!candidate) {
        let error = 'User not Found!';
        return res.render('Login', { user: 'Candidate', action, error })
    }
    const valid = await bcrypt.compare(password, candidate.password)
    if (!valid) {
        let error = 'Password is incorrect!';
        return res.render('Login', { user: 'Candidate', action, error })
    }

    let actions = {
        logout: "/candidate/logout"
    }

    req.session.candidateId = candidate.id;
    req.session.name = candidate.name;
    req.session.isAuthenticated = true;
    req.session.isClient = false;
    req.session.actions = actions;
    res.redirect('/candidate/dashboard');
})

router.get('/dashboard', canRedirectLogin, (req, res) => {
    const session = req.session;
    res.render("candidates/Dashboard_can", { name: "no name", session })
})

router.post('/logout', (req, res) => {
    const session = req.session;
    session.destroy(err => {
        if (err) {
            return res.redirect('/candidate/dashboard')
        }

        res.clearCookie(process.env.SESS_NAME)
        res.redirect('/candidate/login')
    })
})

router.get('/alljobs', canRedirectLogin, (req, res) => {
    const { session } = req;
    Job.find({}).lean().then(jobs => {
        if (!jobs) {
            let error = 'Job not found!'
            return res.render('candidate', { session, error });
        }
        res.render('candidates/New_jobs', { session, jobs });

    }).catch(err => console.log(err))
})

module.exports = router;
