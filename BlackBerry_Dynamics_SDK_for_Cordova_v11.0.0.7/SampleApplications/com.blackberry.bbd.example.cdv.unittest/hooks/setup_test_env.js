/*
 * (c) 2021 BlackBerry Limited. All rights reserved.
 */

module.exports = function(context) {
    var shell = require('shelljs'),
        path = require('path'),
        projectRoot = context.opts.projectRoot;

    shell.exec('cordova plugin add "' + path.join(projectRoot, 'plugins', 'cordova-plugin-bbd-file', 'tests') + '"');
}