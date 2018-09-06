/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow 作者详情页
 */

import React, {Component} from 'react'
import PullScollView from '../view/PullScollView'
import NetUtil from '../util/NetUtil'
import AuthorHead from './AuthorHead'
import LoadMoreState from '../view/LoadMoreState'
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    NativeModules,
} from 'react-native'
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


class AuthorPage extends Component {
    constructor(props) {
        super(props)
        this.onLoadMore = this.onLoadMore.bind(this)
        this.onPullRelease = this.onPullRelease.bind(this)
        this.state = {
            loadingState: LoadMoreState.state.tip,//加载更多状态
            isEnd: false//是否到末尾标记
        }
        this.itemArr = []
        this.key = 0
        this.pageNum = 0
        this.workList = []
    }

    componentDidMount() {
        this.getWorkList()
    }

    getWorkList() {
        let url = ServerApi.AuthorPage.replace('{author_id}', this.props.route.params.authorId)
        url = url.replace('{page_num}', this.pageNum)
        console.log('加载页数' + this.pageNum)
        console.log("地址" + url)
        NetUtil.get(url, null, (result) => {
            this.workList = result.data
            this.loadMoreView()
            this.setState({
                loadingState: LoadMoreState.state.tip,
            })

            if (result.data.length < 10) {
                this.setState({
                    isEnd: true,
                })
            }
            console.log('当前数量' + this.workList.length)
        }, (error) => {
            console.log('error' + error)
            this.setState({
                loadingState: LoadMoreState.state.error,
            })
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
                    {this.itemArr}
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
            this.pageNum++
            console.log('当前页数' + this.pageNum)
            this.getWorkList()
            //设置正在加载和更多列表标记
            this.setState({
                loadingState: LoadMoreState.state.loading,
            })
        }else{
            this.setState({
                loadingState: LoadMoreState.state.noMore,
            })
        }
    }

    loadMoreView() {
        if (this.workList.length !== 0) {
            for (let i = 0; i < this.workList.length; i++) {
                //取出每一条数据
                let data = this.workList[i]
                //最顶部的摄影和一句话
                if (data.category === constants.CategoryGraphic) {
                    //组件绑定数组
                    this.itemArr.push(
                        <OneListTop key={this.key}
                                    data={data}
                                    navigator={this.props.navigator}/>
                    )
                }
                //音乐
                else if (data.category === constants.CategoryMusic) {
                    this.itemArr.push(
                        <OneListMusic key={key} data={data} navigator={this.props.navigator}/>
                    )
                }
                //电影
                else if (data.category === constants.CategoryMovie) {
                    this.itemArr.push(
                        <OneListMovie key={key} data={data} navigator={this.props.navigator}/>
                    )
                }
                //电台
                else if (data.category === constants.CategoryRadio) {
                    this.itemArr.push(
                        <OneListAudio key={key} data={data} navigator={this.props.navigator} todayRadio={() => {
                            toast.showMsg('今晚22:30主播在这里等你', toast.SHORT)
                        }}/>
                    )
                }
                //普通item
                else {
                    this.itemArr.push(
                        <OneListCommon key={key}
                                       navigator={this.props.navigator}
                                       data={data}/>
                    )
                }
                key++
                this.itemArr.push(
                    <View key={key}
                          style={[CommStyles.bottomLine, {backgroundColor: constants.nightMode ? constants.nightModeGrayDark : constants.itemDividerColor}]}/>
                )

                key++
                console.log('渲染view' + this.itemArr.length)
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