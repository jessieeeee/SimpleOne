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
    Image,
    TouchableOpacity
} from 'react-native';

var Dimensions = require('Dimensions');
var {width, height} = Dimensions.get('window');

var DisplayImg = React.createClass({
    render() {
        return (

        <TouchableOpacity style={styles.container} onPress={() => this.props.navigator.pop()}>
                <Text style={styles.showText}>{this.props.route.params.topText}</Text>
                <Image style={[styles.displayImg, {
                    width: width * 0.8,
                    height: this.getHeight(this.props.route.params.originalW, this.props.route.params.originalH)
                }]} source={{uri: this.props.route.params.imgUrl}}/>
                <Text style={styles.showText}>{this.props.route.params.bottomText}</Text>
        </TouchableOpacity>
    )
        ;
    },
    //按图片宽度缩放
    getHeight(w, h) {
        var ratio = (width * 0.8) / w;
        return h * ratio;
    },

});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.7)',
    },
    displayImg: {
        marginTop: width * 0.04,
        marginBottom: width * 0.04,
    },
    showText: {
        textAlign: 'center',
        color: 'white',
        marginLeft: 5,
    },
});

module.exports = DisplayImg;
