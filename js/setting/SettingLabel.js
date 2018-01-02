/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
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
var Dimensions = require('Dimensions');
var {width, height} = Dimensions.get('window');

var SettingLabel=React.createClass({
    getDefaultProps(){
        return {
            text: '',
        }
    },

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.label}>
                    {this.props.text}
                </Text>
            </View>
        );
    },


});

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

module.exports=SettingLabel;
