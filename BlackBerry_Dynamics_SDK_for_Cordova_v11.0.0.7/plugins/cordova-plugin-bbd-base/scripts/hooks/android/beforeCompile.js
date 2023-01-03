#!/usr/bin/env node

/*
 * (c) 2021 BlackBerry Limited. All rights reserved.
 */

module.exports = function(context) {

    var fs = require('fs'),
        path = require('path'),
        projectRoot = context.opts.projectRoot,
        configXmlPath = path.join(projectRoot, 'config.xml'),
        ConfigParser = require('cordova-common').ConfigParser,
        configXmlObj = new ConfigParser(configXmlPath),
        platformAndroidRoot = path.join(projectRoot, 'platforms', 'android');

    if (fs.existsSync(platformAndroidRoot)) {

        //  Set custom configuration for Android
        var AndroidHelper = require('../../../src/android/AndroidHelper.js'),
            platformRoot = path.join(projectRoot, 'platforms', 'android'),
            settingsJsonHelper = new AndroidHelper.SettingsJsonHelper(context),
            manifestFilePath = path.join(platformRoot, 'app', 'src', 'main', 'AndroidManifest.xml'),
            manifest = new AndroidHelper.ManifestHelper(manifestFilePath);

        if (configXmlObj.getPreference('GDEnterpriseSimulationMode', 'android').indexOf('true') > -1) {
            settingsJsonHelper.addProperty('GDLibraryMode', 'GDEnterpriseSimulation');
        } else if (configXmlObj.getPreference('GDEnterpriseSimulationMode', 'android').indexOf('false') > -1 || 
            !configXmlObj.getPreference('GDEnterpriseSimulationMode', 'android')) {
            settingsJsonHelper.addProperty('GDLibraryMode', 'GDEnterprise');
        }

        if (configXmlObj.getPreference('GDApplicationVersion', 'android')) {
            settingsJsonHelper.addProperty('GDApplicationVersion', configXmlObj.getPreference('GDApplicationVersion', 'android'));
        } else if (!configXmlObj.getPreference('GDApplicationVersion', 'android')) {
            settingsJsonHelper.addProperty('GDApplicationVersion', '1.0.0.0');
        }

        if (configXmlObj.getPreference('GDApplicationID', 'android')) {
            settingsJsonHelper.addProperty('GDApplicationID', configXmlObj.getPreference('GDApplicationID', 'android'));
        } else if (!configXmlObj.getPreference('GDApplicationID', 'android')) {
            settingsJsonHelper.addProperty('GDApplicationID', manifest.packageName());
        }

        settingsJsonHelper.writeSync();
    }
};
