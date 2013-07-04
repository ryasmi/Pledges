/* jshint maxstatements: false, node: true */
(function () {
    'use strict';

     // Setup.
    var w, x, y, z;
    var test = require('micro-assert').assert();
    var promise = require('./release.min.js').promise;
    test.logSuccess = true;

    // Test method availability.
    x = promise();
    test.equal(!!x.then, true, 'Find then function');
    test.equal(!!x.fulfil, true, 'Find fulfil function');
    test.equal(!!x.reject, true, 'Find reject function');
    test.equal(!!x.state, true, 'Find state function');
    test.equal(!!x.restrict, true, 'Find restrict function');

    // Test fulfilled promise.
    x.then(function (value) {
        test.equal(x.state(), 'fulfilled', 'State returns fulfilled');
        test.equal(x.restrict().state(), 'fulfilled', 'State of restricted object returns fulfilled');
        test.equal(value, 10, 'Call onFulfilled with value when `then` is called before fulfilment');
    }, function () {
        test.equal(x.state(), 'fulfilled', 'State returns fulfilled');
        test.equal(x.restrict().state(), 'fulfilled', 'State of restricted object returns fulfilled');
        test.equal(false, true, 'Do not call onRejected when `then` is called before fulfilment');
    });

    test.equal(x.state(), 'unfulfilled', 'State returns unfulfilled');
    test.equal(x.restrict().state(), 'unfulfilled', 'State of restricted object returns unfulfilled');
    x.fulfil(10);

    x.then(function (value) {
        test.equal(value, 10, 'Call onFulfilled with value when `then` is called after fulfilment');
    }, function () {
        test.equal(false, true, 'Do not call onRejected when `then` is called after fulfilment');
    });

    // Test restricted object method availability.
    y = promise();
    z = y.restrict();
    test.equal(!!z.then, true, 'Find then function after restriction');
    test.equal(!!z.fulfil, false, 'Find no fulfil function after restriction');
    test.equal(!!z.reject, false, 'Find no reject function after restriction');
    test.equal(!!z.state, true, 'Find state function after restriction');
    test.equal(!!z.restrict, false, 'Find no restrict function after restriction');

    // Test rejected promise using restricted object.
    z.then(function () {
        test.equal(y.state(), 'rejected', 'State returns rejected');
        test.equal(z.state(), 'rejected', 'State of restricted object returns rejected');
        test.equal(false, true, 'Do not call onFulfilled when `then` is called before rejection');
    }, function (reason) {
        test.equal(y.state(), 'rejected', 'State returns rejected');
        test.equal(z.state(), 'rejected', 'State of restricted object returns rejected');
        test.equal(reason, 10, 'Call onRejected with reason when `then` is called before rejection');
    });

    y.reject(10);

    z.then(function () {
        test.equal(false, true, 'Do not call onFulfilled when `then` is called after rejection');
    }, function (reason) {
        test.equal(reason, 10, 'Call onRejected with reason when `then` is called after rejection');
    });

    // Test chaining with restricted object (after rejection).
    z.then(function () {
        return 0;
    }, function (reason) {
        return reason;
    }).then(function (value) {
        test.equal(value, 10, 'Call onFulfilled when `then` is called after rejection in a chain');
    }, function () {
        test.equal(false, true, 'Do not call onRejected with reason when `then` is called after rejection in a chain');
    });

    z.then(function () {
        return 0;
    }, function (reason) {
        throw new Error(reason);
    }).then(function () {
        test.equal(false, true, 'Do not call onFulfilled with reason when `then` is called after rejection in a chain');
    }, function (reason) {
        test.equal(Number(reason.message), 10, 'Call onRejected with reason when `then` is called after rejection in a chain');
    });

    // Test chaining (after fulfilment).
    w = promise();

    w.then(function (value) {
        return value;
    }, function () {
        return 0;
    }).then(function (value) {
        test.equal(value, 10, 'Call onFulfilled with reason when `then` is called before fulfilment in a chain');
    }, function () {
        test.equal(false, true, 'Do not call onRejected with reason when `then` is called before fulfilment in a chain');
    });

    w.fulfil(10);

    w.then(function (value) {
        throw new Error(value);
    }, function () {
        return 0;
    }).then(function () {
        test.equal(false, true, 'Do not call onFulfilled with reason when `then` is called after fulfilment in a chain');
        test.result();
    }, function (reason) {
        test.equal(Number(reason.message), 10, 'Call onRejected with value when `then` is called after fulfilment in a chain');
        test.result();
    });

    return test.result();
}());