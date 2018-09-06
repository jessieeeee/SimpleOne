/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow 主界面-all分页
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Image,
    TouchableOpacity,
} from 'react-native';
import PullScollView from '../view/PullScollView';
import constants from "../Constants";
import Search from '../search/Search';

import AllListTopic from './AllListTopic';// 专题列表
import AllCategoryGuide from './AllCategoryGuide';// 分类导航
import AllListAuthor from './AllListAuthor';// 热门作者
import AllListQuestion from './AllListQuestion';// 问所有人
import AllListBanner from './AllListBanner';
import {BaseComponent} from "../view/BaseComponent";
import CommStyles from "../CommStyles";
import LoadMoreState from "../view/LoadMoreState"

let {width, height} = constants.ScreenWH;
// 顶部的banner
let key = 9;
let bottomList = [];

class All extends Component {
    constructor(props) {
        super(props)
        this.onPullRelease = this.onPullRelease.bind(this)
        this.onLoadMore = this.onLoadMore.bind(this)
        this.state = {
            isRefreshing: false,
            loadMore: false, //底部是否显示更多列表
            loadingState: LoadMoreState.state.tip,//加载更多状态
            startId: 0, //主题请求开始id
            lastId: 0, //记录上一次请求id
            isEnd: false,//是否到末尾标记
            showMusicControl: false,
            scrollEnabled: true
        };
    }

    onPullRelease(resolve) {
        //更改刷新状态
        this.setState({isRefreshing: true});
        //刷新完毕，重置下拉刷新，再次更新刷新和加载更多状态
        setTimeout(() => {
            resolve();
            this.setState({
                isRefreshing: false,
                loadMore: false,
                scrollEnabled: true
            });
        }, 3000);
    }

    render() {
        return (
            <View>
                {this.renderNavBar()}
                <PullScollView
                    onRetry={() => {this.errCallback()}}
                    onPullRelease={this.onPullRelease}
                    onLoadMore={this.onLoadMore}
                    loadMoreState={this.state.loadingState}
                    onPulling={() => {
                        this.setState({
                            scrollEnabled: false
                        })
                    }}>

                    {this.renderAllItem()}
                    {this.renderLoadMoreList()}
                </PullScollView>
            </View>
        );
    }

    /**
     * scrollview滑动回调
     */
    onLoadMore() {
        //如果列表没有结束
        if (this.state.isEnd !== true) {
            //如果最后一次请求起始id为0或者当前请求起始id不等于最后一次请求起始id,添加更多列表
            if (this.state.lastId === 0 || (this.state.lastId !== 0 && this.state.lastId !== this.state.startId)) {
                //放入长度为5的列表
                key++;
                this.setState({
                    lastId: this.state.startId,
                });
                bottomList.push(
                    <AllListTopic key={key} showNum={5} startId={this.state.startId}
                                  onError={(callback) => {
                                      this.errCallback = callback
                                      this.setState({
                                          loadingState: LoadMoreState.state.error,
                                      });
                                  }}
                                  getEndId={(endId, end) => {
                                      console.log('回调了' + endId + end);
                                      this.setState({
                                          startId: endId,
                                          loadingState: LoadMoreState.state.tip,
                                          isEnd: end,
                                      });

                                  }}/>
                );
                //设置正在加载和显示更多标记
                this.setState({
                    loadMore: true,
                    loadingState: LoadMoreState.state.loading,
                });
            }
        }else{
            this.setState({
                loadMore: true,
                loadingState: LoadMoreState.state.noMore,
            });
        }
    }


    /**
     * 添加尾部专题列表
     * @returns {Array}
     */
    renderLoadMoreList() {
        //如果当前列表无数据直接返回
        if (this.state.oneData !== null) {
            //如果正在加载更多,添加这个专题列表
            if (this.state.loadMore) {
                console.log('最底部列表起始id' + this.state.startId);
                return bottomList;
            }
        }
    }


    /**
     * 渲染顶部导航
     */
    renderNavBar() {
        return (
            // 顶部导航bar
            <View style={[CommStyles.outNav, {
                borderBottomColor: constants.nightMode ? constants.nightModeGrayLight : constants.bottomDivideColor,
                backgroundColor: constants.nightMode ? constants.nightModeGrayLight : 'white'
            }]}>

                <Image source={{uri: constants.nightMode ? 'one_is_all_night' : 'one_is_all'}} style={styles.allTitle}/>

                {/*右边按钮*/}
                <TouchableOpacity style={CommStyles.rightBtn}
                                  onPress={() => this.pushToSearch()}>
                    <Image source={{uri: 'search_night'}} style={CommStyles.navRightBar}/>
                </TouchableOpacity>
            </View>
        );
    }

    /**
     * 跳转到搜索页
     * @param url
     */
    pushToSearch() {
        this.props.navigator.push(
            {
                component: Search,
            }
        )
    }

    /**
     * 渲染所有的item
     */
    renderAllItem() {
        let itemArr = [];
        itemArr.push(
            <AllListBanner
                key={0}
                refreshView={this.state.isRefreshing}
                navigator={this.props.navigator}
                scrollEnabled={this.state.scrollEnabled}/>
        );
        itemArr.push(
            <View key={1}
                  style={[CommStyles.bottomLineAll, {backgroundColor: constants.nightMode ? constants.nightModeGrayDark : constants.itemDividerColor}]}/>
        );
        // 渲染分类导航
        itemArr.push(
            <AllCategoryGuide key={2} navigator={this.props.navigator}/>
        );
        itemArr.push(
            <View key={3}
                  style={[CommStyles.bottomLineAll, {backgroundColor: constants.nightMode ? constants.nightModeGrayDark : constants.itemDividerColor}]}/>
        );
        // 渲染专题列表
        itemArr.push(
            <AllListTopic key={4} showNum={14} refreshView={this.state.isRefreshing} startId={0}
                          navigator={this.props.navigator}
                          getEndId={(endId, end) => {
                              this.setState({
                                  startId: endId
                              })
                          }}/>
        );

        // 渲染热门作者
        itemArr.push(
            <AllListAuthor key={5} refreshView={this.state.isRefreshing} navigator={this.props.navigator}/>
        );

        itemArr.push(
            <View key={6}
                  style={[CommStyles.bottomLineAll, {backgroundColor: constants.nightMode ? constants.nightModeGrayDark : constants.itemDividerColor}]}/>
        );

        //问所有人
        itemArr.push(
            <AllListQuestion key={7} refreshView={this.state.isRefreshing} navigator={this.props.navigator}/>
        );

        itemArr.push(
            <View key={8}
                  style={[CommStyles.bottomLineAll, {backgroundColor: constants.nightMode ? constants.nightModeGrayDark : constants.itemDividerColor}]}/>
        );
        return itemArr;
    }
}

const styles = StyleSheet.create({
    allTitle: {
        width: width * 0.36,
        height: width * 0.04,
    },

});

export default AllPage = BaseComponent(All);
