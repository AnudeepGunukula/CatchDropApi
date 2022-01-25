const express = require('express');
const router = express.Router();


router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'handling get to orders'
    })
})


router.post('/', (req, res, next) => {

    const order = {
        productId: req.body.productId,
        quantity: req.body.quantity
    }
    res.status(201).json({
        message: 'handling post to orders',
        order: order
    })
})

router.get('/:orderId', (req, res, next) => {
    const id = req.params.orderId;
    if (id === 'special') {
        res.status(200).json({
            message: 'this is special id'
        })
    }
    else {
        res.status(200).json({
            message: 'this is normal id'
        })
    }

});

router.patch('/:orderId', (req, res, next) => {
    const id = req.params.orderId;
    res.status(200).json({
        message: `updated order ${id}`
    });

});


router.delete('/:orderId', (req, res, next) => {
    const id = req.params.orderId;
    res.status(200).json({
        message: `deleted order ${id}`
    });

});

module.exports = router;