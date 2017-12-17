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

var Dimensions = require('Dimensions');
var {width, height} = Dimensions.get('window');

var LoadingMore = React.createClass({
    render() {
        return (
            <View style={styles.container}>
                {/*<Text style={{*/}
                    {/*color: 'gray',*/}
                    {/*fontSize: width * 0.04,*/}
                    {/*marginTop:width * 0.1,*/}
                {/*}}>*/}
                    {/*正在加载...*/}
                {/*</Text>*/}
            </View>
        );
    }
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    welcome: {
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