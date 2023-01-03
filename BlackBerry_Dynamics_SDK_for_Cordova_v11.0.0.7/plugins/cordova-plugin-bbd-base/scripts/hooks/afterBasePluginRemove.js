#!/usr/bin/env node

/*
 * (c) 2022 BlackBerry Limited. All rights reserved.
 */

module.exports = function(context) {

    var fs = require('fs'),
        command = process.env.CORDOVA_BIN || 'cordova', // process.env.CORDOVA_BIN is used for internal purposes
        path = require('path'),
        execSync = require('child_process').execSync,
        configXmlPath = path.join(context.opts.projectRoot, 'config.xml'),
        ConfigParser = require('cordova-common').ConfigParser,
        configXmlObj = new ConfigParser(configXmlPath),
        pluginsListStr = execSync(command + ' plugin', { encoding: 'utf8' }),
        pathToAndroidPlatform = path.join(context.opts.projectRoot, 'platforms', 'android'),
        pathToiOSPlatform = path.join(context.opts.projectRoot, 'platforms', 'ios'),
        removeLocalizationHookPath = path.join(__dirname, 'ios','removeLocalization.rb');

    if (pluginsListStr.indexOf('cordova-plugin-bbd-base') < 0) {
        // Remove BBWebView content value for Android
        removeBBWebViewAndroidContentSrc();
        // Save changes to config.xml
        fs.writeFileSync(configXmlObj.path, configXmlObj.doc.write({ indent: 4 }), 'utf-8');

        restoreConfigXml([
            '<preference name="android-minSdkVersion" value="28" />',
            '<preference name="android-targetSdkVersion" value="30" />',
            '<preference name="LoadUrlTimeoutValue" value="0" />',
            '<preference name="webview" value="com.good.gd.cordova.core.webview.engine.BBDCordovaWebViewEngine" />',
            '<preference name="BBWebView-for" value="ionic" />',
            /<preference name="launch-url" value="https:\/\/appassets.androidplatform.net\/.+\/>/
        ]);

        if (fs.existsSync(pathToAndroidPlatform)) {
            var isAndroidBuilt = fs.existsSync(path.join(pathToAndroidPlatform, 'build'));
            execSync(command + ' platform rm android');
            execSync(command + ' platform add android');
            if (isAndroidBuilt) {
                execSync(command + ' prepare android');
                execSync(command + ' compile android');
            }
        }

        if (fs.existsSync(pathToiOSPlatform)) {
            var isiOSBuilt = fs.existsSync(path.join(pathToiOSPlatform, 'build'));
            execSync(command + ' platform rm ios');
            execSync(command + ' platform add ios');
            if (isiOSBuilt)
                execSync(command + ' prepare ios');
        }

        if (fs.existsSync(removeLocalizationHookPath)) {
            execSync('ruby "'+ removeLocalizationHookPath +'"');
        }
    }

    if (pluginsListStr.indexOf('cordova-plugin-bbd-') < 0) {
        var afterBasePluginRemoveHookPath = path.join(
            context.opts.projectRoot,
            'hooks',
            'afterBasePluginRemove.js'
        );
        restoreConfigXml([
            '<hook src="hooks/afterBasePluginRemove.js" type="after_plugin_rm" />',
        ]);
        fs.existsSync(afterBasePluginRemoveHookPath) && fs.unlinkSync(afterBasePluginRemoveHookPath);
        console.log("No BBD Cordova plugins installed");
    }

    // removing properties from config.xml added by BBD Cordova plugins
    function restoreConfigXml(propertiesArrayToRestore) {
        var xmlContent = fs.readFileSync(path.join(context.opts.projectRoot, 'config.xml'), { encoding: 'utf8' });
        for (var i = 0; i < propertiesArrayToRestore.length; i++){
            xmlContent = xmlContent.replace(propertiesArrayToRestore[i], '');
        }
        xmlContent = xmlContent.replace(/^\s*$[\n\r]{1,}/gm, '');
        fs.writeFileSync(configXmlPath, xmlContent, 'utf8');
    }

    function removeBBWebViewAndroidContentSrc() {
        var bbWebViewContentSrcString = 'https://appassets.androidplatform.net/assets/www/',
            androidPlatform = configXmlObj.doc.find('platform[@name=\'android\']'),
            androidContent = configXmlObj.doc.find('platform[@name=\'android\']\content');

        if (!androidContent) {
            return;
        }

        var globalContent = configXmlObj.doc.find('content'),
            globalContentSrc = globalContent ? globalContent.attrib.src : '';

        androidContent.attrib.src = androidContent.attrib.src.replace(bbWebViewContentSrcString, '');

        // Default Cordova value for content is index.html
        var shouldRemoveAndroidContentSrc = globalContentSrc ?
                globalContent.attrib.src === androidContent.attrib.src
                :
                androidContent.attrib.src === 'index.html';


        if (shouldRemoveAndroidContentSrc) {
            androidPlatform._children = androidPlatform.getchildren().filter(function(element) {
                return element.tag !== 'content';
            });
        }

    }
}
