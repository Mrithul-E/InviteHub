const admin = require('../firebase')

async function attachUser(req, res, next) {
    const sessionCookie = req.cookies.session

    try {
        if (!sessionCookie) {
            throw new Error("No session cookie found...")
        }

        const decodedClaims = await admin.auth().verifySessionCookie(sessionCookie, true);
        const userRecord = await admin.auth().getUser(decodedClaims.uid);

        req.user = decodedClaims;

        res.locals.userRecord = userRecord
        res.locals.isLoggedIn = true
        res.locals.adminLoggedIn = false
        res.locals.timestamp = Date.now();
        next();
    } catch {
        res.locals.isLoggedIn = false
        res.locals.adminLoggedIn = false
        res.locals.timestamp = Date.now();
        next();
    }
}

async function requireAuth(req, res, next) {
    if (!res.locals.isLoggedIn) {
        return res.redirect('/login')
    }
    
    next();
}

module.exports = {
    requireAuth, attachUser
}