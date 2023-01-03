/*
 * (c) 2021 BlackBerry Limited. All rights reserved.
 */

;
(function() {
    var cordovaExec = require('cordova/exec');

    /**
     * @class GDAppKinetics
     *
     * @classdesc GDAppKinetics provides the functionality of AppKinetics the ability to securely communicate between applications
     */
    var GDAppKineticsPlugin = function() {
        Object.defineProperty(this, 'toString', {
            value: function() {
                return '[object GDAppKineticsPlugin]';
            }
        });
    }

    Object.defineProperty(GDAppKineticsPlugin, 'toString', {
        value: function() {
            return 'function GDAppKineticsPlugin() { [native code] }';
        }
    });

    Object.preventExtensions(GDAppKineticsPlugin);

    // ***** BEGIN: MODULE METHOD DEFINITIONS - GDAppKinetics *****

    /**
     * @function GDAppKinetics#canLaunchAppUsingUrlScheme
     *
     * @description Call this function to check if it is currently possible to open an app using an url scheme.
     *
     * @param {function} onSuccess Callback function to invoke when the function returns successfully.
     *
     * @param {function} onError Callback function to invoke for error conditions.
     *
     * @example
     *
     * window.plugins.GDAppKineticsPlugin.canLaunchAppUsingUrlScheme("http://address/App.plist",
     *     function(result) {
     *         alert("Should be able to launch this app " + result);
     *     },
     *     function(result) {
     *         alert("Application is failed to launch " + result);
     *     }
     * );
     *
     */

    GDAppKineticsPlugin.prototype.canLaunchAppUsingUrlScheme = function(urlToTest, onSuccess, onError) {
        if (typeof onSuccess !== 'function') {
            throw new Error("ERROR in GDAppKineticsPlugin.prototype.canLaunchAppUsingUrlScheme: onSuccess parameter is not a function.");
        }
        if (typeof onError !== 'function') {
            throw new Error("ERROR in GDAppKineticsPlugin.prototype.canLaunchAppUsingUrlScheme: onError parameter is not a function.");
        }

        var parms = [urlToTest];
        cordovaExec(onSuccess, onError, "GDAppKinetics", "canLaunchAppUsingUrlScheme", parms);
    };

    /**
     * @function GDAppKinetics#launchAppUsingUrlScheme
     *
     * @description Call this function to open an app using an URL scheme.
     *
     * @param {string} urlToLaunch URL which is registered to the app which should be launched.
     *
     * @param {function} onSuccess Callback function to invoke when the function returns successfully.
     *
     * @param {function} onError Callback function to invoke for error conditions.
     *
     * @example
     * window.plugins.GDAppKineticsPlugin.launchAppUsingUrlScheme("com.gd.exampleappkineticsfilebouncer",
     *     function(result) {
     *         alert("Should be able to launch this app " + result);
     *     },
     *     function(result) {
     *          alert("Application is failed to launch " + result);
     *     }
     * );
     */
    GDAppKineticsPlugin.prototype.launchAppUsingUrlScheme = function(urlToLaunch, onSuccess, onError) {
        if (typeof onSuccess !== 'function') {
            throw new Error("ERROR in GDAppKineticsPlugin.prototype.launchAppUsingUrlScheme: onSuccess parameter is not a function.");
        }
        if (typeof onError !== 'function') {
            throw new Error("ERROR in GDAppKineticsPlugin.prototype.launchAppUsingUrlScheme: onError parameter is not a function.");
        }

        var parms = [urlToLaunch];
        cordovaExec(onSuccess, onError, "GDAppKinetics", "launchAppUsingUrlScheme", parms);
    };

    /**
     * @function GDAppKinetics#bringAppToFront
     *
     * @description Call this function to bring an app to the front of the device.
     *
     * @param {string} applicationId ID of the app which should be brought to the front.
     *
     * @param {function} onSuccess Callback function to invoke when the function returns successfully.
     *
     * @param {function} onError Callback function to invoke for error conditions.
     *
     * @example
     *
     * window.plugins.GDAppKineticsPlugin.launchAppUsingUrlScheme("com.gd.exampleappkineticsfilebouncer",
     *     function(result) {
     *         alert("Should be able to launch this app " + result);
     *     },
     *     function(result) {
     *         alert("Application is failed to launch " + result);
     *     }
     * );
     *
     */
    GDAppKineticsPlugin.prototype.bringAppToFront = function(applicationId, onSuccess, onError) {
        if (typeof onSuccess !== 'function') {
            throw new Error("ERROR in GDAppKineticsPlugin.prototype.bringAppToFront: onSuccess parameter is not a function.");
        }
        if (typeof onError !== 'function') {
            throw new Error("ERROR in GDAppKineticsPlugin.prototype.bringAppToFront: onError parameter is not a function.");
        }

        var parms = [applicationId];
        cordovaExec(onSuccess, onError, "GDAppKinetics", "bringAppToFront", parms);
    };

    /**
     * @constant GDAppKinetics#storageLocation
     *
     * @type {string}
     *
     * @description Use this constant to get platform specific AppKinetics storage root location
     *  via resolveLocalFileSystemURL from cordova-plugin-bbd-file
     *
     * @example
     * resolveLocalFileSystemURL(window.plugins.GDAppKineticsPlugin.storageLocation,
     *     function(directoryEntry) {
     *         var appKineticsDirectoryReader = directoryEntry.createReader();
     *         appKineticsDirectoryReader.readEntries(function (entries) {
     *             console.log("AppKinetics storage entries: ", entries);
     *         }, function(error) {
     *             console.log("Error: ", error);
     *         });
     *     }, function(error) {
     *         console.log("resolveLocalFileSystemURL error: ", error)
     *     }
     * );
     */
    GDAppKineticsPlugin.prototype.storageLocation = 'cdvfile://localhost/root/Inbox';

    /**
     * @function GDAppKinetics#copyFilesToSecureFileSystem
     *
     * @description Copy files from "www/data" folder into secure file system to the "/data" path from AppKinetics storage.
     * While this is not an issue for applications using most APIs to write or read via GDCordova, there is a
     * problem with moving files which are part of the application Bundle into the secure container.  This api solves
     * that problem and moves all files within the app bundle into the secure container.
     *
     * @param {function} onSuccess Callback function to invoke when the function returns successfully and the
     * parameter to the success function is a string which contains the number of files moved.
     *
     * @example
     * window.plugins.GDAppKineticsPlugin.copyFilesToSecureFileSystem(
     *     function(result) {
     *         alert("Number of files copied = " + result);
     *     }
     * );
     */
    GDAppKineticsPlugin.prototype.copyFilesToSecureFileSystem = function(onSuccess) {
        if (typeof onSuccess !== 'function') {
            throw new Error("ERROR in GDAppKineticsPlugin.prototype.copyFilesToSecureFileSystem: onSuccess parameter is not a function.");
        }
        var parms = []; // no parms

        // calls success function with number of files copied
        cordovaExec(onSuccess, onSuccess, "GDAppKinetics",
            "copyAllBundledFilesToSecureFileSystem", parms);
    };

    /**
     * @function GDAppKinetics#sendFileToApp
     *
     * @description Call this function to send file to the app by applicationId.
     *
     * @param {string} nativeURL Native path (nativeURL) for the file to send.
     *
     * @param {string} applicationId ID of the app to which the file is sent.
     *
     * @param {function} onSuccess Callback function to invoke when the function returns successfully.
     *
     * @param {function} onError Callback function to invoke for error conditions.
     *
     * @example
     * window.plugins.GDAppKineticsPlugin.sendFileToApp(
     *     "file:///path_to_directory_with_files/Brief GD Inter-Container Communication.pdf",
     *     "com.gd.exampleappkineticsfilebouncer",
     *     function(result) {
     *         alert("Should be able to send file " + result);
     *     },
     *     function(result) {
     *         alert("Send file is failed  " + result);
     *     }
     * );
     */
    GDAppKineticsPlugin.prototype.sendFileToApp = function(nativeURL, applicationId, onSuccess, onError) {
        if (typeof onSuccess !== 'function') {
            throw new Error("ERROR in GDAppKineticsPlugin.prototype.sendFileToApp: onSuccess parameter is not a function.");
        }
        if (typeof onError !== 'function') {
            throw new Error("ERROR in GDAppKineticsPlugin.prototype.sendFileToApp: onError parameter is not a function.");
        }

        var parms = [applicationId, nativeURL.replace(/^file:\/\/\/+/, "/")];
        // Order is applicationId then file fullPath (NativeURL excluding file:// from path)

        cordovaExec(onSuccess, onError, "GDAppKinetics", "sendFileToApp", parms);
    };

    /**
     * @function GDAppKinetics#retrieveFiles
     *
     * @description Call this function to retreive any waiting files but only for the file transfer service.
     *
     * @param {function} onSuccess Callback function to invoke when the function returns successfully with a parameter
     * of an array of file paths of the received files.
     *
     * @param {function} onError Callback function to invoke for error conditions or when no files are waiting.
     *
     * @example
     * window.plugins.GDAppKineticsPlugin.retrieveFiles(
     *    function(result) {
     *        alert("Files retrieved");
     *    },
     *    function(result) {
     *        alert("Retrieve files is failed" + result);
     *     }
     * );
     */
    GDAppKineticsPlugin.prototype.retrieveFiles = function(onSuccess, onError) {
        if (typeof onSuccess !== 'function') {
            throw new Error("ERROR in GDAppKineticsPlugin.prototype.retrieveFiles: onSucess parameter is not a function.");
        }
        if (typeof onError !== 'function') {
            throw new Error("ERROR in GDAppKineticsPlugin.prototype.retrieveFiles: onError parameter is not a function.");
        }

        var parms = []; // no parms
        cordovaExec(onSuccess, onError, "GDAppKinetics", "retrieveFiles", parms);
    };

    /**
     * @function GDAppKinetics#setReceiveAttachmentsFunction
     *
     * @description Call this function to set a function to be called for all files received but only for the file transfer
     * service.  Any currently waiting files will be delivered immediately.
     *
     * @param {function} receiveFileFunction Callback function to invoke when the function returns successfully with a parameter
     * of an array of file paths of the received files.
     *
     * @example
     * window.plugins.GDAppKineticsPlugin.setReceiveAttachmentsFunction(
     *     function(result) {
     *         alert("Files retrieved");
     *     }
     * );
     */
    GDAppKineticsPlugin.prototype.setReceiveAttachmentsFunction = function(receiveFileFunction) {
        if (typeof receiveFileFunction !== 'function') {
            throw new Error("ERROR in GDAppKineticsPlugin.prototype.setReceiveAttachmentsFunction: receiveFile parameter is not a function.");
        }

        var parms = []; // no parms
        cordovaExec(receiveFileFunction, receiveFileFunction,
            "GDAppKinetics", "readyToReceiveFile", parms);
    };

    /**
     * @function GDAppKinetics#callAppKineticsService
     *
     * @description Call this function to call any AppKinetics service.
     *
     * @param {string} applicationId ID of app to send to
     *
     * @param {string} serviceId ID of the service
     *
     * @param {string} version Version of the service
     *
     * @param {string} method Method of the service
     *
     * @param {object} parameters Parameters for the service as a dictionary
     *
     * @param {array} attachmentsNativeURL Array of attachments native paths (nativeURL),
     * which must reside within secure storage, see copyFilesToSecureFileSystem
     *
     * @param {function} onSuccess Callback function to invoke when the function returns successfully.
     *
     * @param {function} onError Callback function to invoke for error conditions, check the error string returned for cause.
     *
     * @example
     * window.plugins.GDAppKineticsPlugin.callAppKineticsService( "com.gd.exampleappkineticsfilebouncer",
     *      "com.demo.generic.call2", "1.0.0.0", "testMethod-FileAttachment",
     *     { "arrayEntry-3Elements" : [ "arrayEntry1", "arrayEntry2", "arrayEntry3"],
     *      "dictionary" : {"key1":"value1", "key2":"value2", "key3":"value3"}, "string" : "value" },
     *     [ "file:///path_to_directory_with_files/Brief GD Inter-Container Communication.pdf" ], // File attachment
     *     function(result) {
     *         alert("Email sent");
     *     },
     *     function(result) {
     *         alert("Failed to send email");
     *     }
     * );
     *
     */
    GDAppKineticsPlugin.prototype.callAppKineticsService = function(applicationId, serviceId,
        version, method, parameters, attachmentsNativeURL, onSuccess, onError) {

        if (typeof onSuccess !== 'function') {
            throw new Error("ERROR in GDAppKineticsPlugin.prototype.callAppKineticsService: onSuccess parameter is not a function.");
        }
        if (typeof onError !== 'function') {
            throw new Error("ERROR in GDAppKineticsPlugin.prototype.callAppKineticsService: onError parameter is not a function.");
        }

        var attachments = attachmentsNativeURL.map(function(attachmentNativeURL) {
            return attachmentNativeURL.replace(/^file:\/\/\/+/, "/");
        }),
            parms = [applicationId, serviceId, version, method, parameters, attachments];

        cordovaExec(onSuccess, onError, "GDAppKinetics", "callAppKineticsService", parms);
    };

    /**
     * @function GDAppKinetics#sendEmailViaGFE
     *
     * @description Call this function to send email via GFE (Good For Enterprise).
     *
     * @deprecated It will be removed in future versions. Use sendEmailViaBBWork function instead.
     *
     * @param {array} array Array of recipients email addresses
     *
     * @param {string} subject Subject of the email
     *
     * @param {string} text Text of the email
     *
     * @param {array} array Array of attachments which must reside within secure storage, see copyFilesToSecureFileSystem
     *
     * @param {function} onSuccess Callback function to invoke when the function returns successfully.
     *
     * @param {function} onError Callback function to invoke for error conditions, check the error string returned for cause.
     *
     * @example
     * window.plugins.GDAppKineticsPlugin.sendEmailViaGFE( ["sample@good.com"], "Test Email", "Hi, this is a test email", [],
     *     function(result) {
     *         alert("Email sent");
     *     },
     *     function(result) {
     *         alert("Failed to send email - unless GFE is not installed - check to see if GFE is not installed");
     *     }
     * );
     */
    GDAppKineticsPlugin.prototype.sendEmailViaGFE = function(arrayOfRecipients, subject, emailText,
        attachments, onSuccess, onError) {
        console.warn('"sendEmailViaGFE" function is deprecated in GDAppKineticsPlugin class. ' +
            'It will be removed in future versions.\n' +
            'Please, use "sendEmailViaBBWork" instead.');

        var params = ["", "com.good.gfeservice.send-email", "1.0.0.0", "sendEmail", {
                "to": arrayOfRecipients,
                "subject": subject,
                "body": emailText
            },
            attachments
        ];

        cordovaExec(onSuccess, onError, "GDAppKinetics", "callAppKineticsService", params);
    };

    /**
     * @function GDAppKinetics#sendEmailViaBBWork
     *
     * @description Call this function to securely compose email via "BlackBerry Work" that is service provider
     * for [Send Email Service](https://marketplace.blackberry.com/services/855115) service.
     * It calls "callAppKineticsService" method with pre-defined parameters - "com.good.gfeservice.send-email" serviceId,
     * "1.0.0.0" version and "sendEmail" method.
     *
     * @param {array} toRecipients Array of strings representing email addresses that will go into "TO" field
     * of the email in BlackBerry Work
     *
     * @param {array} ccRecipients Array of strings representing email addresses that will go into "CC" field
     * of the email in BlackBerry Work
     *
     * @param {array} bccRecipients Array of strings representing email addresses that will go into "BCC" field
     * of the email in BlackBerry Work
     *
     * @param {string} subject String representing "Subject" field of the email in BlackBerry Work
     *
     * @param {string} body String representing "Body" of the email in BlackBerry Work
     *
     * @param {array} attachmentsNativeURL Array of strings containing the paths of files in the BlackBerry Dynamics
     * secure file system that will be added to "Attachments" field of the email in BlackBerry Work
     *
     * @param {function} onSuccess Callback function to invoke when the function returns successfully.
     *
     * @param {function} onError Callback function to invoke for error conditions, check the error string returned for cause.
     *
     * @example
     * window.plugins.GDAppKineticsPlugin.sendEmailViaBBWork(
     *     ["to@example.com"],
     *     ["cc1@example.com", "cc2@example.com"],
     *     [],
     *     "Test subject",
     *     "Test body",
     *     ["file:///Inbox/data/testfile.doc"],
     *     function(result) {
     *         alert("Email data is successfully sent to Blackberry Work!");
     *     },
     *     function(result) {
     *         alert("Failed to send email data to BlackBerry Work, check if BlackBerry Work is installed!");
     *     }
     * );
     */
    GDAppKineticsPlugin.prototype.sendEmailViaBBWork = function(toRecipients, ccRecipients, bccRecipients,
        subject, body, attachmentsNativeURL, onSuccess, onError) {

        var attachments = attachmentsNativeURL ?
            attachmentsNativeURL.map(function(attachmentNativeURL) {
                return attachmentNativeURL.replace(/^file:\/\/\/+/, "/");
            }) : [],
            params = [
            "com.good.gcs",
            "com.good.gfeservice.send-email",
            "1.0.0.0",
            "sendEmail",
            {
                "to": toRecipients || [],
                "cc": ccRecipients || [],
                "bcc": bccRecipients || [],
                "subject": subject || "",
                "body": body || ""
            },
            attachments
        ];

        cordovaExec(onSuccess, onError, "GDAppKinetics", "callAppKineticsService", params);
    };

    /**
     * @function GDAppKinetics#readyToProvideService
     *
     * @description Call this function to provide an AppKinetics service.
     *
     * @param {string} serviceName Name of the service
     *
     * @param {string} versionOfService Version of the service
     *
     * @param {function} onSuccess Callback function to invoke when the app receives an app kinetics request matching
     * serviceName and service function.  The parameter received in the function is a dictionary of the received parameters
     * and file attachments in any.
     *
     * @param {function} onError Callback function to invoke for error conditions, check the error string returned for cause.
     *
     * @example
     * window.plugins.GDAppKineticsPlugin.readyToProvideService( "com.demo.generic.call", "1.0.0.0",
     *     function(result) {
     *         alert("Object received from " + result.applicationName + " with service " + result.serviceName + " version - " + result.version +
     *              " using method - " + result.method + " with parameters - " + JSON.stringify( result.parameters ) + " and attachments - " + JSON.stringify( result.attachments ));
     *     },
     *     function(result) {
     *         alert("Failed to receive email service");
     *     }
     * );
     */
    GDAppKineticsPlugin.prototype.readyToProvideService = function(serviceName, versionOfService,
        onSuccess, onError) {

        cordovaExec(onSuccess, onError, "GDAppKinetics", "readyToProvideService", [
            serviceName, versionOfService
        ]);
    };

    /**
     * @function GDAppKinetics#getServiceProvidersFor
     *
     * @description Call this function to get the list of the available service providers of a specified service.
     *
     * @param {string} serviceId Identifier of the service
     *
     * @param {string} version Version of the service
     *
     * @param {function} onSuccess Callback function to invoke when the function returns successfully.
     *
     * @param {function} onError Callback function to invoke for error conditions.
     *
     * @example
     * window.plugins.GDAppKineticsPlugin.getServiceProvidersFor("com.good.gdservice.transfer-file", "1.0.0.0",
     *    function(result) {
     *        alert("Received details: " + result);
     *    },
     *    function(result) {
     *        alert("An error occurred while getting the available service providers: " + result);
     *    }
     * );
     */
    GDAppKineticsPlugin.prototype.getServiceProvidersFor = function(serviceId, version, onSuccess, onError) {
        if (serviceId === null || typeof serviceId === 'undefined') {
            throw new Error("Null serviceId passed to GDAppKineticsPlugin.getServiceProvidersFor.");
        }

        if (typeof onSuccess !== 'function') {
            throw new Error("ERROR in GDAppKineticsPlugin.getServiceProvidersFor: onSuccess parameter is not a function.");
        }

        if (typeof onError !== 'function') {
            throw new Error("ERROR in GDAppKineticsPlugin.getServiceProvidersFor: onError parameter is not a function.");
        }

        var success = function(result) {
            onSuccess(JSON.parse(result));
        };

        cordovaExec(success, onError, "GDAppKinetics", "getServiceProvidersFor", [serviceId, version]);
    };

    // ***** END: MODULE METHOD DEFINITIONS - GDAppKinetics *****
    // hide functions implementation in web inspector
    for (protoFunction in GDAppKineticsPlugin.prototype) {
        if (GDAppKineticsPlugin.prototype.hasOwnProperty(protoFunction) &&
            typeof GDAppKineticsPlugin.prototype[protoFunction] === 'function') {

            var objProtoProperty = GDAppKineticsPlugin.prototype[protoFunction],
                isFuncNamePropConfigurable = Object.getOwnPropertyDescriptor(objProtoProperty, 'name').configurable;

            // Checking, if function property 'name' is configurable
            // (for old browser, which has pre-ES2015 implementation(Android 5.0) function name property isn't configurable)
            if (isFuncNamePropConfigurable) {
                Object.defineProperty(GDAppKineticsPlugin.prototype[protoFunction],
                    'name', {
                        value: protoFunction,
                        configurable: false
                    }
                );
            }

            Object.defineProperty(GDAppKineticsPlugin.prototype[protoFunction],
                'toString', {
                    value: function() {
                        var funcName = this.name || protoFunction;
                        return 'function ' + funcName + '() { [native code] }';
                    },
                    writable: false,
                    configurable: false
                });
        }
    }

    Object.preventExtensions(GDAppKineticsPlugin.prototype);

    var gdAppKineticsPlugin = new GDAppKineticsPlugin();
    Object.preventExtensions(gdAppKineticsPlugin);

    // Install the plugin.
    module.exports = gdAppKineticsPlugin;
}()); // End the Module Definition.
//************************************************************************************************
