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
import constants from '../Constants';
var Dimensions = require('Dimensions');
var {width, height} = Dimensions.get('window');

var SettingItem=React.createClass({
    getDefaultProps(){
        return {
            text: '',
            rightStyle:0,
            //右边显示样式，箭头0,checkbox未选1,选中2,文字3
        }
    },

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.item}>
                    {this.props.text}
                </Text>

                {this.renderRight()}
            </View>
        );
    },

    renderRight() {
        if(this.props.rightStyle==0){
            return (
                <Image style={styles.iconArrow} source={{uri:'arrow_right'}}/>
            );
        }else if(this.props.rightStyle==1){
            return(
                <View style={styles.checkBoxView}>

                    <Image source={{uri:'checkbox_bg'}} style={{width:width*0.064,height:width*0.06}}/>
                </View>
            );
        }else if(this.props.rightStyle==2){
            return (
                <View style={styles.checkBoxView}>
                    <Image source={{uri:'checkbox_bg'}} style={{width:width*0.064,height:width*0.06}}/>
                    <Image source={{uri:'checkbox_click'}} style={{width:width*0.05,height:width*0.04,position:'absolute',top:width*0.01}}/>
                </View>
            );
        }else if(this.props.rightStyle==3){
            return (
                <Text style={styles.rightText}>
                   4.3.4
                </Text>
            );
        }
    },
});
const styles = StyleSheet.create({
    container: {
        justifyContent:'center',
        backgroundColor: 'white',
        height:width*0.1384,
        borderBottomColor:'#dddddd',
        borderBottomWidth: constants.divideLineWidth
    },
    item: {
        fontSize: width*0.04,
        width:width,
        marginLeft:width*0.12,
        color:'#383838',
    },
    rightText:{
        position:'absolute',
        right: width*0.085,
        color:'#b5b5b5',
        fontSize:width*0.038
    },
    iconArrow:{
        position:'absolute',
        right: width*0.084,
        height:width*0.046,
        width:width*0.046
    },
    checkBoxView:{
        position:'absolute',
        right: width*0.08,
        alignItems:'center',
        justifyContent:'center',
    }
});

module.exports=SettingItem;
