/* eslint-env node, mocha */
/* eslint-disable no-unused-expressions */
"use strict";

const chai = require("chai");
const sinonChai = require("sinon-chai");

chai.use(sinonChai);
const sinon = require("sinon");

const expect = chai.expect;

const auth = require("./auth.js");

describe("Auth", () => {
  describe("isLoggedIn middleware", () => {
    it("should continue if req.user is not falsy", () => {
      const nextSpy = sinon.spy();
      auth.middleware.isLoggedIn({ user: {} }, {}, nextSpy);
      expect(nextSpy).to.have.been.calledOnce;
      expect(nextSpy).to.have.been.calledWithExactly();
    });

    it("should pass HTTP 401 if req.user is falsy", () => {
      const nextSpy = sinon.spy();
      auth.middleware.isLoggedIn({}, {}, nextSpy);
      expect(nextSpy).to.have.been.calledOnce;
      expect(nextSpy.args[0][0].status).to.be.equal(401);
    });
  });

  describe("isAdmin middleware", () => {
    it("should continue if user.role is admin", done => {
      auth.middleware.isAdmin({ user: { role: "admin" } }, {}, err => {
        expect(err).to.be.undefined;
        done();
      });
    });

    it("should pass HTTP 403 if user.role is not admin", done => {
      auth.middleware.isAdmin({ user: { role: "supervisor" } }, {}, err => {
        expect(err.status).to.be.equal(403);
        done();
      });
    });

    it("should pass HTTP 401 if req.user is falsy", () => {
      const nextSpy = sinon.spy();
      auth.middleware.isAdmin({}, {}, nextSpy);
      expect(nextSpy).to.have.been.calledOnce;
      expect(nextSpy.args[0][0].status).to.be.equal(401);
    });
  });

  describe("isSupervisor middleware", () => {
    it("should continue if user.role is admin", done => {
      auth.middleware.isAdmin({ user: { role: "admin" } }, {}, err => {
        expect(err).to.be.undefined;
        done();
      });
    });

    it("should pass HTTP 403 if user.role is not admin", done => {
      auth.middleware.isAdmin({ user: { role: "user" } }, {}, err => {
        expect(err.status).to.be.equal(403);
        done();
      });
    });

    it("should pass HTTP 401 if req.user is falsy", () => {
      const nextSpy = sinon.spy();
      auth.middleware.isAdmin({}, {}, nextSpy);
      expect(nextSpy).to.have.been.calledOnce;
      expect(nextSpy.args[0][0].status).to.be.equal(401);
    });
  });
});
