/* eslint-disable no-unused-expressions */
'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const sinonChai = require('sinon-chai');
chai.use(chaiHttp);
chai.use(sinonChai);
const expect = chai.expect;
const routes = require('../app');
const knex = require('../components/knex');

describe('Kota handling', function () {
  beforeEach((done) => {
    knex.migrate.rollback()
    .then(() => knex.migrate.latest())
    .then(() => knex.seed.run())
    .then(() => done());
  });

  after((done) => {
    knex.migrate.rollback()
    .then(() => knex.migrate.latest())
    .then(() => knex.seed.run())
    .then(() => done());
  });

  describe('Kota handling', function () {
    let createNewKota = {
      'username': 'raydreww',
      'email': 'raydreww@gmail.com',
      'password': 'hello123'
    };

    it('should return 201 after creating kota', (done) => {
      chai.request(routes).post('/api/kota').send(createNewKota).end((err, res) => {
        expect(err).to.be.falsy;
        expect(res).to.have.status(201);
        expect(res).to.be.a('object');
        expect(res.body).to.be.a('object');
        expect(res.body).to.haveOwnProperty('created_at');
        expect(res.body.username).to.equal('raydreww');
        done();
      });
    });

    it('should not get list of kota if provinsi or higher is not logged in', (done) => {
      chai.request(routes).post('/api/kota').send(createNewKota).end((err, res) => {
        expect(err).to.be.falsy;
        chai.request(routes).get('/api/kota/' + createNewKota.username).end((err, resfromget) => {
          expect(err).to.be.falsy;
          expect(resfromget).to.have.status(401);
          expect(resfromget.body.message).to.equal('Unauthorized');
          expect(resfromget.body.name).to.equal('UnauthorizedError');
          done();
        });
      });
    });

    it('should not delete kota if provinsi or higher is not logged in', (done) => {
      chai.request(routes).post('/api/kota').send(createNewKota).end((err, res) => {
        expect(err).to.be.falsy;
        chai.request(routes).delete('/api/kota/' + createNewKota.username).end((err, resfromdel) => {
          expect(err).to.be.falsy;
          expect(resfromdel).to.have.status(401);
          expect(resfromdel.body.message).to.equal('Unauthorized');
          expect(resfromdel.body.name).to.equal('UnauthorizedError');
          done();
        });
      });
    });

    it('should not edit kota if kota or higher is not logged in', (done) => {
      chai.request(routes).post('/api/kota').send(createNewKota).end((err, res) => {
        expect(err).to.be.falsy;
        chai.request(routes).patch('/api/kota/' + createNewKota.username).send({ nim: 13515074 }).end((errfromdel, resfromdel) => {
          expect(err).to.be.falsy;
          expect(resfromdel).to.have.status(401);
          expect(resfromdel.body.message).to.equal('Unauthorized');
          expect(resfromdel.body.name).to.equal('UnauthorizedError');
          done();
        });
      });
    });
  });
});
