const express = require('express');
const router = express.Router();


const { getAllproducts, getAllproductsStatic } = require('../controllers/products');

router.route('/').get(getAllproducts);
router.route('/static').get(getAllproductsStatic);


module.exports = router;