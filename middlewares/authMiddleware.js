const admin = require('../firebase')
require('dotenv').config();

async function attachUser(req, res, next) {
    const sessionCookie = req.cookies.session

    try {
        if (!sessionCookie) {
            throw new Error("No session cookie found...")
        }

        const decodedClaims = await admin.auth().verifySessionCookie(sessionCookie, true);
        const userRecord = await admin.auth().getUser(decodedClaims.uid);

        if (userRecord.uid === process.env.adminUID) {
            res.locals.adminLoggedIn = true
        }else{
            res.locals.adminLoggedIn = false
        }
        
        req.user = decodedClaims;
        res.locals.userRecord = userRecord
        res.locals.isLoggedIn = true
        res.locals.timestamp = Date.now();
        res.locals.firebaseClientCred = Buffer.from(process.env.firebaseClientCred, 'base64').toString('utf-8');
        
        next();
    } catch {
        res.locals.isLoggedIn = false
        res.locals.adminLoggedIn = false
        res.locals.timestamp = Date.now();
        res.locals.firebaseClientCred = Buffer.from(process.env.firebaseClientCred, 'base64').toString('utf-8');
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