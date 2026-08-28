require('dotenv').config();

const sharp = require('sharp')

async function uploadImageCDN(fileBuffer, fileName, inThumbnail) {
    let imageBuffer;

    if (inThumbnail) {
        imageBuffer = await sharp(fileBuffer)
            .resize({ width: 500, withoutEnlargement: true })
            .webp({ quality: 80 })
            .toBuffer();
    } else {
        imageBuffer = await sharp(fileBuffer)
            .webp({ quality: 100 })
            .toBuffer();
    }

    const formData = new FormData();

    const blob = new Blob([imageBuffer], {
        type: 'image/webp'
    })

    formData.append(
        "file",
        blob,
        `${fileName}.webp`
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

    const jsonResponse = await response.json()

    return jsonResponse
}

async function deleteFileCDN(fileId) {
    const response = await fetch(`https://cdn.hackclub.com/api/v4/upload/${fileId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${process.env.hackClubCDN}` }
    });

    return response.json();
}

module.exports = {
    uploadImageCDN, deleteFileCDN
}