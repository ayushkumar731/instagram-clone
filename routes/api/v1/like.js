const express = require('express');
const router = express.Router();
const passport = require('passport');

const LikeController = require('../../../controllers/api/v1/likeController');
router.use(passport.authenticate('jwt', { session: false }));

router.post('/', LikeController.like);

module.exports = router;
