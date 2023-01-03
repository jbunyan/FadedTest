BlackBerry Dynamics Cordova Base plugin
=======================================
> The Base plugin adds all the needed configuration to be able to use BlackBerry
> Dynamics in your Cordova application. All the other BlackBerry Dynamics
> Cordova plugins require the Base plugin to be installed as dependency.

Location
========
`BlackBerry_Dynamics_SDK_for_Cordova_<version>/plugins/cordova-plugin-bbd-base`

Preconditions
=============

- Install `xcodeproj` Ruby gem for `cordova-plugin-bbd-base` plugin:
    ```
    $ sudo gem install xcodeproj
    ```
    NOTE: required Ruby version >= 2.0.0


## Dynamics SDK Dependancy
Dynamics SDK for iOS and Android are installed as part of the `cordova-plugin-bbd-base` plugin using CocoaPods & Gradle.
### BlackBerry Dynamics SDK for iOS integration
The integration uses the iOS "Dynamic Framework" version of BlackBerry Dynamics as the static library is no longer supported.
There are a few options to integrate BlackBerry Dynamics SDK for iOS.
#### Using latest released version - default
By default, `cordova-plugin-bbd-base` plugin will integrate **latest** available BlackBerry Dynamics SDK for iOS using following podspec: `https://software.download.blackberry.com/repository/framework/dynamics/ios/11.0.1.137/BlackBerryDynamics-11.0.1.137.podspec`.
> NOTE: If one of the below integration methods was used there is an option to reset **default** configuration by running following command:
`$ cd <path>/BlackBerry_Dynamics_SDK_for_Cordova_vX.X.X.X/plugins/cordova-plugin-bbd-base`
**`$ node scripts/setDynamicsPodSpec.js --default`**
`$ cd <path_to_your_app>`
Remove Base plugin **only if** it was previously added
`$ cordova plugin rm cordova-plugin-bbd-base`
`$ cordova plugin add <path>/BlackBerry_Dynamics_SDK_for_Cordova_vX.X.X.X/plugins/cordova-plugin-bbd-base`
`$ cordova build`

#### Using other released version
There is possibility to integrate other released build of BlackBerry Dynamics SDK for iOS.
Following command should be run:
```
$ cd <path>/BlackBerry_Dynamics_SDK_for_Cordova_vX.X.X.X/plugins/cordova-plugin-bbd-base
$ node scripts/setDynamicsPodSpec.js --url "https://software.download.blackberry.com/repository/framework/dynamics/ios/10.1.0.36/BlackBerryDynamics-10.1.0.36.podspec"
$ cd <path_to_your_app>
// Remove Base plugin only if it was previously added
$ cordova plugin rm cordova-plugin-bbd-base
$ cordova plugin add <path>/BlackBerry_Dynamics_SDK_for_Cordova_vX.X.X.X/plugins/cordova-plugin-bbd-base
$ cordova build
```
#### Using locally downloaded version
Also, it is possible to integrate manually downloaded BlackBerry Dynamics SDK for iOS from local place.
Following command should be run:
```
$ cd <path>/BlackBerry_Dynamics_SDK_for_Cordova_vX.X.X.X/plugins/cordova-plugin-bbd-base
$ node scripts/setDynamicsPodSpec.js --path "/Users/<user>/Downloads/gdsdk-release-dylib-X.X.X.X/BlackBerry_Dynamics_SDK_for_iOS_vX.X.X.X_dylib"
$ cd <path_to_your_app>
// Remove Base plugin only if it was previously added
$ cordova plugin rm cordova-plugin-bbd-base
$ cordova plugin add <path>/BlackBerry_Dynamics_SDK_for_Cordova_vX.X.X.X/plugins/cordova-plugin-bbd-base
$ cordova build
```

BBWebView is integrated on Android
==================================
`BBWebView` has been integrated into the BlackBerry Dynamics Cordova Base plugin.
When the Base plugin is added to a Cordova application for Android the following settings are set in root config.xml:
 - `<preference name="webview" value="com.good.gd.cordova.core.webview.engine.BBDWebViewEngine" />` global preference.
 - `<content src="https://appassets.androidplatform.net/assets/www/*.html" />` entry point for Android platform.
 According to this [article](https://developer.android.com/reference/androidx/webkit/WebViewAssetLoader), loading local files using web-like URLs instead of `"file://"` is desirable as it is compatible with the Same-Origin policy.
 
Also, for Ionic-based projects on Android `<preference name="BBWebView-for" value="ionic" />` is set additionally in root config.xml. The `<content src=... />` tag of root config.xml is not changed in this case as Ionic app is loaded via local web server by default under the hood.

As a result, `BBWebView` becomes the default webview for Dynamics Cordova and Ionic applications on Android. This enables the following features:
 - Dynamics Cordova/Ionic application on Android is loaded via `BBWebView`
 - `XMLHttpRequest` and `fetch` ajax requests are intercepted and routed through Dynamics infrastructure
 - HTML form submissions are intercepted and routed through Dynamics infrastructure
 - `document.cookie` are stored in secure container

#### How to switch to default Cordova webview?
To revert to the default Cordova webview in Dynamics Cordova application for Android the following settings should be removed from root config.xml and the project re-built.
 - `<preference name="webview" value="com.good.gd.cordova.core.webview.engine.BBDWebViewEngine" />`
 - `<content src="https://appassets.androidplatform.net/assets/www/*.html" />`

In case of Dynamics Ionic application for Android the `<preference name="BBWebView-for" value="ionic" />` setting should be removed as well.

UIWebView is not supported
==========================
`UIWebView` has been deprecated for some time.
In 2020 Apple announced that they will start to reject apps with `UIWebView` references from AppStore. Because of this reason BlackBerry Dynamics SDK for iOS v8.0+ and BlackBerry Dynamics SDK for Cordova v8.0+ removed `UIWebView` support.
Starting from version 8.0 all Cordova applications for iOS based on BlackBerry Dynamics SDK for Cordova will use `WKWebView`.

Custom `Activity` subclass
==========================================
The plugin provides an `Activity` subclass `com.good.gd.cordova.core.MainActivity` which is subclass of `BBDCordovaActivity` that, in turn, extends `CordovaActivity`.

`com.good.gd.cordova.core.MainActivity` is, by default, the main activity in Cordova application for Android.

In a case you want to use your custom `CordovaActivity` subclass, it should extend our `com.good.gd.cordova.core.BBDCordovaActivity` to guarantee right integration with BlackBerry Dynamics SDK for Android.
Also, to avoid merging issues of Cordova configuration files you should do one of following options:
-   remove appropriate `edit-config` tag in `<app>/plugins/cordova-plugin-bbd-base/plugin.xml` and define your own in root `config.xml` with your custom `com.good.gd.cordova.core.BBDCordovaActivity` subclass
-   in appropriate `edit-config` tag in `<app>/plugins/cordova-plugin-bbd-base/plugin.xml` replace `com.good.gd.cordova.core.MainActivity` with your custom `com.good.gd.cordova.core.BBDCordovaActivity` subclass

Second option is probably easier.
After this is done it might be necessary to run `cordova prepare` command to get your changes applied. 

Custom `Application` subclass
==========================================
The plugin provides `com.good.gd.cordova.core.BBDCordovaApp` which is an `Application` subclass and is, by default, the main `Application` class in Cordova application for Android. 

In a case you decided to use some custom `Application` subclass, this class should extend `com.good.gd.cordova.core.BBDCordovaApp` to guarantee right integration with BlackBerry Dynamics SDK for Android.
Also, to avoid merging issues of Cordova configuration files you should do one of following options:
-   remove appropriate `edit-config` tag in `<app>/plugins/cordova-plugin-bbd-base/plugin.xml` and define your own in root `config.xml` with your custom `com.good.gd.cordova.core.BBDCordovaApp` subclass
-   in appropriate `edit-config` tag in `<app>/plugins/cordova-plugin-bbd-base/plugin.xml` replace `com.good.gd.cordova.core.BBDCordovaApp` with your custom `com.good.gd.cordova.core.BBDCordovaApp` subclass

Second option is probably easier.
After this is done it might be necessary to run `cordova prepare` command to get your changes applied. 

Custom preferences for BlackBerry Dynamics
==========================================
A number of custom preferences are supported by this plugin. The preferences
correspond to BlackBerry Dynamics features in the SDKs for Android and iOS.

The usual Cordova system is followed for the specification of BlackBery Dynamics
preferences. Add a `preference` tag to the `config.xml` file in the Cordova
project directory for each preference being specified. Put the preference tags
in one of the following locations.

-   In the root `widget` tag, to set the preference for all platforms.
-   In the `platform` tag with `name="android"`, to set the preference for
    Android only.
-   In the `platform` tag with `name="ios"`, to set the preference for iOS only.

The custom preferences supported by this plugin are as follows.

-   Preference: Enterprise Simulation mode.

    To run your application in Enterprise Simulation mode, set the following
    preference.
    ```
    <preference name="GDEnterpriseSimulationMode" value="true" />
    ```

    For details of Enterprise Simulation mode, see either of the following pages
    in the reference documentation on the application developer portal.

    -   For Android: https://community.blackberry.com/view-doc.jspa?fileName=enterprisesimulation.html&docType=android
    -   For iOS: https://community.blackberry.com/view-doc.jspa?fileName=enterprisesimulation.html&docType=api

-   Preference: BlackBerry Dynamics entitlement identifier and version.

    To set the entitlement identifier and version of the application, set the
    following preferences.
    ```
    <preference name="GDApplicationID" value="com.yourdomain.yourentitlementid" />
    <!-- Following line sets entitlement version to 1.0.0.0 -->
    <preference name="GDApplicationVersion" value="1.0.0.0" />
    ```

    For best practice in setting these values, see either of the following pages
    on the application developer portal. Look for the Identification heading.

    -   For Android: https://community.blackberry.com/view-doc.jspa?fileName=classcom_1_1good_1_1gd_1_1_g_d_android.html&docType=android
    -   For iOS: https://community.blackberry.com/view-doc.jspa?fileName=interface_g_di_o_s.html&docType=api

-   Preference: Enterprise discovery URL scheme.

    To add the enterprise discovery URL scheme to your Cordova application for
    iOS, add the following preference.
    ```
    <preference name="BBD_Enterprise_Discovery" value="true" />
    ```

    The enterprise discovery URL scheme doesn't apply to Android. Set this
    preference in the platform tag for iOS.

    For details of the custom URL schemes utilised by BlackBerry Dynamics
    applications, see the following page in the reference documentation on the
    application developer portal.

    -   https://community.blackberry.com/view-doc.jspa?fileName=_build_time_configuration.html&docType=api

    This preference corresponds to the URL scheme:
    `com.good.gd.discovery.enterprise`

-   Preference: Face ID usage declaration.

    Face ID is a facial recognition feature that is available on some iOS
    devices. The BlackBerry Dynamics management console has a policy setting by
    which the enterprise administrator can allow end users to authenticate using
    Face ID. All BlackBerry Dynamics iOS applications must therefore declare
    usage of the Face ID capability.

    For more background, see the following page on the application developer
    portal. Look for the Face ID heading.

    -   https://community.blackberry.com/view-doc.jspa?fileName=_build_time_configuration.html&docType=api

    The Base plugin can add a declaration of Face ID usage to your iOS
    application. It does this by inserting an `NSFaceIDUsageDescription`
    property, with value "Enables authentication without a password." into the
    Info.plist file.

    Adding the declaration is the default behaviour. It can be selected
    explicitly by setting the following preference in the root config.xml either
    globally or for iOS platform specifically.
    ```
    <preference name="addFaceIDUsage" value="On" />
    ```

    Automatic addition can be switched off by setting the following preference
    instead.
    ```
    <preference name="addFaceIDUsage" value="Off" />
    ```

    Don't switch off automatic addition unless your application uses Face ID for
    some other reason than BlackBerry Dynamics integration. In that case, you
    will already have a usage declaration, to which you should add a text like
    the above.

    The Base plugin doesn't add localized versions of the usage message
    automatically. This can be done manually, by adding InfoPlist.strings files
    in the usual way. This is described on the apple.com developer website
    here:

    -   https://developer.apple.com/library/content/documentation/General/Reference/InfoPlistKeyReference/Articles/AboutInformationPropertyListFiles.html

Setting these preferences will result in corresponding changes to the
application declaration files: the `assets/settings.json` and
`AndroidManifest.xml` files, for Android, and the Info.plist file, for iOS. If
you don't use the preferences, you must change those files manually in order to
make use of the corresponding features.

Support for the "mailto:" URL scheme
====================================
The Base plugin supports use of RFC-2368 and RFC-6068, the "mailto:" URL scheme,
to initiate composition of email messages. The email client used for composition
will be a secure email service provider, such as BlackBerry Work, if available,
or a native application, if available and allowed by enterprise policy.

The Base plugin on its own doesn't support email attachments. The BlackBerry
Dynamics MailTo plugin (cordova-plugin-bbd-mailto) does support attachments.
That plugin is included in the BlackBerry Dynamics SDK for Cordova and can be
added to a Cordova project in the usual way.

Logs management
===============
`cordova-plugin-bbd-base` plugin also sets logging settings for Dynamics Cordova application using `GDConsoleLogger`. 
> For more details please visit related docs for [iOS](https://developer.blackberry.com/devzone/files/blackberry-dynamics/ios/logging.html) and [Android](https://developer.blackberry.com/devzone/files/blackberry-dynamics/android/logging.html).

#### Logs management on iOS
On iOS by default following setting is set in `plugin.xml` of `Base` plugin:
```xml
<platform name="ios">
    ...
    <config-file parent="GDConsoleLogger" target="*-Info.plist">
        <string>GDFilterDetailed</string>
    </config-file>
    ...
</platform>
```
To enable detailed logging `GDFilterNone` value should be set for `GDConsoleLogger` property:
```xml
<platform name="ios">
    ...
    <config-file parent="GDConsoleLogger" target="*-Info.plist">
        <string>GDFilterNone</string>
    </config-file>
    ...
</platform>
```

#### Logs management on Android
On Android by default following setting is set in `assets/android/settings.json` of `Base` plugin:
```json
{
  ...
  "GDConsoleLogger": [
    "GDFilterErrors_",
    "GDFilterWarnings_",
    "GDFilterInfo_",
    "GDFilterDetailed_"
  ]
}
```
To enable detailed logging `GDFilterNone` value should be set for `GDConsoleLogger` property:
```json
{
  ...
  "GDConsoleLogger": [ "GDFilterNone" ]
}
```

# Android SafetyNet
BlackBerry UEM version 12.10 and later supports [SafetyNet](https://developers.google.com/android/reference/com/google/android/gms/safetynet/SafetyNet) attestation for BlackBerry Dynamics apps. You can use SafetyNet to extend BlackBerry's root and exploit detection by adding checks for device tampering and application integrity. For more information about SafetyNet attestation, implementation considerations, and instructions for enabling the feature, see the [BlackBerry UEM Configuration Guide](https://docs.blackberry.com/en/endpoint-management/blackberry-uem/current/installation-configuration/configuration). This chapter details considerations for developers who want to enable SafetyNet support for their BlackBerry Dynamics apps.
## Adding the GDSafetyNet library to the app project
The BlackBerry Dynamics SDK for Android version 5.0 and later includes a GDSafetyNet library. To support SafetyNet, add this library to the app project dependencies along with the main GDLibrary.

The GDSafetyNet library includes all of the client-side source code that is required to support SafetyNet. No additional app code is required. The GDSafetyNet library requires Google Play Services 11.0 or later to use device SafetyNet APIs. Verify that your BlackBerry Dynamics app is dependent on only a single version of Google Play Services.
```
implementation 'com.google.android.gms:play-services-safetynet:xx.x.x'
implementation 'com.blackberry.blackberrydynamics:android_handheld_gd_safetynet:+'
```
It can be added in `cordova-plugin-bbd-base/scripts/gradle/bbd.gradle` before Base plugin is added to the application.
## Completing SafetyNet registration
You must [obtain an API key from Google](https://developer.android.com/training/safetynet/attestation#add-api-key) and add it to the app’s AndroidManifest.xml file in the <application> element:
```
<meta-data android:name="com.blackberry.attestation.ApiKey" android:value="YOUR_API_KEY" />
```
More details can be found [here](https://docs.blackberry.com/en/development-tools/blackberry-dynamics-sdk-android/10_0/blackberry-dynamics-sdk-android-devguide/Implementing-SafetyNet-attestation-for-BlackBerry-Dynamics-apps).

Preconditions
=============
Check the following before running the script.
1.  Install `xcodeproj` Ruby gem for `cordova-plugin-bbd-base` plugin:
    ```
    $ sudo gem install xcodeproj
    ```
    NOTE: required Ruby version >= 2.0.0

Adding to a Cordova application
===============================
This plugin can be added to Cordova application as follows:
```
$ cd BlackBerry_Dynamics_SDK_for_Cordova_<version>
$ cordova create MyApp my.app.id App
$ cd MyApp
$ cordova platform add android
OR/AND
$ cordova platform add ios
$ cordova plugin add ../plugins/cordova-plugin-bbd-base
$ cordova build
```

Adding to an Ionic application
==============================
This plugin can be added to Ionic application as follows:
#### `type=ionic1`
```
$ cd BlackBerry_Dynamics_SDK_for_Cordova_<version>
$ ionic start <appName> <template> --cordova --type=ionic1
$ cd <appName>
$ ionic cordova platform add ios
OR/AND
$ ionic cordova platform add android
$ ionic cordova plugin add ../plugins/cordova-plugin-bbd-base
$ ionic cordova build
```
#### `type=ionic-angular`
```
$ cd BlackBerry_Dynamics_SDK_for_Cordova_<version>
$ ionic start <appName> <template> --cordova --type=ionic-angular
$ cd <appName>
$ ionic cordova platform add ios
OR/AND
$ ionic cordova platform add android
$ ionic cordova plugin add ../plugins/cordova-plugin-bbd-base
$ ionic cordova build
```
