/*
 * (c) 2021 BlackBerry Limited. All rights reserved.
 */

;
(function() {
    var cordovaExec = require('cordova/exec');

    if (typeof XMLHttpRequest.prototype.__open !== "function") {
        XMLHttpRequest.prototype.__open = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function() {
            console.warn('cordova-plugin-bbd-xmlhttprequest is deprecated since version 9.0, where XMLHttpRequest is secured ' +
                'within cordova-plugin-bbd-base. It will be removed in future versions.');

            this.__open.apply(this, arguments);
            if (arguments.length >= 5) {
                var _user = arguments[3],
                    _pass = arguments[4];

                if (_user || _pass) {

                    _user = _user ? _user.toString() : '';
                    _pass = _pass ? _pass.toString() : '';

                    this.setRequestHeader.apply(this, ["Authorization", "Basic " + btoa(_user + ":" + _pass)]);
                }
            }
        }
    }

    Object.defineProperty(XMLHttpRequest.prototype.open,
        'toString', {
            value: function() {
                return 'function ' + this.name + '() { [native code] }';
            },
            writable: false
        });

    module.exports = XMLHttpRequest;
}());

// End XMLHttpRequest.js
//*****************************************************************  //leave empty line after
