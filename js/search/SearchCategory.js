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
    ActivityIndicator,
    Modal,
    TouchableOpacity,
    WebView,
    Image,
    NativeModules
} from 'react-native';
import constants from '../Constants';
import NetUtils from "../util/NetUtil";
import PickDateView from '../view/PickDate';
let pickDate = NativeModules.PickDateNative;
var Dimensions = require('Dimensions');
var {width, height} = Dimensions.get('window');
var WEBVIEW_REF = 'webview';
var serverApi = require('../ServerApi');

var SearchCategory = React.createClass({

    /**
     * 初始化状态变量
     */
    getInitialState() {
        return {
            HTML: '',
            loading: false, //是否在加载
            progress: 0,
            backButtonEnabled: false,
            forwardButtonEnabled: false,
            url: '',
            status: '',
            scalesPageToFit: true,
            animating: true,
            isVisible:true,
        }

    },


    componentDidMount() {
        var url = serverApi.SearchCategory.replace('{category_id}', this.props.route.params.categoryId);
        NetUtils.get(url, null, (result) => {
            this.setState({
                HTML: result.html_content,
            });

            // console.log(result);
        }, (error) => {
            this.refs.toast.show('error' + error, 500)
        });
    },


    render() {
        return (
            <View style={styles.container}>
                {this.renderNavBar()}

                <TouchableOpacity ref={(e) => this._view = e} style={styles.dateBar} onPress={() => {
                    pickDate.showPick(
                       null,
                        (year) => {
                            console.log('选择年份' + year);
                        },
                        (month) => {
                            console.log('选择月份' + month);

                        },
                        (year, month, setTime) => {
                            console.log('确定年' + year + '确定月' + month + '确定时间' + setTime);

                        });
                }}>
                    <Text>{constants.curDate.substring(0, 4) + '年' + constants.curDate.substring(5, 7) + '月'}</Text>

                    <Image source={{uri: 'arrow_down_black'}} style={styles.arrow}/>

                </TouchableOpacity>

            <View>
                <WebView
                    ref={WEBVIEW_REF}
                    automaticallyAdjustContentInsets={false}
                    style={styles.webView}
                    source={{html: this.state.HTML}}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    decelerationRate="normal"
                    onNavigationStateChange={this.onNavigationStateChange}
                    onShouldStartLoadWithRequest={this.onShouldStartLoadWithRequest}
                    startInLoadingState={true}
                    scalesPageToFit={this.state.scalesPageToFit}
                />
                {this.renderPickDateView()}
            </View>
                {this.renderProgressBar()}
            </View>
        );
    },

    //渲染日期选择器
    renderPickDateView(){
       return(
           <Modal
               style={styles.datePick}
               animationType={'fade'}
               transparent={true}
               visible={this.state.isVisible}
               onRequestClose={() => {
                   this.props.navigator().pop();
               }}>
               <PickDateView
                   onChange={(obj) => {
                       console.log('onSure收到事件'+obj.nativeEvent.msg+"目标id"+obj.nativeEvent.target);

                   }}
                   style={{flex: 1, width: '100%'}}/>
           </Modal>
       );
    },
    //渲染进度条
    renderProgressBar() {
        if (this.state.loading) {
            return (
                <ActivityIndicator
                    color="#dcdcdc"
                    animating={this.state.animating}
                    style={[styles.centering, {height: width * 0.4}]}
                    size="large"
                />
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
     * 渲染顶部导航
     */
    renderNavBar() {
        return (
            // 顶部导航bar
            <View style={styles.outNav}>

                {/*左边按钮*/}
                <TouchableOpacity style={styles.leftBtn}
                                  onPress={() => this.props.navigator.pop()}>
                    <Image source={{uri: 'icon_back'}} style={styles.navLeftBar}/>
                </TouchableOpacity>

                <Text style={styles.title}>{this.getTitle()}</Text>

            </View>
        );
    },

    /**
     * 获得标题
     */
    getTitle() {
        switch (this.props.route.params.categoryId) {
            case 0:
                return '图文';
                break;
            case 3:
                return '问答';
                break;
            case 1:
                return '阅读';
                break;
            case 2:
                return '连载';
                break;
            case 5:
                return '影视';
                break;
            case 4:
                return '音乐';
                break;
            case 8:
                return '电台';
                break;
        }
    },


});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    webView: {
        backgroundColor: 'white',
        height: height * 0.4,
        width: width,
    },
    arrow: {
        marginLeft: width * 0.02,
        width: width * 0.034,
        height: width * 0.034
    },
    dateBar: {
        width: width,
        height: width * 0.12,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fbfbfb',
        borderBottomColor: '#dddddd',
        borderBottomWidth: constants.divideLineWidth
    },
    centering: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: height * 0.4,
    },

    outNav: {
        height: Platform.OS == 'ios' ? height * 0.07 : height * 0.08,
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
        width: width,
        justifyContent: 'center',
        borderBottomColor: '#dddddd',
        borderBottomWidth: constants.divideLineWidth
    },
    leftBtn: {
        position: 'absolute',
        left: width * 0.024,
    },
    navLeftBar: {
        width: height * 0.04,
        height: height * 0.05,
    },
    datePick:{
        width:width,
        position:'absolute',
        top:0
    }
});

module.exports = SearchCategory;
