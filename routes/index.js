const express = require('express');
const router = express.Router();
const admin = require("../firebase") 
const rateLimit = require("express-rate-limit")
const {saveUserLogin} = require("../service/userService")

const sessionLoginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    message: {
        error: "Too many login attempts. Please try again after some times."
    },
    standardHeaders: true,
    legacyHeaders: false
})


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'InviteHub' });
});

router.get("/login", (req, res) => {
  res.render('login', {"title" : "InviteHub - Login"})
})

router.post("/sessionLogin", sessionLoginLimiter, async (req,res) => {
  const idToken = req.body.idToken;
  const expiresIn = 60 * 60 * 24 * 13 * 1000;

  try {
    const sessionCookie = await admin.auth().createSessionCookie(idToken, { expiresIn: expiresIn });
    const options = {maxAge: expiresIn, httpOnly: true, secure: false};

    const decodedClaims = await admin.auth().verifySessionCookie(sessionCookie, true);
    const userRecord = await admin.auth().getUser(decodedClaims.uid);
    
    await saveUserLogin(userRecord)

    res.cookie('session', sessionCookie, options)
    res.status(200).send({status: "success"})
  } catch (err) {
    console.error(err)
    res.status(401).send('Unauthorized request!');
  }
})

router.get('/logout-48djf9iejjcokecuue884jseidj2koejfutnckwiejs', (req,res) => {
  res.clearCookie('session');
  res.redirect('/login')
})

module.exports = router;
