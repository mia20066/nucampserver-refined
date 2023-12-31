const express = require('express');
const partnerRouter = express.Router();
const Partner = require('../models/partner');
const authenticate = require('../authenticate');
const cors = require('./cors');

partnerRouter.route('/')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, (req, res, next) => {
    Partner.find()
        .then(partners => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(partners);// this method will send json data to the client in the response stream, and it will automatically close the responce stream afterward so no need for the down res.end
        })
        .catch(err => next(err)); // what will this do is passing the error to the overall error handler for this express application

})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin,(req, res, next) => {
    Partner.create(req.body)
        .then(partner => {
            console.log('Partner Created ', partner);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(partner);

        })
        .catch(err => next(err));

})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /partners');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin,(req, res, next) => {
    Partner.deleteMany()
        .then(response => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(response);
        })
        .catch(err => next(err));
});








partnerRouter.route('/:partnerId')
    
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, (req, res, next) => {
        Partner.findById(req.params.partnerId)
            .then(partner => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(partner);// this method will send json data to the client in the response stream, and it will automatically close the responce stream afterward so no need for the down res.end
            })
            .catch(err => next(err)); // what will this do is passing the error to the overall error handler for this express application

    })
    .post(cors.corsWithOptions, authenticate.verifyUser ,authenticate.verifyAdmin, (req, res) => {
        res.statusCode = 403
        res.end(`POST operation not supported on /partners/ ${req.params.partnerId} to you`);
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin,(req, res) => {
        Partner.findByIdAndUpdate(req.params.partnerId, {
            $set: req.body
        }, { new: true }) //we set new to true so we get information back about the updated document as the result from this method
            .then(partner => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(partner);// this method will send json data to the client in the response stream, and it will automatically close the responce stream afterward so no need for the down res.end/since it is in bson so we parse it to json
            })
            .catch(err => next(err));
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin,(req, res, next) => {
        Partner.findByIdAndDelete(req.params.partnerId)
            .then(response => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(response);// this method will send json data to the client in the response stream, and it will automatically close the responce stream afterward so no need for the down res.end
            })
            .catch(err => next(err));

    });
module.exports = partnerRouter;