const express = require('express');
const router = express.Router();
const { getInvitation } = require('../service/invitationService')
const Handlebars = require('handlebars')

router.get('/:invitationId', async function (req, res, next) {
    try {
        const invitationId = req.params.invitationId
        const invitationData = await getInvitation(invitationId)

        if (!invitationData) {
            const err = new Error("Invitation not found");
            err.status = 404;
            return next(err);
        }

        const templateHbsURL = invitationData.templateHBS.url

        const response = await fetch(templateHbsURL)

        const files = invitationData.files
        const fields = invitationData.fields

        if (!response.ok) {
            const err = new Error("templae fetch failed");
            err.status = 502;
            return next(err);
        }

        const templateHbsTxt = await response.text()
        const template = Handlebars.compile(templateHbsTxt)

        const html = template({
            files,
            fields
        })

        res.send(html)
    } catch (error) {
        next(error)
    }
})

module.exports = router;