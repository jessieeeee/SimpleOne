'use strict'; /**
               * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
               *
               * This source code is licensed under the BSD-style license found in the
               * LICENSE file in the root directory of this source tree. An additional grant
               * of patent rights can be found in the PATENTS file in the same directory.
               *
               * 
               */

const path = require('path');

let normalizePathSep;
if (path.sep == '/') {
  normalizePathSep = filePath => filePath;
} else {
  normalizePathSep = filePath => filePath.replace(/\//g, path.sep);
}

module.exports = normalizePathSep;