const mongoose = require('mongoose');


const Product = require('../models/product');

exports.products_get_all = (req, res, next) => {

    Product.find().select('name price _id productImage').then(docs => {
        const response = {
            count: docs.length,
            products: docs.map(doc => {
                return {
                    name: doc.name,
                    price: doc.price,
                    productImage: doc.productImage,
                    _id: doc._id,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/product/' + doc._id
                    }
                }
            })
        };
        res.status(200).json(response);
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        })
    });
}


exports.products_create_product = (req, res, next) => {

    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path.replace("\\", '/')
    });

    product.save().then(result => {
        console.log(result);
        res.status(201).json({
            message: 'created product successfully',
            createdProduct: {
                name: result.name,
                price: result.price,
                _id: result._id,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/products/' + result._id
                }

            }
        })
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });


}


exports.products_get_product = (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
        .select('name price _id productImage')
        .then(doc => {
            console.log(doc);
            if (doc) {
                res.status(200).json(
                    {
                        product: doc,
                        request: {
                            type: 'GET',
                            description: 'GETALLPRODUCTS',
                            url: 'http://localhost:3000/products'
                        }
                    }
                );
            }
            else {
                res.status(404).json({
                    message: 'No valid Entry'
                })
            }
        }).catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        })
}


exports.products_patch_product = (req, res, next) => {
    const id = req.params.productId;
    const updateOps = {};

    // for (const ops of req.body) {
    //     updateOps[ops.propName] = ops.value;
    // }

    Product.update({ _id: id }, { $set: { name: req.body.name, price: req.body.price } }).then(result => {
        console.log(result);
        res.status(200).json({
            message: 'Product Updated',
            request: {
                type: 'GET',
                url: 'http://localhost:3000/products/' + id
            }
        });
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        })
    })

}


exports.products_delete_product = (req, res, next) => {
    const id = req.params.productId;
    Product.remove({ _id: id })
        .then((result) => {
            if (result.deletedCount >= 1) {
                res.status(200).json({
                    message: 'Product Deleted',
                    request: {
                        type: 'POST',
                        url: 'http://localhost:3000/products',
                        body: { name: 'String', price: 'Number' }

                    }
                });
            }
            else {
                res.status(404).json({
                    message: "product not found"
                })
            }
        })
        .catch((error) => {
            console.log(error);
            res.status(500).json(error);

        })

}