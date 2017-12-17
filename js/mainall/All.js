/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    ScrollView,
    Text,
    View,
    Image,
    TouchableOpacity,
    Platform,
    RefreshControl,

} from 'react-native';
import Toast, {DURATION} from 'react-native-easy-toast'

var Dimensions = require('Dimensions');
var {width, height} = Dimensions.get('window');
// 顶部的banner
var AllListBanner = require('./AllListBanner');
// 分类导航
var AllCategoryGuide = require('./AllCategoryGuide');
// 专题列表
var AllListTopic = require('./AllListTopic');
// 热门作者
var AllListAuthor = require('./AllListAuthor');
// 问所有人
var AllListQuestion = require('./AllListQuestion');

// 加载更多的view
var LoadingMore = require('../LoadingMore');


var All = React.createClass({

    /**
     * 初始化状态变量
     * @returns {{oneData: null}}
     */
    getInitialState() {
        return {
            isRefreshing: false,
            loadMore: false,
            startId: 0,
        }

    },

    render() {
        return (
            <View style={styles.container}>
                {this.renderNavBar()}
                <ScrollView onScroll={this.onScroll} refreshControl={
                    <RefreshControl
                        refreshing={this.state.isRefreshing}
                        onRefresh={this.onRefresh}
                        title="Loading..."
                        titleColor="#00ff00"
                        colors={['#ff0000', '#00ff00', '#0000ff', '#3ad564']}
                        progressBackgroundColor="#ffffff"
                    />
                }>
                    {this.renderAllItem()}

                    {this.renderLoadMoreView()}

                    {this.renderLoadMoreList()}
                </ScrollView>
                <Toast
                    ref="toast"
                    style={{backgroundColor: 'gray'}}
                    position='top'
                    positionValue={height * 0.24}
                    textStyle={{color: 'white'}}
                />
            </View>
        );
    },


    /**
     * scrollview滑动回调
     */
    onScroll(event) {
        if (this.state.loadMore) {
            return;
        }
        let y = event.nativeEvent.contentOffset.y;
        let height = event.nativeEvent.layoutMeasurement.height;
        let contentHeight = event.nativeEvent.contentSize.height;
        if (y + height >= contentHeight - 20) {
            console.log('in');
            this.setState({
                loadMore: true
            });
        }
    },

    /**
     * 刷新操作
     */
    onRefresh() {
        //更改刷新状态
        this.setState({isRefreshing: true});

        setTimeout(() => {
            this.setState({
                isRefreshing: false
            });
        }, 1000);

    },

    /**
     * 添加尾部专题列表
     * @returns {Array}
     */
    renderLoadMoreList() {
        //如果当前列表无数据直接返回
        if (this.state.oneData === null) {
            return;
        } else {
            //如果正在加载更多,添加这个专题列表
            if (this.state.loadMore) {
                return (
                    <AllListTopic key={9} showNum={5} startId={this.state.startId} getEndId={(endId) => {
                        this.setState({
                            startId: endId,
                            loadMore: false
                        })
                    }}/>
                );
            }
        }

    },

    /**
     * 显示加载更多view
     */
    renderLoadMoreView(){
        if(this.state.loadMore){
            console.log('加载更多');
            return (
                <LoadingMore/>
            );
        }
    },

    /**
     * 渲染顶部导航
     */
    renderNavBar() {
        return (
            // 顶部导航bar
            <View style={styles.outNav}>

                <Image source={{uri: 'one_is_all'}} style={styles.allTitle}/>

                {/*右边按钮*/}
                <TouchableOpacity style={styles.rightBtn}
                                  onPress={() => this.refs.toast.show('click', DURATION.LENGTH_LONG)}>
                    <Image source={{uri: 'search_night'}} style={styles.navRightBar}/>
                </TouchableOpacity>
            </View>
        );
    },
    /**
     * 渲染所有的item
     */
    renderAllItem() {
        var itemArr = [];
        // 渲染底部item
        itemArr.push(
            <AllListBanner key={0} refreshView={this.state.isRefreshing}/>
        );
        itemArr.push(
            <View key={1} style={styles.bottomLine}/>
        );
        // 渲染分类导航
        itemArr.push(
            <AllCategoryGuide key={2}/>
        );
        itemArr.push(
            <View key={3} style={styles.bottomLine}/>
        );
        // 渲染专题列表
        itemArr.push(
            <AllListTopic key={4} showNum={14} startId={0} getEndId={(endId) => {
                this.setState({
                    startId: endId
                })
            }}/>
        );

        // 渲染热门作者
        itemArr.push(
            <AllListAuthor key={5}/>
        );

        itemArr.push(
            <View key={6} style={styles.bottomLine}/>
        );

        //问所有人
        itemArr.push(
            <AllListQuestion key={7}/>
        );

        itemArr.push(
            <View key={8} style={styles.bottomLine}/>
        );

        return itemArr;
    },


});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    outNav: {
        height: Platform.OS == 'ios' ? height * 0.07 : height * 0.08,
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
        width: width,
        justifyContent: 'center',
        borderBottomWidth: 0.2,
        borderBottomColor: 'gray'
    },

    navRightBar: {
        width: width * 0.05,
        height: width * 0.05,
    },
    rightBtn: {
        position: 'absolute',
        right: width * 0.05,
    },
    allTitle: {
        width: width * 0.36,
        height: width * 0.04,
    },
    bottomLine: {
        backgroundColor: '#EEEEEE',
        height: width * 0.028,
        width: width
    },
});

module.exports = All;
