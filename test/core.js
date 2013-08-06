/* jshint maxstatements: false, node: true */
/* global describe */
/* global it */
(function () {
    'use strict';
    var promise = require('../src/core.js').promise;
    var expect = require('expect.js');

    describe('promise', function () {
        var myPromise = promise();
        it('should have a \'then\' function', function () {
            expect(myPromise.then).to.be.a('function');
        });
        it('should have a \'fulfil\' function', function () {
            expect(myPromise.fulfil).to.be.a('function');
        });
        it('should have a \'reject\' function', function () {
            expect(myPromise.reject).to.be.a('function');
        });
        it('should have a \'state\' function', function () {
            expect(myPromise.state).to.be.a('function');
        });
        it('should have a \'restrict\' function', function () {
            expect(myPromise.restrict).to.be.a('function');
        });
        it('should have a \'then\' function on restricted object', function () {
            expect(myPromise.restrict().then).to.be.a('function');
        });
        it('should have a \'state\' function on restricted object', function () {
            expect(myPromise.restrict().state).to.be.a('function');
        });
    });

    describe('fulfilled promise', function () {
        var myPromise = promise();
        var myRestrictedPromise = myPromise.restrict();
        var fulfilledValue = 10;

        it('should call \'onFulfilled\' with value when `then` is called before fulfilment', function (done) {
            myPromise.then(function (value) {
                if (value !== fulfilledValue) { throw 'incorrect value'; }
                done();
            }, function (reason) {
                throw 'called incorrect callback with ' + reason;
            });
        });

        it('should call \'onFulfilled\' with value when `then` is called before fulfilment on restricted object', function (done) {
            myRestrictedPromise.then(function (value) {
                if (value !== fulfilledValue) { throw 'incorrect value'; }
                done();
            }, function (reason) {
                throw 'called incorrect callback with ' + reason;
            });
        });

        myPromise.fulfil(fulfilledValue);

        it('should call \'onFulfilled\' with value when `then` is called after fulfilment', function (done) {
            myPromise.then(function (value) {
                if (value !== fulfilledValue) { throw 'incorrect value'; }
                done();
            }, function (reason) {
                throw 'called incorrect callback with ' + reason;
            });
        });

        it('should call \'onFulfilled\' with value when `then` is called after fulfilment on restricted object', function (done) {
            myRestrictedPromise.then(function (value) {
                if (value !== fulfilledValue) { throw 'incorrect value'; }
                done();
            }, function (reason) {
                throw 'called incorrect callback with ' + reason;
            });
        });

        it('state should return \'fulfilled\'', function () {
            expect(myPromise.state()).to.equal('fulfilled');
        });

        it('state should return \'fulfilled\' on restricted object', function () {
            expect(myPromise.state()).to.equal('fulfilled');
        });

        describe('chained promise', function () {
            it('should call fulfilled with reason in fulfilled chain', function (done) {
                myPromise.then(function (value) {
                    return value;
                }, function (reason) {
                    throw 'called incorrect callback before chain with ' + reason;
                }).then(function (value) {
                    if (value !== fulfilledValue) { throw 'incorrect value'; }
                    done();
                }, function (reason) {
                    throw 'called incorrect callback with ' + reason;
                });
            });
            it('should call rejected with reason in rejected chain', function (done) {
                myPromise.then(function (value) {
                    throw value; // Create error for chained promise rejection.
                }, function (reason) {
                    throw 'called incorrect callback before chain with ' + reason;
                }).then(function (value) {
                    throw 'called incorrect callback with ' + value;
                }, function (reason) {
                    if (reason !== fulfilledValue) { throw 'incorrect reason'; }
                    done();
                });
            });
        });
    });

    describe('rejected promise', function () {
        var myPromise = promise();
        var myRestrictedPromise = myPromise.restrict();
        var rejectionReason = 10;

        it('should call \'onRejected\' with reason when `then` is called before rejection', function (done) {
            myPromise.then(function (value) {
                throw 'called incorrect callback with ' + value;
            }, function (reason) {
                if (reason !== rejectionReason) { throw 'incorrect reason'; }
                done();
            });
        });

        it('should call \'onRejected\' with reason when `then` is called before rejection on restricted object', function (done) {
            myRestrictedPromise.then(function (value) {
                throw 'called incorrect callback with ' + value;
            }, function (reason) {
                if (reason !== rejectionReason) { throw 'incorrect reason'; }
                done();
            });
        });

        myPromise.reject(rejectionReason);

        it('should call \'onRejected\' with reason when `then` is called after rejection', function (done) {
            myPromise.then(function (value) {
                throw 'called incorrect callback with ' + value;
            }, function (reason) {
                if (reason !== rejectionReason) { throw 'incorrect reason'; }
                done();
            });
        });

        it('should call \'onRejected\' with reason when `then` is called after rejection on restricted object', function (done) {
            myRestrictedPromise.then(function (value) {
                throw 'called incorrect callback with ' + value;
            }, function (reason) {
                if (reason !== rejectionReason) { throw 'incorrect reason'; }
                done();
            });
        });

        it('state should return \'rejected\'', function () {
            expect(myPromise.state()).to.equal('rejected');
        });

        it('state should return \'rejected\' on restricted object', function () {
            expect(myPromise.state()).to.equal('rejected');
        });

        describe('chained promise', function () {
            it('should call fulfilled with reason in fulfilled chain', function (done) {
                myPromise.then(function (value) {
                    throw 'called incorrect callback before chain with ' + value;
                }, function (reason) {
                    return reason;
                }).then(function (value) {
                    if (value !== rejectionReason) { throw 'incorrect reason'; }
                    done();
                }, function (reason) {
                    throw 'called incorrect callback with ' + reason;
                });
            });
            it('should call rejected with reason in rejected chain', function (done) {
                myPromise.then(function (value) {
                    throw 'called incorrect callback before chain with ' + value;
                }, function (reason) {
                    throw reason; // Create error for chained promise rejection.
                }).then(function (value) {
                    throw 'called incorrect callback with ' + value;
                }, function (reason) {
                    if (reason !== rejectionReason) { throw 'incorrect reason'; }
                    done();
                });
            });
        });
    });
}());