#!/usr/bin/env node

/*
 * (c) 2022 BlackBerry Limited. All rights reserved.
 */

'use strict';

(function(argv) {
   const path = require('path'),
   fs = require('fs');

   const parce = (arg, options = { value: null }) => {
      const argument = {
         index: null,
         value: null
      };

      argument.index = argv.indexOf(arg);
      if (argument.index  > -1) {
         argument.value = options.value ? options.value : argv[argument.index + 1];
      }

      return argument.value;
   };

   const copyPodspecFile = (_path) => {
      const specPath = path.join(_path, 'BlackBerryDynamics.podspec');
      if (fs.existsSync(specPath))
         return;

      const pathToInnerSpec = path.join(__dirname, 'hooks', 'ios', 'BlackBerryDynamics.podspec');
      fs.copyFileSync(pathToInnerSpec, specPath);
   }

   const originalPod = `<pod name="BlackBerryDynamics" options=":podspec => 'https://software.download.blackberry.com/repository/framework/dynamics/ios/11.0.1.137/BlackBerryDynamics-11.0.1.137.podspec'" />`;
   const pattern = /<pod name="BlackBerryDynamics" options="(:podspec|:path) => '(.+)'" \/>/;

   const pod = {
      path: parce('--path'),
      url: parce('--url'),
      default: parce('--default', { value: true })
   }

   let spec;
   if (pod.default) {
      spec = originalPod;
   }
   if (pod.path) {
      copyPodspecFile(pod.path);
      pod.path = path.join(pod.path, 'BlackBerryDynamics.podspec');

      spec = `<pod name="BlackBerryDynamics" options=":path => '${pod.path}'" />`;
   }
   if (pod.url) {
      spec = `<pod name="BlackBerryDynamics" options=":podspec => '${pod.url}'" />`;
   }

   const pluginXmlFile = path.join(__dirname, '..', 'plugin.xml');
   let pluginXmlContent = fs.readFileSync(pluginXmlFile, 'utf-8');

   pluginXmlContent = pluginXmlContent.replace(pattern, spec);
   fs.writeFileSync(pluginXmlFile, pluginXmlContent, 'utf-8');

   console.log('\x1b[32m%s\x1b[0m', 'Podspec in cordova-plugin-bbd-base was successfully updated.');
})(process.argv);
