const admin = require('../firebase')
const db = admin.firestore()

async function saveUserLogin(userRecord) {
    return db
        .collection("users")
        .doc(userRecord.uid)
        .set(
            {
                displayName: userRecord.displayName || null,
                email: userRecord.email,
                photoURL: userRecord.photoURL || null,
                lastLoginAt: new Date(userRecord.metadata.lastSignInTime)
            },
            {merge: true}
        )
}

module.exports = {
    saveUserLogin
}