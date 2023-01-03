/*
 * (c) 2020 BlackBerry Limited. All rights reserved.
 */

module.exports = function(context) {
    var path = require('path'),
        fs = require('fs'),
        projectRoot = context.opts.projectRoot,
        testEnvPath = path.join(projectRoot, 'www', 'js', 'env.js');

    var nocAppServer = 'gdmdc.good.com'; // default NOC App Server Address: gdmc.good.com
    if (process.env.NOC_APP_SERVER) {
        nocAppServer = process.env.NOC_APP_SERVER;
    }

    envContent = "var env = {\n\tNOC_APP_SERVER: '" + nocAppServer + "'\n}\n";

    fs.writeFileSync(testEnvPath, envContent);

}
