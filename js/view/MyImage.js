/**
 * @date : 18-4-2
 * @author : JessieK
 * @email :lyj1246505807@gmail.com
 * @description : 自定义image
 */

import React, {Component} from 'react';
import {
    Platform,
    Image,
} from 'react-native';
import resolveAssetSource from 'resolveAssetSource';
class MyImage extends Image {

    constructor() {
        super();
        this.setNativeProps = (props = {}) => {

            if (props.source) {
                const source = resolveAssetSource(props.source);
                let sourceAttr = Platform.OS === 'ios' ? 'source' : 'src';
                let sources;
                if (Array.isArray(source)) {
                    sources = source;
                } else {
                    sources = [source];
                }
                Object.assign(props, {[sourceAttr]: sources});
            }

            return super.setNativeProps(props);
        }
    }
}
export default MyImage;