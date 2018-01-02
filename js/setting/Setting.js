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
    Platform,
    ScrollView,
    TouchableOpacity,

} from 'react-native';

var SettingLabel = require('./SettingLabel');
var SettingItem = require('./SettingItem');
var Dimensions = require('Dimensions');
var {width, height} = Dimensions.get('window');

var Setting = React.createClass({
    render() {
        return (
            <ScrollView>
            <View style={styles.container}>
                {this.renderNavBar()}
                <SettingLabel text={'设置'}/>
                <SettingItem text={'夜间模式'} rightStyle={1}/>
                <SettingItem text={'流量播放提醒'} rightStyle={2}/>
                <SettingItem text={'清除缓存'} rightStyle={0}/>

                <SettingLabel text={'反馈'}/>
                <SettingItem text={'意见与反馈'} rightStyle={0}/>
                <SettingItem text={'关注我们'} rightStyle={0}/>
                <SettingItem text={'给一个评分'} rightStyle={0}/>

                <SettingLabel text={'关于'}/>
                <SettingItem text={'用户协议'} rightStyle={0}/>
                <SettingItem text={'版本号'} rightStyle={3}/>

            </View>
            </ScrollView>
        );
    },

    /**
     * 渲染顶部导航
     */
    renderNavBar() {
        return (
            // 顶部导航bar
            <View style={styles.outNav}>

                {/*左边按钮*/}
                <TouchableOpacity style={styles.leftBtn}
                                  onPress={() => this.props.navigator.pop()}>
                    <Image source={{uri: 'icon_back'}} style={styles.navLeftBar}/>
                </TouchableOpacity>

                <Text style={styles.title}>设置</Text>

            </View>
        );
    },

});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#f8f8f8',
    },
    outNav: {
        height: Platform.OS == 'ios' ? height * 0.07 : height * 0.08,
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
        width: width,
        justifyContent: 'center',
        borderBottomColor: '#dddddd',
        borderBottomWidth: 0.167
    },
    leftBtn: {
        position: 'absolute',
        left: width * 0.024,
    },
    navLeftBar: {
        width: height * 0.04,
        height: height * 0.05,
    },
    title: {
        fontSize: width * 0.04,
        color: '#414141',
        fontWeight: 'bold'
    }
});

module.exports = Setting;
