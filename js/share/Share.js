/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Platform,
    Image,
    NativeModules,
    ScrollView,
    TouchableOpacity,
    Clipboard,
} from 'react-native';
import constants from '../Constants';
let toast = NativeModules.ToastNative;
var Dimensions = require('Dimensions');
var {width, height} = Dimensions.get('window');
let UShare = NativeModules.UShare;

var Share = React.createClass({
    getInitialState() {
        return {
            content: 'Content will appear here'
        };
    },
    render() {
        return (
            <View style={styles.container}>
                {this.renderNavBar()}
                <ScrollView showsVerticalScrollIndicator={false}>
                    <TouchableOpacity onPress={() => this.platformShare(constants.PlatformWeChatMoments)}>
                        <Image source={{uri: 'bubble_moment'}} style={[styles.shareIcon, {marginTop: width * 0.01}]}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.platformShare(constants.PlatformWeChat)}>
                        <Image source={{uri: 'bubble_wechat'}} style={styles.shareIcon}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.platformShare(constants.PlatformQQ)}>
                        <Image source={{uri: 'bubble_qq'}} style={styles.shareIcon}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.platformShare(constants.PlatformSina)}>
                        <Image source={{uri: 'bubble_weibo'}} style={styles.shareIcon}/>
                    </TouchableOpacity>
                    {this.showLink()}
                </ScrollView>
            </View>
        );
    },

    /**
     * 调起原生分享模块
     * @param platform
     */
    platformShare(platform) {
        var data;
        switch(platform){
            case constants.PlatformWeChatMoments:
                data=this.props.route.params.shareList.wx_timeline;
                break;
            case constants.PlatformWeChat:
                data=this.props.route.params.shareList.wx;
                break;
            case constants.PlatformSina:
                data=this.props.route.params.shareList.weibo;
                break;
            case constants.PlatformQQ:
                data=this.props.route.params.shareList.qq;
                break;
        }
        var title,content,image,url;
        if(data.title==null||data.title==""){
           title=this.props.route.params.shareInfo.title;
        }else{
            title=data.title;
        }
        if(data.desc==null||data.desc==""){
            content=this.props.route.params.shareInfo.content;
        }else{
            content=data.desc;
        }
        if(data.imgUrl==null||data.imgUrl==""){
            image=this.props.route.params.shareInfo.image;
        }else{
            image=data.imgUrl;
        }
        if(data.link==null||data.link==""){
            url=this.props.route.params.shareInfo.url;
        }else{
            url=data.link;
        }
        UShare.share(platform,title ,content ,
            image,url,
            (platform) => {
                console.log(platform + '成功');
            },
            (platform, msg) => {
                console.log(platform + '失败' + msg);
            },
            (platform) => {
                console.log(platform + '取消');
            });
    },

    /**
     * 复制到剪贴板
     * @returns {Promise.<void>}
     */
    async setClipboardContent() {
        Clipboard.setString(this.props.route.params.shareInfo.url);
        try {
            var content = await Clipboard.getString();
            this.setState({content: content});
            toast.showMsg('已复制到剪切板',toast.SHORT)
        } catch (e) {
            this.setState({content: e.message});
        }
    },

    showLink() {
        if (this.props.route.params.showlink) {
            return (
                <TouchableOpacity onPress={() => this.setClipboardContent()}>
                    <Image source={{uri: 'bubble_copy_link'}} style={styles.shareIcon}/>
                </TouchableOpacity>
            );
        }
    },


    /**
     * 渲染顶部导航
     */
    renderNavBar() {
        return (
            // 顶部导航bar
            <View style={styles.outNav}>
                <View style={styles.rightBtnBar}>
                    <TouchableOpacity onPress={() => this.props.navigator.pop()}>
                        <Image style={styles.rightBtn} source={{uri: 'close_gray'}}/>
                    </TouchableOpacity>
                </View>
            </View>
        );
    },
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#fafafa',
    },
    outNav: {
        height: Platform.OS == 'ios' ? height * 0.062 : height * 0.1,
        flexDirection: 'row',
        alignItems: 'center',
        width: width,
        justifyContent: 'center',
    },

    rightBtn: {
        width: height * 0.031,
        height: height * 0.031,
    },

    rightBtnBar: {
        position: 'absolute',
        right: width * 0.04,
        flexDirection: 'row'
    },

    shareIcon: {
        width: height * 0.06,
        height: height * 0.06,
        marginBottom: width * 0.16
    }
});

module.exports = Share;
