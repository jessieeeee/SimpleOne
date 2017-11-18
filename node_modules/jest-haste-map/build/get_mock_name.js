'use strict';









var _path = require('path');var _path2 = _interopRequireDefault(_path);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

const MOCKS_PATTERN = _path2.default.sep + '__mocks__' + _path2.default.sep; /**
                                                                              * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
                                                                              *
                                                                              * This source code is licensed under the BSD-style license found in the
                                                                              * LICENSE file in the root directory of this source tree. An additional grant
                                                                              * of patent rights can be found in the PATENTS file in the same directory.
                                                                              *
                                                                              * 
                                                                              */const getMockName = filePath => {const mockPath = filePath.split(MOCKS_PATTERN)[1];return mockPath.substring(0, mockPath.lastIndexOf(_path2.default.extname(mockPath)));};module.exports = getMockName;