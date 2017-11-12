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

describe('provinsi handling', function () {
  beforeEach(done => {
    knex.migrate
      .rollback()
      .then(() => knex.migrate.latest())
      .then(() => knex.seed.run())
      .then(() => done());
  });

  after(done => {
    knex.migrate
      .rollback()
      .then(() => knex.migrate.latest())
      .then(() => knex.seed.run())
      .then(() => done());
  });

  describe('Provinsi handling', function () {
    let provinsi = {
      username: 'test1'
    };

    // get/provinsi
    it('should not get list of provinsi if provinsi or higher is not logged in', done => {
      chai
        .request(routes)
        .get('/api/provinsi')
        .end((err, resfromget) => {
          expect(err);
          expect(resfromget).to.have.status(401);
          expect(resfromget.body.message).to.equal('Unauthorized');
          expect(resfromget.body.name).to.equal('UnauthorizedError');
          done();
        });
    });

    // get /provinsi/search
    it('should not get list of provinsi by searching if provinsi or higher is not logged in', done => {
      chai
        .request(routes)
        .get('/api/provinsi/search')
        .end((err, resfromget) => {
          expect(err);
          expect(resfromget).to.have.status(401);
          expect(resfromget.body.message).to.equal('Not logged in.');
          expect(resfromget.body.name).to.equal('UnauthorizedError');
          done();
        });
    });

    // get /provinsi/:username
    it('should not get spesific kota if user is not logged in', done => {
      chai
        .request(routes)
        .get('/api/provinsi/' + provinsi.username)
        .end((err, resfromget) => {
          expect(err);
          expect(resfromget).to.have.status(401);
          expect(resfromget.body.name).to.equal('UnauthorizedError');
          done();
        });
    });

    // patch /provinsi/:username
    it('should not edit kota if kota or higher is not logged in', done => {
      chai
        .request(routes)
        .patch('/api/provinsi/' + provinsi.username)
        .send({ alamat: 'here' })
        .end((err, resfromget) => {
          expect(err);
          expect(resfromget).to.have.status(401);
          expect(resfromget.body.message).to.equal('Unauthorized');
          expect(resfromget.body.name).to.equal('UnauthorizedError');
          done();
        });
    });
  });
});
