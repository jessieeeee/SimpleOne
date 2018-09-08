/**
 * @date :2018/9/7
 * @author :JessieKate
 * @email :lyj1246505807@gmail.com
 * @description :主界面-one分页
 */


import React, {Component} from 'react'
import constants from '../Constants'
import {
    View,
} from 'react-native'

import DateUtil from "../util/DateUtil"
import OneTabPage from './OneTabPage'
import GuideView from './GuideView'
import DisplayImg from '../display/DisplayImg'
import MyStorage from '../util/MySorage'
import ServerApi from '../ServerApi'
import OneTopBar from './OneTopBar'
import StatusManager from '../util/StatusManager'
import {BaseComponent} from "../view/BaseComponent"
import {observer} from "mobx-react/native"
// toast.show('Toast message',toast.SHORT,(message,count)=>{console.log("==",message,count)},(message,count)=>{console.log("++",message,count)})
@observer
class One extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showSearch: false,//是否显示搜索按钮
            showArrow: false,//是否显示箭头
            showDisplay: false,//是否显示大图
            showDate: '0',//显示的日期
            showGuide: false,//显示引导
            curOneData: null,  //缓存当前页
            nextOneData: null, //缓存下一页
        }
        this.date = '0'; //请求的日期
        this.curPage = 0
        // 初始化状态界面管理器
        this.statusManager = new StatusManager()
        this.showArrowAndSearch = this.showArrowAndSearch.bind(this)
        this.forward = this.forward.bind(this)
        this.backward = this.backward.bind(this)
        this.backToday = this.backToday.bind(this)
        this.onPullRelease = this.onPullRelease.bind(this)
    }
    /**
     * 刷新内容
     */
    retry() {
        this.loadPage()
    }
    /**
     * 发起网络请求
     */
    componentDidMount() {
        //初始化数据库
        MyStorage.initStorage()
        //检查是否第一次打开
        MyStorage.loadByKey('isFirst', (result) => {
            console.log("查询结果" + result)
        }, (err) => {
            //第一次打开，显示引导，刷新标记
            this.setState({
                showGuide: true
            })
            MyStorage.save('isFirst', false)
        })

        //检查界面渲染模式
        MyStorage.loadByKey('nightMode', (result) => {
            console.log("查询夜间模式" + result)
            constants.nightMode = result
        }, (err) => {
            //第一次设置，默认为正常模式
            MyStorage.save('nightMode', false)
        })
        // 请求数据
        this.loadPage()
    }

    /**
     * 初始化载入页面
     */
    loadPage() {
        //获取当前页后获取下一页进行缓存
        this.loadFirstPage(() => {
            // 先添加一个空白界面
            this.oneTabPage.addEmptyView()
            // 获取下一页
            this.getOneList((result) => {
                this.setState({
                    nextOneData: result,
                })
            }, false, () => {
                this.setState({
                    nextOneData: null,
                })
            })
        })
    }

    // 刷新释放回调
    onPullRelease() {
        console.log('this',this)
        if(!this.state.nextOneData){
            console.log('this添加界面')
            this.oneTabPage && this.oneTabPage.addEmptyView()
        }
        //发起请求
        this.getOneList((result) => {
            console.log('请求成功',result)
            this.setState({
                curOneData: result,
            })
        }, true)
    }

    /**
     * 渲染正常界面
     * @returns {*}
     */
    renderNormal() {
        if (this.state.curOneData){
            return (
                <View style={{flex:1}}>
                    {/*渲染内容界面*/}
                    <OneTabPage ref={(c) => this.oneTabPage = c}
                                curPage={this.curPage}
                                weather={this.state.curOneData.data.weather}
                                navigator={this.props.navigator}
                                forward={this.forward}
                                backward={this.backward}
                                showDate={this.state.showDate}
                                onPullRelease={this.onPullRelease}
                                showArrowAndSearch={this.showArrowAndSearch}
                                clickDisplay={(topText, imgUrl, bottomText, originalW, originalH) => {
                                    this.setState({
                                        topText: topText,
                                        imgUrl: imgUrl,
                                        bottomText: bottomText,
                                        originalW: originalW,
                                        originalH: originalH,
                                        showDisplay: true
                                    })
                                }}/>
                    {/*渲染展示大图*/}
                    {this.renderDisplay()}
                </View>
            )
        }
    }

    // 显示箭头和搜索
    showArrowAndSearch(show) {
        this.props.setNavigatorShow(show)
        this.setState({
            showSearch: show,
            showArrow: show
        })
    }

    /**
     * 回到今天
     */
    backToday() {
        this.curPage = 0
        this.setState({
            showDate: constants.curDate
        })
        this.oneTabPage.backToday()
    }

    /**
     * 向前翻页
     */
    forward(currentPage) {
        this.setState({
            showDate: DateUtil.getNextDate(this.state.showDate, this.curPage - currentPage)
        })
        this.curPage = currentPage
    }

    /**
     * 向后翻页
     */
    backward(currentPage) {
        this.setState({
            showDate: DateUtil.getLastDate(this.state.showDate, currentPage - this.curPage)
        });
        console.log('往后翻:' + currentPage + '缓存页数' + this.state.cachePage)
        //添加下一页缓存
        if (currentPage === this.state.cachePage) {
            console.log('添加下一页缓存')
            //设置当前页数
            this.setState({
                curOneData: this.state.nextOneData,
                cachePage: this.state.cachePage + 1,
            })
            this.oneTabPage.addPage(this.state.nextOneData.data)
            this.getOneList((result) => {
                this.setState({
                    nextOneData: result,
                })
                this.oneTabPage.addEmptyView()
            }, false ,() => {
                this.setState({
                    nextOneData: null,
                })
            })
        }
        this.curPage = currentPage
    }

    /**
     * 界面绘制
     * @returns {XML}
     */
    render() {
        return (
            <View style={{flex: 1}}>
                {/*渲染头部bar*/}
                <OneTopBar navigator={this.props.navigator}
                           showDate={this.state.showDate}
                           showArrow={this.state.showArrow}
                           showSearch={this.state.showSearch}
                           curOneData={this.state.curOneData}
                           backToday={this.backToday}/>
                <View style={{flex: 1}}>
                    {/*渲染正常界面*/}
                    {this.renderNormal() }
                    {/*渲染状态界面*/}
                    {this.props.displayStatus(this.statusManager)}
                </View>
                <GuideView isVisible={this.state.showGuide}
                           onCancel={() => {
                               this.setState({showGuide: false})
                           }}/>
            </View>
        )
    }


    /**
     * 渲染大图查看
     * @returns {XML}
     */
    renderDisplay() {
        return (
            <DisplayImg topText={this.state.topText}
                        originalW={this.state.originalW}
                        originalH={this.state.originalH}
                        imgUrl={this.state.imgUrl}
                        bottomText={this.state.bottomText}
                        isVisible={this.state.showDisplay}
                        onCancel={() => {
                            this.setState({showDisplay: false})
                        }}/>
        )
    }

    /**
     * 第一页获取
     * @param loadFirstSuccess 回调
     */
    loadFirstPage(loadFirstSuccess) {
        this.getOneList((result) => {
            this.setState({
                curOneData: result,
                cachePage: 1,
            })
            this.date = result.data.weather.date
            this.setState({
                showDate: result.data.weather.date
            })
            console.log('今日日期' + this.date)
            constants.curDate = this.date
            this.oneTabPage.resetView()
            this.oneTabPage.addPage(this.state.curOneData.data)
            loadFirstSuccess()
        }, false)
    }

    /**
     * 获取内容列表
     * @param onSuccess 成功请求回调
     * @param refresh 是否刷新
     * @param onError 错误回调
     */
    getOneList(onSuccess, refresh, onError) {
        console.log('请求date' + this.date)
        let requestDate;
        if (this.date === '0') {
            requestDate = '0'
        } else {
            if (refresh) {
                requestDate = this.state.showDate
            } else {
                requestDate = DateUtil.getLastDate(this.date)
            }
        }

        let url = ServerApi.OneList.replace('{date}', requestDate)

        console.log('请求日期date' + requestDate)
        this.props.request(url, null, this.statusManager, (result) => {
            if (!refresh) {
                this.date = requestDate
            }
            onSuccess(result)
        }, (error) => {
            if (onError){
                onError()
            }
            console.log('error' + error)
        }, !refresh)
    }
}

export default OnePage = BaseComponent(One)
