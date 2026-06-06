const express = require('express');
const router = express.Router();
const admin = require("../firebase") 


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get("/login", (req, res) => {
  res.render('login', {"title" : "InviteHub - Login"})
})

router.post("/sessionLogin", async (req,res) => {
  console.log("req type:", typeof req);
  console.log("res type:", typeof res);
  const idToken = req.body.idToken;
  const expiresIn = 60 * 60 * 24 * 30 * 1 * 1000;

  try {
    const sessionCookies = await admin.auth().createSessionCookie(idToken, { expiresIn });
    const options = {maxAge: expiresIn, httpOnly: true, secure: false};

    res.cookie('session', sessionCookies, options)
    res.st
    res.status(200).send({status: "success"})
  } catch {
    res.status(401).send('Unauthorized request!');
  }
})

router.get('/logout', (req,res) => {
  res.clearCookie('session');
  res.redirect('/login')
})

module.exports = router;
