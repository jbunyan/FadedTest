Introduction to BlackBerry Dynamics SDK for Cordova
===================================================
# Supportability

#### Node.js

- We recommend to use the latest stable version of Node.js 12.X (LTS).

#### Cordova

- Cordova 11.0.0
- Cordova 10.0.0 (DEPRECATED)
  >  Note: `cordova-android@10.1.1` is the only supported version for Cordova 10 project on Android platform.
  To upgrade run following commands:
  `$ cordova platform remove android`  
  `$ cordova platform add android@10.1.1`

#### Ionic

- Ionic 6
- Ionic 5 (DEPRECATED)
- **cordova-plugin-bbd-base** supports `--cordova` *integration* and following *types*:
    - `--type=ionic-angular`
    - `--type=ionic1`
- **[capacitor-plugin-bbd-base](https://github.com/blackberry/blackberry-dynamics-cordova-plugins#capacitor-base)** supports `--capacitor` *integration* and following *types*:
    - `--type=ionic-angular`
    - `--type=ionic-react`
    - `--type=ionic-vue`
- `cordova-android@10.1.1` is the only supported version on Android

#### Xcode (iOS)

- Install `xcodeproj` Ruby gem for `cordova-plugin-bbd-base` plugin:
    ```
    $ sudo gem install xcodeproj
    ```
    NOTE: required Ruby version >= 2.0.0

# Recent Changes

#### Ionic Capacitor support

The Dynamics SDK for Cordova now supports Ionic Capacitor projects.
New **[capacitor-plugin-bbd-base](https://github.com/blackberry/blackberry-dynamics-cordova-plugins#capacitor-base)** is available that adds all needed configurations to be able to use `BlackBerry Dynamics` in your Ionic Capacitor application.

#### `cordova-plugin-push` support
The Dynamics SDK for Cordova is compatible with [`cordova-plugin-push`](https://github.com/havesource/cordova-plugin-push) Cordova plugin.
A Dynamics Cordova application is able to receive push notifications in the following scenarios:
 - Application is in background
 - Application is in foreground
 - When notifications are received and the application isn't running (`coldstart` scenario)
##### Known issues
###### Limitation in case of `coldstart` scenario on iOS
There is one limitation in case of `coldstart` scenario on iOS. On receipt of a push notification, the notification with title and body can be opened, but the notification and payload will not be received by the application after launch.
###### Conflict between default and secure SQLite library on iOS
BlackBerry Dynamcis SDK for iOS uses secure *SQLite* library to provide secure DB connection and management.
Many standard and 3rd party Cordova plugins use default *SQLite* library.
When both default and secure *SQLite* libraries are linked to the project it causes conflict with unpredictable behavior.
**Example: `cordova-plugin-push`**
Let's consider a concrete example:
**`cordova-plugin-bbd-base`** - is main plugin from **BlackBerry Dynamics SDK for Cordova** that integrates BlackBerry Dymamics into Cordova application. BlackBerry Dymamics, in turn, provides secure *SQLite* dependency to the project.
**[`cordova-plugin-bbd-sqlite-storage`](https://github.com/blackberry/BlackBerry-Dynamics-Cordova-Plugins#sqlite-storage)** - plugin from **BlackBerry Dynamics SDK for Cordova** that provides secure DB connection and management.
**`cordova-plugin-push`** links default *SQLite* library in the project. This is an extract of `xcconfig` of the Cordova application with added `cordova-plugin-push`:
*OTHER_LDFLAGS = $(inherited) -ObjC -l"sqlite3" ...*
When the project is compiled and run DB functionality works incorrectly.
**Workaround**
To resolve the conflict **`sqlite3`** dependency should be removed from both **debug** and **release** `xcconfig` files under following path: **`<app>/platforms/ios/Pods/Target Support Files/Pods-<appName>/Pods-<appName>.<config>.xcconfig`**
This should not break anything as secured **`sqlite3`** dependency will remain linked to the project.

#### Dynamics SDK Dependancy

Dynamics SDK for iOS and Android are now installed as part of the Base plugin using CocoaPods & Gradle. The integration uses the iOS "Dynamic Framework" version of BlackBerry Dynamics as the static library is no longer supported.

NOTE: As CocoaPods is used, you need to open <application>.xcworkspace instead of <application>.xcodeproj in Xcode.

#### Configure plugin removed

As the Dynamics SDK for iOS and Android is now installed as part of the Base plugin, the Configure plugin is no longer required.

#### UIWebView is not supported

`UIWebView` has been deprecated for some time. In 2020 Apple announced that they will start to reject apps with `UIWebView` references from AppStore. Because of this reason BlackBerry Dynamics SDK for iOS v8.0+ and BlackBerry Dynamics SDK for Cordova v8.0+ removed `UIWebView` support.
Starting from version 8.0 all Cordova applications for iOS based on BlackBerry Dynamics SDK for Cordova will use `WKWebView`. When BlackBerry Dynamics Cordova Base plugin is added to Cordova application it will add [cordova-plugin-wkwebview-engine](https://github.com/apache/cordova-plugin-wkwebview-engine) automatically with `WKWebViewOnly` option turned on by default. For more details see following [article](https://cordova.apache.org/howto/2020/03/18/wkwebviewonly.html).

#### BBWebView Integration on Android

`BBWebView` has been integrated into the BlackBerry Dynamics Cordova Base plugin. See below.

# Using BBWebView Integration on Android

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

#### XMLHttpRequest plugin is deprecated

As `XMLHttpRequest` is secured by `BBWebView`, `cordova-plugin-bbd-xmlhttprequest` is deprecated and will be removed in future releases.

# Dynamics Cordova plugins

Repository https://github.com/blackberry/BlackBerry-Dynamics-Cordova-Plugins contains following Cordova plugins separated into branches:
 - `capacitor-base` branch corresponds to [capacitor-plugin-bbd-base](https://github.com/blackberry/BlackBerry-Dynamics-Cordova-Plugins/tree/capacitor-base) plugin
 - `file` branch corresponds to [cordova-plugin-bbd-file](https://github.com/blackberry/BlackBerry-Dynamics-Cordova-Plugins/tree/file) plugin
 - `file-transfer` branch corresponds to [cordova-plugin-bbd-file-transfer](https://github.com/blackberry/BlackBerry-Dynamics-Cordova-Plugins/tree/file-transfer) plugin
 - `sqlite-storage` branch corresponds to [cordova-plugin-bbd-sqlite-storage](https://github.com/blackberry/BlackBerry-Dynamics-Cordova-Plugins/tree/sqlite-storage) plugin
 - `inappbrowser` branch corresponds to [cordova-plugin-bbd-inappbrowser](https://github.com/blackberry/BlackBerry-Dynamics-Cordova-Plugins/tree/inappbrowser) plugin
 - `media-capture` branch corresponds to [cordova-plugin-bbd-media-capture](https://github.com/blackberry/BlackBerry-Dynamics-Cordova-Plugins/tree/media-capture) plugin

> Please visit appropriate branch in order to take a look at the implementation of specific plugin.

## capacitor-plugin-bbd-base
`capacitor-plugin-bbd-base` adds all needed configurations to be able to use `BlackBerry Dynamics` in your Ionic Capacitor application.
It is similar to `cordova-plugin-bbd-base` that adds all needed configurations to be able to use `BlackBerry Dynamics` in Cordova-based or Ionic-Cordova-based projects.
All the other BlackBerry Dynamics Cordova plugins require the Capacitor Base plugin to be installed as dependency.
#### Installation
```
$ npm install git+https://github.com/blackberry/blackberry-dynamics-cordova-plugins#capacitor-base
```
#### Uninstallation
```
$ npm uninstall capacitor-plugin-bbd-base
```

## cordova-plugin-bbd-file
`cordova-plugin-bbd-file` is a fork of [cordova-plugin-file@6.0.1](https://github.com/apache/cordova-plugin-file).
This plugin enables you to manage the FileSystem residing within the BlackBerry Dynamics secure container using a similar JavaScript API to the original plugin.
#### Installation
```
$ cordova plugin add git+https://github.com/blackberry/BlackBerry-Dynamics-Cordova-Plugins#file
```
#### Uninstallation
```
$ cordova plugin rm cordova-plugin-bbd-file
```

## cordova-plugin-bbd-file-transfer
`cordova-plugin-bbd-file-transfer` is a fork of [cordova-plugin-file-transfer@1.7.2](https://github.com/apache/cordova-plugin-file-transfer).
This plugin enables you to securely upload and download files within the BlackBerry Dynamics secure container using a similar JavaScript API to the original plugin.
> It should be used instead of `cordova-plugin-bbd-filetransfer` plugin which was deprecated and is removed from package now.
#### Installation
```
$ cordova plugin add git+https://github.com/blackberry/BlackBerry-Dynamics-Cordova-Plugins#file-transfer
```
#### Uninstallation
```
$ cordova plugin rm cordova-plugin-bbd-file-transfer
```

## cordova-plugin-bbd-sqlite-storage
`cordova-plugin-bbd-sqlite-storage` is a fork of [cordova-plugin-sqlite-storage@4.0.0](https://github.com/litehelpers/Cordova-sqlite-storage).
This plugin enables you to securely create and manage an SQLite database within the BlackBerry Dynamics secure container using a similar JavaScript SQLite API to the original plugin.
> It should be used instead of `cordova-plugin-bbd-sqlite` plugin which was deprecated and is removed from package now.
#### Installation
```
$ cordova plugin add git+https://github.com/blackberry/BlackBerry-Dynamics-Cordova-Plugins#sqlite-storage
```
#### Uninstallation
```
$ cordova plugin rm cordova-plugin-bbd-sqlite-storage
```

## cordova-plugin-bbd-inappbrowser
`cordova-plugin-bbd-inappbrowser` is a fork of [cordova-plugin-inappbrowser@5.0.0](https://github.com/apache/cordova-plugin-inappbrowser/tree/5.0.x).
This plugin enables you to securely load helpful articles, videos, and web resources inside of your app without leaving your app.

#### Installation
```
$ cordova plugin add git+https://github.com/blackberry/BlackBerry-Dynamics-Cordova-Plugins#inappbrowser
```
#### Uninstallation
```
$ cordova plugin rm cordova-plugin-bbd-inappbrowser
```

## cordova-plugin-bbd-media-capture
`cordova-plugin-bbd-media-capture` is a fork of [cordova-plugin-media-capture@3.0.4-dev](https://github.com/apache/cordova-plugin-media-capture).
This plugin enables you to capture audio, video and images using device's camera and store them within the BlackBerry Dynamics secure container using a similar JavaScript API to the original plugin.

#### Installation
```
$ cordova plugin add git+https://github.com/blackberry/BlackBerry-Dynamics-Cordova-Plugins#media-capture
```
#### Uninstallation
```
$ cordova plugin rm cordova-plugin-bbd-media-capture
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

# Sample Applications

The BlackBerry Dynamics SDK for Cordova includes sample applications, at
the following path:

    BlackBerry_Dynamics_SDK_for_Cordova_<version>/SampleApplications/

By default, sample applications only have HTML, CSS, and JS code.

To start using the BlackBerry Dynamics Cordova sample applications, just add the
platforms that you need:

    $ cd SampleApplications/<sample_application>
    
    $ npm install
    
    $ cordova platform add android
    # OR
    $ cordova platform add ios
    # OR
    $ cordova platform add android ios

> There are other sample applications available on [BlackBerry Github](https://github.com/blackberry/BlackBerry-Dynamics-Cordova-Samples/) like `Secure-ICC` (Ionic-based project with Cordova integration and Angular type), `Secure-ICC-Ionic-Capacitor-Angular` (Ionic-based project with Capacitor integration and Angular type) or `InAppBrowser` (pure Cordova project).

