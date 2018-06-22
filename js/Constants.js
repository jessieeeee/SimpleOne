import React, {Component} from 'react';
import FrameAnimation from './view/FrameAnimationView';
let Dimensions = require('Dimensions');

import {
    Text,
} from 'react-native';
import AppState from "./store/AppState";

const object = {

    CategoryGraphic: "0",
    CategoryQuestion: "3",
    CategoryRead:  "1",
    CategorySerial: "2",
    CategoryMovie: "5",
    CategoryMusic: "4",
    CategoryRadio: "8",
    CategoryBannerAd: "14",
    CategoryAd: "6",
    CategoryReadBg: "11",
    playMusic: false,
    ScreenWH: Dimensions.get('window'),
    curDate: '',
    curPage: 0,
    /**
     * 分享平台
     */
    PlatformQQ: 0,
    PlatformWeChat: 1,
    PlatformWeChatMoments: 2,
    PlatformSina: 3,
    /**
     * 阅读入口
     */
    MenuRead: 1,
    OneRead: 2,
    AllRead: 3,

    //分割线宽度
    divideLineWidth: 0.5,

    STOP_PLAY_MEDIA: 'STOP_PLAY_MEDIA',//停止播放
    LOADING_MEDIA_SUCCESS: 'LOADING_MEDIA_SUCCESS',//缓冲成功
    PLAY_EXCEPTION: 'PLAY_EXCEPTION',//播放异常
    PLAY_COMPLETE: 'PLAY_COMPLETE',//播放完成
    PLAY_STATE: 'PLAY_STATE',//播放状态
    PLAY_PROGRESS: 'PLAY_PROGRESS',//播放进度
    CHANGE_MUSIC_CONTROL_MODAL_VISIBILITY: 'CHANGE_MUSIC_CONTROL_MODAL_VISIBILITY', //控制悬浮窗可见
    CURRENT_MUSIC_DATA: null, //当前播放的音乐数据
    MUSIC_TYPE: 0,
    AUDIO_TYPE: 1,
    CURRENT_TYPE: 0,

    /**
     * 数据管理器
     */
    appState : new AppState(),

    /**
     * 渲染载入view
     * @returns {*}
     */
    renderLoading(loading) {
        return (
            <FrameAnimation
                loadingArr={this.getLoadingIcon()}
                width={this.ScreenWH.width * 0.14} height={this.ScreenWH.width * 0.14}
                loading={loading} refreshTime={0} style={{
                position: 'absolute',
                top: this.ScreenWH.height * 0.4 - this.ScreenWH.width * 0.07,
                left: this.ScreenWH.width / 2 - this.ScreenWH.width * 0.07
            }}/>
        );
    },

    /**
     * 载入图标名称初始化
     */
    getLoadingIcon() {
        let loadingArr=[];
        for (let i = 0; i < 30; i++) {
            let postfix;
            if(i<10){
                postfix='0'+i;
            }else{
                postfix=i;
            }
            loadingArr.push(('webview_loading_' + postfix).toString());
        }
        return loadingArr;
    },
    /**
     * 渲染喜欢数量
     */
    renderlikeNum(likeNum) {
        if (likeNum > 0) {
            return (
                <Text style={{
                    position: 'relative',
                    left: this.ScreenWH.width * 0.003,
                    bottom: this.ScreenWH.width * 0.016,
                    fontSize: this.ScreenWH.width * 0.024,
                    color: '#A7A7A7'
                }}>
                    {likeNum}
                </Text>
            );
        }
    },


};

export default object;