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
    Image,
    TouchableOpacity
} from 'react-native';
import MyImage from '../view/MyImage';

var flag = 0;
var TimerMixin = require('react-timer-mixin');
var FrameAnimationView = React.createClass({
    loadingIndex: 0,
    //注册计时器
    mixins: [TimerMixin],

    getDefaultProps() {
        return {
            width: 0,
            height: 0,
            loading: false, //是否在加载
            style: null,
            loadingArr: null,
            clickEvent: null,//点击事件回调
            refreshTime:0 //刷新频率
        }
    },
    getInitialState() {
        return {
            rotate: this.props.loading,
        }
    },

    render() {
        if (this.state.rotate) {
            return (
                <TouchableOpacity style={this.props.style} onPress={() => {
                    this.props.clickEvent()
                }}>
                    <MyImage ref={"img"} source={{uri: this.props.loadingArr[this.loadingIndex]}}
                             style={[{width: this.props.width, height: this.props.height}]}/>
                </TouchableOpacity>
            )
        } else {
            return (
                <View/>
            );
        }
    },

   componentDidMount(){
       if (!this.props.loading) {
           console.log('停止动画');
           this.stopTimer()
       } else {
           console.log('开始动画');
           this.startTimer()
       }
   },

    /**
     * 父组件传参变化回调
     * @param nextProps
     */
    componentWillReceiveProps(nextProps) {
        if (!nextProps.loading) {
            console.log('停止动画');
            this.stopTimer()
        } else {
            console.log('开始动画');
            this.startTimer()
        }
        console.log(nextProps.loading);
        this.setState({
            rotate: nextProps.loading,
        });
    },


    /**
     * 开启计时器
     */
    startTimer() {
        this.stopTimer();
        this.timer = this.setInterval(function () {
            if (this.state.rotate) {
                requestAnimationFrame(() => {
                    //移动下标
                    flag++;
                    if(flag>this.props.refreshTime){
                        if (this.refs.img + '' != 'undefined'&& this.loadingIndex>=0&&this.loadingIndex<this.props.loadingArr.length) {
                            this.refs.img.setNativeProps({
                                source:{uri: this.props.loadingArr[this.loadingIndex]},
                            });
                            console.log('刷新下标' + this.props.loadingArr[this.loadingIndex]);
                            this.loadingIndex++;
                            if(this.loadingIndex>=this.props.loadingArr.length){
                                this.loadingIndex=0;
                            }
                        }
                        flag=0;
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
