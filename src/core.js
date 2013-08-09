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
                    buffer.forEach(function (fn, index) {
                        buffer.splice(index, 1);
                        fn();
                    });
                }

                return self;
            };
        };

        self.state = (function () {
            var states = ['unfulfilled', 'fulfilled', 'rejected'];

            return function () {
                return states[state];
            };
        }());

        self.fulfil = changeStateFn(1, fulfilled);
        self.reject = changeStateFn(2, rejected);

        self.then = function (onFulfilment, onRejection) {
            var p = new Promise();
            var fn = function (givenFn) {
                if (typeof givenFn !== 'function') {
                    return function () {};
                }

                return function () {
                    setTimeout(function () {
                        try {
                            p.fulfil(givenFn(value));
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
                    onFulfilment();
                } else if (state === 2 && rejected.indexOf(onRejection) !== -1) {
                    rejected.splice(fulfilled.indexOf(onRejection), 1);
                    onRejection();
                }
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