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
    Platform,
    TouchableOpacity,
    StatusBar
} from 'react-native';
var Dimensions = require('Dimensions');
var {width, height} = Dimensions.get('window');

var Login=React.createClass({
    render() {
        return (

            <View style={styles.container}>
                <StatusBar
                    hidden={true}
                />

                <Image source={{uri:'login_bg'}} style={{width:width,height:height,position:'absolute', top:0}}/>

                {this.renderNavBar()}
                <View style={[styles.btnView,{marginTop:width*0.13}]}>
                    <Image source={{uri:'bubble_wechat_night'}} style={styles.btnIcon}/>
                    <Text style={styles.btnText}>微信</Text>
                </View>
                <View style={styles.btnView}>
                    <Image source={{uri:'bubble_weibo_night'}} style={styles.btnIcon}/>
                    <Text style={styles.btnText}>微博</Text>
                </View>

                <View style={styles.btnView}>
                    <Image source={{uri:'bubble_qq_night'}} style={styles.btnIcon}/>
                    <Text style={styles.btnText}>QQ</Text>
                </View>

                <Text style={{color:'#dde0e2', fontSize:width*0.038}}>或者</Text>

                <Image source={{uri:'phone_login_bg'}} style={{width:width*0.6,height:width*0.1}}/>

                <Text style={[styles.description,{bottom:width*0.122}]}>创建账户即代表您同意</Text>
                <Text style={[styles.description,{bottom:width*0.056}]}>使用条款和隐私政策</Text>
            </View>
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

                <Text style={styles.title}>登录ONE</Text>

            </View>
        );
    },

});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    outNav: {
        height: Platform.OS == 'ios' ? height * 0.07 : height * 0.08,
        flexDirection: 'row',
        alignItems: 'center',
        width: width,
        justifyContent: 'center',
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
        fontSize: width * 0.044,
        color: '#414141',
    },
    btnIcon:{
        width:width*0.08,
        height:width*0.08,
        position:'absolute',
        left:width*0.02
    },
    btnText:{
        fontSize:width*0.038,
        color:'#f4f4f4'
    },
    btnView:{
        backgroundColor:'#c3c4ca',
        borderRadius:width*0.01,
        width:width*0.77,
        height:width*0.11,
        flexDirection:'row',
        marginBottom:width*0.028,
        justifyContent:'center',
        alignItems: 'center',
    },
    description:{
        color:'#bcbfc4',
        fontSize:width*0.038,
        textDecorationLine:'underline',
        position:'absolute',
    }
});

module.exports=Login;
