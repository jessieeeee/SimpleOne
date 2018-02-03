import React from 'react';
import {requireNativeComponent, View} from 'react-native';


let iface = {
    name: 'ShowPlayView',
    propTypes: {

        //回调
        onChange: React.PropTypes.func,
        ...View.propTypes  //支持View组件的所有属性
    }
}

var RCTShowPlayMusicView = requireNativeComponent('ShowPlayView', iface);


export default RCTShowPlayMusicView;