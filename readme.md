# [Pledges](https://www.github.com/ryansmith94/Pledges)
A micro JS library for promises *based* on the [Promises/A+ specification](http://promises-aplus.github.io/promises-spec/).

[![Build Status](https://travis-ci.org/ryansmith94/Pledges.png)](https://travis-ci.org/ryansmith94/Pledges)

**License**
This work is licensed under a [Attribution-NonCommercial-ShareAlike 4.0 International
license](https://gist.githubusercontent.com/ryansmith94/b947ee33d7bfffff9d16/raw/bcd4b00739543c4a215a1f60538d899e2c22cdfd/BY-NC-SA.txt).


**Contributing**
Please make contributions by [forking](https://github.com/ryansmith94/Pledges/fork "/fork") the project and creating a [pull-request](https://github.com/ryansmith94/Pledges/pull/new/master "/pull-request"). Other contributions include maintaining the [Wiki](https://github.com/ryansmith94/Pledges/wiki "/wiki") and [issues](https://github.com/ryansmith94/Pledges/issues?state=open "/issues").

# Documentation
## 1 Installation
### 1.1 Browser
Reference the [raw Github version](https://raw.github.com/ryansmith94/Pledges/master/build/release.min.js) of [release.min.js](https://www.github.com/ryansmith94/Pledges/blob/master/build/release.min.js) in your code.

Pledges is compatible with requireJS and can be used by wrapping your code in the following block:
```JavaScript
require(['deferred'], function (deferred) {
	// Your code.
});
```

### 1.2 Node
Pledges is also available as a node package called "pledges". You can install it to your local repository using `npm install pledges --save-dev` and you can use the library with node by using `var deferred = require('pledges').deferred;` in your JavaScript file.

### 1.3 Versioning
This project is maintained under the [semantic versioning guidlines](http://semver.org/). This means that releases will have the following format `<major>.<minor>.<patch>`.
* Breaking backward compatibility bumps the major (and resets the minor and patch).
* New additions without breaking backward compatibility bumps the minor (and resets the patch).
* Bug fixes and misc changes bumps the patch.

## 2 Getting Started
To create a new deferred, use the global "deferred" function.
```JavaScript
deferred();
```

**Arguments**
None.

**Returns**
{Object} deferred: A structure that can be manipulated like a deferred.

## 3 Methods
### 3.1 resolve
Resolves the promise.
```JavaScript
deferred().resolve(value);
```

**Arguments**
* {Object} value: The promised value.

**Returns**
{Object} deferred: The current deferred.

### 3.2 reject
Rejects the promise.
```JavaScript
deferred().reject(reason);
```

**Arguments**
* {Object} reason: The reason why the promise was rejected.

**Returns**
{Object} deferred: The current deferred.

### 3.3 then
What to do when the state of the promise has changed.
```JavaScript
deferred().then(onFulfilment, onRejection);
```

**Arguments**
* {Function} onFulfilment: A function to be called when the promise is fulfilled.
* {Function} onRejection: A function to be called when the promise is rejected.

**Returns**
{Object} restrictedDeferred: Promises the completion of onFulfilment or onRejection (restricted deferred - see restrict method).

### 3.4 state
The current state of the promise.
```JavaScript
deferred().state();
```

**Arguments**
None.

**Returns**
{String} state: The current state of the promise (either 'pending', 'fulfilled', or 'rejected').

### 3.5 restrict
Restricts access to the deferred.
```JavaScript
deferred().restrict();
```

**Arguments**
None.

**Returns**
{Object} deferred: A deferred that provides access to the `then` and `state` methods only.
