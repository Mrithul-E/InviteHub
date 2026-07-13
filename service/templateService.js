const admin = require('../firebase')
const db = admin.firestore()

async function createTemplate(templateData) {
    return db.collection("templates").add(templateData)
}

async function getTemplates(id) {
    if (!id) {
        const snapshot = await db.collection("templates").get()

        const templates = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }))

        return templates
    } else {
        const doc = await db.collection("templates").doc(id).get()

        if (!doc.exists) return []

        return [{
            id: doc.id,
            ...doc.data()
        }]
    }

}

module.exports = {
    createTemplate, getTemplates
}