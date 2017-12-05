/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image
} from 'react-native';

var Main = require('./Main');
var Dimensions = require('Dimensions');
var {width, height}=Dimensions.get('window');
var LaunchImage = React.createClass({
    render() {
        return (
            <Image source={{uri:"http://image.wufazhuce.com/Fmt9c05lQPhGtuN58fIU2ruxVSUU"}} style={styles.launchImage}/>
        );
    },
    componentDidMount() {
        setTimeout(() => {
          this.props.navigator.replace({component:Main})
        }, 2000);
    }
});

const styles = StyleSheet.create({
    launchImage: {
        flex: 1,
        width:width,
        height:height
    }
});

module.exports = LaunchImage;
