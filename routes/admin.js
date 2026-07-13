require('dotenv').config();

const express = require('express');
const router = express.Router();

const { createTemplate } = require("../service/templateService")
const multer = require("multer");
const sharp = require('sharp')

const upload = multer({
  storage: multer.memoryStorage()
});

router.post(
  '/templates/create',
  upload.single('formFile'),
  async (req, res) => {
    try {
      if (!req.file) {
        res.status(400).json({
          success: false,
          message: "No file uploaded"
        })
      }

      const compressedBuffer = await sharp(req.file.buffer)
        .resize({width: 500, withoutEnlargement: true})
        .webp({quality: 80})
        .toBuffer();

      const formData = new FormData();

      const blob = new Blob([compressedBuffer], {
        type: 'image/webp'
      })

      formData.append(
        "file",
        blob,
        `${req.body.templateName}.webp`
      )

      const response = await fetch("https://cdn.hackclub.com/api/v4/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.hackClubCDN}`,
        },
        body: formData
      })

      if (!response.ok) {
        throw new Error(`CDN upload failed - ERROR: (${response.status})`)
      }

      const thumbnail = await response.json()

      const templateData = {
        ...req.body,
        fieldsData: JSON.parse(req.body.fieldsData),
        thumbnail
      }

      await createTemplate(templateData)

      res.status(201).json({
        success: true,
        message: "Template created successfully"
      });

    } catch (error) {
      console.error(error)
      res.status(500).json({
        success: false,
        message: error.message
      })
    }
  }
)

module.exports = router;