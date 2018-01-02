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
    TouchableOpacity,
    WebView,
    Image
} from 'react-native';

var Dimensions = require('Dimensions');
var {width, height} = Dimensions.get('window');
var WEBVIEW_REF = 'webview';
import NetUtils from "../util/NetUtil";
var serverApi = require('../ServerApi');

var SearchCategory = React.createClass({

    /**
     * 初始化状态变量
     */
    getInitialState() {
        return {
            scalesPageToFit: true,
            HTML: '',
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
                <View style={styles.dateBar}>
                    <Text>{this.props.route.params.date}</Text>
                    <Image source={{uri: 'arrow_down_black'}} style={styles.arrow}/>
                </View>
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
            </View>
        );
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
        backgroundColor: '#F5FCFF',
    },
    webView: {
        backgroundColor: '#F5FCFF',
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
        borderBottomColor:'#dddddd',
        borderBottomWidth: 0.167
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
});

module.exports = SearchCategory;
