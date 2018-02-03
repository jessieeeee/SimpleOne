import React, {Component} from 'react';
import ShowPlayMusic from './view/ShowPlayMusic';
var FrameAnimation = require('./view/FrameAnimationView');
var Dimensions = require('Dimensions');

import {
    Text,
} from 'react-native';

const object = {


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
     * 音频播放绘制
     */
    renderAudioPlay(clickEvent) {
        if(this.playMusic){
            return(
                <ShowPlayMusic
                    onChange={(obj) => {
                        console.log('onSure收到事件'+obj.nativeEvent.msg+"目标id"+obj.nativeEvent.target);
                        clickEvent();
                    }}
                    style={{
                        position: 'absolute',
                        top: this.ScreenWH.height * 0.17,
                        right: 0,
                        zIndex: 100,
                        width:this.ScreenWH.width * 0.11,
                        height:this.ScreenWH.width * 0.1
                    }}
                />
            );
        }

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