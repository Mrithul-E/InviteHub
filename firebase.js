require('dotenv').config();

const admin = require('firebase-admin')

const serviceAccountKeyJson_str = process.env.serviceAccountKey
const serviceAccountKey = JSON.parse(serviceAccountKeyJson_str)

admin.initializeApp({
    credential: admin.credential.cert(serviceAccountKey)
})

module.exports = admin;