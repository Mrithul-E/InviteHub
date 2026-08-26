const express = require('express');
const router = express.Router();
const Busboy = require("busboy");

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

const maxTotalFileSize = 50 * 1024 * 1024 // 50 MB in bytes ^_~

router.post("/invitationData", function (req, res) {
  let totalFileSize = 0;
  const fields = {}
  const files = []

  const busboy = Busboy({
    headers: req.headers,
    limits: {
      fileSize: maxTotalFileSize,
      fields: 100
    }
  })

  busboy.on('field', (name, value) => {
    fields[name] = value
  })
  
  busboy.on('file', (name, file, info)=>{
    const {fileName, mimeType} = info
    const chunks = []

    file.on('limit', () => {
      busboy.destroy(new Error('Total file size exceeded for a single file'))
    })

    file.on('data', (chunk) => {
      totalFileSize += chunk.length

      if (totalFileSize > maxTotalFileSize) {
        busboy.destroy(new Error('Total file size exceeded'))
      }

      chunks.push(chunk)
    })

    file.on('end', () => {
      files.push({
        fileName,
        mimeType,
        fieldName: name,
        size: Buffer.concat(chunks).length,
        buffer: Buffer.concat(chunks)
      })
    })
  })

  busboy.on('finish', () => {
    res.json({message: "Received successfully"})
  })

  busboy.on('error', (err) => {
    res.status(413).json({message: err.message})
  })

  req.pipe(busboy)
})      

module.exports = router