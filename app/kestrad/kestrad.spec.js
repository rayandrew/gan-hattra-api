/* eslint-env node, mocha */
/* eslint-disable no-unused-expressions */
"use strict";

const chai = require("chai");
const chaiHttp = require("chai-http");
const sinonChai = require("sinon-chai");

chai.use(chaiHttp);
chai.use(sinonChai);
const expect = chai.expect;
const routes = require("../app");
const knex = require("../components/knex");

describe("Kestrad handling", () => {
  beforeEach(() =>
    knex.migrate
      .rollback()
      .then(() => knex.migrate.latest())
      .then(() => knex.seed.run()));

  after(() => knex.migrate.rollback());

  describe("Kestrad isInactive", () => {
    const kestrad = {
      username: "kestrad_tasik"
    };

    // Get /puskesmas
    it("should not get list of kestrad if user is not logged in", done => {
      chai
        .request(routes)
        .get("/api/kestrad/")
        .end((err, resfromget) => {
          expect(err).to.be.false;
          expect(resfromget).to.have.status(401);
          expect(resfromget.body.message).to.equal("Unauthorized");
          expect(resfromget.body.name).to.equal("UnauthorizedError");
          done();
        });
    });

    // Get /kestrad/search
    it("should not get list of kestrad by searching if user is not logged in", done => {
      chai
        .request(routes)
        .get("/api/kestrad/search")
        .end((err, resfromget) => {
          expect(err).to.be.false;
          expect(resfromget).to.have.status(401);
          expect(resfromget.body.message).to.equal("Unauthorized");
          expect(resfromget.body.name).to.equal("UnauthorizedError");
          done();
        });
    });

    // Get /kestrad/:username
    it("should not get spesific kestrad if user is not logged in", done => {
      chai
        .request(routes)
        .get("/api/kestrad/" + kestrad.username)
        .end((err, resfromget) => {
          expect(err).to.be.false;
          expect(resfromget).to.have.status(401);
          expect(resfromget.body.message).to.equal("Unauthorized");
          expect(resfromget.body.name).to.equal("UnauthorizedError");
          done();
        });
    });

    // Patch /kestrad/:username
    it("should not update kestrad information if user is not logged in", done => {
      chai
        .request(routes)
        .patch("/api/kestrad/" + kestrad.username)
        .send({ alamat: "disini" })
        .end((err, resfromget) => {
          expect(err).to.be.false;
          expect(resfromget).to.have.status(401);
          expect(resfromget.body.message).to.equal("Unauthorized");
          expect(resfromget.body.name).to.equal("UnauthorizedError");
          done();
        });
    });

    // Patch /kestrad/verification/:username
    it("should not update kestrad information if user is not logged in", done => {
      chai
        .request(routes)
        .patch("/api/kestrad/" + kestrad.username)
        .send({ verification: "true" })
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
