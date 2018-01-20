import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    Platform,
    Image,

} from 'react-native';
import resolveAssetSource from 'resolveAssetSource';
class MyImage extends Image {
    viewConfig = Object.assign({} , this.viewConfig, {
        validAttributes: Object.assign(
            {},
            this.viewConfig.validAttributes,
            {[Platform.OS === 'ios' ? 'source' : 'src']: true})
    });

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
module.exports = MyImage;