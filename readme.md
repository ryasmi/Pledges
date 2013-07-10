# [Pledges](https://www.github.com/ryansmith94/Pledges)
A micro JS library for promises based on the [Promises/A+ specification](http://promises-aplus.github.io/promises-spec/).

[![Build Status](https://travis-ci.org/ryansmith94/Pledges.png)](https://travis-ci.org/ryansmith94/Pledges)   

**License**   
[This work is licensed under a MIT License.](https://github.com/ryansmith94/Pledges/blob/master/license.md)

**Contributing**   
Please make contributions by [forking](https://github.com/ryansmith94/Pledges/fork "/fork") the project and creating a [pull-request](https://github.com/ryansmith94/Pledges/pull/new/master "/pull-request"). Other contributions include maintaining the [Wiki](https://github.com/ryansmith94/Pledges/wiki "/wiki") and [issues](https://github.com/ryansmith94/Pledges/issues?state=open "/issues").

# Documentation
## Installation
Reference the [raw Github version](https://raw.github.com/ryansmith94/Pledges/master/build/release.min.js) of [release.min.js](https://www.github.com/ryansmith94/Pledges/blob/master/build/release.min.js) in your code.

## Getting Started
## 1 Installation
Reference the [raw Github version](https://raw.github.com/ryansmith94/Pledges/master/build/release.min.js) of [release.min.js](https://www.github.com/ryansmith94/Pledges/blob/master/build/release.min.js) in your code.

Pledges is also available as a node package called "pledges". You can install it to your local repository using `npm install pledges --save-dev` and you can use the library with node by using `var promise = require("pledges").promise;` in your JavaScript file.

Pledges is compatible with requireJS and can be used by wrapping your code in the following block:
```JavaScript
require(['promise'], function (promise) {
	// Your code.
});
```

## 2 Getting Started
To create a new promise, use the global "promise" function.
```JavaScript
promise();
```

**Arguments**   
None.

**Returns**   
{Object} promise: A structure that can be manipulated like a promise.

## 3 Methods
### 3.1 fulfil
Fulfils the promise.
```JavaScript
promise().fulfil(value);
```

**Arguments**
* {Object} value: The promised value.

**Returns**   
{Object} promise: The current promise.

### 3.2 reject
Rejects the promise.
```JavaScript
promise().reject(reason);
```

**Arguments**
* {Object} reason: The reason why the promise was rejected.

**Returns**   
{Object} promise: The current promise.

### 3.3 then
What to do when the state of the promise has changed.
```JavaScript
promise().then(onFulfilment, onRejection);
```

**Arguments**
* {Function} onFulfilment: A function to be called when the promise is fulfilled.
* {Function} onRejection: A function to be called when the promise is rejected.

**Returns**   
{Object} promise: Promises the completion of onFulfilment or onRejection (restricted promise - see restrict method).

### 3.4 state
The current state of the promise.
```JavaScript
promise().state();
```

**Arguments**   
None.

**Returns**   
{Object} state: The current state of the promise (either "unfulfilled", "fulfilled", or "rejected").

### 3.5 restrict
Restricts access to the promise.
```JavaScript
promise().restrict();
```

**Arguments**   
None.

**Returns**   
{Object} promise: A promise that provides access to the `then` and `state` methods only.