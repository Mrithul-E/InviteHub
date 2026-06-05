const admin = require('../firebase')

async function checkAuth(req, res, next) {
    const sessionCookies = req.cookies.session || ''

    try {
        const decodedClaims = await admin.auth().verifySessionCookie(sessionCookies, true);
        req.user = decodedClaims;
        next();
    } catch {
        res.redirect('/login')
    }
}

module.exports = checkAuth;