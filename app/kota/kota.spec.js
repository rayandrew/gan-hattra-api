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

describe("Kota handling", () => {
  beforeEach(() =>
    knex.migrate
      .rollback()
      .then(() => knex.migrate.latest())
      .then(() => knex.seed.run()));

  after(() => knex.migrate.rollback());

  describe("Kota handling", () => {
    const kota = {
      username: "raydreww"
    };

    // Get /kota
    it("should not get list of kota if provinsi or higher is not logged in", done => {
      chai
        .request(routes)
        .get("/api/kota")
        .end((err, resfromget) => {
          expect(err).to.be.null;
          expect(resfromget).to.have.status(401);
          expect(resfromget.body.message).to.equal("Unauthorized").null;
          expect(resfromget.body.name).to.equal("UnauthorizedError");
          done();
        });
    });

    // Get /kota/search
    it("should not get list of kota by searching if provinsi or higher is not logged in", done => {
      chai
        .request(routes)
        .get("/api/kota/search")
        .end((err, resfromget) => {
          expect(err).to.be.null;
          expect(resfromget).to.have.status(401);
          expect(resfromget.body.message).to.equal("Unauthorized").null;
          expect(resfromget.body.name).to.equal("UnauthorizedError");
          done();
        });
    });

    // Get /kota/:username
    it("should not get spesific kota if user is not logged in", done => {
      chai
        .request(routes)
        .get("/api/kota/" + kota.username)
        .end((err, resfromget) => {
          expect(err).to.be.null;
          expect(resfromget).to.have.status(401);
          expect(resfromget.body.message).to.equal("Unauthorized").null;
          expect(resfromget.body.name).to.equal("UnauthorizedError");
          done();
        });
    });

    // Patch /kota/:username
    it("should not edit kota if kota or higher is not logged in", done => {
      chai
        .request(routes)
        .patch("/api/kota/" + kota.username)
        .send({ alamat: "here" })
        .end((err, resfromget) => {
          expect(err).to.be.null;
          expect(resfromget).to.have.status(401);
          expect(resfromget.body.message).to.equal("Unauthorized").null;
          expect(resfromget.body.name).to.equal("UnauthorizedError");
          done();
        });
    });
  });
});
