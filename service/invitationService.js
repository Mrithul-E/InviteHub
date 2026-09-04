const admin = require('../firebase')
const Handlebars = require('handlebars');
const { deleteFileCDN } = require('./cdnService');
const db = admin.firestore()

async function getInvitation(id) {
    const doc = await db.collection("InvitationData").doc(id).get()

    if (!doc.exists) return null

    return {
        id: doc.id,
        ...doc.data()
    }
}

async function getInvitationsPerUser(userId) {
    const querySnapshot = await db.collection("InvitationData").where("ownerId", "==", userId).get()

    const invitations = querySnapshot.docs.map((doc) => {
        return { id: doc.id, createdAt: doc.data().createdAt?.toDate().toISOString() }
    })

    return invitations
}

async function deleteInvitation(invitationId, userId) {
    const invitationData = await getInvitation(invitationId)

    if (invitationData.ownerId !== userId) {
        const err = new Error("Your don't have permission to delete this template");
        err.status = 403;
        return next(err);
    }

    if (!invitationData) {
        const err = new Error("Invitation not found");
        err.status = 404;
        return next(err);
    }

    const fields = invitationData.files

    for (const [fieldName, files] of Object.entries(fields)) {
        for (const file of files) {
            await deleteFileCDN(file.cdn.id)
        }
    }

    await db.collection("InvitationData").doc(invitationId).delete()
}


module.exports = {
    getInvitation, getInvitationsPerUser, deleteInvitation
}