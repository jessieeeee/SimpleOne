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
var {width, height} = constants.ScreenWH;
class SettingLabel extends Component{
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.label}>
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
        backgroundColor: '#f8f8f8',
        height:width*0.1,
    },
    label: {
        fontSize: width*0.034,
        width:width,
        marginLeft:width*0.12,
        color:'#9c9c9c',
    },

});


export default SettingLabel;
