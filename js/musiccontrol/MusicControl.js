/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import constants from '../Constants';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    Modal,
    Slider,
    TouchableOpacity
} from 'react-native';
var {width, height} = constants.ScreenWH;

var MusicControl = React.createClass({

    getDefaultProps(){
        return{
            isVisible:false,
            onCancel:null,
        }
    },
    render() {
        return (
            <Modal
                animationType={'fade'}
                transparent={true}
                visible={this.props.isVisible}
                onRequestClose={() => {
                    this.props.onCancel()
                }}>
                <TouchableOpacity style={styles.container} onPress={() => this.props.onCancel()}>
                    <View style={styles.bg}>
                        <Text style={styles.title}> {constants.CURRENT_MUSIC_NAME}</Text>
                        <Slider style={{width:width}} minimumTrackTintColor={'black'}
                        maximumTrackTintColor={'﻿#9f9f9f'} thumbImage={{uri:'audio'}}/>
                        <Text style={styles.singer}> {constants.CURRENT_MUSIC_SINGER}</Text>
                        <View style={styles.btnsView}>
                        <Image source={{uri:'audio'}} style={[styles.controlBtn,{position:'absolute',left: width*0.02}]}/>
                        <Image source={{uri:'audio'}} style={[styles.controlBtn]}/>
                        <Image source={{uri:'audio'}} style={[styles.controlBtn,{position:'absolute',right: width*0.02}]}/>
                        </View>
                        <View style={styles.bottomBar}>
                            <Image source={{uri:'audio'}} style={[styles.bottomBtn,{position:'absolute',left:width*0.02}]}/>
                            <View style={styles.centerfrom}>
                            <Image source={{uri:'audio'}} style={styles.bottomBtn}/>
                                <Text>来自一个音乐</Text>
                            </View>
                            <View style={{position:'absolute', right:width*0.02,flexDirection:'row'}}>
                            <Image source={{uri:'audio'}} style={[styles.bottomBtn,{ marginRight: width*0.03}]}/>
                            <Image source={{uri:'audio'}} style={[styles.bottomBtn,]}/>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            </Modal>
        );
    },


});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    bg:{
        width:width,
        alignItems: 'center',
        backgroundColor:'white'
    },
    title:{
        marginTop:width*0.04,
        color: '#B3B3B3',
        fontSize:width*0.04,
    },

    singer:{
        marginTop:width*0.05,
        color: '#cfcfcf',
        fontSize:width*0.03,
    },
    btnsView:{
        marginTop:width*0.05,
        width:width*0.6,
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
    },
    controlBtn:{
        width:width*0.06,
        height:width*0.06
    },
    bottomBtn:{
        width:width*0.06,
        height:width*0.06
    },
    bottomBar:{
        marginTop:width*0.06,
        width:width,
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        marginBottom:width*0.05,
    },
    centerfrom:{
        flexDirection:'row'
    }
});

module.exports = MusicControl;
