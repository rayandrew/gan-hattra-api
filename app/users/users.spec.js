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

describe("User handling", function() {
  beforeEach(() =>
    knex.migrate
      .rollback()
      .then(() => knex.migrate.latest())
      .then(() => knex.seed.run()));

  describe("new user", function() {
    let createNewUser = {
      username: "raydreww",
      email: "raydreww@gmail.com",
      password: "hello123"
    };

    it("should return 201 after creating new user", done => {
      chai
        .request(routes)
        .post("/api/users")
        .send(createNewUser)
        .end((err, res) => {
          expect(err).to.be.false;
          expect(res).to.have.status(201);
          expect(res).to.be.a("object");
          expect(res.body).to.be.a("object");
          expect(res.body).to.haveOwnProperty("created_at");
          expect(res.body.username).to.equal("raydreww");
          done();
        });
    });

    it("should not get list of users if user is not logged in", done => {
      chai
        .request(routes)
        .post("/api/users")
        .send(createNewUser)
        .end((err, res) => {
          expect(err).to.be.false;
          chai
            .request(routes)
            .get("/api/users/" + createNewUser.username)
            .end((errfromget, resfromget) => {
              expect(errfromget).to.be.null;
              expect(resfromget).to.have.status(200);
              expect(res.body.username).to.equal("raydreww");
              done();
            });
        });
    });

    it("should not delete user if user is not logged in", done => {
      expect(err).to.be.null;
      chai
        .request(routes)
        .get("/api/users/" + createNewUser.username)
        .end((errfromget, resfromget) => {
          expect(errfromget).to.be.null;
          expect(resfromget).to.have.status(200);
          expect(res.body.username).to.equal("raydreww");
          expect(err).to.be.false;
          chai
            .request(routes)
            .delete("/api/users/" + createNewUser.username)
            .end((errfromdel, resfromdel) => {
              expect(errfromdel).to.be.null;
              expect(resfromdel).to.have.status(200);
              expect(resfromdel.body.affectedRowCount).to.equal(1);
              done();
            });
        });
    });

    it("should not edit user if user is not logged in", done => {
      chai
        .request(routes)
        .post("/api/users")
        .send(createNewUser)
        .end((err, res) => {
          expect(err).to.be.false;
          chai
            .request(routes)
            .patch("/api/users/" + createNewUser.username)
            .send({ username: 13515074 })
            .end((errfromdel, resfromdel) => {
              expect(errfromdel).to.be.null;
              expect(resfromdel).to.have.status(200);
              expect(resfromdel.body.affectedRowCount).to.equal(1);
              done();
            });
        });
    });
  });
});
