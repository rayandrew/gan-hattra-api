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

describe('Puskesmas handling', function() {
    beforeEach((done) => {
        knex.migrate.rollback()
            .then(() => knex.migrate.latest())
            .then(() => knex.seed.run())
            .then(() => done());
    });

    after((done) => {
        knex.migrate.rollback()
            .then(() => knex.migrate.latest())
            .then(() => knex.seed.run())
            .then(() => done());
    });

    describe('Puskesmas handling', function() {
        let dataPuskesmas = {
            'username': 'raydreww',
            'email': 'raydreww@gmail.com',
            'password': 'hello123'
        };

        it('should not get list of puskesmas if kota or higher is not logged in', (done) => {
            chai.request(routes).post('/api/puskesmas').send(dataPuskesmas).end((err, res) => {
                expect(err).to.be.falsy;
                chai.request(routes).get('/api/puskesmas/' + dataPuskesmas.username).end((err, resfromget) => {
                    expect(err).to.be.falsy;
                    expect(resfromget).to.have.status(401);
                    expect(resfromget.body.message).to.equal('Unauthorized');
                    expect(resfromget.body.name).to.equal('UnauthorizedError');
                    done();
                });
            });
        });

        it('should not delete puskesmas if kota or higher is not logged in', (done) => {
            chai.request(routes).post('/api/puskesmas').send(createNewPuskesmas).end((err, res) => {
                expect(err).to.be.falsy;
                chai.request(routes).delete('/api/kota/' + createNewPuskesmas.username).end((err, resfromdel) => {
                    expect(err).to.be.falsy;
                    expect(resfromdel).to.have.status(401);
                    expect(resfromdel.body.message).to.equal('Unauthorized');
                    expect(resfromdel.body.name).to.equal('UnauthorizedError');
                    done();
                });
            });
        });

        it('should not edit puskesmas if puskesmas or higher is not logged in', (done) => {
            chai.request(routes).post('/api/puskesmas').send(createNewPuskesmas).end((err, res) => {
                expect(err).to.be.falsy;
                chai.request(routes).patch('/api/puskesmas/' + createNewPuskesmas.username).send({ nim: 13515074 }).end((errfromdel, resfromdel) => {
                    expect(err).to.be.falsy;
                    expect(resfromdel).to.have.status(401);
                    expect(resfromdel.body.message).to.equal('Unauthorized');
                    expect(resfromdel.body.name).to.equal('UnauthorizedError');
                    done();
                });
            });
        });
    });
});