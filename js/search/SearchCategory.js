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
    Image
} from 'react-native';
import constants from '../Constants';
import NetUtils from "../util/NetUtil";

var PullPickDate = require('../view/PullPickDate');
var PullMenu = require('../view/PullMenu');
var Dimensions = require('Dimensions');
var {width, height} = Dimensions.get('window');
var WEBVIEW_REF = 'webview';
var serverApi = require('../ServerApi');
const menuArr=[{'key':'0','value':'图文'},{'key':'3','value':'问答'},{'key':'1','value':'阅读'},{'key':'2','value':'连载'},{'key':'5','value':'影视'},{'key':'4','value':'音乐'},{'key':'8','value':'电台'}];

var SearchCategory = React.createClass({

    /**
     * 初始化状态变量
     */
    getInitialState() {
        return {
            HTML: '',
            loading: false, //是否在加载
            progress: 0,   //加载进度
            backButtonEnabled: false,  //回退键开启
            forwardButtonEnabled: false, //翻页键开启
            url: '',  //请求地址
            status: '',  //请求标题
            scalesPageToFit: true, //大小自适应
            animating: true, //动画开启
            isVisible: false,  //选择日期是否可见
            showMenu: false, //列表菜单是否可见
            curYear: 0,  //当前年
            curMonth: 0, //当前月
            curTime: 0,   //当前时间
            curMenuId:this.props.route.params.categoryId+''  //当前菜单
        }

    },


    componentDidMount() {
      this.getCategory(this.props.route.params.categoryId);
    },

    getCategory(categoryId){
        var url = serverApi.SearchCategory.replace('{category_id}', categoryId);
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

                <TouchableOpacity style={styles.dateBar} onPress={() => {
                    this.setState({
                        isVisible: true,
                    });
                }}>
                    <Text>{constants.curDate.substring(0, 4) + '年' + constants.curDate.substring(5, 7) + '月'}</Text>

                    {this.renderArrow(this.state.isVisible)}

                </TouchableOpacity>


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

                {this.renderPullMenu()}
                {this.renderProgressBar()}
                {constants.renderAudioPlay()}
            </View>
        );
    },

    //渲染下拉菜单选择器
    renderPullMenu() {
        return (
            <PullMenu menuData={menuArr} select={this.state.curMenu} onShow={this.state.showMenu} onSure={(clickItem) => {
                this.setState({showMenu: false,curMenuId:clickItem.key});
                this.getCategory(clickItem.key);
            }} onCancel={() => {
                this.setState({showMenu: false})
            }}/>
        );
    },

    //渲染日期选择器
    renderPickDateView() {
        return (
            <PullPickDate onSure={(year, month, time) => {
                this.setState({
                    curYear: year,
                    curMonth: month,
                    curTime: time
                });
            }} onCancel={() => {
                this.setState({
                    isVisible: false
                });
            }} onShow={this.state.isVisible}/>
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

                <TouchableOpacity style={{
                    flexDirection: 'row',
                    justifyContent: 'center', alignItems: 'center'
                }} onPress={() => {
                    console.log()
                    this.setState({
                        showMenu: true
                    });
                }}>
                    <Text style={styles.title}>{this.getTitle()}</Text>
                    {this.renderArrow(this.state.showMenu)}

                </TouchableOpacity>
            </View>
        );
    },

    renderArrow(show){
        var arrowUri='';
        if(show){
            arrowUri='arrow_up_black';
        }else{
            arrowUri='arrow_down_black';
        }

        return(
            <Image source={{uri: arrowUri}} style={styles.arrow}/>
        );
    },

    /**
     * 获得标题
     */
    getTitle() {
        for(var i=0;i<menuArr.length;i++){
            if(menuArr[i].key==this.state.curMenuId){
                console.log('当前类型'+menuArr[i].value);
                return menuArr[i].value;
            }
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

});

module.exports = SearchCategory;
