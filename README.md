# InviteHub
A website for creating digital invitation webpages by simply selecting a template and filling out a form.

Now many templates are listed, more can be added by the admin in the future !!!
<img width="1583" height="762" alt="image" src="https://github.com/user-attachments/assets/1c02268f-4bbc-47e7-b689-0407d6073bf1" />

# How to use

Live Demo: [InviteHub](https://invitehub.mrithul.in/)

1. Select a template
2. Fill out the form
3. Submit the form
4. Your template is ready, now you can copy the link and share it to anyone

# Features
- Can give sharable invitation links

- Many templates for different events (Created by admin)

- Every templates have it's own custom form

- secured by **Sign in with Google** (firebase)

- Template search using Fuse.js

- HBS based templates

- 50 MB file size limit for template creation

- My inviations section - From here a user can all inviation created by that user, the user can also see the creation date

- Invitation deletion - User can delete invitations created by them when ever they want.

- About, Privacy Policy and Terms - Includes the basic pages for a real public facing website

# Tech Stack I Used

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

- Hackclub CDN


# What's the main speciality 

The main idea behind InviteHub is that **different invitaion template need different informations**

Example:

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

Instead of hard-coding the form for every templates, InviteHub allows admin to create the form using drag-and-drop elements with help of jQuery form builder.

InviteHub also allows to create form with a simple block of HTML

# Quick start

[https://invitehub.mrithul.in/](https://invitehub.mrithul.in/)

# Acknowledgements

- Thanks to [Formidable](https://github.com/node-formidable/formidable)
for making the total file size limiting in request easy
I find It after many google searches

# Note for Stardance shipwrghts

- Readme is completely written by human:
![zeroGPT](https://cdn.hackclub.com/01a094c1-ecdc-7e4c-a72a-35ecbd26e73f/ai_usage_reality.png)

- The assets are made using Canva, Not Ai generated
![Canav screenshot proof](https://cdn.hackclub.com/01a094c7-fe4f-77b5-8bf1-4fe9502d5360/Screenshot%202026-09-12%20141125.png)

- The styling in this completely done by me, the fact is that this site has very little styling required. That styling and responsiveness are  mainly done by Bootstarp 5

