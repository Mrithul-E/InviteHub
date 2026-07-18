const express = require('express');
const router = express.Router();
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

const formElements = [
  { element: "input", type: "text" },
  { element: "input", type: "password" },
  { element: "input", type: "email" },
  { element: "input", type: "number" },
  { element: "input", type: "tel" },
  { element: "input", type: "url" },
  { element: "input", type: "search" },
  { element: "input", type: "date" },
  { element: "input", type: "time" },
  { element: "input", type: "datetime-local" },
  { element: "input", type: "month" },
  { element: "input", type: "week" },
  { element: "input", type: "color" },
  { element: "input", type: "range" },
  { element: "input", type: "checkbox" },
  { element: "input", type: "radio" },
  { element: "input", type: "file" },
  { element: "input", type: "hidden" },
  { element: "textarea" },
  { element: "select" }
];

router.get('/', async function (req, res) {
  const templatesData = await getTemplates()
  
  res.render('templates', { templateCategories, formElements, templatesData})
})

router.get('/:templateId', async function (req, res, next) {
  const templateId = req.params.templateId
  const templatesData = await getTemplates(templateId)

  if (templatesData.length === 0) {
    const err = new Error("Template not found");
    err.status = 404;
    return next(err);
  }

  const fields = templatesData[0].fieldsData.map(field => {
    const fieldDetails = templateFields.find(obj => obj.id === field.id)

    return {
      ...field,
      ...fieldDetails
    }
  })

  let htmlForm = 
  res.render("templateForm", { "testStr": templateId })
})

router.get('/a', function (req, res) {
  res.render('templates/wedding_single_page', {
    layout: false
  })
})

module.exports = router