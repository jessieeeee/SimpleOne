'use strict';

















var _constants = require('./constants');var _constants2 = _interopRequireDefault(_constants);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

class ModuleMap {



  constructor(map, mocks) {
    this._map = map;
    this._mocks = mocks;
  }

  getModule(
  name,
  platform,
  supportsNativePlatform,
  type)
  {
    if (!type) {
      type = _constants2.default.MODULE;
    }

    const map = this._map[name];
    if (map) {
      let module = platform && map[platform];
      if (!module && map[_constants2.default.NATIVE_PLATFORM] && supportsNativePlatform) {
        module = map[_constants2.default.NATIVE_PLATFORM];
      } else if (!module) {
        module = map[_constants2.default.GENERIC_PLATFORM];
      }
      if (module && module[_constants2.default.TYPE] === type) {
        return module[_constants2.default.PATH];
      }
    }

    return null;
  }

  getPackage(
  name,
  platform,
  supportsNativePlatform)
  {
    return this.getModule(name, platform, null, _constants2.default.PACKAGE);
  }

  getMockModule(name) {
    return this._mocks[name];
  }

  getRawModuleMap() {
    return {
      map: this._map,
      mocks: this._mocks };

  }} /**
      * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
      *
      * This source code is licensed under the BSD-style license found in the
      * LICENSE file in the root directory of this source tree. An additional grant
      * of patent rights can be found in the PATENTS file in the same directory.
      *
      * 
      */module.exports = ModuleMap;