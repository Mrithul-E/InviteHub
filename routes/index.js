const express = require('express');
const router = express.Router();
const admin = require("../firebase") 
const {saveUserLogin} = require("../service/userService")


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get("/login", (req, res) => {
  res.render('login', {"title" : "InviteHub - Login"})
})

router.post("/sessionLogin", async (req,res) => {
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

router.get('/logout', (req,res) => {
  res.clearCookie('session');
  res.redirect('/login')
})

module.exports = router;
