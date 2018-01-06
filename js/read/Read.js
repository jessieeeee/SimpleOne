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
    WebView,
    Image,
    TouchableOpacity,
} from 'react-native';

var Dimensions = require('Dimensions');
var WEBVIEW_REF = 'webview';
var serverApi = require('../ServerApi');
var {width, height} = Dimensions.get('window');
var Share = require('../share/Share');
var Login = require('../login/Login');
var TimerMixin = require('react-timer-mixin');
import NetUtils from "../util/NetUtil";

var loadingArr=[];

var Read = React.createClass({
    
    getDefaultProps() {
        return {
            duration: 10,
            // 外层回调函数参
            refreshView: false, //刷新
        }
    },
    
    /**
     * 初始化状态变量
     */
    getInitialState() {
        return {
            scalesPageToFit: true,
            like: false,
            readData: null,
            loadingIndex:0,//加载下标
            loading:true, //是否在加载
            backButtonEnabled: false,
            forwardButtonEnabled: false,
            url: '',
            status: '',
            scalesPageToFit: true
        }

    },

    //注册计时器
    mixins: [TimerMixin],

    componentDidMount() {
        var url = this.getCategoryUrl().replace('{content_id}', this.props.route.params.data.content_id);
        NetUtils.get(url, null, (result) => {
            this.setState({
                readData: result.data,
            });

            // console.log(result);
        }, (error) => {
            this.refs.toast.show('error' + error, 500)
        });
        this.getLoadingIcon();
        this.startTimer();
    },

    getCategoryUrl() {
        switch (parseInt(this.props.route.params.data.content_type)) {
            case 1:
                return serverApi.Essay;
                break;
            case 3:
                return serverApi.Question;
                break;
            case 2:
                return serverApi.SerialContent;
                break;
            case 4:
                return serverApi.Music;
                break;
            case 5:
                return serverApi.Movie;
                break;
            case 8:
                return serverApi.Radio;
                break;
        }


    },

    render() {
        return (
            <View style={styles.container}>
                {this.renderNavBar()}

                <WebView
                    ref={WEBVIEW_REF}
                    automaticallyAdjustContentInsets={false}
                    style={styles.webView}
                    source={{html: this.state.readData === null ? '' : this.state.readData.html_content}}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    decelerationRate="normal"
                    onNavigationStateChange={this.onNavigationStateChange}
                    onShouldStartLoadWithRequest={this.onShouldStartLoadWithRequest}
                    startInLoadingState={true}
                    scalesPageToFit={this.state.scalesPageToFit}
                />

                {this.renderLoading()}
                {this.renderBottomBar()}
            </View>
        );
    },

    renderLoading(){
        if(this.state.loading){
            return(
                <Image source={{uri:loadingArr[this.state.loadingIndex]}} style={{width:width*0.2,height:width*0.2,position:'absolute',top:height*0.4}}/>
            );
        }
    },

    onShouldStartLoadWithRequest(event) {
        // Implement any custom loading logic here, don't forget to return!
        return true;
    },

    onNavigationStateChange(navState) {
        this.setState({
            backButtonEnabled: navState.canGoBack,
            forwardButtonEnabled: navState.canGoForward,
            url: navState.url,
            status: navState.title,
            loading: navState.loading,
            scalesPageToFit: true
        });
    },
    
    /**
     * 渲染底部bar
     */
    renderBottomBar() {
        return (
            <View style={styles.bottomView}>

                <TouchableOpacity style={{ position: 'absolute', left: width * 0.05,}}
                    onPress={() => this.pushToLogin()}>
                    <Text style={styles.textInput}>写一个评论..</Text>
                </TouchableOpacity>

                <View style={styles.buttomBar}>
                    <TouchableOpacity
                        onPress={() => this.likeClick()}>
                        <Image source={{uri: this.showLikeIcon()}} style={styles.rightBtnIcon}/>
                    </TouchableOpacity>

                    <Text style={{
                        position: 'relative',
                        left: width * 0.003,
                        bottom: width * 0.016,
                        fontSize: width * 0.024,
                        marginRight: width * 0.06,
                        color: '#A7A7A7'
                    }}>
                        {this.state.readData === null ? '' : this.state.readData.praisenum}
                    </Text>

                    <TouchableOpacity style={styles.rightBtnIconCenter}
                                      onPress={() => {
                                      }}>

                        <Image source={{uri: 'bottom_comment'}} style={styles.rightBtnIcon}/>
                    </TouchableOpacity>

                    <Text style={{
                        position: 'relative',
                        left: width * 0.003,
                        bottom: width * 0.016,
                        fontSize: width * 0.024,
                        marginRight: width * 0.06,
                        color: '#A7A7A7'
                    }}>
                        {this.state.readData === null ? '' : this.state.readData.commentnum}
                    </Text>

                    <TouchableOpacity style={styles.rightBtnIconRight}
                                      onPress={() => this.pushToShare()}>

                        <Image source={{uri: 'share_image'}} style={styles.rightBtnIcon}/>
                    </TouchableOpacity>
                </View>
            </View>
        );
    },
    /**
     * 渲染顶部导航
     */
    renderNavBar() {
        return (
            // 顶部导航bar
            <View style={styles.outNav}>

                {/*左边按钮*/}
                <TouchableOpacity style={styles.leftBtn}
                                  onPress={() => {this.stopTimer();this.props.navigator.pop();}}>
                    <Image source={{uri: 'icon_back'}} style={styles.navLeftBar}/>
                </TouchableOpacity>

                <Text style={styles.title}>{this.getCategory(this.props.route.params.data)}</Text>

                <TouchableOpacity
                    onPress={() => this.pushToLogin()} style={{position: 'absolute', right: width * 0.032}}>
                    <Image source={{uri: 'stow_default'}} style={styles.rightBtn}/>
                </TouchableOpacity>
            </View>
        );
    },

    /**
     * 获取分类
     */
    getCategory(data) {
        if (data.tag != null) {
            return data.tag.title;
        }
        else if (data.content_type == 1) {
            return '阅读';
        }
        else if (data.content_type == 3) {
            return '问答';
        }
        else if (data.content_type == 1) {
            return '阅读';
        }
        else if (data.content_type == 2) {
            return '连载';
        }
        else if (data.content_type == 4) {
            return '音乐';
        }
        else if (data.content_type == 5) {
            return '影视';
        }
        else if (data.content_type == 8) {
            return '电台';
        }
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
                    showlink: true
                }
            }
        )
    },
    //点击喜欢
    likeClick() {
        this.setState({
            like: !this.state.like
        });
    },

    //根据当前状态，显示喜欢图标
    showLikeIcon() {
        //喜欢
        if (this.state.like === true) {
            return 'bubble_liked';
        } else {
            return 'bubble_like';
        }
    },
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
    },

    /**
     * 载入图标名称初始化
     */
    getLoadingIcon(){
        for(var i=0;i<30;i++){
            loadingArr.push(('webview_loading_0'+i).toString());
        }
        // for(var i=0;i<30;i++){
        //     console.log(loadingArr[i]);
        // }
    },

    /**
     * 开启计时器
     */
    startTimer() {
        this.stopTimer();
        this.timer = this.setInterval(function () {
            console.log('刷新下标'+this.state.loadingIndex);
            if(this.state.loading){
                var nextIndex=0;

                //移动下标
                if(this.state.loadingIndex+1>29){
                    nextIndex=0
                }else{
                    nextIndex=this.state.loadingIndex++;
                }
                console.log('刷新下标..'+nextIndex);
                //刷新下标
                this.setState({
                    loadingIndex:nextIndex
                });
            }else{
                this.stopTimer();
            }

        }, this.props.duration);
    },

    /**
     * 停止计时器
     */
    stopTimer() {
        if(this.timer!=null){
            this.clearInterval(this.timer);
        }

    },

});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent:'center',
        backgroundColor: 'white',
    },
    webView: {
        backgroundColor: 'white',
        height: height * 0.4,
        width: width,
    },
    bottomView: {
        height: width * 0.14,
        width: width,
        position: 'absolute',
        bottom: 0,
        backgroundColor: '#fbfbfb',
        flexDirection: 'row',
        alignItems: 'center',
        borderTopColor: '#dddddd',
        borderTopWidth: 0.167
    },
    buttomBar: {
        height: width * 0.1,
        flexDirection: 'row',
        position: 'absolute',
        right: width * 0.05,
        alignItems: 'center'
    },
    textInput: {
        width: width * 0.36,
        height: width * 0.096,
        color: '#a8a8a8',
        borderRadius: width * 0.01,
        borderWidth: 1,
        borderColor: '#a6a6a6',
        backgroundColor: 'white',
        textAlignVertical: 'center',
        paddingLeft: width * 0.03
    },
    outNav: {
        height: Platform.OS == 'ios' ? height * 0.07 : height * 0.08,
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
        width: width,
        justifyContent: 'center',
        borderBottomColor: '#dddddd',
        borderBottomWidth: 0.167
    },
    leftBtn: {
        position: 'absolute',
        left: width * 0.024,
    },
    navLeftBar: {
        width: height * 0.04,
        height: height * 0.05,
    },

    rightBtnIcon: {
        width: width * 0.06,
        height: width * 0.06,
    },

    rightBtn: {
        width: height * 0.035,
        height: height * 0.035,

    }
});

module.exports = Read;
