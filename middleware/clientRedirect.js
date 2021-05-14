module.exports = {
    cliRedirectLogin: (req, res, next) => {
        let action = '/client/login';
        if (!req.session.clientId) {
            res.redirect('/client/login')
        } else {
            next()
        }
    },
    cliRedirectDashboard: (req, res, next) => {
        console.log(req.session.isAuthenticated);
        if (req.session.clientId) {
            res.redirect('/client/dashboard')
        } else {
            next()
        }
    }
}
