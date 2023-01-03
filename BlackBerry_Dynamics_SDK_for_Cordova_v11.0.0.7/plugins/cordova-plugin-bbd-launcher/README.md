BBD Cordova Launcher plugin
========================================
> The Launcher plugin is used to show the BlackBerry Dynamics Launcher in your application. 

> The BlackBerry Dynamics Launcher is the blue BlackBerry icon located in BlackBerry Dynamics apps. It primarily enables a user to quickly switch between BlackBerry Dynamics application installed on their device. 

> For further information please see the 'BlackBerry Dynamics Launcher Framework' under Developer tools at https://docs.blackberry.com

Location
========
`BlackBerry_Dynamics_SDK_for_Cordova_<version>/plugins/cordova-plugin-bbd-launcher`

> __Note:__ `BBD Cordova Launcher plugin` is dependent on
> * `BBD Cordova Base plugin`

Installation
============
To add this plugin to your application, run the following command in the project directory:
```
$ cd <path/to/package>/BlackBerry_Dynamics_SDK_for_Cordova_<version>/plugins/cordovaApp
$ cordova plugin add ../cordova-plugin-bbd-launcher
```

API reference
=============
`window.launcher.show`
```javascript
/**
* @function Launcher#show
*
* @description This function shows Launcher button
* 
* @return {undefined} always
*/
window.launcher.show();
```

`window.launcher.hide`
```javascript
/**
* @function Launcher#hide
*
* @description This function shows Launcher button
* 
* @return {undefined} always
*/
window.launcher.hide();
```

`window.launcher.open`
```javascript
/**
* @function Launcher#open
*
* @description This function opens Launcher button
* NOTE: method is available only on iOS
* 
* @return {undefined} always
*/
window.launcher.open();
```

`window.launcher.close`
```javascript
/**
* @function Launcher#close
*
* @description This function closes Launcher button
* NOTE: method is available only on iOS
* 
* @return {undefined} always
*/
window.launcher.close();
```
