/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow　主界面分页－一个－音乐item
 */

import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    DeviceEventEmitter,
    Platform,
    NativeModules,
    TouchableOpacity,
    Animated,
    Easing,
    Alert
} from 'react-native';

import DateUtil from "../util/DateUtil";
import constants from '../Constants';
import Read from '../read/Read';
import Share from '../share/Share';
let media = NativeModules.MediaPlayer;
let toast = NativeModules.ToastNative;

let {width, height} = constants.ScreenWH;
let rotate;

class OneListMusic extends Component{
    constructor(props){
        super(props);
        this.state={
            like: false,
            likeNum: this.props.data.like_count,
            spinValue: new Animated.Value(0),
            isPlay: false,
            page:0,
        }
    }
    componentDidMount() {
        rotate=false;
        this.animation = Animated.timing(
            this.state.spinValue,
            {
                toValue: 1,
                duration: 4000,
                easing: Easing.linear
            }
        );

        DeviceEventEmitter.addListener(constants.PLAY_PROGRESS, () => {
            //当前显示的等于当前播放的歌曲转起来
            if (!rotate && this.props.page == constants.curPage && constants.CURRENT_TYPE== constants.MUSIC_TYPE) {
                console.log("调用旋转");
                this.spin();
                rotate=true;
                constants.appState.startPlay();
                // this.props.onShow();
                this.setState({
                    isPlay: true
                });
            }
        });

        DeviceEventEmitter.addListener(constants.PLAY_STATE, (reminder) => {
            console.log('当前状态' + reminder.state);
            if (reminder.state == constants.STOP_PLAY_MEDIA || reminder.state == constants.PLAY_EXCEPTION || reminder.state == constants.PLAY_COMPLETE) {
                this.setState({
                    isPlay: false,
                });
                rotate=false;
                this.state.spinValue.stopAnimation(value => {
                    console.log('剩余时间' + (1 - value) * 4000);
                    //计算角度比例
                    this.animation = Animated.timing(this.state.spinValue, {
                        toValue: 1,
                        duration: (1 - value) * 4000,
                        easing: Easing.linear,
                    });
                });
            }
        });
    }

    componentWillUnmount() {
        DeviceEventEmitter.removeAllListeners(constants.PLAY_PROGRESS);
        DeviceEventEmitter.removeAllListeners(constants.PLAY_STATE);
        media.stop();
    }

    spin() {
        this.animation.start((result) => {
            //正常转完1周,继续转
            if (Boolean(result.finished)) {
                this.animation = Animated.timing(
                    this.state.spinValue,
                    {
                        toValue: 1,
                        duration: 4000,
                        easing: Easing.linear
                    }
                );
                this.state.spinValue.setValue(0);
                this.spin();
            }
        })
    }

    //渲染
    render() {
        const spinRange = this.state.spinValue.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '360deg']
        });

        return (
            <TouchableOpacity style={styles.container} activeOpacity={1} onPress={()=>{this.pushToRead()}}>

                <Text style={styles.category}>
                    - 音乐 -
                </Text>
                {/*标题*/}

                <Text style={styles.title}>{this.props.data.title}</Text>

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
                    <Animated.Image
                        source={{uri: this.props.data.img_url}}
                        style={[styles.centerImg, {transform: [{rotate: spinRange}]}]}
                    />

                    <View style={{
                        width: width * 0.52,
                        height: width * 0.52, justifyContent: 'center',
                        alignItems: 'center', position: 'absolute', top: 0
                    }}>
                        <TouchableOpacity
                            onPress={() => {
                                if (!this.state.isPlay) {
                                    this.playMusic();
                                } else {
                                    this.stopMusic();
                                }
                            }}>
                            {/*播放按钮*/}
                            <Image source={{uri: this.state.isPlay ? 'pause' : 'play'}}
                                   style={{width: width * 0.12, height: width * 0.12}}/>
                        </TouchableOpacity>
                    </View>

                    <Image source={{uri: this.props.data.audio_platform == 1 ? 'xiami_right' : 'one_right'}}
                           style={styles.iconXia}/>
                </View>
                {/*音乐封面下的音乐名称，作者和专辑*/}
                <Text style={styles.musicInfo}>{this.getMusicInfo()}</Text>
                {/*音乐描述*/}
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

                            {constants.renderlikeNum(this.state.likeNum)}

                        </View>
                        <TouchableOpacity
                            onPress={() => this.pushToShare()}>
                            <Image source={{uri: 'share_image'}} style={styles.barRightBtnsIcon2}/>
                        </TouchableOpacity>
                    </View>
                </View>

            </TouchableOpacity>
        );
    }

    playMusic() {
        constants.curPage=this.props.page;
        console.log('播放地址' + this.props.data.audio_url);
        constants.CURRENT_MUSIC_DATA = this.props.data;
        constants.CURRENT_TYPE=constants.MUSIC_TYPE;
        constants.appState.startPlay();
        // if (this.props.data.audio_platform != 1) {
        //     // media.start('http://music.wufazhuce.com/lmVsrwGEgqs8pQQE3066e4N_BFD4');
        //     media.addMusicList(this.props.data.audio_url);
        //     media.start(this.props.data.audio_url);
        //     this.setState({
        //         isPlay: true
        //     });
        // } else {
        //     toast.showMsg('很抱歉，此歌曲已在虾米音乐下架，无法播放', toast.SHORT);
        // }
    }

    stopMusic() {
        media.stop();
        this.setState({
            isPlay: false,
        });
    }

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
    }

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
    }


    /**
     * 获得歌曲信息
     */
    getMusicInfo() {
        return this.props.data.music_name + ' · ' + this.props.data.audio_author + ' | ' + this.props.data.audio_album;
    }

    /**
     * 获取回答者
     * @returns {*}
     */
    getAuthor() {
        var tempStr = new Array();
        tempStr = this.props.data.author.user_name.split(' ');
        return '文 / ' + tempStr[0];
    }

    /**
     * 点击喜欢
     */
    likeClick() {
        this.setState({
            likeNum: this.state.like ? this.props.data.like_count : this.props.data.like_count + 1,
            like: !this.state.like
        });
    }

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
    }
}

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
    },


    fullScreen: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },
});

export default OneListMusic;
