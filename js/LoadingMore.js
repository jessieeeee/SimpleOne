/**
 * @date :2017/12/15 0015
 * @author :JessieK
 * @email :lyj1246505807@gmail.com
 * @description : 加载更多view
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
} from 'react-native';

import constants from '../Constants';
var {width, height} = constants.ScreenWH;
var LoadingMore = React.createClass({
    getDefaultProps() {
        return {
            // 外层回调函数参
            loading: false, //加载更多
        }
    },

    render() {
        return (
            <View style={styles.container}>
                {this.loading()}
            </View>
        );
    },

    loading() {
        if (this.props.loading) {
            return (
                <Text style={{
                    color: 'gray',
                    fontSize: width * 0.04,
                    margin: width * 0.04,
                }}>
                    正在加载中...
                </Text>
            );
        }
    }
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    menu: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
});

module.exports = LoadingMore;