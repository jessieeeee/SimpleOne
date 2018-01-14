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
    Modal,
    TouchableOpacity
} from 'react-native';

var Dimensions = require('Dimensions');
var {width, height} = Dimensions.get('window');

var DisplayImg = React.createClass({
    getDefaultProps() {
        return {
            duration: 10,
            topText:'',
            originalW:0,
            originalH:0,
            imgUrl:'',
            bottomText:'',
            isVisible:false,
            onCancel:null,
        }
    },


    render() {
        return (
            <Modal
                animationType={'fade'}
                transparent={true}
                visible={this.props.isVisible}
                onRequestClose={() => {
                    this.props.onCancel()
                }}>
                <TouchableOpacity style={styles.container} onPress={() => this.props.onCancel()}>
                    <Text style={styles.showText}>{this.props.topText}</Text>
                    <Image style={[styles.displayImg, {
                        width: width * 0.8,
                        height: this.getHeight(this.props.originalW, this.props.originalH)
                    }]} source={{uri: this.props.imgUrl}}/>
                    <Text style={styles.showText}>{this.props.bottomText}</Text>
                </TouchableOpacity>
            </Modal>
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
        backgroundColor: 'rgba(0, 0, 0, 0.74)'
    },
    displayImg: {
        marginTop: width * 0.04,
        marginBottom: width * 0.04,
    },
    showText: {
        textAlign: 'center',
        color: 'white',
    },
});

module.exports = DisplayImg;
