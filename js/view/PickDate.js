import React from 'react';
import PropTypes from 'prop-types';
import {requireNativeComponent, View} from 'react-native';


let iface = {
    name: 'PickDateView',
    propTypes: {
        setYear: PropTypes.string,
        setMonth: PropTypes.string,
        //回调
        onChange: PropTypes.func,
        ...View.propTypes  //支持View组件的所有属性
    }
}

var RCTPickDateView = requireNativeComponent('PickDateView', iface);


export default RCTPickDateView;