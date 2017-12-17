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
    Image
} from 'react-native';
var Dimensions = require('Dimensions');
var {width, height} = Dimensions.get('window');

var OneListItemBottom=React.createClass({
    render() {
        return (
            <View style={styles.container}>
                <Image source={{uri:'feeds_bottom_image'}} style={{width:width*0.36,height:width*0.26}}/>
            </View>
        );
    }
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height:height*0.3,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#eeeeee',
    },

});

module.exports=OneListItemBottom;
