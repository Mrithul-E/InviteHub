const express = require('express');
const router = express.Router();
const multer = require("multer")

const admin = require("../firebase");
const { getTemplates } = require("../service/templateService");
const { format } = require('morgan');



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
  
  res.render('templates', { templateCategories, templatesData})
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

router.post("/invitationData", function (req, res){
  
})      

module.exports = router