'use strict';

const jsonParser = require('body-parser').json();
const { Router } = require('express');
const bearerAuth = require('../lib/bearer-auth-middleware.js');
const Incident = require('../model/incident.js');

const incidentRouter = module.exports = new Router();

incidentRouter.post('/api/incidents', jsonParser, bearerAuth, (req, res, next) =>{
  req.body.userId = req.user._id;
  new Incident(req.body)
    .save()
    .then(incident => res.status(201).json(incident))
    .catch(next);
});

incidentRouter.get('/api/incidents/:id', (req, res, next) => {
  Incident.findById(req.params.id)
    .then(incident => res.status(200).json(incident))
    .catch(next);
});

incidentRouter.get('/api/incidents', (req, res, next) => {
  Incident.find({})
    .then(incidents => res.status(200).json(incidents))
    .catch(next);
});
