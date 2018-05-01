/* eslint-env node, mocha */
/* eslint-disable no-unused-expressions */
"use strict";
const config = require("config");
const chai = require("chai");
chai.use(require("chai-http"));
chai.use(require("sinon-chai"));
const routes = require("../app");
const knex = require("../components/knex");

const expect = chai.expect;

describe("Session handling", () => {
  const tests = [
    {
      username: "prov_jawabarat",
      password: "prov_jawabarat",
      role: "provinsi"
    },
    {
      username: "kota_tasik",
      password: "kota_tasik",
      role: "kota"
    },
    {
      username: "pusk_tasik",
      password: "pusk_tasik",
      role: "puskesmas"
    },
    {
      username: "kestrad_tasik",
      password: "kestrad_tasik",
      role: "kestrad"
    }
  ];

  before(() =>
    knex.migrate
      .rollback()
      .then(() => knex.migrate.latest())
      .then(() => knex.seed.run())
  );

  after(() => knex.migrate.rollback());

  tests.forEach(test => {
    describe(`authentication test for role ${test.role}`, () => {
      const authenticated = chai.request.agent(routes);

      it(`should get logged in`, () => {
        return authenticated
          .post(`${config.get("routePrefix")}/session`)
          .send(test)
          .then(res => {
            expect(res).to.have.status(200);
            expect(res.body).to.have.ownProperty("username");
            expect(res.body).to.have.ownProperty("status");
          });
      });

      it(`should get detail of user`, () =>
        authenticated.get(`${config.get("routePrefix")}/session`).then(res => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.ownProperty("username");
          expect(res.body).to.have.ownProperty("status");
        }));

      it(`should get logged out`, () => {
        return authenticated
          .del(`${config.get("routePrefix")}/session`)
          .then(res => {
            expect(res).to.have.status(200);
            expect(res.body).to.be.an("object");
            expect(res.body.message).to.equal("Logged out successfully.");
          });
      });
    });
  });
});
