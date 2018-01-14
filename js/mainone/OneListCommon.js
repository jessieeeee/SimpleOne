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
import DateUtil from "../util/DateUtil";
import Toast, {DURATION} from 'react-native-easy-toast'

var Dimensions = require('Dimensions');
var {width, height} = Dimensions.get('window');
var Share = require('../share/Share');
var Read = require('../read/Read');
import constants from '../Constants';

var OneListCommon = React.createClass({

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
            data: null,
        }
    },

    //渲染
    render() {
        return (
            <TouchableOpacity onPress={() => this.pushToRead()}>
                <View style={styles.container}>
                    <Text style={styles.category}>{this.getCategory()}</Text>
                    {/*标题*/}
                    <Text style={styles.title}>{this.props.data.title}</Text>
                    {/*回答者*/}
                    <Text style={styles.author}>{this.getAuthor()}</Text>
                    {this.renderImg()}
                    {/*插图下面的那句话*/}
                    <Text style={styles.forward}>{this.props.data.forward}</Text>
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
            </TouchableOpacity>
        );
    },

    renderImg() {
        if (this.props.data.img_url != '') {
            return (
                <Image source={{uri: this.props.data.img_url}} style={styles.centerImg}/>
            );
        }
    },
    /**
     * 跳转到阅读页
     * @param url
     */
    pushToRead() {
        this.props.navigator.push(
            {
                component: Read,
                title: '阅读',
                params: {
                    data: this.props.data,
                    entry: constants.OneRead
                }
            }
        )
    },

    /**
     * 跳转到分享
     * @param url
     */
    pushToShare() {

        this.props.navigator.push(
            {
                component: Share,
                title: '分享',
                params: {
                    showlink: true,
                    shareInfo: this.props.data.share_info,
                    shareList: this.props.data.share_list
                }
            }
        )
    },
    /**
     * 渲染喜欢数量
     */
    renderlikeNum() {
        if (this.state.likeNum > 0) {
            return (
                <Text style={{
                    position: 'relative',
                    left: width * 0.003,
                    bottom: width * 0.016,
                    fontSize: width * 0.024,
                    color: '#A7A7A7'
                }}>
                    {this.state.likeNum}
                </Text>
            );
        }
    },

    /**
     * 显示分类
     */
    getCategory() {
        if (this.props.data.tag_list != null && this.props.data.tag_list.length > 0) {
            return '- ' + this.props.data.tag_list[0].title + ' -';
        }
        else if (this.props.data.category == 1) {
            return '- 阅读 -';
        }
        else if (this.props.data.category == 2) {
            return '- 连载 -';
        }
        else if (this.props.data.category == 3) {
            return '- 问答 -';
        }
        else {
            return '- 连载 -';
        }

    },

    /**
     * 获取回答者
     * @returns {*}
     */
    getAuthor() {
        var tempStr = new Array();
        tempStr = this.props.data.author.user_name.split(' ');
        if (this.props.data.category == 1) {
            return '文 / ' + tempStr[0];
        }
        return tempStr[0];
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
    author: {
        width: width,
        marginTop: width * 0.03,
        paddingLeft: width * 0.05,
        fontSize: width * 0.038,
        color: '#808080'
    },
    centerImg: {
        marginTop: width * 0.02,
        width: width * 0.9,
        height: width * 0.52,
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

});

module.exports = OneListCommon;
