/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow 第三方登录页
 */

import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    Platform,
    NativeModules,
    TouchableOpacity,
    StatusBar
} from 'react-native';
import constants from '../Constants';
import CommStyles from "../CommStyles";
let toast = NativeModules.ToastNative;
let ULogin = NativeModules.ULogin;
let {width, height} = constants.ScreenWH;

class Login extends Component{
    render() {
        return (

            <View style={styles.container}>
                <StatusBar
                    hidden={true}
                />

                <Image source={{uri:'login_bg'}} style={{width:width,height:height,position:'absolute', top:0}}/>

                {this.renderNavBar()}
                <TouchableOpacity style={[styles.btnView,{marginTop:width*0.13}]} onPress={()=>{this.platformLogin(constants.PlatformWeChat)}}>
                    <Image source={{uri:'bubble_wechat_night'}} style={styles.btnIcon}/>
                    <Text style={styles.btnText}>微信</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnView} onPress={()=>{this.platformLogin(constants.PlatformSina)}}>
                    <Image source={{uri:'bubble_weibo_night'}} style={styles.btnIcon}/>
                    <Text style={styles.btnText}>微博</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.btnView} onPress={()=>{this.platformLogin(constants.PlatformQQ)}}>
                    <Image source={{uri:'bubble_qq_night'}} style={styles.btnIcon}/>
                    <Text style={styles.btnText}>QQ</Text>
                </TouchableOpacity>

                <Text style={{color:'#dde0e2', fontSize:width*0.038}}>或者</Text>

                <Image source={{uri:'phone_login_bg'}} style={{width:width*0.35,height:width*0.048, marginTop:width*0.04}}/>

                <Text style={[styles.description,{bottom:width*0.122}]}>创建账户即代表您同意</Text>
                <Text style={[styles.description,{bottom:width*0.056}]}>使用条款和隐私政策</Text>
            </View>
        );
    }

    /**
     * 调起原生登录模块
     * @param platform
     */
    platformLogin(platform) {
        ULogin.login(platform,
            (platform) => {
                console.log(platform + '成功');
            },
            (platform, msg) => {
                console.log(platform + '失败' + msg);
            },
            (platform) => {
                console.log(platform + '取消');
            });
    }

    /**
     * 渲染顶部导航
     */
    renderNavBar() {
        return (
            // 顶部导航bar
            <View style={CommStyles.outNav2}>

                {/*左边按钮*/}
                <TouchableOpacity style={CommStyles.leftBack}
                                  onPress={() => this.props.navigator.pop()}>
                    <Image source={{uri: 'icon_back'}} style={CommStyles.navLeftBack}/>
                </TouchableOpacity>

                <Text style={styles.title}>登录ONE</Text>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
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

// module.exports=Login;
export default Login;