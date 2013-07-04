(function (scope) {
    'use strict';
    var Promise = function () {
        var self = this;
        var state = 'unfulfilled';
        var value = null;
        var reason = null;
        var fulfilled = [];
        var rejected = [];

        var async = function (fn, arg) {
            setTimeout(function () {
                fn(arg);
            });
        };

        self.state = function () {
            return state;
        };

        self.fulfil = function (givenValue) {
            if (state === 'unfulfilled') {
                value = givenValue;
                state = 'fulfilled';
                fulfilled.forEach(function (fn) {
                    async(fn, value);
                    fulfilled.splice(fulfilled.indexOf(fn), 1);
                });
            }

            return self;
        };

        self.reject = function (givenReason) {
            if (state === 'unfulfilled') {
                reason = givenReason;
                state = 'rejected';
                rejected.forEach(function (fn) {
                    async(fn, reason);
                    rejected.splice(rejected.indexOf(fn), 1);
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
                    try {
                        p.fulfil(givenFn(arg));
                    } catch (error) {
                        p.reject(error);
                    }
                };
            };

            onFulfilment = fn(onFulfilment);
            onRejection = fn(onRejection);

            if (state === 'unfulfilled') {
                setTimeout(function () {
                    fulfilled.push(onFulfilment);
                    rejected.push(onRejection);
                    if (state === 'fulfilled' && fulfilled.indexOf(onFulfilment) !== -1) {
                        onFulfilment(value);
                        fulfilled.splice(fulfilled.splice(onFulfilment), 1);
                    } else if (state === 'rejected' && rejected.indexOf(onRejection) !== -1) {
                        onRejection(reason);
                        rejected.splice(fulfilled.splice(onRejection), 1);
                    }
                });
            } else if (state === 'fulfilled') {
                async(onFulfilment, value);
            } else if (state === 'rejected') {
                async(onRejection, reason);
            }

            return p;
        };

        self.restrict = function () {
            return {
                state: self.state,
                then: self.then
            };
        };

        return self;
    };

    scope.promise = function () {
        return new Promise();
    };
}(this));