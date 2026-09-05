const express = require('express');
const router = express.Router();
const { formidable } = require("formidable");

const fs = require("fs")
const path = require('path')
const os = require("os")

const { getTemplates, writeInvitationData } = require("../service/templateService");
const { uploadFileCDN } = require("../service/cdnService");
const { requireAuth } = require('../middlewares/authMiddleware');
const { url } = require('inspector');

const tempDir = path.join(os.tmpdir(), "inviteHub")

fs.rmSync(tempDir, { recursive: true, force: true });
fs.mkdirSync(tempDir, { recursive: true });

// this contains all template categories in template creation form:
const templateCategories = [
  {
    "id": "wedding",
    "name": "Wedding"
  },
  {
    "id": "engagement",
    "name": "Engagement"
  },
  {
    "id": "birthday",
    "name": "Birthday"
  },
  {
    "id": "naming-ceremony",
    "name": "Naming Ceremony"
  },
  {
    "id": "housewarming",
    "name": "Housewarming"
  },
  {
    "id": "anniversary",
    "name": "Anniversary"
  },
  {
    "id": "baby-shower",
    "name": "Baby Shower"
  },
  {
    "id": "graduation",
    "name": "Graduation"
  },
  {
    "id": "corporate-event",
    "name": "Corporate Event"
  },
  {
    "id": "seminar-workshop",
    "name": "Seminar / Workshop"
  },
  {
    "id": "retirement-party",
    "name": "Retirement Party"
  },
  {
    "id": "religious-event",
    "name": "Religious Event"
  }
]

router.get('/', async function (req, res) {
  const templatesData = await getTemplates()

  res.render('templates', { templateCategories, templatesData })
})

router.get('/a', function (req, res) {
  res.render('templates/wedding_single_page', {
    layout: false
  })
})

router.get('/:templateId', requireAuth, async function (req, res, next) {
  const templateId = req.params.templateId
  const templatesData = await getTemplates(templateId)

  if (templatesData.length === 0) {
    const err = new Error("Template not found");
    err.status = 404;
    return next(err);
  }

  console.log(templatesData)

  res.render("templateForm", { "templatesData": JSON.stringify(templatesData) })
})

const maxTotalFileSize = 50 * 1024 * 1024; // 1 MB

router.post("/invitationData", requireAuth, function (req, res) {
  const form = formidable({
    maxTotalFileSize: maxTotalFileSize,
    multiples: true,
    uploadDir: tempDir,
    allowEmptyFiles: true,
    minFileSize: 0,
  });

  const ownerId = res.locals.userRecord.uid
  const filesPlainObj = {}

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Formidable error:", err);
      if (err.httpCode === 413) {
        return res.status(413).json({
          message: `Request size too large. Total size exceeds ${(maxTotalFileSize / 1024 / 1024).toFixed(2)} MB limit.`
        });
      }

      return res.status(400).json({
        message: "Form parsing failed."
      });
    }

    for (const fieldName in files) {
      try {
        filesPlainObj[fieldName] = []

        for (const file of files[fieldName]) {
          if (file.size > maxTotalFileSize) {
            await fs.promises.unlink(file.filepath);

            return res.status(413).json({
              message: `Request size too large. Total size exceeds ${(maxTotalFileSize / 1024 / 1024).toFixed(2)} MB limit.`
            });
          } else if (file.size === 0) {
            await fs.promises.unlink(file.filepath)
            continue
          }

          const resp = await uploadFileCDN(file.originalFilename, file.filepath, file.mimetype)
          // not AI genarated, copied from formidable file object lol..
          filesPlainObj[fieldName].push({
            size: file.size,
            filepath: file.filepath,
            newFilename: file.newFilename,
            mimetype: file.mimetype,
            mtime: file.mtime,
            originalFilename: file.originalFilename,
            cdn: resp
          })

          await fs.promises.unlink(file.filepath);
        }
      } catch (error) {
        console.log(error)
        return res.status(400).json({
          message: "Form parsing failed.",
        });
      }
    }

    Object.entries(fields).forEach(
      ([key, val]) => {
        fields[key] = val[0]
      }
    )

    const result = await writeInvitationData(ownerId, fields, filesPlainObj, fields.templateId)

    return res.status(200).json({
      message: "Upload successful",
      url: "/invitation/"+result.id
    });
  });
});

module.exports = router