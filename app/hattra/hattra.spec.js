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

describe("Hattra handling", function() {
  beforeEach(() =>
    knex.migrate
      .rollback()
      .then(() => knex.migrate.latest())
      .then(() => knex.seed.run()));

  describe("Hattra handling", function() {
    let layanan = {
      username: "raydreww",
      id: 1
    };

    // get /hattra
    it("should not get list of hattra if kestrad or higher is not logged in", done => {
      chai
        .request(routes)
        .get("/api/hattra")
        .end((err, resfromget) => {
          expect(err).to.be.null;
          expect(resfromget).to.have.status(401);
          expect(resfromget.body.message).to.equal("Unauthorized").null;
          expect(resfromget.body.name).to.equal("UnauthorizedError");
          done();
        });
    });

    // get /hattra/search
    it("should not get list of hattra by searching if kestrad or higher is not logged in", done => {
      chai
        .request(routes)
        .get("/api/hattra/search")
        .end((err, resfromget) => {
          expect(err).to.be.null;
          expect(resfromget).to.have.status(401);
          expect(resfromget.body.message).to.equal("Unauthorized").null;
          expect(resfromget.body.name).to.equal("UnauthorizedError");
          done();
        });
    });

    // get /hattra/:id_hattra
    it("should not get spesific hattra if user is not logged in", done => {
      chai
        .request(routes)
        .get("/api/hattra/" + hattra.id_hattra)
        .end((err, resfromget) => {
          expect(err).to.be.null;
          expect(resfromget).to.have.status(401);
          expect(resfromget.body.message).to.equal("Unauthorized").null;
          expect(resfromget.body.name).to.equal("UnauthorizedError");
          done();
        });
    });

    // patch /hattra/:id_hattra
    it("should not edit layanan if Puskesmas is not logged in", done => {
      chai
        .request(routes)
        .patch("/api/hattra/" + hattra.id_hattra)
        .send({ nama_layanan: "pijat" })
        .end((err, resfromget) => {
          expect(err).to.be.null;
          expect(resfromdel).to.have.status(401);
          expect(resfromdel.body.message).to.equal("Unauthorized").null;
          expect(resfromdel.body.name).to.equal("UnauthorizedError");
          done();
        });
    });

    // patch /hattra/:id_hattra/verification
    it("should not edit hattra if Kota is not logged in", done => {
      chai
        .request(routes)
        .patch("/api/hattra/" + hattra.id_hattra + "/verification")
        .send({ verified: "active" })
        .end((err, resfromget) => {
          expect(err).to.be.null;
          expect(resfromdel).to.have.status(401);
          expect(resfromdel.body.message).to.equal("Unauthorized").null;
          expect(resfromdel.body.name).to.equal("UnauthorizedError");
          done();
        });
    });
  });
});
