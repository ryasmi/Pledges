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
                state = 'fulfilled';
                value = givenValue;
                fulfilled.forEach(function (fn) {
                    async(fn, value);
                });
            }

            return self;
        };

        self.reject = function (givenReason) {
            if (state === 'unfulfilled') {
                state = 'rejected';
                reason = givenReason;
                rejected.forEach(function (fn) {
                    async(fn, reason);
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
                });
            } else if (state === 'fulfilled') {
                async(onFulfilment, value);
            } else if (state === 'rejected') {
                async(onRejection, reason);
            }

            return p;
        };

        self.restrict = {
            state: self.state,
            then: self.then
        };

        return self;
    };

    scope.promise = function () {
        return new Promise();
    };
}(this));