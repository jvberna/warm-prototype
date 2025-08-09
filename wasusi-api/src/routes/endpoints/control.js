const { Router } = require('express');
const router = Router();

const { control } = require('../../controllers/control');

router.get('/', control)

module.exports = router;