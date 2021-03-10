const express = require('express');
const router = express.Router();
const passport = require('passport');
const searchController = require('../../../controllers/api/v1/searchController');

router.use(passport.authenticate('jwt', { session: false }));

router.get('/:name', searchController.searchByName);

module.exports = router;
