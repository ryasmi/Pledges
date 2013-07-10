(function (scope) {
    'use strict';
    var Promise = function () {
        var self = this;
        var state = 0;
        var value = null;
        var reason = null;
        var fulfilled = [];
        var rejected = [];

        self.state = (function () {
            var states = ['unfulfilled', 'fulfilled', 'rejected'];

            return function () {
                return states[state];
            };
        }());

        self.fulfil = function (givenValue) {
            if (state === 0) {
                value = givenValue;
                state = 1;
                fulfilled.forEach(function (fn) {
                    fulfilled.splice(fulfilled.indexOf(fn), 1);
                    fn(value);
                });
            }

            return self;
        };

        self.reject = function (givenReason) {
            if (state === 0) {
                reason = givenReason;
                state = 2;
                rejected.forEach(function (fn) {
                    rejected.splice(rejected.indexOf(fn), 1);
                    fn(reason);
                });
            }

            return self;
        };

        self.then = function (onFulfilment, onRejection) {
            var p = new Promise();
            var fn = function (givenFn) {
                if (typeof givenFn !== 'function') {
                    return function () {};
                }

                return function (arg) {
                    setTimeout(function () {
                        try {
                            p.fulfil(givenFn(arg));
                        } catch (error) {
                            p.reject(error);
                        }
                    });
                };
            };

            onFulfilment = fn(onFulfilment);
            onRejection = fn(onRejection);

            if (state === 0) {
                fulfilled.push(onFulfilment);
                rejected.push(onRejection);
                if (state === 1 && fulfilled.indexOf(onFulfilment) !== -1) {
                    fulfilled.splice(fulfilled.indexOf(onFulfilment), 1);
                    onFulfilment(value);
                } else if (state === 2 && rejected.indexOf(onRejection) !== -1) {
                    rejected.splice(fulfilled.indexOf(onRejection), 1);
                    onRejection(reason);
                }
            } else if (state === 1) {
                onFulfilment(value);
            } else if (state === 2) {
                onRejection(reason);
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
    if (typeof scope.define === 'Function') {
        scope.define('promise', [], function () {
            return constructor;
        });
    } else {
        scope.promise = constructor;
    }
}(this));