/**
 * @author : JessieK
 * @email : lyj1246505807@gmail.com
 * @description : one分页内容页面渲染
 */
import React, {Component} from 'react'
import {ScrollView, View, Text} from 'react-native'
import OneTabPageItem from './OneTabPageItem'
import constants from "../Constants"
import PropTypes from 'prop-types'
let {width, height} = constants.ScreenWH

class OneTabPage extends Component {
    static defaultProps = {
        showDate: ''
    }
    static propTypes = {
        forward: PropTypes.func, //向前翻回调
        backward: PropTypes.func,//向后翻回调
        showArrowAndSearch: PropTypes.func, //显示箭头和搜索
        onPullRelease: PropTypes.func,//刷新回调
        weather: PropTypes.object.isRequired,//天气
        showDate: PropTypes.string,//展示日期
        clickDisplay: PropTypes.func, //点击查看大图
        displayStatus: PropTypes.func, //展示状态
    }

    constructor(props) {
        super(props)
        this.itemPageArr = [] //分页数组
        this.key = 1 //横向页面的id
        this.curPage = 0
        this.items = []
        this.state = {
            scrollEnable: true
        }
        // 绑定回调
        this.onMomentumScrollEnd = this.onMomentumScrollEnd.bind(this)
        this.pullRelease = this.pullRelease.bind(this)
        this.pulling = this.pulling.bind(this)
    }

    /**
     * 滚动回调
     * @private
     */
    onMomentumScrollEnd(e) {
        //水平方向偏移量
        let offset = e.nativeEvent.contentOffset.x
        console.log(':' + offset + '宽度' + width)
        //当前页数
        let currentPage = Math.round(offset / width)

        //往后翻
        if (currentPage > this.curPage) {
            this.props.backward && this.props.backward(this.curPage, currentPage)
            this.curPage = currentPage
        }
        else if (currentPage < this.curPage) {
            // console.log('往前翻')
            this.props.forward && this.props.forward(this.curPage, currentPage)
            this.curPage = currentPage
        }

    }

    resetView() {
        this.itemPageArr.splice(0, this.itemPageArr.length)
    }

    /**
     * 添加后面一页的空白界面
     */
    addEmptyView() {
        this.itemPageArr.push(
            <View key={this.key} style={{
                flex: 1,
                width: width,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: constants.nightMode ? constants.nightModeGrayLight : 'white'
            }}>
                <Text style={{ color: constants.nightMode ? 'white' : constants.normalTextColor, fontSize: width * 0.04}}>正在加载中.....</Text>

            </View>
        )
    }


    // 刷新内容item
    updatePage(oneData) {
        this.items[this.curPage].update(oneData)
    }

    // 设置内容item的状态
    setStatusPage(statusManager) {
        this.items[this.curPage] && this.items[this.curPage].setStatus(statusManager)
    }

    pulling() {
        this.setState({
            scrollEnable: false
        })
    }

    pullRelease() {
        this.setState({
            scrollEnable: true
        })
        this.props.onPullRelease && this.props.onPullRelease()
    }

    // 添加内容页面
    addPage(oneData) {
        // 把空白界面删除
        this.itemPageArr.pop()
        // 添加内容界面
        this.itemPageArr.push(
            <OneTabPageItem
                key={this.key}
                page={this.key}
                displayStatus={this.props.displayStatus}
                onPulling={this.pulling}
                navigator={this.props.navigator}
                weather={this.props.weather}
                clickDisplay={this.props.clickDisplay}
                showDate={this.props.showDate}
                refCallback=
                    {(ref) => {
                        this.items.push(ref)
                        // 刷新界面
                        this.items[this.items.length - 1].update(oneData)
                    }}
                onPullRelease={this.pullRelease}
                showArrowAndSearch={this.props.showArrowAndSearch}
            />
        )
        this.key++
    }

    /**
     * 回到今天
     */
    backToday() {
        //获得scrollView
        let scrollView = this.refs.sv_one
        scrollView.scrollResponderScrollTo({x: 0, y: 0, animated: true})
        this.curPage = 0
    }

    render() {
        return (
            <ScrollView
                style={{flex: 1}}
                horizontal={true} ref='sv_one' pagingEnabled={true}
                scrollEnabled={this.state.scrollEnable} showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={this.onMomentumScrollEnd}>
                {/*渲染分页*/}
                {this.itemPageArr}

            </ScrollView>
        )
    }
}

export default OneTabPage