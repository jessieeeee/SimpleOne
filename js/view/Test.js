/**
 * Created by blueberry on 6/20/2017.
 */

import React, {Component} from 'react';
import {AppRegistry, StyleSheet, View, Text, requireNativeComponent, TextInput, Button, Alert} from 'react-native';

import PickDate from './PickDate';

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
            </View>
        );
    }
});
module.exports = Test;