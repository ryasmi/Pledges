(function (scope) {
    'use strict';
    var Promise = function () {
        var self = this;
        var state = 0;
        var value = null;
        var fulfilled = [];
        var rejected = [];

        var changeStateFn = function (newState, buffer) {
            return function (givenValue) {
                if (state === 0) {
                    value = givenValue;
                    state = newState;
                    buffer.forEach(function (fn) {
                        fn();
                    });
                }

                return self;
            };
        };

        self.state = (function () {
            var states = ['pending', 'fulfilled', 'rejected'];

            return function () {
                return states[state];
            };
        }());

        self.resolve = changeStateFn(1, fulfilled);
        self.reject = changeStateFn(2, rejected);

        self.then = function (onFulfilment, onRejection) {
            var p = constructor();
            var fn = function (givenFn, protection) {
                if (typeof givenFn !== 'function') {
                    givenFn = protection;
                }

                return function () {
                    setTimeout(function () {
                        try {
                            p.resolve(givenFn(value));
                        } catch (error) {
                            p.reject(error);
                        }
                    });
                };
            };

            onFulfilment = fn(onFulfilment, function (value) {
                return value;
            });
            onRejection = fn(onRejection, function (reason) {
                throw reason;
            });

            if (state === 0) {
                fulfilled.push(onFulfilment);
                rejected.push(onRejection);
            } else if (state === 1) {
                onFulfilment();
            } else if (state === 2) {
                onRejection();
            }

            return p.restrict();
        };

        self.restrict = function () {
            return {
                state: self.state,
                then: self.then
            };
        };

        return self;
    };

    var constructor = function () {
        return new Promise();
    };

    // AMD Support.
    if (typeof scope.define === 'function') {
        scope.define('promise', [], function () {
            return constructor;
        });
    } else {
        scope.promise = constructor;
    }
}(this));
