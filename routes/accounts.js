const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homecontroller');
const authController = require('../controllers/api/v1/authController');
const passport = require('passport');

router.get('/signup', homeController.signup);
router.get('/login', homeController.login);
router.get('/password/forgot', homeController.forgot);

router.use(passport.authenticate('jwt', { session: false }));

router.get('/edit', authController.isLoggedIn, homeController.profileSettings);
module.exports = router;
