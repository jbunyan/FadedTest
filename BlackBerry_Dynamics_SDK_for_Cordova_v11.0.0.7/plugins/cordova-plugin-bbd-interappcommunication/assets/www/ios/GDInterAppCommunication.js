/*
 * (c) 2021 BlackBerry Limited. All rights reserved.
 */

;
(function() {
    var cordovaExec = require('cordova/exec');

    /**
     * @class GDInterAppCommunication
     *
     * @deprecated since version 10.1. It will be removed in future versions.
     * Use appropriate functionality in AppKinetics plugin instead.
     *
     * @classdesc The GDInterAppCommunication is used to return information about a service provider
     * application.
     *
     */
    var GDInterAppCommunication = function() {
        Object.defineProperties(this, {
            'toString': {
                value: function() {
                    return '[object GDInterAppCommunication]'
                }
            }
        });
    };

    Object.defineProperty(GDInterAppCommunication, 'toString', {
        value: function() {
            return 'function GDInterAppCommunication() { [native code] }';
        }
    });

    Object.preventExtensions(GDInterAppCommunication);
    // ***** BEGIN: MODULE METHOD DEFINITIONS - GDInterAppCommunication *****

    GDInterAppCommunication.prototype.getGDAppDetails = function(serviceId, version, onSuccess, onError) {
        console.warn(
            '"getGDAppDetails" is deprecated now. It will be removed in future versions.\n' +
            'Please, use "getServiceProvidersFor" from AppKinetics plugin instead.'
        );

        if (serviceId === null || typeof serviceId === 'undefined') {
            console.log("Null serviceId passed to GDInterAppCommunication.getGDAppDetails.");
            return;
        }

        if (typeof onSuccess !== 'function') {
            console.log("ERROR in GDInterAppCommunication.getGDAppDetails: onSuccess parameter is not a function.");
            return;
        }

        var success = function(res) {
            var result = JSON.parse(res);
            onSuccess(result);
        };

        var parms = [serviceId, version];
        cordovaExec(success, onError, "GDInterAppCommunication", "getGDAppDetails", parms);
    };

    // ***** END: MODULE METHOD DEFINITIONS - GDInterAppCommunication *****

    // hide function implementation in web inspector
    Object.defineProperty(GDInterAppCommunication.prototype.getGDAppDetails, 'toString', {
        value: function() {
            return 'function getGDAppDetails() { [native code] }';
        },
        writable: false
    });

    Object.preventExtensions(GDInterAppCommunication.prototype);

    var gdInterAppCommunication = new GDInterAppCommunication();
    Object.preventExtensions(gdInterAppCommunication);
    // Install the plugin.
    module.exports = gdInterAppCommunication;
}()); // End the Module Definition.
//************************************************************************************************
