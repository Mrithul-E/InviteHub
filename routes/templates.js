const express = require('express');
const router = express.Router();
const { formidable } = require("formidable");

const { getTemplates } = require("../service/templateService");

// this contains all template categories:
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

router.get('/:templateId', async function (req, res, next) {
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

router.post("/invitationData", function (req, res) {
  const form = formidable({
    maxTotalFileSize: maxTotalFileSize,
    multiples: true
  });

  form.parse(req, (err, fields, files) => {
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

    return res.status(200).json({
      message: "Upload successful",
      body: fields,
      files: files
    });
  });
});

module.exports = router