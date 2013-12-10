/* jshint maxstatements: false, node: true */
/* global describe */
/* global it */
/* global before */
(function () {
    'use strict';
    var expect = require('chai').expect;

    describe('deferred()', function () {
        var deferred;
        var testFnExposure = function (name) {
            it('should expose a function called ' + name, function () {
                expect(deferred()[name]).to.be.a('function');
            });
        };
        var myArg = 10;
        var correctCallback = function (done) {
            return function (arg) {
                expect(arg).to.equal(myArg);
                done();
            };
        };
        var incorrectCallback = function (arg) {
            throw 'called incorrect callback with ' + arg;
        };

        before(function () {
            deferred = require('../src/core.js').deferred;
            expect(deferred).to.be.a('function');
        });

        testFnExposure('then');
        testFnExposure('resolve');
        testFnExposure('reject');
        testFnExposure('state');
        testFnExposure('restrict');

        describe('restrict()', function () {
            var testFnExposure = function (name) {
                it('should expose the function called ' + name + ' from the unrestricted deferred', function () {
                    var myPromise = deferred();
                    expect(myPromise.restrict()[name]).to.equal(myPromise[name]);
                });
            };
            testFnExposure('then');
            testFnExposure('state');
        });

        describe('state()', function () {
            var states = ['pending', 'fulfilled', 'rejected'];
            it('should return \'' + states[0] + '\' before state is changed', function () {
                var myPromise = deferred();
                expect(myPromise.state()).to.equal(states[0]);
            });
            it('should return \'' + states[1] + '\' once ' + states[1], function () {
                var myPromise = deferred();
                myPromise.resolve();
                expect(myPromise.state()).to.equal(states[1]);
                myPromise.reject();
                expect(myPromise.state()).to.equal(states[1]);
            });
            it('should return \'' + states[2] + '\' once ' + states[2], function () {
                var myPromise = deferred();
                myPromise.reject();
                expect(myPromise.state()).to.equal(states[2]);
                myPromise.resolve();
                expect(myPromise.state()).to.equal(states[2]);
            });
        });

        describe('then()', function () {
            var pass = function (arg) {
                return arg;
            };
            var fail = function (arg) {
                throw arg;
            };

            it('should call the fulfilled callback when fulfilled after being called', function (done) {
                var myPromise = deferred();
                myPromise.then(correctCallback(done), incorrectCallback);
                myPromise.resolve(myArg);
            });
            it('should call the fulfilled callback when fulfilled before being called', function (done) {
                var myPromise = deferred();
                myPromise.resolve(myArg);
                myPromise.then(correctCallback(done), incorrectCallback);
            });
            it('should call the rejected callback when rejected after being called', function (done) {
                var myPromise = deferred();
                myPromise.then(incorrectCallback, correctCallback(done));
                myPromise.reject(myArg);
            });
            it('should call the rejected callback when rejected before being called', function (done) {
                var myPromise = deferred();
                myPromise.reject(myArg);
                myPromise.then(incorrectCallback, correctCallback(done));
            });
            it('should expose a function called state', function () {
                expect(deferred().then().state).to.be.a('function');
            });
            it('should expose a function called then', function () {
                expect(deferred().then().then).to.be.a('function');
            });

            describe('state()', function () {
                var states = ['pending', 'fulfilled', 'rejected'];
                var getState = function (stateFn, expectedState, done) {
                    return function () {
                        expect(stateFn()).to.equal(expectedState);
                        done();
                    };
                };
                it('should return \'' + states[0] + '\' before state is changed', function () {
                    expect(deferred().then().state()).to.equal(states[0]);
                });
                it('should return \'' + states[1] + '\' once ' + states[1] + ' after ' + states[1], function (done) {
                    var myPromise = deferred().resolve(myArg).then(pass, fail);
                    myPromise.then(getState(myPromise.state, states[1], done), incorrectCallback);
                });
                it('should return \'' + states[1] + '\' once ' + states[1] + ' after ' + states[2], function (done) {
                    var myPromise = deferred().reject(myArg).then(fail, pass);
                    myPromise.then(getState(myPromise.state, states[1], done), incorrectCallback);
                });
                it('should return \'' + states[2] + '\' once ' + states[2] + ' after ' + states[1], function (done) {
                    var myPromise = deferred().resolve(myArg).then(fail, pass);
                    myPromise.then(incorrectCallback, getState(myPromise.state, states[2], done));
                });
                it('should return \'' + states[2] + '\' once ' + states[2] + ' after ' + states[2], function (done) {
                    var myPromise = deferred().reject(myArg).then(pass, fail);
                    myPromise.then(incorrectCallback, getState(myPromise.state, states[2], done));
                });
            });

            describe('then()', function () {
                it('should call chained fulfilled callback after calling fulfilled callback', function (done) {
                    deferred().resolve(myArg).then(pass, fail).then(correctCallback(done), incorrectCallback);
                });
                it('should call chained rejected callback after calling fulfilled callback', function (done) {
                    deferred().resolve(myArg).then(fail, pass).then(incorrectCallback, correctCallback(done));
                });
                it('should call chained fulfilled callback after calling rejected callback', function (done) {
                    deferred().reject(myArg).then(fail, pass).then(correctCallback(done), incorrectCallback);
                });
                it('should call chained rejected callback after calling rejected callback', function (done) {
                    deferred().reject(myArg).then(pass, fail).then(incorrectCallback, correctCallback(done));
                });
                it('should call chained fulfilled callback after calling fulfilled protection callback', function (done) {
                    deferred().resolve(myArg).then(10, 10).then(correctCallback(done), incorrectCallback);
                });
                it('should call chained rejected callback after calling rejected protection callback', function (done) {
                    deferred().reject(myArg).then(10, 10).then(incorrectCallback, correctCallback(done));
                });
            });
        });
    });
}());
