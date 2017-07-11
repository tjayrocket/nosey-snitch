'use strict';

const jsonParser = require('body-parser').json();
const { Router } = require('express');
const bearerAuth = require('../lib/bearer-auth-middleware.js');
const Residence = require('../model/residence.js');

const residenceRouter = (module.exports = new Router());

residenceRouter.post(
  '/api/residences',
  jsonParser,
  bearerAuth,
  (req, res, next) => {
    console.log('hit POST /api/residences');
    new Residence(req.body)
      .save()
      .then(residence => res.status(201).json(residence._id))
      .catch(next);
  }
);

residenceRouter.get('/api/residences/:id', (req, res, next) => {
  console.log('hit GET /api/residences/:id');
  Residence.findById(req.params.id)
    .then(residence => res.status(200).json(residence))
    .catch(next);
});

residenceRouter.get('/api/residences', (req, res, next) => {
  console.log('hit GET /api/residences');

  let pageNumber = Number(req.query.page);
  if (!pageNumber || pageNumber < 1) pageNumber = 1;
  pageNumber--;

  Residence.find({})
    .sort({ title: 'asc' })
    .skip(pageNumber * 50)
    .limit(50)
    .then(residences => res.status(200).json(residences))
    .catch(next);
});

residenceRouter.put('/api/residences/:id', jsonParser, bearerAuth, (req, res, next) => {
  console.log('hit PUT /api/residences/:id');
  console.log('req.body: ', req.body);
  console.log('req.body.address: ', req.body.address);
  if(req.body.address) return res.sendStatus(400);
  if(!Object.keys(req.body).length) return res.sendStatus(400);

  Residence.findByIdAndUpdate(req.params.id, req.body)
    .then(residence => res.status(202).json(residence))
    .catch(next);
});
