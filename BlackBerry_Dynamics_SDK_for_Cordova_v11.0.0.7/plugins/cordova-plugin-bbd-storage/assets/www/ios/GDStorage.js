/*
 * (c) 2019 BlackBerry Limited. All rights reserved.
 */

;
(function() {
    var cordovaExec = require('cordova/exec');

    //***************************** GDSecureStorage ********************************//

    /**
     * @class GDSecureStorage
     * @classdesc GDSecureStorage provides local storage analog functionality
     */
    var GDSecureStorage = function() {
        Object.defineProperty(this, 'toString', {
            value: function() {
                return '[object GDSecureStorage]';
            }
        });
    };

    Object.defineProperty(GDSecureStorage, 'toString', {
        value: function() {
            return 'function GDSecureStorage() { [native code] }';
        }
    });

    /* Local Storage */
    var storageDictionary, // the dictionary to hold local storage
        secureStorage; // global GDSecureStorage object for local storage functions

    var getSecureDictionary = function() {
        var retrieveStorage = function(result) {
            try {
                storageDictionary = result;
            } catch (err) {
                throw new Error("unable to get GDSecureStorage");
            }
        }
        // retrieve the dictionary from the plugin
        cordovaExec(retrieveStorage, null, "GDStorage", "getDictionary", []);
        // delay loop to retrieve data using asynchronous Cordova API.
        // this code is performed only once during the plugin set up
        var miliseconds = 200, currentTime = new Date();
        while (new Date() - currentTime < miliseconds) { (function(){})() }
    };

    GDSecureStorage.prototype.getDictionary = getSecureDictionary;

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
    GDSecureStorage.prototype.setItem = function(key, value) {
        if (!storageDictionary) {
            getSecureDictionary();
        }

        if (value === undefined) {
            value = typeof undefined;
        } else if (value instanceof Object) {
            value = value.toString ? value.toString() : '[object Object]';
        } else {
            value = '' + value;
        }
        // keep local java script dictionary in sync
        storageDictionary[key] = value;

        cordovaExec(null, null, "GDStorage", "setItem", [key, value]);
    };

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
    GDSecureStorage.prototype.getItem = function(key) {
        if (!storageDictionary) {
            getSecureDictionary();
        }
        // retrieve the result from the storageDictionary
        try {
            if (storageDictionary[key] !== undefined) {
                return storageDictionary[key];
            }
        } catch (err) {
            throw new Error("Unable to get item");
        }
        return null;
    };

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
    GDSecureStorage.prototype.removeItem = function(key) {
        try {
            delete storageDictionary[key];
        } catch (err) {
            throw new Error("Error deleting item");
        }

        cordovaExec(null, null, "GDStorage", "removeStorageItem", [key]);
    };

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
    GDSecureStorage.prototype.length = function() {
        var count = 0;
        for (var k in storageDictionary) {
            count++;
        }
        return count;
    };

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
    GDSecureStorage.prototype.key = function(index) {
        // return the Ith key
        var count = 0;
        for (var key in storageDictionary) {
            if (storageDictionary.hasOwnProperty(key)) {
                if (count == index)
                    return key;
                count++;
            }
        }
        return null;
    };

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
    GDSecureStorage.prototype.clear = function() {
        // clear local storage
        storageDictionary = {};
        cordovaExec(null, null, "GDStorage", "clearStorage", []);
    };

    // Override Storage for local storage
    var overrideLocalStorage = function() {
        secureStorage = new GDSecureStorage();
        secureStorage.getDictionary();

        Storage.prototype.setItem = secureStorage.setItem;

        Storage.prototype.getItem = secureStorage.getItem;

        Storage.prototype.removeItem = secureStorage.removeItem;

        Storage.prototype.key = secureStorage.key;

        Storage.prototype.clear = secureStorage.clear;

        Storage.prototype.getLength = secureStorage.length;
    };

    for (protoFunction in GDSecureStorage.prototype) {
        if (GDSecureStorage.prototype.hasOwnProperty(protoFunction)) {
            Object.defineProperty(GDSecureStorage.prototype[protoFunction],
                'name', { value: protoFunction, writable: false }
            );

            Object.defineProperty(GDSecureStorage.prototype[protoFunction],
                'toString', {
                    value: function() {
                        return 'function ' + this.name + '() { [native code] }';
                    },
                    writable: false
                });
        }
    }

    localStorage = overrideLocalStorage();

    module.exports = localStorage;
}());

// End GDStorage.js
//*****************************************************************  //leave empty line after
