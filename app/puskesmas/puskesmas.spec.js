"use strict";

const chai = require("chai");
const chaiHttp = require("chai-http");
const sinonChai = require("sinon-chai");
chai.use(chaiHttp);
chai.use(sinonChai);
const expect = chai.expect;
const routes = require("../app");
const knex = require("../components/knex");

describe("Puskesmas handling", function() {
  beforeEach(() =>
    knex.migrate
      .rollback()
      .then(() => knex.migrate.latest())
      .then(() => knex.seed.run()));

  describe("Puskesmas isInactive", function() {
    let puskesmas = {
      username: "puskesmas_tasik"
    };

    // get /puskesmas
    it("should not get list of puskesmas if user is not logged in", done => {
      chai
        .request(routes)
        .get("/api/puskesmas/")
        .end((err, resfromget) => {
          expect(err).to.be.false;
          expect(resfromget).to.have.status(401);
          expect(resfromget.body.message).to.equal("Unauthorized");
          expect(resfromget.body.name).to.equal("UnauthorizedError");
          done();
        });
    });

    // get /puskesmas/search
    it("should not get list of puskesmas by searching if user is not logged in", done => {
      chai
        .request(routes)
        .get("/api/puskesmas/search")
        .end((err, resfromget) => {
          expect(err).to.be.false;
          expect(resfromget).to.have.status(401);
          expect(resfromget.body.message).to.equal("Unauthorized");
          expect(resfromget.body.name).to.equal("UnauthorizedError");
          done();
        });
    });

    // get /puskesmas/:username
    it("should not get spesific puskesmas if user is not logged in", done => {
      chai
        .request(routes)
        .get("/api/puskesmas/" + puskesmas.username)
        .end((err, resfromget) => {
          expect(err).to.be.false;
          expect(resfromget).to.have.status(401);
          expect(resfromget.body.message).to.equal("Unauthorized");
          expect(resfromget.body.name).to.equal("UnauthorizedError");
          done();
        });
    });

    // patch /puskesmas/:username
    it("should not update puskesmas information if user is not logged in", done => {
      chai
        .request(routes)
        .patch("/api/puskesmas/" + puskesmas.username)
        .send({ alamat: "disini" })
        .end((err, resfromget) => {
          expect(err).to.be.false;
          expect(resfromget).to.have.status(401);
          expect(resfromget.body.message).to.equal("Unauthorized");
          expect(resfromget.body.name).to.equal("UnauthorizedError");
          done();
        });
    });
  });
});
