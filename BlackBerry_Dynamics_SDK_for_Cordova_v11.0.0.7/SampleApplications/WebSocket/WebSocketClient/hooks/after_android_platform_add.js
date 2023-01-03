/*
 * (c) 2021 BlackBerry Limited. All rights reserved.
 */

module.exports = function(context) {
    var path = require('path'),
        fs = require('fs'),
        projectRoot = context.opts.projectRoot,
        androidManifestPath = path.join(projectRoot, 'platforms', 'android', 'app', 'src', 'main', 'AndroidManifest.xml');

    var androidManifestContent = fs.readFileSync(androidManifestPath, 'utf-8'),
        cleartextTrafficToAdd = 'android:usesCleartextTraffic="true"';

    if (!androidManifestContent.includes(cleartextTrafficToAdd)) {
        androidManifestContent = androidManifestContent.replace(
            '<application',
            '<application ' + cleartextTrafficToAdd
        );
    }

    fs.writeFileSync(androidManifestPath, androidManifestContent, 'utf-8');
}
