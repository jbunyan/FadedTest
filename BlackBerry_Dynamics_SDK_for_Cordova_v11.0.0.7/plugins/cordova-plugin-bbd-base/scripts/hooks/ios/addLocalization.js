#!/usr/bin/env node

/*
 * (c) 2020 BlackBerry Limited. All rights reserved.
 */

'use strict';

require('shelljs/global');
const path = require('path');

module.exports = function (context) {
  if (exec(`ruby "${path.join(__dirname, 'addLocalization.rb')}"`).code !== 0) {
    throw new Error('\nERROR: addLocalization exited with error!');
  }
};
