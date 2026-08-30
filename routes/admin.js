const express = require('express');
const router = express.Router();
const crypto = require('crypto')
const fs = require("fs")

const { createTemplate } = require("../service/templateService")
const { uploadImageCDN, uploadFileCDN } = require("../service/cdnService")
const { deleteTemplate } = require("../service/templateService")

const multer = require("multer");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB file
    fieldSize: 10 * 1024 * 1024  // 10 MB per text field
  }
});

router.post(
  '/templates/create',
  upload.single('formFile'),
  async (req, res) => {
    try {
      if (!req.file || !req.body.templateHBS) {
        res.status(400).json({
          success: false,
          message: "No file uploaded"
        })
        return;
      }

      // req.body.templateName 
      const filename = `${crypto.randomUUID()}.hbs`
      const templateHbsFilePath = path.join(os.tmpdir(), "inviteHub", filename)
      await fs.writeFile(templateHbsFilePath, req.body.templateHBS, "utf8");

      const templateHBS = await uploadFileCDN(filename, templateHbsFilePath, "text/plain")
      const thumbnail = await uploadImageCDN(req.file.buffer, req.body.templateName, true)

      fs.unlinkSync(templateHbsFilePath)
      
      const templateData = {
        ...req.body,
        fieldsData: JSON.parse(req.body.fieldsData),
        thumbnail,
        templateHBS
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