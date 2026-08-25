const express = require('express');
const router = express.Router();

const { createTemplate } = require("../service/templateService")
const { uploadImageCDN } = require("../service/imageService")
const { deleteTemplate } = require("../service/templateService")

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
        return;
      }

      // req.body.templateName

      const thumbnail = await uploadImageCDN(req.file.buffer, req.body.templateName, true)

      const templateData = {
        ...req.body,
        fieldsData: JSON.parse(req.body.fieldsData),
        thumbnail
      }

      console.log(templateData)

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

router.delete('/delete/template/:id', async (req, res) => {
  const templateId = req.params.id
  console.log(templateId)

  try {
    await deleteTemplate(templateId);
    res.json({
      success: true,
      message: "Item deleted successfully"
    });
  } catch (error) {
    console.error("Delete template error:", error);

    res.status(400).json({
      success: false,
      message: "Item delete failed",
      error: error.message
    });
  }
})

module.exports = router;