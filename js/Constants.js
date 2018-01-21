import React, {Component} from 'react';
var FrameAnimation = require('./view/FrameAnimationView');
var Dimensions = require('Dimensions');

import {
    Text,
} from 'react-native';
const object = {
    playMusic:true,
    ScreenWH: Dimensions.get('window'),
    curDate: '',
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
    MenuRead:1,
    OneRead:2,
    AllRead:3,

    //分割线宽度
    divideLineWidth:0.5,

    STOP_PLAY_MEDIA: 'STOP_PLAY_MEDIA',//停止播放
    LOADING_MEDIA_SUCCESS: 'LOADING_MEDIA_SUCCESS',//缓冲成功
    PLAY_EXCEPTION: 'PLAY_EXCEPTION',//播放异常
    PLAY_COMPLETE:'PLAY_COMPLETE',//播放完成
    PLAY_STATE:'PLAY_STATE',//播放状态
    PLAY_PROGRESS:'PLAY_PROGRESS',//播放进度
    CHANGE_MUSIC_CONTROL_MODAL_VISIBILITY: 'CHANGE_MUSIC_CONTROL_MODAL_VISIBILITY' , //控制悬浮窗可见

    CURRENT_MUSIC_NAME:'来自另一个地球',  //当前播放的音乐名称
    CURRENT_MUSIC_DURATION:0,//当前播放的音乐进度
    CURRENT_MUSIC_TOTAL:0,//当前播放的音乐总进度
    CURRENT_MUSIC_SINGER:'张亮银',//当前播放的歌手
    /**
     * 载入图标名称初始化
     */
    getLoadingIcon() {
        var loadingArr=[];
        for (var i = 0; i < 20; i++) {
            var postfix;
            if(i<9){
                postfix='0'+(i+1);
            }else{
                postfix=i+1;
            }
            loadingArr.push(('float_player_play_' + postfix).toString());
        }
        return loadingArr;
    },

    /**
     * 音频播放绘制
     */
    renderAudioPlay(clickEvent){

        return(
            <FrameAnimation
                loadingArr={this.getLoadingIcon()}
                width={this.ScreenWH.width * 0.11} height={this.ScreenWH.width * 0.1}
                loading={this.playMusic}
                clickEvent={()=>{
                    clickEvent();
                }}
                style={{
                position: 'absolute',
                top: this.ScreenWH.height * 0.17,
                right: 0
            }}/>
        );
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