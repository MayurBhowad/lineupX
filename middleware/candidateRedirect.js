module.exports = {
    canRedirectLogin: (req, res, next) => {
        let action = '/candidate/login';
        if (!req.session.candidateId) {
            res.redirect('/candidate/login')
        } else {
            next()
        }
    },
    canRedirectDashboard: (req, res, next) => {
        console.log(req.session.isAuthenticated);
        if (req.session.candidateId) {
            res.redirect('/candidate/dashboard')
        } else {
            next()
        }
    }
}