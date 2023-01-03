#!/usr/bin/env node

/*
 * (c) 2022 BlackBerry Limited. All rights reserved.
 */

module.exports = function(context) {

    var fs = require('fs'),
        path = require('path'),
        execSync = require('child_process').execSync,
        basePluginPackageJson = require(path.join('..', '..', 'package.json')),
        supportedCordovaVersions = basePluginPackageJson.supportedCordovaVersions,
        deprecatedCordovaVersions = basePluginPackageJson.deprecatedCordovaVersions,
        command = process.env.CORDOVA_BIN || 'cordova', // process.env.CORDOVA_BIN is used for internal purposes
        currentCordovaVersion = execSync(command + ' -v').toString().match(/(\d+\.){1,2}\d/)[0],
        packageJson = require(path.join(context.opts.projectRoot, 'package.json')),
        // Check package.json dependenices path to support npm i + cordova platform add mode for sample apps
        basePluginDependency = packageJson.dependencies && packageJson.dependencies['cordova-plugin-bbd-base'] ||
            packageJson.devDependencies && packageJson.devDependencies['cordova-plugin-bbd-base'],
        // Check whether command is "cordova plugin add" or "cordova platform add"
        isCmdPlatformAdd = process.argv[4].includes('android') || process.argv[4].includes('ios'),
        pluginPath = isCmdPlatformAdd ?
            basePluginDependency && path.resolve(basePluginDependency.replace('file:', ''))
            : path.resolve(process.argv[4]),
        pluginsPath = path.join(pluginPath, '..'),
        basePluginPath = path.join(pluginsPath, 'cordova-plugin-bbd-base'),
        GeneralHelper = require(path.join(basePluginPath, 'src', 'generalHelper.js')).GeneralHelper,
        GeneralHelper = new GeneralHelper(context, pluginsPath);

    // Install own dependencies
    execSync('npm install', null);

    // Supportability warnings for Cordova
    var supportedVersionsString = '\n\nSupported versions:\n\t' + supportedCordovaVersions.join(',\n\t');
    if (deprecatedCordovaVersions) {
        supportedVersionsString += '\n\t' + deprecatedCordovaVersions.join(' (DEPRECATED),\n\t') + ' (DEPRECATED)';
    }

    if (!(supportedCordovaVersions.includes(currentCordovaVersion) || deprecatedCordovaVersions.includes(currentCordovaVersion))) {
        console.warn('\x1b[33m%s\x1b[0m', 'WARNING: BlackBerry Dynamics SDK for Cordova does not support ' + currentCordovaVersion +
            ' Cordova version.' + supportedVersionsString);
    } else if (deprecatedCordovaVersions.includes(currentCordovaVersion)) {
        console.warn('\x1b[33m%s\x1b[0m', 'WARNING: Cordova version ' + currentCordovaVersion + ' is deprecated now.' +
            '\nNote: "cordova-android@10.1.1" is the only supported version on Android platform. To upgrade run following commands:' +
            '\n\t$ cordova platform remove android' +
            '\n\t$ cordova platform add android@10.1.1' + supportedVersionsString);
    }

    // @ionic/vue is not supported
    if (GeneralHelper.isIonicVueProject()) {
        console.error('\x1b[33m%s\x1b[0m', 'Failed to add cordova-plugin-bbd-base due to error:' +
            '\n\n@ionic/vue project is not supported by cordova-plugin-bbd-base plugin.' +
            '\nPlease use capacitor-plugin-bbd-base plugin instead:' +
            '\n\t$ npm install git+https://github.com/blackberry/blackberry-dynamics-cordova-plugins#capacitor-base');
        return;
    }

    // @ionic/react is not supported
    if (GeneralHelper.isIonicReactProject()) {
        console.error('\x1b[33m%s\x1b[0m', 'Failed to add cordova-plugin-bbd-base due to error:' +
            '\n\n@ionic/react project is not supported by cordova-plugin-bbd-base plugin.' +
            '\nPlease use capacitor-plugin-bbd-base plugin instead:' +
            '\n\t$ npm install git+https://github.com/blackberry/blackberry-dynamics-cordova-plugins#capacitor-base');
        return;
    }

    // @ionic/angular 5 is deprecated, @ionic/angular < 5 is not supported
    GeneralHelper.handleSupportabilityWarningsForIonicAngularProject();

    // When we add some other plugins, following hook is triggered again.
    // This results in unexpected behaviour and we need to hack this.
    // The fix would be, on installation remove after_plugin_add hook from plugin.xml file.

    var pluginXmlFile = path.join(context.opts.projectRoot, 'plugins', 'cordova-plugin-bbd-base', 'plugin.xml'),
        pluginXmlContent = fs.readFileSync(pluginXmlFile, 'utf-8');

    pluginXmlContent = pluginXmlContent.replace('<hook type="after_plugin_add" src="scripts/hooks/afterPluginAdd.js" />', '');
    fs.writeFileSync(pluginXmlFile, pluginXmlContent, 'utf-8');

    // ---------- HANDLE PATH IN DEPENDENCIES FOR ALL BlackBerry Dynamics CORDOVA PLUGINS ----------

    // This will give us possibility to add any plugin from anywhere in the FileSystem
    GeneralHelper.handlePathInDependencyForBBDplugins();

}
