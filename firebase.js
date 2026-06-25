require('dotenv').config();

const admin = require('firebase-admin')

const serviceAccountKey = JSON.parse(process.env.serviceAccountKey)

admin.initializeApp({
    credential: admin.credential.cert(serviceAccountKey)
})

module.exports = admin;