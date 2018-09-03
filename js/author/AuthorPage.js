/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow 作者详情页
 */

import React, {Component} from 'react';
import PullScollView from '../view/PullScollView';
import NetUtil from '../util/NetUtil';
import AuthorHead from './AuthorHead';
import LoadMoreState from '../view/LoadMoreState'
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    NativeModules,
} from 'react-native';
import constants from '../Constants'
import OneListTop from '../mainone/OneListTop'
import OneListCommon from '../mainone/OneListCommon'
import OneListMusic from '../mainone/OneListMusic'
import OneListMovie from '../mainone/OneListMovie'
import OneListAudio from '../mainone/OneListAudio'
import ServerApi from '../ServerApi'
import CommStyles from "../CommStyles"

let toast = NativeModules.ToastNative
let {width, height} = constants.ScreenWH
let itemArr = []
let key = 0
let pageNum = 0
let workList = []

class AuthorPage extends Component {
    constructor(props) {
        super(props)
        this.onLoadMore = this.onLoadMore.bind(this)
        this.onPullRelease = this.onPullRelease.bind(this)
        this.state = {
            loadingState: LoadMoreState.state.tip,//加载更多状态
            isEnd: false//是否到末尾标记
        }
    }

    componentDidMount() {
        this.reset()
        this.getWorkList()
    }

    reset() {
        key = 0
        itemArr = []
        workList = []
        pageNum = 0;
    }

    getWorkList() {
        let url = ServerApi.AuthorPage.replace('{author_id}', this.props.route.params.authorId);
        url = url.replace('{page_num}', pageNum);
        console.log('加载页数' + pageNum);
        console.log("地址" + url);
        NetUtil.get(url, null, (result) => {

            workList = result.data;

            this.loadMoreView();

            this.setState({
                loadingState: LoadMoreState.state.tip,

            })

            if (result.data.length < 10) {
                this.setState({
                    isEnd: true,
                })
            }
            console.log('当前数量' + workList.length);
        }, (error) => {
            toast.showMsg('error' + error, toast.SHORT);
            this.setState({
                loadingState: LoadMoreState.state.error,
            });
        })
    }

    render() {
        return (
            <View style={[styles.container, {backgroundColor:constants.nightMode ? constants.nightModeGrayLight : 'white'}]}>
                {this.renderNavBar()}

                <PullScollView onPullRelease={this.onPullRelease}
                               onRetry={() => {this.getWorkList()}}
                               loadMoreState={this.state.loadingState}
                               onLoadMore={this.onLoadMore}
                               style={{width: width}}>
                    <AuthorHead authorId={this.props.route.params.authorId}/>
                    <View
                        style={[CommStyles.bottomLine, {backgroundColor: constants.nightMode ? constants.nightModeGrayDark : constants.itemDividerColor}]}/>

                    {this.renderAllItem()}
                </PullScollView>
            </View>
        )
    }


    // 刷新释放回调
    onPullRelease(resolve) {
        //do something
        console.log('作者页调刷新')
        //发起请求
        this.getWorkList()
        setTimeout(() => {
            resolve()
        }, 3000)
    }

    /**
     * scrollview滑动回调
     */
    onLoadMore() {
        if (!this.state.isEnd) {
            pageNum++

            console.log('当前页数' + pageNum)
            this.getWorkList()
            //设置正在加载和更多列表标记
            this.setState({
                loadingState: LoadMoreState.state.loading,
            })
        }else{
            this.setState({
                loadingState: LoadMoreState.state.noMore,
            });
        }
    }

    loadMoreView() {
        if (workList.length !== 0) {
            for (let i = 0; i < workList.length; i++) {
                //取出每一条数据
                let data = workList[i];
                //最顶部的摄影和一句话
                if (data.category === constants.CategoryGraphic) {
                    //组件绑定数组
                    itemArr.push(
                        <OneListTop key={key}
                                    data={data}
                                    navigator={this.props.navigator}/>
                    )
                }
                //音乐
                else if (data.category === constants.CategoryMusic) {
                    itemArr.push(
                        <OneListMusic key={key} data={data} navigator={this.props.navigator}/>
                    )
                }
                //电影
                else if (data.category === constants.CategoryMovie) {
                    itemArr.push(
                        <OneListMovie key={key} data={data} navigator={this.props.navigator}/>
                    )
                }
                //电台
                else if (data.category === constants.CategoryRadio) {
                    itemArr.push(
                        <OneListAudio key={key} data={data} navigator={this.props.navigator}/>
                    )
                }
                //普通item
                else {
                    itemArr.push(
                        <OneListCommon key={key}
                                       navigator={this.props.navigator}
                                       data={data}/>
                    )
                }
                key++
                itemArr.push(
                    <View key={key}
                          style={[CommStyles.bottomLine, {backgroundColor: constants.nightMode ? constants.nightModeGrayDark : constants.itemDividerColor}]}/>
                )

                key++
                console.log('渲染view' + itemArr.length)
            }
        }
    }

    /**
     * 列表item渲染
     * @param oneData
     * @returns {Array}
     */
    renderAllItem() {
        return itemArr
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

                {/*左边按钮*/}
                <TouchableOpacity style={CommStyles.leftBack}
                                  onPress={() => this.props.navigator.pop()}>
                    <Image source={{uri: 'icon_back'}} style={CommStyles.navLeftBack}/>
                </TouchableOpacity>

                <Text style={[styles.title,{color: constants.nightMode ? constants.nightModeTextColor : constants.normalTextColor,
                }]}>{this.props.route.params.authorName}</Text>

            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',

    },

    title: {
        fontSize: width * 0.04,
        fontWeight: 'bold'
    },
})

export default AuthorPage