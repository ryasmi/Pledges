(function (scope) {
    'use strict';
    var Promise = function () {
        var self = this;
        var state = 'unfulfilled';
        var value = null;
        var reason = null;
        var fulfilled = [];
        var rejected = [];

        self.state = function () {
            return state;
        };

        self.fulfil = function (givenValue) {
            if (state === 'unfulfilled') {
                value = givenValue;
                state = 'fulfilled';
                fulfilled.forEach(function (fn) {
                    fulfilled.splice(fulfilled.indexOf(fn), 1);
                    fn(value);
                });
            }

            return self;
        };

        self.reject = function (givenReason) {
            if (state === 'unfulfilled') {
                reason = givenReason;
                state = 'rejected';
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

            if (state === 'unfulfilled') {
                fulfilled.push(onFulfilment);
                rejected.push(onRejection);
                if (state === 'fulfilled' && fulfilled.indexOf(onFulfilment) !== -1) {
                    fulfilled.splice(fulfilled.indexOf(onFulfilment), 1);
                    onFulfilment(value);
                } else if (state === 'rejected' && rejected.indexOf(onRejection) !== -1) {
                    rejected.splice(fulfilled.indexOf(onRejection), 1);
                    onRejection(reason);
                }
            } else if (state === 'fulfilled') {
                onFulfilment(value);
            } else if (state === 'rejected') {
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

    scope.promise = function () {
        return new Promise();
    };
}(this));