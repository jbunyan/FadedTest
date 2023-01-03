BBD Storage plugin
==================
> The Storage plugin in an interface representing a secure localStorage.

Location
========
`BlackBerry_Dynamics_SDK_for_Cordova_<version>/plugins/cordova-plugin-bbd-storage`

> __Note:__ `BBD Cordova Storage plugin` is dependent on
> * `BBD Cordova Base plugin`
> * `BBD Cordova File plugin`
> * `BBD Cordova SQLite Storage plugin`

Installation
============
To add this plugin to your application, run the following command in the project directory:
```
$ cd <path/to/package>/BlackBerry_Dynamics_SDK_for_Cordova_<version>/plugins/cordovaApp
$ cordova plugin add ../cordova-plugin-bbd-storage
```

API reference
=============

`window.localStorage`
```javascript
/**
* @classs GDSecureStorage
* @classdescc GDSecureStorage provides local storage analog functionality
*/
```

`localStorage.setItem`
```javascript
/**
* @function GDSecureStorage#setItem
* @description Adds new value to local storage
* @param {string} key The key for newly create value
* @param {any} value The value itself
*
* @example
* var key = "key";
* var value = "value";
*
* localStorage.setItem(key, value);
* console.log(localStorage.getItem(key)); // "value"
*/
```

`localStorage.getItem`
```javascript
/**
* @function GDSecureStorage#getItem
* @description Returns a value from local storage by key
* @param {string} key The key for existing value in local storage
*
* @example
* var key = "key";
* var value = "value";
*
* localStorage.setItem(key, value);
* var val = localStorage.getItem(key);
* console.log(val); // "value"
*/
```

`localStorage.removeItem`
```javascript
/**
* @function GDSecureStorage#removeItem
* @description Removes the value fram local storage with key
* @param {string} key The key for existing value in local storage
*
* @example
* var key = "key";
* var value = "value";
*
* localStorage.setItem(key, value);
* console.log(localStorage.getLength()); // 1
* localStorage.removeItem(key);
* console.log(localStorage.getLength()); // 0
*/
```

`localStorage.getLength`
```javascript
/**
* @function GDSecureStorage#getLength
* @description Returns a number - how many elements are there in the local storage
*
* @example
* var key = "key";
* var value = "value";
*
* localStorage.setItem(key, value);
* var localStorageSize = localStorage.getLength();
* console.log(localStorageSize); // 1
*/
```

`localStorage.key`
```javascript
/**
* @function GDSecureStorage#key
* @description Returns a key for particular index in local storage
* @param {number} index The index in local storage
*
* @example
* var key = "key";
* var value = "value";
*
* localStorage.setItem(key, value);
* console.log(localStorage.key(0)); // "key"
*/
```

`localStorage.clear`
```javascript
/**
* @function GDSecureStorage#clear
* @description Clears the local storage
*
* @example
* var key1 = "key1";
* var value1 = "value1";
* var key2 = "key2";
* var value2 = "value2";
*
* localStorage.setItem(key1, value1);
* localStorage.setItem(key2, value2);
* console.log(localStorage.getLength()); // 2
* localStorage.clear();
* console.log(localStorage.getLength()); // 0
*/
```
