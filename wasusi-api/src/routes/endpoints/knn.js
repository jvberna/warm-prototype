const { Router } = require('express');
const router = Router();

const { knn } = require('../../controllers/knn');

router.get('/', knn)

module.exports = router;