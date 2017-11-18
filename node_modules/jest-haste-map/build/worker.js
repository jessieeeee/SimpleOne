'use strict';












var _path = require('path');var _path2 = _interopRequireDefault(_path);
var _jestDocblock = require('jest-docblock');var _jestDocblock2 = _interopRequireDefault(_jestDocblock);
var _gracefulFs = require('graceful-fs');var _gracefulFs2 = _interopRequireDefault(_gracefulFs);
var _constants = require('./constants');var _constants2 = _interopRequireDefault(_constants);
var _extract_requires = require('./lib/extract_requires');var _extract_requires2 = _interopRequireDefault(_extract_requires);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

const JSON_EXTENSION = '.json'; /**
                                 * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
                                 *
                                 * This source code is licensed under the BSD-style license found in the
                                 * LICENSE file in the root directory of this source tree. An additional grant
                                 * of patent rights can be found in the PATENTS file in the same directory.
                                 *
                                 * 
                                 */const PACKAGE_JSON = _path2.default.sep + 'package' + JSON_EXTENSION;let hasteImpl = null;let hasteImplModulePath = null;const formatError = error => {if (typeof error === 'string') {return {
      message: error,
      stack: null,
      type: 'Error' };

  }

  return {
    code: error.code || undefined,
    message: error.message,
    stack: error.stack,
    type: 'Error' };

};

module.exports = (data, callback) => {
  if (
  data.hasteImplModulePath &&
  data.hasteImplModulePath !== hasteImplModulePath)
  {
    if (hasteImpl) {
      throw new Error('jest-haste-map: hasteImplModulePath changed');
    }
    hasteImplModulePath = data.hasteImplModulePath;
    hasteImpl =
    // $FlowFixMe: dynamic require
    require(hasteImplModulePath);
  }

  try {
    const filePath = data.filePath;
    const content = _gracefulFs2.default.readFileSync(filePath, 'utf8');
    let module;
    let id;
    let dependencies;

    if (filePath.endsWith(PACKAGE_JSON)) {
      const fileData = JSON.parse(content);
      if (fileData.name) {
        id = fileData.name;
        module = [filePath, _constants2.default.PACKAGE];
      }
    } else if (!filePath.endsWith(JSON_EXTENSION)) {
      if (hasteImpl) {
        id = hasteImpl.getHasteName(filePath);
      } else {
        const doc = _jestDocblock2.default.parse(_jestDocblock2.default.extract(content));
        id = doc.providesModule || doc.provides;
      }
      dependencies = (0, _extract_requires2.default)(content);
      if (id) {
        module = [filePath, _constants2.default.MODULE];
      }
    }

    callback(null, { dependencies, id, module });
  } catch (error) {
    callback(formatError(error));
  }
};