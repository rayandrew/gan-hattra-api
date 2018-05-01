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

describe("Layanan handling", () => {
  beforeEach(() =>
    knex.migrate
      .rollback()
      .then(() => knex.migrate.latest())
      .then(() => knex.seed.run()));

  after(() => knex.migrate.rollback());

  describe("Existing layanan entries", () => {
    const layanan = {
      username: "raydreww",
      id: 1
    };

    // Get /kota
    it("should not get list of layanan if kestrad or higher is not logged in", done => {
      chai
        .request(routes)
        .get("/api/layanan")
        .end((err, resfromget) => {
          expect(err).to.be.null;
          expect(resfromget).to.have.status(401);
          expect(resfromget.body.message).to.equal("Unauthorized").null;
          expect(resfromget.body.name).to.equal("UnauthorizedError");
          done();
        });
    });

    // Get /layanan/search
    it("should not get list of layanan by searching if kestrad or higher is not logged in", done => {
      chai
        .request(routes)
        .get("/api/layanan/search")
        .end((err, resfromget) => {
          expect(err).to.be.null;
          expect(resfromget).to.have.status(401);
          expect(resfromget.body.message).to.equal("Unauthorized").null;
          expect(resfromget.body.name).to.equal("UnauthorizedError");
          done();
        });
    });

    // Get /layanan/:username
    it("should not get spesific layanan if user is not logged in", done => {
      chai
        .request(routes)
        .get("/api/layanan/" + layanan.username)
        .end((err, resfromget) => {
          expect(err).to.be.null;
          expect(resfromget).to.have.status(401);
          expect(resfromget.body.message).to.equal("Unauthorized").null;
          expect(resfromget.body.name).to.equal("UnauthorizedError");
          done();
        });
    });

    // Patch /layanan/:id_layanan
    it("should not edit layanan if Puskesmas is not logged in", done => {
      chai
        .request(routes)
        .patch("/api/layanan/" + layanan.id)
        .send({ nama_layanan: "pijat" })
        .end((err, resfromget) => {
          expect(err).to.be.null;
          expect(resfromget).to.have.status(401);
          expect(resfromget.body.message).to.equal("Unauthorized").null;
          expect(resfromget.body.name).to.equal("UnauthorizedError");
          done();
        });
    });

    // Patch /layanan/verifikasi/:username
    it("should not edit layanan if Kota is not logged in", done => {
      chai
        .request(routes)
        .patch("/api/layanan/verifikasi" + layanan.id)
        .send({ verified: "active" })
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
