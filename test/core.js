/* jshint maxstatements: false, node: true */
/* global describe */
/* global it */
/* global before */
(function () {
    'use strict';
    var expect = require('expect.js');

    describe('promise()', function () {
        var promise;
        var testFnExposure = function (name) {
            it('should expose a function called ' + name, function () {
                expect(promise()[name]).to.be.a('function');
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
            promise = require('../src/core.js').promise;
        });

        testFnExposure('then');
        testFnExposure('fulfil');
        testFnExposure('reject');
        testFnExposure('state');
        testFnExposure('restrict');

        describe('restrict()', function () {
            var testFnExposure = function (name) {
                it('should expose the function called ' + name + ' from the unrestricted promise', function () {
                    var myPromise = promise();
                    expect(myPromise.restrict()[name]).to.equal(myPromise[name]);
                });
            };
            testFnExposure('then');
            testFnExposure('state');
        });

        describe('state()', function () {
            var states = ['unfulfilled', 'fulfilled', 'rejected'];
            it('should return \'' + states[0] + '\' before state is changed', function () {
                var myPromise = promise();
                expect(myPromise.state()).to.equal(states[0]);
            });
            it('should return \'' + states[1] + '\' once ' + states[1], function () {
                var myPromise = promise();
                myPromise.fulfil();
                expect(myPromise.state()).to.equal(states[1]);
                myPromise.reject();
                expect(myPromise.state()).to.equal(states[1]);
            });
            it('should return \'' + states[2] + '\' once ' + states[2], function () {
                var myPromise = promise();
                myPromise.reject();
                expect(myPromise.state()).to.equal(states[2]);
                myPromise.fulfil();
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
                var myPromise = promise();
                myPromise.then(correctCallback(done), incorrectCallback);
                myPromise.fulfil(myArg);
            });
            it('should call the fulfilled callback when fulfilled before being called', function (done) {
                var myPromise = promise();
                myPromise.fulfil(myArg);
                myPromise.then(correctCallback(done), incorrectCallback);
            });
            it('should call the rejected callback when rejected after being called', function (done) {
                var myPromise = promise();
                myPromise.then(incorrectCallback, correctCallback(done));
                myPromise.reject(myArg);
            });
            it('should call the rejected callback when rejected before being called', function (done) {
                var myPromise = promise();
                myPromise.reject(myArg);
                myPromise.then(incorrectCallback, correctCallback(done));
            });
            it('should expose a function called state', function () {
                expect(promise().then().state).to.be.a('function');
            });
            it('should expose a function called then', function () {
                expect(promise().then().then).to.be.a('function');
            });

            describe('state()', function () {
                var states = ['unfulfilled', 'fulfilled', 'rejected'];
                var getState = function (stateFn, expectedState, done) {
                    return function () {
                        expect(stateFn()).to.equal(expectedState);
                        done();
                    };
                };
                it('should return \'' + states[0] + '\' before state is changed', function () {
                    expect(promise().then().state()).to.equal(states[0]);
                });
                it('should return \'' + states[1] + '\' once ' + states[1] + ' after ' + states[1], function (done) {
                    var myPromise = promise().fulfil(myArg).then(pass, fail);
                    myPromise.then(getState(myPromise.state, states[1], done), incorrectCallback);
                });
                it('should return \'' + states[1] + '\' once ' + states[1] + ' after ' + states[2], function (done) {
                    var myPromise = promise().reject(myArg).then(fail, pass);
                    myPromise.then(getState(myPromise.state, states[1], done), incorrectCallback);
                });
                it('should return \'' + states[2] + '\' once ' + states[2] + ' after ' + states[1], function (done) {
                    var myPromise = promise().fulfil(myArg).then(fail, pass);
                    myPromise.then(incorrectCallback, getState(myPromise.state, states[2], done));
                });
                it('should return \'' + states[2] + '\' once ' + states[2] + ' after ' + states[2], function (done) {
                    var myPromise = promise().reject(myArg).then(pass, fail);
                    myPromise.then(incorrectCallback, getState(myPromise.state, states[2], done));
                });
            });
            
            describe('then()', function () {
                it('should call chained fulfilled callback after calling fulfilled callback', function (done) {
                    promise().fulfil(myArg).then(pass, fail).then(correctCallback(done), incorrectCallback);
                });
                it('should call chained rejected callback after calling fulfilled callback', function (done) {
                    promise().fulfil(myArg).then(fail, pass).then(incorrectCallback, correctCallback(done));
                });
                it('should call chained fulfilled callback after calling rejected callback', function (done) {
                    promise().reject(myArg).then(fail, pass).then(correctCallback(done), incorrectCallback);
                });
                it('should call chained rejected callback after calling rejected callback', function (done) {
                    promise().reject(myArg).then(pass, fail).then(incorrectCallback, correctCallback(done));
                });
            });
        });
    });
}());