const express = require('express');
const router = express.Router();
const { getInvitationsPerUser } = require('../service/invitationService')
const { requireAuth } = require('../middlewares/authMiddleware')

router.get('/', requireAuth, async function (req, res, next) {
    try {
        const userId = res.locals.userRecord.uid

        const invitations =  await getInvitationsPerUser(userId)

        res.render("myInvitations", { invitations })

    } catch (error) {
        next(error)
    }
})

module.exports = router;