const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();
const ProductController = require('../controllers/products');
const multer = require('multer');
const checkAuth = require("../middleware/check-auth");
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
    }
});

// const fileFilter = (req, file, cb) => {
//     if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg')
//         cb(null, false);
//     else
//         cb(null, true);
// }

const upload = multer({
    storage: storage, limits: {
        fileSize: 1024 * 1024 * 5
    },
    // fileFilter: fileFilter
});

const Product = require('../models/product');

router.get('/', ProductController.products_get_all);


router.post('/', checkAuth, upload.single('productImage'), ProductController.products_create_product);

router.get('/:productId', ProductController.products_get_product);

router.patch('/:productId', checkAuth, ProductController.products_patch_product);


router.delete('/:productId', checkAuth, ProductController.products_delete_product);


module.exports = router;