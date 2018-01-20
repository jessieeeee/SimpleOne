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
    Image
} from 'react-native';
import MyImage from '../view/MyImage';
var Dimensions = require('Dimensions');
var {width, height} = Dimensions.get('window');
var TimerMixin = require('react-timer-mixin');
var FrameAnimationView = React.createClass({

    //注册计时器
    mixins: [TimerMixin],
    loadingIndex: 0,
    getDefaultProps() {
        return {
            width: 0,
            height: 0,
            loading: false, //是否在加载
            style: null,
            loadingArr: null,
        }
    },
    getInitialState() {
        return {

        }
    },

    render() {
        if (this.props.loading) {
            // console.log('刷新..' + this.props.loadingArr[this.state.loadingIndex]);
            return (

                <MyImage ref={"img"} source={{uri: this.props.loadingArr[this.loadingIndex]}}
                       style={[this.props.style, {width: this.props.width, height: this.props.height}]}/>
            );
        } else {
            return (
                <View/>
            );
        }
    },

    /**
     * 发起网络请求
     */
    componentDidMount() {
        this.startTimer();
    },

    /**
     * 父组件传参变化回调
     * @param nextProps
     */
    componentWillReceiveProps(nextProps) {
        if (!nextProps.loading) {
            console.log('停止动画');
            this.stopTimer()
        }
    },


    /**
     * 开启计时器
     */
    startTimer() {
        console.log('开始动画');
        this.stopTimer();
        this.timer = this.setInterval(function () {

            if (this.props.loading) {

                requestAnimationFrame(()=>{
                    //移动下标
                    if (this.loadingIndex + 1 > this.props.loadingArr.length - 1) {
                        this.loadingIndex=0;
                    } else {
                        this.loadingIndex++;
                    }
                    console.log('刷新下标' + this.loadingIndex);
                    console.log('view'+this.refs.img);
                    if(this.refs.img+''!='undefined'){
                        this.refs.img.setNativeProps({
                            source:{uri: this.props.loadingArr[this.loadingIndex]},
                        });
                    }

                });


            } else {
                this.stopTimer();
            }

        }, 10);
    },

    /**
     * 停止计时器
     */
    stopTimer() {
        if (this.timer != null) {
            this.clearInterval(this.timer);
        }

    },


});


module.exports = FrameAnimationView;
