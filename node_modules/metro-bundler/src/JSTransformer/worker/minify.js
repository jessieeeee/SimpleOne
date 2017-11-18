/**
 * Copyright (c) 2016-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * 
 * @format
 */

'use strict';

const uglify = require('uglify-js');







const UGLIFY_JS_OUTPUT_OPTIONS = {
  ascii_only: true,
  screw_ie8: true };


function noSourceMap(code) {
  return minify(code).code;
}

function withSourceMap(
code,
sourceMap,
filename)
{
  const result = minify(code, sourceMap);

  const map = JSON.parse(result.map);
  map.sources = [filename];
  return { code: result.code, map };
}

function minify(inputCode, inputMap) {
  return uglify.minify(inputCode, {
    fromString: true,
    inSourceMap: inputMap,
    outSourceMap: true,
    output: UGLIFY_JS_OUTPUT_OPTIONS });

}

module.exports = {
  noSourceMap,
  withSourceMap };