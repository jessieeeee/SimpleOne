/**
 * Created by blueberry on 6/20/2017.
 */

import React, {Component} from 'react';
import {AppRegistry, StyleSheet, View, Text, requireNativeComponent, TextInput, Button, Alert} from 'react-native';

import PickDate from './PickDate';
import ShowPlayMusic from './ShowPlayMusic'
var Test = React.createClass({
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
});
module.exports = Test;