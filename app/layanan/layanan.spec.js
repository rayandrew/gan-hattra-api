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

  describe('layanan handling', function () {
    let layanan = {
      username: 'raydreww',
      id: 1
    };

    // get /kota
    it('should not get list of layanan if kestrad or higher is not logged in', done => {
      chai
        .request(routes)
        .get('/api/layanan')
        .end((err, resfromget) => {
          expect(err).to.be.null;
          expect(resfromget).to.have.status(401);
          expect(resfromget.body.message).to.equal('Unauthorized').null;
          expect(resfromget.body.name).to.equal('UnauthorizedError');
          done();
        });
    });

    // get /layanan/search
    it('should not get list of layanan by searching if kestrad or higher is not logged in', done => {
      chai
        .request(routes)
        .get('/api/layanan/search')
        .end((err, resfromget) => {
          expect(err).to.be.null;
          expect(resfromget).to.have.status(401);
          expect(resfromget.body.message).to.equal('Unauthorized').null;
          expect(resfromget.body.name).to.equal('UnauthorizedError');
          done();
        });
    });

    // get /layanan/:username
    it('should not get spesific layanan if user is not logged in', done => {
      chai
        .request(routes)
        .get('/api/layanan/' + layanan.username)
        .end((err, resfromget) => {
          expect(err).to.be.null;
          expect(resfromget).to.have.status(401);
          expect(resfromget.body.message).to.equal('Unauthorized').null;
          expect(resfromget.body.name).to.equal('UnauthorizedError');
          done();
        });
    });

    // patch /layanan/:id_layanan
    it('should not edit layanan if Puskesmas is not logged in', done => {
      chai
        .request(routes)
        .patch('/api/layanan/' + layanan.id)
        .send({ nama_layanan: 'pijat' })
        .end((err, resfromget) => {
          expect(err).to.be.null;
          expect(resfromdel).to.have.status(401);
          expect(resfromdel.body.message).to.equal('Unauthorized').null;
          expect(resfromdel.body.name).to.equal('UnauthorizedError');
          done();
        });
    });

    // patch /layanan/verifikasi/:username
    it('should not edit layanan if Kota is not logged in', done => {
        chai
          .request(routes)
          .patch('/api/layanan/verifikasi' + layanan.id)
          .send({ verified: 'active' })
          .end((err, resfromget) => {
            expect(err).to.be.null;
            expect(resfromdel).to.have.status(401);
            expect(resfromdel.body.message).to.equal('Unauthorized').null;
            expect(resfromdel.body.name).to.equal('UnauthorizedError');
            done();
          });
      });
  });
});
