BBD Cordova InterAppCommunication plugin (DEPRECATED)
========================================
> The InterAppCommunication plugin is used to return information about a service provider application.

Location
========
`BlackBerry_Dynamics_SDK_for_Cordova_<version>/plugins/cordova-plugin-bbd-interappcommunication`

> __Note:__ `BBD Cordova InterAppCommunication plugin` is dependent on
> * `BBD Cordova Base plugin`

Installation
============
To add this plugin to your application, run the following command in the project directory:
```
$ cd <path/to/package>/BlackBerry_Dynamics_SDK_for_Cordova_<version>/plugins/cordovaApp
$ cordova plugin add ../cordova-plugin-bbd-interappcommunication
```

API reference
=============
Note that `GDInterAppCommunication` API is deprecated since version 10.1. Use `AppKinetics` API reference instead, see more details below.

`window.plugins.GDInterAppCommunication.getGDAppDetails`
```javascript
/** @function GDInterAppCommunication#getGDAppDetails
* @description This method check for apps installed on device
* @deprecated It will be removed in future versions. Use getServiceProvidersFor function from AppKinetics plugin instead
* @param {string} id Service ID.
* @param {string} version Service version
* @param {function} onSuccess Callback function to invoke when the function returns successfully.
* @param {function} onError Callback function to invoke for error conditions.
*/
function success(result) {
    alert("Recieved details: " + result);
};
function fail(result) {
    alert("An error occurred while recieving the application details: " + result);
};

function getGDAppDetails(){
    window.plugins.GDInterAppCommunication.getGDAppDetails("", "", success, fail);
};
```
