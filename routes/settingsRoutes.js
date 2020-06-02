const express = require('express');
const router = express.Router();
const multer = require('multer');
const authMid = require('../middleware/jwt-verification');
const SettingsController = require('../controllers/settings');

MIME_TYPE_MAP = {
    'image/png' : 'png',
    'image/jpg' : 'jpg',
    'image/jpeg': 'jpeg'
}

const config = multer.diskStorage({

    destination: (req, file, cb) => {
        is_valid = MIME_TYPE_MAP[file.mimetype];
        let error = new Error('Mime type not valid')

        if(is_valid){
            error = null;
        }

        cb(error, 'images');
    },

    filename: (req, file, cb) => {
        let fullName = Date.now() + '-' + file.originalname.toLowerCase().split(' ').join('-');
        cb(null, fullName)
    }
})


router.patch('', authMid, multer({storage:config}).single('profileImage'), SettingsController.updateSettings);

router.get('', authMid, SettingsController.getSettings);

module.exports = router;