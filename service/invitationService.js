const admin = require('../firebase')
const Handlebars = require('handlebars');
const db = admin.firestore()

async function getInvitation(id) {
    const doc = await db.collection("InvitationData").doc(id).get()

    if (!doc.exists) return null

    return {
        id: doc.id,
        ...doc.data()
    }
}


module.exports = {
    getInvitation
}