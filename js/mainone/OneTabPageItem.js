/**
 * @author : JessieK
 * @email : lyj1246505807@gmail.com
 * @description : one分页内容-水平方向单个item
 */
import React, {Component} from 'react'
import {StyleSheet, NativeModules, View} from 'react-native'
import PullScrollView from '../view/PullScrollView'
import constants from "../Constants"
import CommStyles from "../CommStyles"
import PropTypes from 'prop-types'
import ExpandMenu from './menu/ExpandMenu'
import OneListItemBottom from './OneListItemBottom'
import OneListCommon from './OneListCommon'
import OneListAudio from './OneListAudio'
import OneListMusic from './OneListMusic'
import OneListMovie from './OneListMovie'
import OneListTop from './OneListTop'
let toast = NativeModules.ToastNative
let {width, height} = constants.ScreenWH

class OneTabPageItem extends Component {
    static defaultProps = {
        showDate:'',
        page:1
    }

    static propTypes = {
        weather: PropTypes.object.isRequired, //天气
        clickDisplay: PropTypes.func, //点击查看大图
        showDate: PropTypes.string, // 展示日期
        refCallback: PropTypes.func, // ref回调
        onPullRelease: PropTypes.func, // 刷新回调
        showArrowAndSearch: PropTypes.func, // 显示回调
        page : PropTypes.number, // 页面key值
        onPulling: PropTypes.func, //下拉回调
        displayStatus: PropTypes.func, //展示状态
    }

    constructor(props) {
        super(props)
        this.state = {
            oneData: null,
            statusManager: null
        }
        this.onPullRelease = this.onPullRelease.bind(this)
        this.onScroll = this.onScroll.bind(this)
    }

    componentDidMount(){
        this.isMount = true
        this.props.refCallback && this.props.refCallback(this)
    }

    componentWillUnmount(){
        this.isMount = false
    }
    /**
     * 刷新数据
     * @param Data
     */
    update(Data){
        if(this.isMount){
            this.setState({
                oneData: Data
            })
        }
    }

    setStatus(statusManager){
        if (this.isMount){
            this.setState({
                statusManager: statusManager
            })
        }
    }
    render() {
        return (
            <View style={{flex: 1}}>
                <PullScrollView
                    style={{flex: 1}}
                    onPullRelease={this.onPullRelease}
                    onScroll={this.onScroll}
                    onPulling={() => {
                      this.props.onPulling && this.props.onPulling()
                    }}
                >
                    {this.state.oneData && this.state.oneData.content_list ? this.renderAllItem(this.props.page) :null}

                </PullScrollView>
                {/*渲染状态界面*/}
                {this.state.statusManager ? this.props.displayStatus(this.state.statusManager) : null}
            </View>
        )
    }

    onPullRelease(resolve){
        //do something
        console.log('one分页调刷新')
        setTimeout(() => {
            resolve()
        }, 3000);
        this.props.onPullRelease && this.props.onPullRelease()
    }

    /**
     * scrollview滑动回调
     */
    onScroll(event) {
        let y = event.nativeEvent.contentOffset.y
        // 显示搜索按钮和标题下面的箭头
        if (y > height * 0.1) {
            this.props.showArrowAndSearch && this.props.showArrowAndSearch(true)
        } else {
            this.props.showArrowAndSearch && this.props.showArrowAndSearch(false)
        }
    }
    /**
     * 列表item渲染
     * @param oneData
     * @returns {Array}
     */
    renderAllItem(page) {
        let itemArr = []
        let key = 0
        for (let i = 0; i < this.state.oneData.content_list.length; i++) {
            //取出每一条数据，根据类型判断item的样式
            let data = this.state.oneData.content_list[i]
            //最顶部的摄影和一句话
            if (data.category === constants.CategoryGraphic) {
                itemArr.push(
                    <OneListTop key={key}
                                date={constants.curDate}
                                weather={this.props.weather}
                                data={data}
                                navigator={this.props.navigator}
                                clickDisplay={this.props.clickDisplay}/>
                )
            }

            //音乐
            else if (data.category === constants.CategoryMusic) {
                itemArr.push(
                    <OneListMusic key={key} page={page} data={data} navigator={this.props.navigator}/>
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
                    <OneListAudio key={key} page={page} data={data} navigator={this.props.navigator}
                                  todayRadio={() => {
                                      toast.showMsg('今晚22:30主播在这里等你', toast.SHORT)
                                  }}/>
                )
            }
            //去除广告跳转的普通item
            else if (data.category !== constants.CategoryAd) {
                itemArr.push(
                    <OneListCommon key={key}
                                   navigator={this.props.navigator}
                                   data={data}/>
                )
            }
            //添加分割线
            key++
            // 添加普通分割线
            if (i !== 0) {
                itemArr.push(
                    <View key={key}
                          style={[CommStyles.bottomLine, {backgroundColor: constants.nightMode ? constants.nightModeGrayDark : constants.itemDividerColor}]}/>
                )
            }
            // 添加菜单分割线
            else {
                itemArr.push(
                    <View key={key}
                          style={[styles.menuLine, {backgroundColor: constants.nightMode ? constants.nightModeGrayDark : constants.itemDividerColor}]}/>
                )
            }
            key++
            if (key === 2) {
                key = key + 2
            }
        }
        //添加菜单和分割线
        if (this.state.oneData.menu) {
            itemArr.splice(2, 0,
                <ExpandMenu key={2} menu={this.state.oneData.menu} navigator={this.props.navigator} date={this.props.showDate}
                            todayRadio={() => {
                                toast.showMsg('今晚22:30主播在这里等你', toast.SHORT)
                            }}/>
            )
            itemArr.splice(3, 0,
                <View key={3}
                      style={[styles.menuLine, {backgroundColor: constants.nightMode ? constants.nightModeGrayDark : constants.itemDividerColor}]}/>
            )
        }
        // 渲染底部item
        itemArr.push(
            <OneListItemBottom key={key}/>
        )
        return itemArr
    }

}
const styles = StyleSheet.create({
    menuLine: {
        height: width * 0.012,
        width: width
    },
})
export default OneTabPageItem