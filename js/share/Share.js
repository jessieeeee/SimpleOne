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
    Platform,
    Image,
    ScrollView,
    TouchableOpacity
} from 'react-native';

var Dimensions = require('Dimensions');
var {width, height} = Dimensions.get('window');

var Share = React.createClass({
    render() {
        return (
            <View style={styles.container}>
                {this.renderNavBar()}
                <ScrollView showsVerticalScrollIndicator={false}>
                    <TouchableOpacity onPress={() => this.props.navigator.pop()}>
                        <Image source={{uri: 'bubble_moment'}} style={[styles.shareIcon, {marginTop: width * 0.01}]}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.props.navigator.pop()}>
                        <Image source={{uri: 'bubble_wechat'}} style={styles.shareIcon}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.props.navigator.pop()}>
                        <Image source={{uri: 'bubble_qq'}} style={styles.shareIcon}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.props.navigator.pop()}>
                        <Image source={{uri: 'bubble_weibo'}} style={styles.shareIcon}/>
                    </TouchableOpacity>
                    {this.showLink()}
                </ScrollView>
            </View>
        );
    },

    showLink(){
      if(this.props.route.params.showlink){
        return(
            <TouchableOpacity onPress={() => this.props.navigator.pop()}>
                <Image source={{uri: 'bubble_copy_link'}} style={styles.shareIcon}/>
            </TouchableOpacity>
        );
      }
    },
    /**
     * 渲染顶部导航
     */
    renderNavBar() {
        return (
            // 顶部导航bar
            <View style={styles.outNav}>
                <View style={styles.rightBtnBar}>
                    <TouchableOpacity onPress={() => this.props.navigator.pop()}>
                    <Image style={styles.rightBtn} source={{uri: 'close_gray'}}/>
                    </TouchableOpacity>
                </View>
            </View>
        );
    },
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#fafafa',
    },
    outNav: {
        height: Platform.OS == 'ios' ? height * 0.062 : height * 0.1,
        flexDirection: 'row',
        alignItems: 'center',
        width: width,
        justifyContent: 'center',
    },

    rightBtn: {
        width: height * 0.031,
        height: height * 0.031,
    },

    rightBtnBar: {
        position: 'absolute',
        right: width * 0.04,
        flexDirection: 'row'
    },

    shareIcon: {
        width: height * 0.06,
        height: height * 0.06,
        marginBottom: width * 0.16
    }
});

module.exports = Share;
