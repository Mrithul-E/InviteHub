const express = require('express');
const router = express.Router();
const admin = require("../firebase");

const { getTemplates } = require("../service/templateService")

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

const templateFields = [
  {
    "id": "eventTitle",
    "label": "Event Title",
    "type": "text",
    "category": "common"
  },
  {
    "id": "eventSubtitle",
    "label": "Event Subtitle",
    "type": "text",
    "category": "common"
  },
  {
    "id": "invitationMessage",
    "label": "Invitation Message",
    "type": "textarea",
    "category": "common"
  },
  {
    "id": "eventDate",
    "label": "Event Date",
    "type": "date",
    "category": "common"
  },
  {
    "id": "eventTime",
    "label": "Event Time",
    "type": "time",
    "category": "common"
  },
  {
    "id": "venueName",
    "label": "Venue Name",
    "type": "text",
    "category": "common"
  },
  {
    "id": "venueAddress",
    "label": "Venue Address",
    "type": "textarea",
    "category": "common"
  },
  {
    "id": "mapLink",
    "label": "Google Maps Link",
    "type": "url",
    "category": "common"
  },
  {
    "id": "contactNumber",
    "label": "Contact Number",
    "type": "phone",
    "category": "common"
  },
  {
    "id": "whatsappNumber",
    "label": "WhatsApp Number",
    "type": "phone",
    "category": "common"
  },
  {
    "id": "email",
    "label": "Email Address",
    "type": "email",
    "category": "common"
  },
  {
    "id": "coverImage",
    "label": "Cover Image",
    "type": "image",
    "category": "media"
  },
  {
    "id": "gallery",
    "label": "Photo Gallery",
    "type": "images",
    "category": "media"
  },
  {
    "id": "backgroundMusic",
    "label": "Background Music",
    "type": "url",
    "category": "media"
  },
  {
    "id": "videoLink",
    "label": "Video Link",
    "type": "url",
    "category": "media"
  },
  {
    "id": "groomName",
    "label": "Groom Name",
    "type": "text",
    "category": "wedding"
  },
  {
    "id": "brideName",
    "label": "Bride Name",
    "type": "text",
    "category": "wedding"
  },
  {
    "id": "groomParents",
    "label": "Groom Parents",
    "type": "text",
    "category": "wedding"
  },
  {
    "id": "brideParents",
    "label": "Bride Parents",
    "type": "text",
    "category": "wedding"
  },
  {
    "id": "coupleStory",
    "label": "Couple Story",
    "type": "textarea",
    "category": "wedding"
  },
  {
    "id": "celebrantName",
    "label": "Celebrant Name",
    "type": "text",
    "category": "birthday"
  },
  {
    "id": "age",
    "label": "Age",
    "type": "number",
    "category": "birthday"
  },
  {
    "id": "babyName",
    "label": "Baby Name",
    "type": "text",
    "category": "baby"
  },
  {
    "id": "parentNames",
    "label": "Parent Names",
    "type": "text",
    "category": "baby"
  },
  {
    "id": "babyPhoto",
    "label": "Baby Photo",
    "type": "image",
    "category": "baby"
  },
  {
    "id": "familyName",
    "label": "Family Name",
    "type": "text",
    "category": "housewarming"
  },
  {
    "id": "housePhoto",
    "label": "House Photo",
    "type": "image",
    "category": "housewarming"
  },
  {
    "id": "husbandName",
    "label": "Husband Name",
    "type": "text",
    "category": "anniversary"
  },
  {
    "id": "wifeName",
    "label": "Wife Name",
    "type": "text",
    "category": "anniversary"
  },
  {
    "id": "anniversaryYear",
    "label": "Anniversary Year",
    "type": "number",
    "category": "anniversary"
  },
  {
    "id": "studentName",
    "label": "Student Name",
    "type": "text",
    "category": "graduation"
  },
  {
    "id": "institution",
    "label": "Institution",
    "type": "text",
    "category": "graduation"
  },
  {
    "id": "degree",
    "label": "Degree",
    "type": "text",
    "category": "graduation"
  },
  {
    "id": "speakerName",
    "label": "Speaker Name",
    "type": "text",
    "category": "conference"
  },
  {
    "id": "description",
    "label": "Description",
    "type": "textarea",
    "category": "conference"
  },
  {
    "id": "bannerImage",
    "label": "Banner Image",
    "type": "image",
    "category": "conference"
  },
  {
    "id": "motherName",
    "label": "Mother Name",
    "type": "text",
    "category": "babyshower"
  },
  {
    "id": "fatherName",
    "label": "Father Name",
    "type": "text",
    "category": "babyshower"
  },
  {
    "id": "rsvpEnabled",
    "label": "Enable RSVP",
    "type": "checkbox",
    "category": "features"
  },
  {
    "id": "rsvpDeadline",
    "label": "RSVP Deadline",
    "type": "date",
    "category": "features"
  },
  {
    "id": "countdownEnabled",
    "label": "Countdown Timer",
    "type": "checkbox",
    "category": "features"
  },
  {
    "id": "themeColor",
    "label": "Theme Color",
    "type": "color",
    "category": "design"
  },
  {
    "id": "secondaryColor",
    "label": "Secondary Color",
    "type": "color",
    "category": "design"
  },
  {
    "id": "fontFamily",
    "label": "Font Family",
    "type": "select",
    "category": "design"
  },
  {
    "id": "hostName",
    "label": "Hosted By",
    "type": "text",
    "category": "common"
  },
  {
    "id": "endDate",
    "label": "End Date",
    "type": "date",
    "category": "common"
  },
  {
    "id": "endTime",
    "label": "End Time",
    "type": "time",
    "category": "common"
  },
  {
    "id": "dressCode",
    "label": "Dress Code",
    "type": "text",
    "category": "common"
  },
  {
    "id": "specialInstructions",
    "label": "Special Instructions",
    "type": "textarea",
    "category": "common"
  },
  {
    "id": "website",
    "label": "Website",
    "type": "url",
    "category": "common"
  },
  {
    "id": "logo",
    "label": "Logo",
    "type": "image",
    "category": "media"
  },
  {
    "id": "weddingHashtag",
    "label": "Wedding Hashtag",
    "type": "text",
    "category": "wedding"
  },
  {
    "id": "receptionVenue",
    "label": "Reception Venue",
    "type": "text",
    "category": "wedding"
  },
  {
    "id": "receptionAddress",
    "label": "Reception Address",
    "type": "textarea",
    "category": "wedding"
  },
  {
    "id": "receptionTime",
    "label": "Reception Time",
    "type": "time",
    "category": "wedding"
  }
]

router.get('/', async function (req, res) {
  const templatesData = await getTemplates()
  
  res.render('templates', { templateCategories, templateFields, templatesData})
})

router.get('/:templateId', async function (req, res, next) {
  const templateId = req.params.templateId
  const templatesData = await getTemplates(templateId)

  if (templatesData.length === 0) {
    const err = new Error("Template not found");
    err.status = 404;
    return next(err);
  }


  res.render("templateForm", { "testStr": templateId })
})

router.get('/a', function (req, res) {
  res.render('templates/wedding_single_page', {
    layout: false
  })
})

module.exports = router