const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Client = require('../models/Client');
const Job = require('../models/Jobs');
const Application = require('../models/Application');

const redirectLogin = (req, res, next) => {
    let action = '/client/login';
    if (!req.session.clientId) {
        res.redirect('/client/login')
    } else {
        next()
    }
}

const redirectDashboard = (req, res, next) => {
    console.log(req.session.isAuthenticated);
    if (req.session.clientId) {
        res.redirect('/client/dashboard')
    } else {
        next()
    }
}

/* GET home page. */
router.get('/', (req, res, next) => {
    res.render('home', { title: 'client' });
});

router.get('/register', redirectDashboard, (req, res) => {
    let action = '/client/register';

    res.render('Register', { user: 'Employer', action, client: true })
})

router.post('/register', redirectDashboard, async (req, res) => {
    const { name, email, company, password } = req.body;
    const newClient = new Client({ name, email, company, password });
    const hashed = await bcrypt.hash(password, 10);
    newClient.password = hashed;
    newClient.save().then(client => res.redirect('/client/login')).catch(err => console.log(err));
})

router.get('/login', redirectDashboard, (req, res) => {
    let action = '/client/login';
    res.render('Login', { user: 'Employer', action })
})

router.post('/login', redirectDashboard, async (req, res) => {
    let action = `"/client/login"`;
    const { email, password } = req.body;
    const client = await Client.findOne({ email });
    if (!client) {
        let error = 'User not Found!';
        return res.render('Login', { user: 'Employer', action, error })
    }
    const valid = await bcrypt.compare(password, client.password)
    if (!valid) {
        let error = 'Password is incorrect!';
        return res.render('Login', { user: 'Employer', action, error })
    }

    let actions = {
        logout: "/client/logout",
        postjob: "/client/postjob"
    }

    req.session.clientId = client.id;
    req.session.name = client.name;
    req.session.isAuthenticated = true;
    req.session.isClient = true;
    req.session.actions = actions;
    res.redirect('/client/dashboard');
})


router.get('/dashboard', redirectLogin, (req, res) => {
    const session = req.session;
    res.render("clients/Dashboard_cli", { name: "no name", session })
})

router.post('/logout', (req, res) => {
    const session = req.session;
    session.destroy(err => {
        if (err) {
            return res.redirect('/client/home')
        }

        res.clearCookie(process.env.SESS_NAME)
        res.redirect('/client/login')
    })
})


router.get('/postjob', redirectLogin, (req, res) => {
    console.log(req.session);
    const session = req.session;
    res.render('clients/Add_job', { session })
})

router.post('/postjob', redirectLogin, async (req, res) => {
    const { title, designation, company, location, skills, description } = req.body;
    const { clientId } = req.session;
    const newJob = new Job({ title, designation, company, location, skills, description, clientId })
    if (typeof skills !== 'undefined') { newJob.skills = await skills.split(',') }
    newJob.save().then(() => res.redirect('/client/dashboard'))
})

router.get('/showjobs', (req, res) => {
    const session = req.session;
    Job.find({ clientId: session.clientId }).lean().then(jobs => {
        console.log(jobs);
        if (!jobs) {
            let error = 'jobs not found!'
            return res.render('clients/Show_jobs', { session, error })
        }
        res.render('clients/Show_jobs', { session, jobs })
    })

})

router.get('/jobapplications/:id', (req, res) => {
    const { session } = req;
    const { id } = req.params;
    Application.find({ jobId: id }).lean().populate('Candidate', ['name', 'skills']).then(applications => {
        console.log(applications);
        if (!applications.length > 0) {
            let error = 'application not found!';
            return res.render('clients/Show_apps', { session, error })
        }
    })
})

module.exports = router;
