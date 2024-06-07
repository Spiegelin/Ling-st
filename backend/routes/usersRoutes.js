import express from 'express';
import { getUserById, editUser, getUsersWithSameLanguage, editProfileImage, getProfileImage } from "../models/userModel.js";
import cookieJwtAuth from '../auth/cookieJwtAuth.js';

const router = express.Router();

// Show user profile information in Profile.jsx
router.get('/profile-info', cookieJwtAuth, async (req, res) => {
    const userId = req.user.user_id;
    const user = await getUserById(userId);

    res.send({ first_name : user[0].first_name ? user[0].first_name : "", 
        // If the user has no last name, return an empty string
        last_name : user[0].last_name ? user[0].last_name : "", 
        language1 : user[1]? user[1] : "", 
        language2 : user[2] ? user[2] : "", 
        language3 : user[3] ? user[3] : ""} );
});

// Get current user profile information in ConfigProfile.jsx
router.get('/edit-profile', cookieJwtAuth, async (req, res) => {
    // Get user id from token
    const userId = req.user.user_id;
    const user = await getUserById(userId);

    res.send({ 
        // If the user has no first name, return an empty string
        first_name : user[0].first_name ? user[0].first_name : "",
        last_name : user[0].last_name ? user[0].last_name : "",
        email: user[0].email ? user[0].email : "",
        country : user[0].country ? user[0].country : "",
        contact_num : user[0].contact_num ? user[0].contact_num : "",
        language1 : user[1] ? user[1] : "", 
        language2 : user[2] ? user[2] : "", 
        language3 : user[3] ? user[3] : ""
     });
});

// Edit user profile in ConfigProfile.jsx
router.post('/edit-profile', cookieJwtAuth, async (req, res) => {
    // Get user id from token
    const userId = req.user.user_id;

    // Get all the fields from the request
    // newLanguages is an array of languages that the user wants to change
    let { first_name, last_name, country, contact_num, newLanguages } = req.body;

    // If the user has no languages, set it to "English"
    newLanguages = newLanguages.map(language => language === "" ? "English" : language);
    
    await editUser(userId, first_name, last_name, country, contact_num, newLanguages);
    res.send({ message: 'Profile updated',
        success: true
     });
});

// Route to upload profile image
router.post('/upload-profile-image', cookieJwtAuth, async (req, res) => {
    const userId = req.user.user_id;
    const imageBase64 = req.body;
  
    // Convert base64 image to binary
    const imageBuffer = Buffer.from(imageBase64.imageBase64, 'base64');
  
    try {
      await editProfileImage(userId, imageBuffer);
      console.log('Profile image updated successfully');
      res.status(200).send({ message: 'Profile image updated successfully' });
    } catch (error) {
      console.error('Error updating profile image:', error);
      res.status(500).send({ message: 'Internal server error' });
    }
});

// Route to get profile image
router.get('/profile-image', cookieJwtAuth, async (req, res) => {
    const userId = req.user.user_id;
  
    try {
        const result = await getProfileImage(userId);
  
      if (result.rows.length > 0 && result.rows[0].profile_image) {
        const imageBuffer = result.rows[0].profile_image;
        const imageBase64 = imageBuffer.toString('base64');
        res.send({ imageBase64 });
      } else {
        res.status(404).send({ message: 'Profile image not found' });
      }
    } catch (error) {
      console.error('Error fetching profile image:', error);
      res.status(500).send({ message: 'Internal server error' });
    }
  });

router.get('/chats-with-same-language', cookieJwtAuth, async (req, res) => {
    const userId = req.user.user_id;
    const users = await getUsersWithSameLanguage(userId);
    res.send(users);
});

export default router;