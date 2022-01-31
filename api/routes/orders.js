const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const Order = require('../models/orders');

const Product = require('../models/product');

router.get('/', (req, res, next) => {
    Order.find().select('_id quantity product').populate('product', 'name price')
        .then((docs) => {
            res.status(200).json({
                count: docs.length,
                orders: docs.map(doc => {
                    return {
                        _id: doc._id,
                        product: doc.product,
                        quantity: doc.quantity,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/orders/' + doc._id
                        }
                    }
                })
            });
        })
        .catch((error) => {
            console.log(error);
            res.status(500).json({
                error: error
            })
        })
})


router.post('/', (req, res, next) => {

    Product.findById(req.body.productId)
        .then(product => {
            if (!product) {
                return null;
            }

            const order = new Order({
                _id: mongoose.Types.ObjectId(),
                quantity: req.body.quantity,
                product: req.body.productId
            });
            return order.save();
        })
        .then(result => {
            if (!result) {
                return res.status(404).json({
                    message: 'product Not Found'
                })
            }
            res.status(201).json({
                message: 'Order Stored',
                createdOrder: {
                    _id: result._id,
                    product: result.product,
                    quantity: result.quantity
                },
                request: {
                    type: 'GET',
                    url: 'http://localhost:/orders/' + result._id
                }
            });
        })
        .catch((err) => {
            if (err.name === 'CastError') {

                res.status(404).json({
                    message: 'product Not found'
                })
            }
            else {
                res.status(500).json({
                    error: err
                })
            }
        })


})

router.get('/:orderId', (req, res, next) => {
    Order.findById(req.params.orderId)
        .then(order => {
            if (!order) {
                return res.status(404).json({
                    message: 'Order Not Found'
                })
            }
            res.status(200).json({
                order: order,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/orders'
                }
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
});

router.patch('/:orderId', (req, res, next) => {
    const id = req.params.orderId;
    res.status(200).json({
        message: `updated order ${id}`
    });

});


router.delete('/:orderId', (req, res, next) => {
    Order.remove({ _id: req.params.orderId })
        .then(result => {
            res.status(200).json({
                message: 'Order Deleted',
                request: {
                    type: 'POST',
                    url: 'http://localhost:3000/orders',
                    body: { productId: 'Id', quantity: 'Number' }

                }
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
});

module.exports = router;