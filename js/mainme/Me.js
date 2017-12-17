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
    TouchableOpacity,

} from 'react-native';
import Toast, {DURATION} from 'react-native-easy-toast'

var Dimensions = require('Dimensions');
var {width, height} = Dimensions.get('window');
var Me = React.createClass({
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
                                      onPress={() => this.refs.toast.show('点击了', DURATION.LENGTH_LONG)}>
                        <Image source={{uri: 'center_setting'}} style={{width: width * 0.05, height: width * 0.05}}/>
                    </TouchableOpacity>
                </View>

                {/*登录头像*/}
                <TouchableOpacity activeOpacity={0.5}
                                  onPress={() => this.refs.toast.show('点击了', DURATION.LENGTH_LONG)}>
                    <Image source={{uri: 'head'}}
                           style={{width: width * 0.17, height: width * 0.17, borderRadius: width * 0.4, resizeMode: 'stretch',}}/>
                    <Text style={styles.loginText}>
                        点击登录
                    </Text>
                </TouchableOpacity>
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
});

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

module.exports = Me;
