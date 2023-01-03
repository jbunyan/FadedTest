#!/usr/bin/env node

/*
 * (c) 2021 BlackBerry Limited. All rights reserved.
 */

'use strict';

const path = require('path');
require('shelljs/global');

module.exports = function (context) {
  if (exec(`ruby "${path.join(__dirname, 'rmLauncherFramework.rb')}"`).code !== 0) {
    throw new Error('\nERROR: rmLauncherFramework exited with error!');
  }
};
