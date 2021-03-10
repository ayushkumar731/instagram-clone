const express = require('express');
const router = express.Router();

router.use('/user', require('./user'));
router.use('/post', require('./post'));
router.use('/comment', require('./comment'));
router.use('/like', require('./like'));
router.use('/friend', require('./friend'));
router.use('/search', require('./search'));

module.exports = router;
