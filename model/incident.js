'use strict';

const mongoose = require('mongoose');
const Residence = require('./residence.js');

const incidentSchema = mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  timeStamp: { type: Date, default: Date.now() },
  type: { type: String, required: true },
  description: { type: String, required: true },
  residenceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'residence',
    required: true
  },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'comment', }]
});

incidentSchema.pre('save', function(next) {
  Residence.findById(this.residence)
    .then(() => next())
    .catch(() =>
      next(
        new Error(
          'Validation failed - failed to create Incident, residence does not exist'
        )
      )
    );
});

incidentSchema.post('save', function(doc, next) {
  Residence.findById(doc.residenceId)
    .then(residence => {
      let incidentIDSet = new Set(residence.incidents);
      incidentIDSet.add(this._id.toString());
      residence.incidents = Array.from(incidentIDSet);
      return residence.save();
    })
    .then(() => next())
    .catch(next);
});

module.exports = mongoose.model('incident', incidentSchema);
