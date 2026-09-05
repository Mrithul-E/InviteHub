# InviteHub
A website for creating digital invitation webpages by simply selecting a template and filling out a form.

# Try InviteHub!
Create an invitation, choose a template, fill in its custom form, and get a shareable invitation page.

Live Demo: [InviteHub](www.mrithul.in)

# Features
- **Sharable invitation links**

- **Many templates** for different events (Created by admin)

- **Dynamic forms** - Every templates have it's own custom form

- secured by **Sign in with Google** (firebase)

- **Template search** - using Fuse.js

- **Light weight templates** - HBS based templates

- **50 MB Size limit** - 50 MB file size limit for template creation

- **My inviations** section - From here a user can all inviation created by that user, the user can also see the creation date

- **Invitation deletion** - User can delete invitation when ever they want

- **About, Privacy Policy and Terms** - Includes the basic pages for a real public facing website

# Tech Stack

### Frontend

- HTML (Hbs)
- CSS
- Bootstrap
- Javascript
- Jquery
- Fuse.js

### Backend 

- Node.js
- Express
- HandleBars (Hbs)
- Formidable & Multer for multipart parsing

### Database and Authentication

- Firebase Google Authentication
- Firestore (Firebase)

### File Storage

Hackclub CDN


# Speciality

One of the main idea behind InviteHub is that **different invitaion template need different informations**

**Example:**

A wedding inviation might need:

- Groom's name
- Bride's name
- Wedding date
- Venue
- Couple's photos
- Gallery

While a birthday inviation might only need:

- Birthday person's name
- Age
- Date
- Venue

Instead of hard-coding the form for every templates, InviteHub allows admin to create the form using drag-and-drop elements with help of `jQuery form builder`.

InviteHub also allows to create form with a simple block of HTML

# Quick start

Live Demo: [InviteHub](www.mrithul.in)

# Acknowlodgements

Thanks to [Formidable](https://github.com/node-formidable/formidable) (initially developed by [@felixge](https://github.com/felixge))
for making the total file size limiting easy