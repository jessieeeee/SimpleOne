/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow 组件测试界面
 */

import React, {Component} from 'react';
import {AppRegistry, StyleSheet, View, Text, requireNativeComponent, TextInput, Button, Alert} from 'react-native';

import PickDate from './PickDate';
import ShowPlayMusic from './ShowPlayMusic'
class Test extends Component{
    render() {
        return (
            <View style={{flex: 1}}>
                <PickDate
                    onChange={(obj) => {
                        console.log('onSure收到事件'+obj.nativeEvent.msg+"目标id"+obj.nativeEvent.target);

                    }}
                    style={{flex: 1, width: '100%'}}
                />

                <ShowPlayMusic
                    onChange={(obj) => {
                        console.log('onSure收到事件'+obj.nativeEvent.msg+"目标id"+obj.nativeEvent.target);

                    }}
                    style={{height:'109%', width: '18%'}}
                />
            </View>
        );
    }
}
export default Test;