/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow 音乐控制界面
 */

import React, {Component} from 'react'
import constants from '../Constants'
import Slider from "react-native-slider"
import PropTypes from 'prop-types'
import {
    StyleSheet,
    Text,
    View,
    Image,
    Modal,
    TouchableOpacity,
    NativeModules,
    DeviceEventEmitter
} from 'react-native'
import Login from '../login/Login'

let media = NativeModules.MediaPlayer
let {width, height} = constants.ScreenWH

class MusicControl extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isPlay: false,
            duration: 0,
            total: 0,
            totalMsec: 0,
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.isVisible !== this.props.isVisible) {
            if (nextProps.isVisible) {
                this.addListener()
            } else {
                this.removeListener()
            }
        }
    }

    addListener() {
        this.progressListener = (reminder) => {
            console.log('当前进度' + reminder.currentPosition)
            console.log('总长度' + reminder.totalDuration)
            if (this.props.isVisible) {
                if (this.state.total === 0) {
                    this.setState({
                        total: (reminder.totalDuration / 1000 / 60).toFixed(2),
                        totalMsec: reminder.totalDuration
                    })
                }
                if (!this.state.isPlay) {
                    this.setState({
                        isPlay: true
                    })
                }
                this.setState({
                    duration: parseFloat(reminder.currentPosition / reminder.totalDuration)
                })
            }
        }
        DeviceEventEmitter.addListener(constants.PLAY_PROGRESS, this.progressListener)
        this.stateListener = (reminder) => {
            console.log('当前状态' + reminder.state)
            if (this.props.isVisible) {
                if (reminder.state === constants.STOP_PLAY_MEDIA || reminder.state === constants.PLAY_EXCEPTION || reminder.state == constants.PLAY_COMPLETE) {
                    this.setState({
                        isPlay: false,
                    })
                }
            }
        }
        DeviceEventEmitter.addListener(constants.PLAY_STATE, this.stateListener)
        console.log("监听开启")
    }

    removeListener() {
        DeviceEventEmitter.removeListener(constants.PLAY_PROGRESS, this.progressListener)
        DeviceEventEmitter.removeListener(constants.PLAY_STATE, this.stateListener)
        console.log("监听关闭")
    }

    render() {
        return (
            <Modal
                animationType={'fade'}
                transparent={true}
                visible={this.props.isVisible}
                onRequestClose={() => {
                    this.props.onCancel()
                }}>
                <View style={styles.container}>
                    <View
                        style={[styles.bg, {backgroundColor: constants.nightMode ? constants.nightModeGrayLight : 'white'}]}>
                        <Text
                            style={[styles.title, {color: constants.nightMode ? 'white' : constants.normalTextLightColor}]}> {constants.CURRENT_MUSIC_DATA != null ? constants.CURRENT_MUSIC_DATA.title : ''}</Text>
                        <Slider
                            style={{width: width * 0.92}}
                            trackStyle={{height: width * 0.005}}
                            minimumTrackTintColor={'#3f3f3f'}
                            maximumTrackTintColor={'#b3b3b3'}
                            value={constants.CURRENT_MUSIC_DATA != null ? this.state.duration : 0.0001}
                            thumbStyle={{
                                width: width * 0.024,
                                height: width * 0.024,
                                backgroundColor: '#747474',
                                borderColor: '#2e2d1e',
                                borderWidth: 2,
                                borderRadius: width * 0.024,
                            }}
                            onValueChange={value => {
                                console.log(value);
                                media.seekTo(value * this.state.totalMsec);
                            }}
                        />
                        <View style={{width: width, height: width * 0.03, marginTop: -width * 0.04}}>
                            <Text
                                style={[styles.durationtext, {color: constants.nightMode ? 'white' : constants.normalTextLightColor}]}>{this.state.total}''</Text>
                        </View>
                        <Text
                            style={[styles.singer, {color: constants.nightMode ? 'white' : constants.normalTextLightColor}]}> {constants.CURRENT_MUSIC_DATA != null ? constants.CURRENT_MUSIC_DATA.audio_author : ''}</Text>
                        <View style={styles.btnsView}>
                            <TouchableOpacity style={{position: 'absolute', left: width * 0.13}} onPress={() => {
                                media.playPre();
                            }}>
                                <Image source={{uri: this.showLastUri()}} style={styles.controlBtn}/>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => {
                                if (!this.state.isPlay) {
                                    this.playMusic();
                                } else {
                                    this.stopMusic();
                                }
                            }}>
                                <Image source={{uri: this.state.isPlay ? 'player_pause' : 'player_play'}}
                                       style={styles.controlBtn}/>
                            </TouchableOpacity>
                            <TouchableOpacity style={{position: 'absolute', right: width * 0.13}} onPress={() => {
                                media.playNext();
                            }}>
                                <Image source={{uri: this.showNextUri()}} style={styles.controlBtn}/>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.bottomBar}>
                            <TouchableOpacity style={{position: 'absolute', left: width * 0.04}} onPress={() => {
                                media.setPlayMode();
                            }}>
                                <Image source={{uri: 'player_all_cycle'}}
                                       style={styles.bottomBtn}/>
                            </TouchableOpacity>
                            <View style={styles.centerfrom}>
                                <Image source={{uri: 'one_right'}} style={styles.bottomBtn}/>
                                <Text
                                    style={[styles.fromtext, {color: constants.nightMode ? 'white' : constants.normalTextLightColor}]}>来自one一个</Text>
                            </View>
                            <View style={{position: 'absolute', right: width * 0.04, flexDirection: 'row'}}>
                                <TouchableOpacity style={{marginRight: width * 0.05}} onPress={() => {
                                    this.pushToLogin()
                                }}>
                                    <Image source={{uri: 'music_collection_night'}}
                                           style={styles.bottomBtn}/>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => {
                                    this.pushToRead()
                                }}>
                                    <Image source={{uri: 'fm_info'}} style={styles.bottomBtn}/>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    <TouchableOpacity style={{flex: 1, width: width}} onPress={() => {
                        this.props.onCancel();
                    }}/>
                </View>
            </Modal>
        );
    }

    showLastUri() {
        if (media.hasPre()) {
            return 'last'
        } else {
            return 'last_disable'
        }
    }

    showNextUri() {
        if (media.hasNext()) {
            return 'next'
        } else {
            return 'next_disable'
        }
    }

    /**
     * 播放音乐
     */
    playMusic() {
        // media.start('http://music.wufazhuce.com/lmVsrwGEgqs8pQQE3066e4N_BFD4');
        media.start(constants.CURRENT_MUSIC_DATA.audio_url)
        this.setState({
            isPlay: true
        })
    }

    /**
     * 停止播放
     */
    stopMusic() {
        media.stop()
    }

    /**
     * 跳转到登录
     * @param url
     */
    pushToLogin() {
        this.props.navigator.push(
            {
                component: Login,
                title: '登录',
                params: {}
            }
        )
        this.props.onCancel()
    }

    /**
     * 跳转到阅读页
     * @param url
     */
    pushToRead() {
        let Read = require('../read/Read').default
        this.props.navigator.push(
            {
                component: Read,
                title: '阅读',
                params: {
                    data: constants.CURRENT_MUSIC_DATA,
                    entry: constants.OneRead
                }
            }
        )
        this.props.onCancel()
    }
}

MusicControl.defaultProps = {
    isVisible: false,
}

MusicControl.propTypes = {
    onCancel: PropTypes.func,
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    bg: {
        width: width,
        alignItems: 'center',
    },
    title: {
        marginTop: width * 0.03,
        fontSize: width * 0.04,
        width: width * 0.8,
        textAlign: 'center',
        alignSelf: 'center'
    },

    singer: {
        marginTop: width * 0.01,
        fontSize: width * 0.03,
    },
    btnsView: {
        marginTop: width * 0.05,
        width: width * 0.6,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    controlBtn: {
        width: width * 0.09,
        height: width * 0.09
    },
    bottomBtn: {
        width: width * 0.06,
        height: width * 0.06
    },
    bottomBar: {
        marginTop: width * 0.06,
        width: width,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: width * 0.05,
    },
    centerfrom: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    fromtext: {
        fontSize: width * 0.03,
        marginLeft: width * 0.02
    },
    durationtext: {
        fontSize: width * 0.026,
        position: 'absolute',
        right: width * 0.04
    }
});

export default MusicControl
