const express = require('express');
const router = express.Router();
const passport = require('passport');
const friendController = require('../../../controllers/api/v1/friendController');

router.use(passport.authenticate('jwt', { session: false }));

router.post('/', friendController.friend);

module.exports = router;
