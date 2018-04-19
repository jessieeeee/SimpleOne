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
let page;
let flag = 0;

class FrameAnimationView extends Component{

    constructor(props){
        super(props);
        this.state={
            rotate: this.props.loading
        };
        this.loadingIndex=0;
        page=this;
    }

    render() {
        if (this.state.rotate) {
            return (
                <TouchableOpacity style={this.props.style} onPress={() => {
                    this.props.clickEvent()
                }}>
                    <MyImage ref={"img"} source={{uri: this.props.loadingArr[this.loadingIndex]}}
                             style={[{width: this.props.width, height: this.props.height }]}/>
                </TouchableOpacity>
            )
        } else {
            return (
                <View/>
            );
        }
    }

    componentDidMount(){
        if (!this.props.loading) {
            console.log('停止动画');
            this.stopTimer()
        } else {
            console.log('开始动画');
            this.startTimer()
        }
    }

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
    }

    /**
     * 开启计时器
     */
    startTimer() {
        this.stopTimer();
        this.timer = setInterval(function () {
            if (page.state.rotate) {
                requestAnimationFrame(() => {
                    //移动下标
                    flag++;
                    if(flag > page.props.refreshTime){
                        if (page.refs.img + '' != 'undefined' && page.loadingIndex >= 0 && page.loadingIndex < page.props.loadingArr.length) {
                            page.refs.img.setNativeProps({
                                source:{uri: page.props.loadingArr[page.loadingIndex]},
                            });
                            console.log('刷新下标' + page.props.loadingArr[page.loadingIndex]);
                            page.loadingIndex++;
                            if(page.loadingIndex >= page.props.loadingArr.length){
                                page.loadingIndex=0;
                            }
                        }
                        flag = 0;
                    }

                });

            } else {
                page.stopTimer();
            }

        }, 10);
    }

    /**
     * 停止计时器
     */
    stopTimer() {
        if (this.timer != null) {
            clearInterval(this.timer);
        }
    }


    componentWillUnmount() {
        // 如果存在this.timer，则使用clearTimeout清空。
        // 如果你使用多个timer，那么用多个变量，或者用个数组来保存引用，然后逐个clear
        this.timer && clearInterval(this.timer);
    }
}
FrameAnimationView.propTypes={
    width: React.PropTypes.number.isRequired,
    height:React.PropTypes.number.isRequired,
    loading: React.PropTypes.bool.isRequired, //是否在加载
    refreshTime:React.PropTypes.number.isRequired //刷新频率
};

export default FrameAnimationView;
