const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homecontroller');
const authController = require('../controllers/api/v1/authController');
const passport = require('passport');

router.use('/api', require('./api'));
router.get('/', authController.isLoggedIn, homeController.home);
router.get('/email-verification', homeController.emailVerification);

router.use('/accounts', require('./accounts'));

router.use(passport.authenticate('jwt', { session: false }));
router.get('/:id', homeController.profile);

module.exports = router;
