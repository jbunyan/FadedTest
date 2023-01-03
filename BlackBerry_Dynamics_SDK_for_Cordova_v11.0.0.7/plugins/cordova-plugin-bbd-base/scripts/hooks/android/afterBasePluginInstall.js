#!/usr/bin/env node

/*
 * (c) 2022 BlackBerry Limited. All rights reserved.
 */

// This hook is used for config.xml, AndroidManifest.xml, settings.json, settings.gradle, project.properties files
// configuration after the Base plugin was installed on android platform.
// NOTE: the manifest file can be self-restored during plugin installation (during platform adding process.)
// Fixed by after_plugin_add android hook.

var os = require('os'),
    fse = require('fs-extra'),
    et = require('elementtree');
require('shelljs/global');

module.exports = function(context) {

    var fs = require('fs'),
        path = require('path');

    var platformRoot = path.join(context.opts.projectRoot, 'platforms', 'android'),
        manifestFilePath = path.join(platformRoot, 'app', 'src', 'main', 'AndroidManifest.xml'),
        ManifestHelper = require('../../../src/android/AndroidHelper.js').ManifestHelper,
        CommonHelper = require('../../../src/android/AndroidHelper.js').CommonHelper,
        SettingsJsonHelper = require('../../../src/android/AndroidHelper.js').SettingsJsonHelper;

    var basePluginProjectPath = path.join(context.opts.projectRoot, 'plugins', 'cordova-plugin-bbd-base'),
        pathToAndroidPlatform = path.join(context.opts.projectRoot, 'platforms', 'android');

    var manifest = new ManifestHelper(manifestFilePath),
        settingsJson = new SettingsJsonHelper(context),
        packageName = manifest.packageName();

    settingsJson.addProperty("GDApplicationID", packageName);
    settingsJson.writeSync();
    settingsJson.chmodSync('777');

    // Update Android Sdk Version
    var configXmlPath = path.join(context.opts.projectRoot, 'config.xml'),
        ConfigParser = require('cordova-common').ConfigParser,
        configXmlObj = new ConfigParser(configXmlPath),
        cordovaLibManifestXmlPath = path.join(platformRoot, 'CordovaLib', 'AndroidManifest.xml'),
        cordovaLibManifestHelperObj = new ManifestHelper(cordovaLibManifestXmlPath),
        dataForManifestXml = [
            { location: './uses-sdk', attrName: 'android:minSdkVersion', value: '28' },
            { location: './uses-sdk', attrName: 'android:targetSdkVersion', value: '30' }
        ];

    configXmlObj.setGlobalPreference('android-minSdkVersion', 28);
    configXmlObj.setGlobalPreference('android-targetSdkVersion', 30);
    configXmlObj.setGlobalPreference('AndroidXEnabled', true);
    configXmlObj.setGlobalPreference('LoadUrlTimeoutValue', 0);
    configXmlObj.setGlobalPreference('webview', 'com.good.gd.cordova.core.webview.engine.BBDCordovaWebViewEngine');

    if (isIonicProject()) {
        configXmlObj.setGlobalPreference('BBWebView-for', 'ionic');
    } else {
        // Handle BBWebView content value in config.xml
        handleContentSrcForBBWebView();
    }

    configXmlObj.write();

    // Update Android SDK Version in root build.gradle (Cordova 9+)
    var rootBuildGradlePath = path.join(platformRoot, 'build.gradle'),
        rootBuildGradleContent = fs.readFileSync(rootBuildGradlePath, 'utf-8');

    rootBuildGradleContent = rootBuildGradleContent
        .replace('defaultMinSdkVersion=19', 'defaultMinSdkVersion=28')
        .replace('defaultBuildToolsVersion="28.0.3"', 'defaultBuildToolsVersion="30.0.0"')
        .replace('defaultTargetSdkVersion=28', 'defaultTargetSdkVersion=30')
        .replace('defaultCompileSdkVersion=28', 'defaultCompileSdkVersion=30')
        .replace(/com.android.tools.build:gradle:[0-9].[0-9].[0-9]/g, 'com.android.tools.build:gradle:3.6.3');
    fs.writeFileSync(rootBuildGradlePath, rootBuildGradleContent, 'utf-8');

    // Update gradle wrapper version to be compatible with gradle plugin version (Cordova 9+)
    var cordovaProjectBuilder = path.join(platformRoot, 'cordova', 'lib', 'builders', 'ProjectBuilder.js');

    if (fs.existsSync(cordovaProjectBuilder)) {
        var cordovaProjectBuilderContent = fs.readFileSync(cordovaProjectBuilder, 'utf-8');
        cordovaProjectBuilderContent = cordovaProjectBuilderContent.replace('gradle-4.10.3', 'gradle-5.6.4');
        fs.writeFileSync(cordovaProjectBuilder, cordovaProjectBuilderContent, 'utf-8');
    }

    setPropertiesInManifestObj(cordovaLibManifestHelperObj);

    console.log('\x1b[32m%s\x1b[0m', 'Plugin cordova-plugin-bbd-base was successfully installed for android.');

    function setPropertiesInManifestObj(obj) {
        for (var attr in dataForManifestXml) {
            var attrObj = dataForManifestXml[attr];
            obj.setAttribute(attrObj);
        }
        obj.writeSync();
    }

    function isIonicProject() {
        var packageJson = require(path.join(context.opts.projectRoot, 'package.json'));

        if (!packageJson['dependencies']) return;
        return packageJson['dependencies']['@ionic/angular'] ? true : false;
    }

    function handleContentSrcForBBWebView() {
        var bbWebViewContentSrcString = 'https://appassets.androidplatform.net/assets/www/',
            androidContent = configXmlObj.doc.find('platform[@name=\'android\']\content'),
            globalContent = configXmlObj.doc.find('content'),
            rootElement = configXmlObj.doc.getroot();

        if (androidContent) {
            var androidContentSrc = androidContent.attrib.src;

            if (!androidContentSrc.includes(bbWebViewContentSrcString)) {
                androidContent.attrib.src = bbWebViewContentSrcString + androidContentSrc;
                configXmlObj.setGlobalPreference('launch-url', bbWebViewContentSrcString + androidContentSrc);
            }
        } else {
            // Default Cordova value for content is index.html
            var globalContentSrc = globalContent ? globalContent.attrib.src : 'index.html',
                androidPlatformEl = configXmlObj.doc.find('platform[@name=\'android\']'),
                contentEl = new et.Element('content');

            contentEl.attrib.src = bbWebViewContentSrcString + globalContentSrc;

            if (!androidPlatformEl) {
                // Create <platform name="android"> element, if it doesn't exist
                androidPlatformEl = new et.Element('platform', { name: 'android' });
                rootElement.append(androidPlatformEl);
            }

            androidPlatformEl.append(contentEl);

            configXmlObj.setGlobalPreference('launch-url', bbWebViewContentSrcString + globalContentSrc);
        }
    }

};
