/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 *
 * 大多数item 除广告和顶部item
 */

import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    Platform,
    TouchableOpacity
} from 'react-native';

import Toast, {DURATION} from 'react-native-easy-toast'

var Dimensions = require('Dimensions');
var {width, height} = Dimensions.get('window');
var Share=require('../share/Share');
var OneListAudio = React.createClass({

    //初始化变量
    getInitialState() {
        return {
            like: false
        }
    },

    //要传入的参数
    getDefaultProps() {
        return {
            title: '标题',
            imgUrl: '谁答下面的插图',
            likeNum: 0,
        }
    },

    //渲染
    render() {
        return (
            <View style={styles.container}>
                {/*背景*/}
                <Image source={{uri: this.props.imgUrl}} style={styles.bg}/>
                {/*标题*/}
                <Text style={styles.title}>{this.props.title}</Text>
                {/*最下面的bar*/}
                <View style={styles.bar}>
                    <Text style={{color:'#a6a6a6',fontSize:width*0.08,marginLeft:width*0.04}}>·</Text>
                    {/*左边的按钮*/}
                    <Image source={{uri:'aliwx_chatfrom_play_02'}} style={styles.leftIcon}/>

                    {/*右边的按钮*/}
                    <View style={styles.rightBtn}>
                        <View style={{flexDirection: 'row' ,width:width * 0.1 ,marginRight: width * 0.03}}>
                        <TouchableOpacity
                            onPress={() => this.likeClick()}>
                            <Image source={{uri: this.showLikeIcon()}} style={styles.barRightBtnsIcon1}/>
                        </TouchableOpacity>

                            {this.renderlikeNum()}

                        </View>
                        <TouchableOpacity
                            onPress={() => this.pushToShare()}>
                            <Image source={{uri: 'share_image'}} style={styles.barRightBtnsIcon2}/>
                        </TouchableOpacity>
                    </View>
                </View>

                <Toast
                    ref="toast"
                    style={{backgroundColor: 'gray'}}
                    position='top'
                    positionValue={height * 0.24}
                    textStyle={{color: 'white'}}
                />
            </View>
        );
    },


    /**
     * 跳转到分享
     * @param url
     */
    pushToShare(){

        this.props.navigator.push(
            {
                component: Share,
                title:'分享',
                params:{
                    showlink:true,
                    shareInfo:this.props.shareInfo,
                    shareList:this.props.shareList
                }
            }
        )
    },

    /**
     * 渲染喜欢数量
     */
    renderlikeNum(){
       if(this.props.likeNum>0){
           return(
           <Text style={{position:'relative',left:width * 0.003,bottom:width * 0.016,fontSize: width * 0.024,color:'#A7A7A7'}}>
               {this.props.likeNum}
           </Text>
           );
       }
    },


    /**
     * 点击喜欢
     */
    likeClick(){
        this.setState({
            like: !this.state.like
        });
    },

    /**
     * 根据当前状态，显示喜欢图标
     * @returns {*}
     */
    showLikeIcon(){
        //喜欢
        if(this.state.like===true){
            return 'bubble_liked';
        }else{
            return 'bubble_like';
        }
    },

    //点击喜欢
    likeClick(){
        this.setState({
            like: !this.state.like
        });
    },

    //根据当前状态，显示喜欢图标
    showLikeIcon(){
        //喜欢
        if(this.state.like===true){
            return 'bubble_liked';
        }else{
            return 'bubble_like';
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

    title: {
        fontSize: width*0.034,
        color: '#c3c2c7',
        width: width,
        textAlign:'center',
        position:'absolute',
        bottom:height * 0.1,
    },

    bg: {
        width: width ,
        height: width * 0.66,
    },

    bar: {
        alignItems:'center',
        position:'absolute',
        bottom:0,
        flexDirection: 'row',
        width: width,
        borderTopColor:'#c3c2c7',
        borderTopWidth:width*0.0006,
        height: Platform.OS == 'ios' ? height * 0.06 : height * 0.07,
    },
    leftIcon:{
        width: width * 0.066,
        height: width * 0.09,

    },
    rightBtn: {
        flexDirection: 'row',
        position: 'absolute',
        right: width * 0.05,
    },
    barRightBtnsIcon1: {
        width: width * 0.045,
        height: width * 0.045,
    },
    barRightBtnsIcon2: {
        width: width * 0.045,
        height: width * 0.045,

    },

});

module.exports = OneListAudio;
