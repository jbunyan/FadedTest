#!/usr/bin/env node

/*
 * (c) 2022 BlackBerry Limited. All rights reserved.
 */

var path = require('path'),
    fs = require('fs'),
    os = require('os');

function GeneralHelper(context, pluginsPath) {

    try {
        this.params = {};
        this.pluginsPath = pluginsPath;
        this.sampleAppsPath = path.join(this.pluginsPath, '..', 'SampleApplications');
        this.shellJS = require('shelljs');
        this.projectRoot = context.opts.projectRoot;
        this.packageJson = require(path.join(this.projectRoot, 'package.json'));
        this.basePluginPath = path.join(this.pluginsPath, 'cordova-plugin-bbd-base');
        this.basePluginXml = path.join(this.basePluginPath, 'plugin.xml');

        console.log('\x1b[32m%s\x1b[0m', '\nPath to BlackBerry Dynamics Cordova plugins folder: ' + this.pluginsPath);
        console.log('\x1b[32m%s\x1b[0m', '\nOperating system platform: ' + process.platform);
    } catch (e) {
        throw e;
    }

    this.bbdCordovaPlugins = [
        'cordova-plugin-bbd-all',
        'cordova-plugin-bbd-appkinetics',
        'cordova-plugin-bbd-application',
        'cordova-plugin-bbd-httprequest',
        'cordova-plugin-bbd-interappcommunication',
        'cordova-plugin-bbd-push',
        'cordova-plugin-bbd-launcher',
        'cordova-plugin-bbd-mailto',
        'cordova-plugin-bbd-serversideservices',
        'cordova-plugin-bbd-socket',
        'cordova-plugin-bbd-specificpolicies',
        'cordova-plugin-bbd-storage',
        'cordova-plugin-bbd-tokenhelper',
        'cordova-plugin-bbd-xmlhttprequest',
        'cordova-plugin-bbd-websocket',
    ];
}

GeneralHelper.prototype = {
    isWindowsPlatform: function() {
        return process.platform == 'win32';
    },
    updateDependenciesForPlugin: function(pathToPlugin) {
        var pluginXmlPath = path.join(pathToPlugin, 'plugin.xml'),
            pluginXmlData = fs.readFileSync(pluginXmlPath, 'utf8');

        fs.chmodSync(pluginXmlPath, '660');

        if (pluginXmlData.indexOf('../cordova-plugin-bbd-base') >= 0) {
            pluginXmlData = pluginXmlData.replace(/url="\.\./g, 'url="' + this.pluginsPath);
            fs.writeFileSync(pluginXmlPath, pluginXmlData, 'utf8');
        }
    },
    handlePathInDependencyForBBDplugins: function() {
        for (var plugin = 0; plugin < this.bbdCordovaPlugins.length; plugin++) {
            var currentPlugin = this.bbdCordovaPlugins[plugin],
                pathToCurrentPlugin = path.join(this.pluginsPath, currentPlugin);

            this.updateDependenciesForPlugin(pathToCurrentPlugin);
        };
    },
    copyDirRecursively: function(sourceFolder, targetFolder) {
        this.shellJS.cp('-R', sourceFolder, targetFolder);
        fs.chmodSync(targetFolder, '755');
    },
    getPackageJsonDependencies: function(packageJson) {
        var packageJsonDependencies = {},
            dependencies = packageJson.dependencies,
            devDependencies = packageJson.devDependencies;

        if (dependencies) {
            packageJsonDependencies = Object.assign(packageJsonDependencies, dependencies);
        }

        if (devDependencies) {
            packageJsonDependencies = Object.assign(packageJsonDependencies, devDependencies);
        }

        return packageJsonDependencies;
    },
    handleSupportabilityWarningsForIonicAngularProject: function() {
        if (!this.isIonicAngularProject()) return;

        var ionicAngularVersion = this.packageJson['dependencies']['@ionic/angular'],
            supportedIonicVersionsRegExp = /^((\~|\^)6|6)\.[\d]+\.[\d]+/,
            deprecatedIonicVersionsRegExp = /^((\~|\^)5|5)\.[\d]+\.[\d]+/;

        if (supportedIonicVersionsRegExp.test(ionicAngularVersion)) return;

        if (deprecatedIonicVersionsRegExp.test(ionicAngularVersion)) {
            var deprecationMessage = 'WARNING: @ionic/angular version 5.x is deprecated ' +
                'by Dynamics SDK for Cordova and its support might be removed in future releases.';

            console.warn('\x1b[33m%s\x1b[0m', deprecationMessage);
        } else {
            var notSupportedMessage = 'WARNING: @ionic/angular of version lower than 5 is not supported ' +
                'by Dynamics SDK for Cordova.\n' +
                'Supported @ionic/angular versions:\n\t 6.x,\n\t 5.x (DEPRECATED)';

            console.warn('\x1b[33m%s\x1b[0m', notSupportedMessage);
        }
    },
    getIonicAngularProjectVersion: function() {
        if (!this.packageJson['dependencies']) return;

        return this.packageJson['dependencies']['@ionic/angular'];
    },
    isIonicAngularProject: function() {
        if (!this.packageJson['dependencies']) return;

        return !!this.packageJson['dependencies']['@ionic/angular'];
    },
    isIonicVueProject: function() {
        if (!this.packageJson['dependencies']) return;

        return !!this.packageJson['dependencies']['@ionic/vue'];
    },
    isIonicReactProject: function() {
        if (!this.packageJson['dependencies']) return;

        return !!this.packageJson['dependencies']['@ionic/react'];
    }
}

exports.GeneralHelper = GeneralHelper;
