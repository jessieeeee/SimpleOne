'use strict';












var _path = require('path');var _path2 = _interopRequireDefault(_path);
var _micromatch = require('micromatch');var _micromatch2 = _interopRequireDefault(_micromatch);
var _constants = require('./constants');var _constants2 = _interopRequireDefault(_constants);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

class HasteFS {


  constructor(files) {
    this._files = files;
  }

  getModuleName(file) {
    return this._files[file] && this._files[file][_constants2.default.ID] || null;
  }

  getDependencies(file) {
    return this._files[file] && this._files[file][_constants2.default.DEPENDENCIES] || null;
  }

  exists(file) {
    return !!this._files[file];
  }

  getAllFiles() {
    return Object.keys(this._files);
  }

  matchFiles(pattern) {
    if (!(pattern instanceof RegExp)) {
      pattern = new RegExp(pattern);
    }
    const files = [];
    for (const file in this._files) {
      if (pattern.test(file)) {
        files.push(file);
      }
    }
    return files;
  }

  matchFilesWithGlob(globs, root) {
    const files = new Set();
    for (const file in this._files) {
      const filePath = root ? _path2.default.relative(root, file) : file;
      if ((0, _micromatch2.default)([filePath], globs).length) {
        files.add(file);
      }
    }
    return files;
  }} /**
      * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
      *
      * This source code is licensed under the BSD-style license found in the
      * LICENSE file in the root directory of this source tree. An additional grant
      * of patent rights can be found in the PATENTS file in the same directory.
      *
      * 
      */module.exports = HasteFS;