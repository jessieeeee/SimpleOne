/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow　主界面分页－我的
 */

import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,

} from 'react-native';
import Toast, {DURATION} from 'react-native-easy-toast'
import constants from "../Constants";
import Login from '../login/Login';
import MusicControl from '../musiccontrol/MusicControl';
import Setting from '../setting/Setting';

var {width, height} = constants.ScreenWH;


class Me extends Component{
    constructor(props){
        super(props);
        this.state={
            play:true,
            showMusicControl:false,
        }
    }

    render() {
        return (
            <View style={styles.container}>
                {/*背景*/}
                <Image source={{uri: 'center_bg'}}
                       style={{width: width, height: height, position: 'absolute', top: 0}}/>

                {/*顶部导航*/}
                <View style={{
                    width: width,
                    position: 'absolute',
                    top: 0,
                    height: width * 0.1,
                    justifyContent: 'center',
                    paddingLeft: width * 0.04
                }}>
                    <TouchableOpacity activeOpacity={0.5}
                                      onPress={() => this.pushToSetting()}>
                        <Image source={{uri: 'center_setting'}} style={{width: width * 0.05, height: width * 0.05}}/>
                    </TouchableOpacity>
                </View>

                {/*登录头像*/}
                <TouchableOpacity activeOpacity={0.5}
                                  onPress={() => this.pushToLogin()}>
                    <Image source={{uri: 'head'}}
                           style={{
                               width: width * 0.17,
                               height: width * 0.17,
                               borderRadius: width * 0.4,
                               resizeMode: 'stretch',
                           }}/>
                    <Text style={styles.loginText}>
                        点击登录
                    </Text>
                </TouchableOpacity>

                {constants.renderAudioPlay(()=>{
                    this.setState({
                        showMusicControl:true,
                    });
                })}
                <MusicControl navigator={this.props.navigator} isVisible={this.state.showMusicControl} onCancel={()=>{
                    this.setState({
                        showMusicControl:false,
                    });
                }}/>

                <Toast
                    ref="toast"
                    style={{backgroundColor: 'gray'}}
                    position='top'
                    positionValue={height * 0.1}
                    textStyle={{color: 'white'}}
                />
            </View>
        );
    }

    /**
     * 跳转到登录
     * @param url
     */
    pushToLogin(){
        this.props.navigator.push(
            {
                component: Login,
                title:'登录',
                params:{

                }
            }
        )
    }

    /**
     * 跳转到设置页
     * @param url
     */
    pushToSetting() {
        this.props.navigator.push(
            {
                component: Setting,
            }
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    loginText: {
        color: 'white',
        fontSize: width * 0.044,
        marginTop: width * 0.012,
    }
});

export default Me;
