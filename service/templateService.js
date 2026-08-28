const admin = require('../firebase')
const db = admin.firestore()

const { deleteFileCDN: deleteImageCDN } = require("./cdnService")

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

async function deleteTemplate(templateId) {
    const docRef = db.collection("templates").doc(templateId)
    const docSnap = await docRef.get()

    if (docSnap.exists) {
        const data = docSnap.data()
        const thumbnailImageId = data.thumbnail.id

        await docRef.delete()
        await deleteImageCDN(thumbnailImageId)
    }
}

module.exports = {
    createTemplate, getTemplates, deleteTemplate
}