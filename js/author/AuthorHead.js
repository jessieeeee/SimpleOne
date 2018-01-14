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
    TouchableOpacity,

} from 'react-native';
var Dimensions = require('Dimensions');
var {width, height} = Dimensions.get('window');

var AuthorHead=React.createClass({
    //要传入的参数
    getDefaultProps() {
        return {
            data: null,
        }
    },

    render() {
        return (
            <View style={styles.container}>
               <Image source={{uri:this.props.data.web_url}} style={styles.avatar}/>
                <Text style={styles.name}>{this.props.data.user_name} </Text>
                <Text style={styles.summary}>{this.props.data.summary}</Text>
                <TouchableOpacity onPress={() => this.followAuthor()}>
                <Text style={styles.follow}>关注</Text>
                </TouchableOpacity>
                <Text style={styles.followNum}>{this.props.data.fans_total+'关注'}</Text>
            </View>
        );
    },

    followAuthor(){

    }
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    avatar:{
        resizeMode: 'stretch',
        marginTop:width*0.05,
        width:width*0.16,
        height:width*0.16,
        borderRadius:width,
    },
    name:{
        marginTop:width*0.03,
        color:'black',
        fontSize:width*0.05,
    },
    summary:{
        margin:width*0.04,
        color:'black',
        fontSize:width*0.04,
    },
    follow:{
        color:'#333333',
        fontSize:width*0.04,
        borderColor:'#333333',
        borderWidth:width*0.002,
        borderRadius:width*0.006,
        textAlign:'center',
        textAlignVertical:'center',
        paddingTop:width*0.01,
        paddingBottom:width*0.01,
        paddingLeft:width*0.02,
        paddingRight:width*0.02
    },
    followNum:{
        marginTop:width*0.014,
        color:'#a1a1a1',
        fontSize:width*0.026,
        marginBottom:width*0.04
    }
});

module.exports=AuthorHead;
