'use strict';

require('dotenv').config({path: `${__dirname}/../.test.env`});
const superagent = require('superagent');
const expect = require('expect');

const server = require('../lib/server.js');
const cleanDB = require('./lib/clean-db.js');
const mockUser = require('./lib/mock-user.js');
const mockResidence = require('./lib/mock-residence.js');

const API_URL = process.env.API_URL;

describe('Testing Profile Model', () => {
  before(server.start);
  after(server.stop);
  afterEach(cleanDB);

  describe('Testing POST', () => {
    it('should return 200', () => {
      return mockUser.createOne()
        .then(userData => {
          let encoded = new Buffer(`${userData.email}:${userData.password}`).toString('base64');
          return superagent.post(`${API_URL}/api/profile/${userData._id}`)
            .set('Authorization', `Basic ${encoded}`)
            .send({
              name: 'Phil',
              phone: 9998881234,
              bio: 'I am Phil',
            })
            .then(res => {
              expect(res.status).toEqual(200);
              expect(res._id).toEqual(userData._id);
              expect(res.name).toEqual('Phil');
              expect(res.phone).toEqual(9998881234);
              expect(res.bio).toEqual('I am Phil');
            });
        });
    });
    it('should return 400 bad request', () => {
      return mockUser.createOne()
        .then(userData => {
          let encoded = new Buffer(`${userData.email}:${userData.password}`).toString('base64');
          return superagent.post(`${API_URL}/api/profile/${userData._id}`)
            .set('Authorization', `Basic ${encoded}`)
            .send({
              nope: 'non existent',
            })
            .then(res => {
              throw res;
            })
            .catch(res => {
              expect(res.status).toEqual(400);
            });
        });
    });
    it('should return 401 unauthorized', () => {
      return mockUser.createOne()
        .then(userData => {
          return superagent.post(`${API_URL}/api/profile/${userData._id}`)
            .set('Authorization', `Basic skdfhskjdfhakdjf`)
            .send({
              name: 'Phil',
              phone: 9998881234,
              bio: 'I am Phil',
            })
            .then(res => {
              throw res;
            })
            .catch(res => {
              expect(res.status).toEqual(401);
            });
        });
    });
    it('Should return with 404 not found', () => {
      return superagent.post(`${API_URL}/api/profile/asdasdasdasd`)
        .send({
          nope: 'non existent',
        })
        .then(res => {
          throw res;
        })
        .catch(res => {
          expect(res.status).toEqual(404);
        });
    });
  });

  describe('Testing GET - Incident Array', () => {
    it('should return 200', () => {
      return mockResidence.createOne()
        .then(residence => {
          return mockUser.createOne()
            .then(userData => {
              return superagent.post(`${API_URL}/api/profile/${userData._id}`)
                .send({
                  residenceId: residence._id,
                  name: 'Phil',
                  phone: 1236530000,
                  bio: 'I am Phil',
                })
                .then(() => {
                  return superagent.get(`${API_URL}/api/profile/${userData._id}`)
                    .then(res => {
                      expect(res.status).toEqual(200);
                      expect(res.userId).toEqual(userData._id);
                      expect(res.name).toEqual('Phil');
                      expect(res.phone).toEqual(1236530000);
                      expect(res.bio).toEqual('I am Phil');
                      expect(res.residenceId).toEqual(residence._id);
                    });
                });
            });
        });
    });
    it('Should return with 404 not found', () => {
      return superagent.get(`${API_URL}/api/profile/asdasdasdasd`)
        .then(res => {
          throw res;
        })
        .catch(res => {
          expect(res.status).toEqual(404);
        });
    });
  });

  describe('Testing PUT', () => {
    it('should return 200', () => {
      return mockResidence.createOne()
        .then(residence => {
          return mockUser.createOne()
            .then(userData => {
              let encoded = new Buffer(`${userData.email}:${userData.password}`).toString('base64');
              return superagent.post(`${API_URL}/api/profile/${userData._id}`)
                .set('Authorization', `Basic ${encoded}`)
                .send({
                  residenceId: residence._id,
                  name: 'Phil',
                  phone: 1236530000,
                  bio: 'I am Phil',
                })
                .then(() => {
                  return superagent.put(`${API_URL}/api/profile/${userData._id}`)
                    .set('Authorization', `Basic ${encoded}`)
                    .send({
                      name: 'Paul',
                      bio: 'I am no longer Phil, I am Paul',
                    })
                    .then(res => {
                      expect(res.status).toEqual(200);
                      expect(res.userId).toEqual(userData._id);
                      expect(res.name).toEqual('Paul');
                      expect(res.phone).toEqual(1236530000);
                      expect(res.bio).toEqual('I am no longer Phil, I am Paul');
                      expect(res.residenceId).toEqual(residence._id);
                    });
                });
            });
        });
    });
    it('should return 400 bad request', () => {
      return mockResidence.createOne()
        .then(residence => {
          return mockUser.createOne()
            .then(userData => {
              let encoded = new Buffer(`${userData.email}:${userData.password}`).toString('base64');
              return superagent.post(`${API_URL}/api/profile/${userData._id}`)
                .set('Authorization', `Basic ${encoded}`)
                .send({
                  residenceId: residence._id,
                  name: 'Phil',
                  phone: 1236530000,
                  bio: 'I am Phil',
                })
                .then(() => {
                  return superagent.put(`${API_URL}/api/profile/${userData._id}`)
                    .set('Authorization', `Basic ${encoded}`)
                    .send({
                      userId: 'jflkasjdlksajdl',
                      name: 'Paul',
                      bio: 'I am no longer Phil, I am Paul',
                    })
                    .then(res => {
                      expect(res.status).toEqual(400);
                      expect(res.userId).toEqual(userData._id);
                      expect(res.name).toEqual('Paul');
                      expect(res.phone).toEqual(1236530000);
                      expect(res.bio).toEqual('I am no longer Phil, I am Paul');
                      expect(res.residenceId).toEqual(residence._id);
                    });
                });
            });
        });
    });
    it('should return 401 unauthorized', () => {
      return mockUser.createOne()
        .then(userData => {
          return superagent.put(`${API_URL}/api/profile/${userData._id}`)
            .set('Authorization', `Basic skdfhskjdfhakdjf`)
            .send({
              name: 'Phil',
              phone: 1236530000,
              bio: 'I am Phil',
            })
            .then(res => {
              throw res;
            })
            .catch(res => {
              expect(res.status).toEqual(401);
            });
        });
    });
    it('Should return with 404 not found', () => {
      return superagent.put(`${API_URL}/api/profile/asdasdasdasd`)
        .send({
          nope: 'non existent',
        })
        .then(res => {
          throw res;
        })
        .catch(res => {
          expect(res.status).toEqual(404);
        });
    });
  });
});
