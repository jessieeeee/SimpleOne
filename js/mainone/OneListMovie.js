/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow 主界面分页－一个－视频item
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
import constants from '../Constants';
var Read = require('../read/Read');
var {width, height} = constants.ScreenWH;
import DateUtil from "../util/DateUtil";
var Share=require('../share/Share');
var OneListMovie = React.createClass({

    //初始化变量
    getInitialState() {
        return {
            like: false,
            likeNum:this.props.data.like_count
        }
    },

    //要传入的参数
    getDefaultProps() {
        return {
            data:null,
        }
    },

    //渲染
    render() {
        return (
            <TouchableOpacity activeOpacity={1} onPress={() => this.pushToRead()}>
            <View style={styles.container}>
                <Text style={styles.category}>
                    - 影视 -
                </Text>
                {/*标题*/}
                <Text style={styles.title}>{this.props.data.title}</Text>
                {/*用户名*/}
                <Text style={styles.author}>{this.getAuthor()}</Text>
                <View style={styles.centerImgBg}>
                    <Image source={{uri: 'feeds_movie'}} style={{width: width * 0.9, height: width * 0.56,}}/>
                    {/*用户名下面的插图*/}
                    <Image source={{uri: this.props.data.img_url}} style={styles.centerImg}/>
                </View>
                {/*插图下面的那句话*/}
                <Text style={styles.forward}>{this.props.data.forward}</Text>
                <View style={{width:width}}>
                {/*那句话右边的副标题*/}
                <Text style={styles.subtitle}>{'-- 《' + this.props.data.subtitle + '》'}</Text>
                </View>
                {/*最下面的bar*/}
                <View style={styles.bar}>
                    {/*左边的按钮*/}
                    <Text style={styles.date}>{DateUtil.showDate(this.props.data.post_date)}</Text>

                    {/*右边的按钮*/}
                    <View style={styles.rightBtn}>
                        <View style={{flexDirection: 'row', width: width * 0.1, marginRight: width * 0.03}}>
                            <TouchableOpacity
                                onPress={() => this.likeClick()}>
                                <Image source={{uri: this.showLikeIcon()}} style={styles.barRightBtnsIcon1}/>
                            </TouchableOpacity>

                            {constants.renderlikeNum(this.state.likeNum)}

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
            </TouchableOpacity>
        );
    },


    /**
     * 跳转到阅读页
     * @param url
     */
    pushToRead() {
        this.props.navigator.push(
            {
                component: Read,
                title:'阅读',
                params:{
                    data:this.props.data,
                    entry:constants.OneRead
                }
            }
        )
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
                    shareInfo:this.props.data.share_info,
                    shareList:this.props.data.share_list
                }
            }
        )
    },



    /**
     * 获取回答者
     * @returns {*}
     */
    getAuthor() {
        var tempStr = new Array();
        tempStr = this.props.data.author.user_name.split(' ');
        return '文 / ' + tempStr[0];

    },

    /**
     * 点击喜欢
     */
    likeClick() {
        this.setState({
            likeNum: this.state.like?this.props.data.like_count:this.props.data.like_count + 1,
            like: !this.state.like
        });
    },

    /**
     * 根据当前状态，显示喜欢图标
     * @returns {*}
     */
    showLikeIcon() {
        //喜欢
        if (this.state.like) {
            return 'bubble_liked';
        } else {
            return 'bubble_like';
        }
    },

});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    category: {
        marginTop: width * 0.03,
        fontSize: width * 0.032,
        color: '#8B8B8B'
    },
    title: {
        fontSize: width * 0.056,
        color: '#333333',
        width: width,
        paddingLeft: width * 0.05,
        marginTop: width * 0.03,
    },
    subtitle: {
        fontSize: width * 0.038,
        color: '#808080',
        position:'absolute',
        right:width * 0.05,
    },
    author: {
        width: width,
        marginTop: width * 0.03,
        paddingLeft: width * 0.05,
        fontSize: width * 0.038,
        color: '#808080'
    },
    centerImgBg: {
        marginTop: width * 0.02,
        width: width * 0.9,
        height: width * 0.56,
        justifyContent: 'center',
        alignItems: 'center',
    },
    centerImg: {
        position:'absolute',
        top:width*0.046,
        width: width * 0.9,
        height: width * 0.47,
    },
    forward: {
        width: width,
        paddingLeft: width * 0.05,
        paddingRight: width * 0.05,
        marginTop: width * 0.02,
        fontSize: width * 0.038,
        color: '#808080',
        lineHeight: parseInt(width * 0.08)
    },
    bar: {
        alignItems: 'center',
        marginTop: width * 0.15,
        flexDirection: 'row',
        width: width,
        height: Platform.OS == 'ios' ? height * 0.06 : height * 0.057,
    },
    date: {

        fontSize: 12,
        color: '#B6B6B6',
        flexDirection: 'row',
        position: 'absolute',
        left: width * 0.05,
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

module.exports = OneListMovie;
