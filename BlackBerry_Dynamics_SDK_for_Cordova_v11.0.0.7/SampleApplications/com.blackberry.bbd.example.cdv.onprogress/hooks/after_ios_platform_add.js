/*
 * (c) 2020 BlackBerry Limited. All rights reserved.
 */

module.exports = function(context) {
    var shell = require('shelljs'),
        path = require('path'),
        fs = require('fs'),
        projectRoot = context.opts.projectRoot,
        resImagesPath = path.join(projectRoot, 'res', 'ios', 'Images.xcassets'),
        appRoot = path.join(projectRoot, 'platforms', 'ios', 'OnProgress'),
        defaultImagesPath = path.join(appRoot, 'Images.xcassets'),
        resFolderPath = path.join(appRoot, 'Resources', 'res', 'ios'),
        imagesDestination = path.join(resFolderPath, 'Images.xcassets'),
        storyboardPath = path.join(resFolderPath, 'LaunchScreen.storyboard'),
        sourceStoryboardPath = path.join(projectRoot, 'res', 'ios', 'LaunchScreen.storyboard');

    shell.exec('rm -rf "' + imagesDestination + '"');
    shell.exec('rm -rf "' + path.join(defaultImagesPath, 'AppIcon.appiconset') + '"');
    shell.exec('cp -R "' + resImagesPath + '" "' + imagesDestination + '"');

    var storyboardContent = fs.readFileSync(storyboardPath, 'utf-8');
    
    storyboardContent = storyboardContent.replace('PRODUCT_NAME', 'OnProgress');

    fs.writeFileSync(storyboardPath, storyboardContent);
    fs.writeFileSync(sourceStoryboardPath, storyboardContent);
}
