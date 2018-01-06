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
import DateUtils from "../util/DateUtil";
import DateUtil from "../util/DateUtil";
var Dimensions = require('Dimensions');
var {width, height} = Dimensions.get('window');
var Share=require('../share/Share');
var OneListCommon = React.createClass({

    //初始化变量
    getInitialState() {
        return {
            like: false
        }
    },

    //要传入的参数
    getDefaultProps() {
        return {
            userName: '用户',
            title: '标题',
            imgUrl: '音乐封面',
            musicName: '音乐名称',
            audioAuthor: '作者',
            audioAlbum: '专辑',
            forward: '音乐描述',
            postDate: '发布的日期',
            likeNum: 0,
        }
    },

    //渲染
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.category}>
                    - 音乐 -
                </Text>
                {/*标题*/}
                <Text style={styles.title}>{this.props.title}</Text>
                {/*用户*/}
                <Text style={styles.author}>{this.getAuthor()}</Text>
                <View style={styles.centerView}>

                    {/*音乐封面的背景*/}
                    <View style={{
                        width: width,
                        height: width * 0.54, justifyContent: 'center',
                        alignItems: 'center', position: 'absolute', top: 0
                    }}>
                        <Image source={{uri: 'feeds_music'}} style={{
                            width: width * 0.9,
                            height: width * 0.54,
                        }}/>
                    </View>
                    {/*用户下面的音乐封面*/}
                    <Image source={{uri: this.props.imgUrl}} style={styles.centerImg}/>
                    <View style={{
                        width: width * 0.52,
                        height: width * 0.52, justifyContent: 'center',
                        alignItems: 'center', position: 'absolute', top: 0
                    }}>
                        <TouchableOpacity
                            onPress={() => this.refs.toast.show('click', DURATION.LENGTH_LONG)}>
                            {/*播放按钮*/}
                            <Image source={{uri: 'play'}} style={{width: width * 0.12, height: width * 0.12}}/>
                        </TouchableOpacity>
                    </View>
                    <Image source={{uri: 'xiami_right'}} style={styles.iconXia}/>
                </View>
                {/*音乐封面下的音乐名称，作者和专辑*/}
                <Text style={styles.musicInfo}>{this.getMusicInfo()}</Text>
                {/*音乐描述*/}
                <Text style={styles.forward}>{this.props.forward}</Text>
                {/*最下面的bar*/}
                <View style={styles.bar}>
                    {/*左边的按钮*/}
                    <Text style={styles.date}>{DateUtil.showDate(this.props.postDate)}</Text>

                    {/*右边的按钮*/}
                    <View style={styles.rightBtn}>
                        <View style={{flexDirection: 'row', width: width * 0.1, marginRight: width * 0.03}}>
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
    renderlikeNum() {
        if (this.props.likeNum > 0) {
            return (
                <Text style={{
                    position: 'relative',
                    left: width * 0.003,
                    bottom: width * 0.016,
                    fontSize: width * 0.024,
                    color: '#A7A7A7'
                }}>
                    {this.props.likeNum}
                </Text>
            );
        }
    },

    /**
     * 获得歌曲信息
     */
    getMusicInfo() {
        return this.props.musicName + ' · ' + this.props.audioAuthor + ' | ' + this.props.audioAlbum;
    },

    /**
     * 获取回答者
     * @returns {*}
     */
    getAuthor() {
        var tempStr = new Array();
        tempStr = this.props.userName.split(' ');
        return '文 / ' + tempStr[0];
    },

    /**
     * 点击喜欢
     */
    likeClick() {
        this.setState({
            like: !this.state.like
        });
    },

    /**
     * 根据当前状态，显示喜欢图标
     * @returns {*}
     */
    showLikeIcon() {
        //喜欢
        if (this.state.like === true) {
            return 'bubble_liked';
        } else {
            return 'bubble_like';
        }
    },

    //点击喜欢
    likeClick() {
        this.setState({
            like: !this.state.like
        });
    },

    //根据当前状态，显示喜欢图标
    showLikeIcon() {
        //喜欢
        if (this.state.like === true) {
            return 'bubble_liked';
        } else {
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
    author: {
        width: width,
        marginTop: width * 0.03,
        paddingLeft: width * 0.05,
        fontSize: width * 0.038,
        color: '#808080'
    },
    centerImg: {
        width: width * 0.54,
        height: width * 0.54,
        borderRadius: width * 0.7,
        resizeMode: 'stretch',
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
        marginTop: width * 0.06,
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
    musicInfo: {
        paddingLeft: width * 0.05,
        width: width,
        fontSize: width * 0.034,
        color: '#a8a8a8',
        marginTop: width * 0.04
    },
    centerView: {
        marginTop: width * 0.02,
        width: width,
        justifyContent: 'center',
        alignItems: 'center'
    },
    iconXia: {
        width: width * 0.07,
        height: width * 0.07,
        position: 'absolute',
        left: width * 0.05,
        bottom: width * 0.02
    }
});

module.exports = OneListCommon;
