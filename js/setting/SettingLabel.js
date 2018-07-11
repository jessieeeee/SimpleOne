/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow　设置标题
 */

import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,

} from 'react-native';
import constants from '../Constants';
let {width, height} = constants.ScreenWH;
class SettingLabel extends Component{
    render() {
        return (
            <View style={[styles.container,{backgroundColor: constants.nightMode ? constants.nightModeGrayDark: constants.labelBgColor}]}>
                <Text style={[styles.label,{color: constants.nightMode ? constants.nightModeTextColor: constants.normalTextColor}]}>
                    {this.props.text}
                </Text>
            </View>
        );
    }
}

SettingLabel.defaultProps={
    text: ''
};

const styles = StyleSheet.create({
    container: {
        justifyContent:'center',
        height:width*0.1,
    },
    label: {
        fontSize: width*0.034,
        width:width,
        marginLeft:width*0.12,
    },

});


export default SettingLabel;
