const admin = require('../firebase')
const db = admin.firestore()
db.settings({ ignoreUndefinedProperties: true })

const { deleteFileCDN } = require("./cdnService")

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
        const templateHBSId = data.templateHBS.id

        await docRef.delete()
        await deleteFileCDN(thumbnailImageId)
        await deleteFileCDN(templateHBSId)
    }
}

async function writeInvitationData(ownerId, fields, files, templateId) {
    try {
        const templateData = await getTemplates(templateId);

        const invitationData = {
            ownerId,
            fields,
            files,
            templateId,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            templateHBS: templateData[0].templateHBS
        };

        const result = await db.collection("InvitationData").add(invitationData);

        return result;
    } catch (error) {
        throw error; // ^_^
    }
}

module.exports = {
    createTemplate, getTemplates, deleteTemplate, writeInvitationData
}