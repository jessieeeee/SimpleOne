/**
 * @author : JessieK
 * @email : lyj1246505807@gmail.com
 * @description : one分页内容页面渲染
 */
import React, {Component} from 'react'
import {NativeModules, ScrollView, StyleSheet, View} from 'react-native'
import ExpandMenu from './menu/ExpandMenu'
import OneListItemBottom from './OneListItemBottom'
import OneListCommon from './OneListCommon'
import OneListAudio from './OneListAudio'
import OneListMusic from './OneListMusic'
import OneListMovie from './OneListMovie'
import OneListTop from './OneListTop'
import PullScrollView from '../view/PullScrollView'
import constants from "../Constants"
import CommStyles from "../CommStyles"
import PropTypes from 'prop-types'
let toast = NativeModules.ToastNative
let {width, height} = constants.ScreenWH
class OneTabPage extends Component{
    static defaultProps = {
        showDate:''
    }
    static propTypes = {
        curPage: PropTypes.number.isRequired,
        forward: PropTypes.func, //向前翻回调
        backward: PropTypes.func,//向后翻回调
        showArrowAndSearch: PropTypes.func, //显示箭头和搜索
        onPullRelease: PropTypes.func,
        weather: PropTypes.object.isRequired,
        showDate: PropTypes.string,
        clickDisplay: PropTypes.func //点击查看大图
    }

    constructor(props){
        super(props)
        this.itemPageArr = [] //分页数组
        this.key = 1 //横向页面的id
         // 绑定回调
        this.onPullRelease = this.onPullRelease.bind(this)
        this.onScroll = this.onScroll.bind(this)
        this.onMomentumScrollEnd = this.onMomentumScrollEnd.bind(this)

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
        if (currentPage > this.props.curPage) {
            this.props.backward && this.props.backward(currentPage)
        }
        else if (currentPage < this.props.curPage) {
            // console.log('往前翻')
            this.props.forward && this.props.forward(currentPage)
        }

    }

    resetView(){
        this.itemPageArr.splice(0,this.itemPageArr.length)
    }
    /**
     * 添加后面一页的空白界面
     */
    addEmptyView() {
        this.itemPageArr.push(
            <View key={this.key} style={{
                width: width,
                height: height,
                backgroundColor: constants.nightMode ? constants.nightModeGrayLight : 'white'
            }}/>
        )
        this.key++
    }

    onPullRelease(resolve){
        //do something
        console.log('one分页调刷新')
        this.props.onPullRelease && this.props.onPullRelease()
        setTimeout(() => {
            resolve()
        }, 3000);
    }

    // 添加内容页面
    addPage(oneData) {
        // 把空白界面删除
        this.itemPageArr.pop()
        this.key--
        // 添加内容界面
        this.itemPageArr.push(
            <PullScrollView
                style={{flex:1}}
                key={this.key}
                onPullRelease={this.onPullRelease}
                onScroll={this.onScroll}
            >

                {this.renderAllItem(oneData, this.key)}

            </PullScrollView>
        )
        {
            this.key++
        }
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
     * 回到今天
     */
    backToday() {
        //获得scrollView
        let scrollView = this.refs.sv_one
        scrollView.scrollResponderScrollTo({x: 0, y: 0, animated: true})
    }

    /**
     * 列表item渲染
     * @param oneData
     * @returns {Array}
     */
    renderAllItem(oneData, page) {
        if (oneData !== null) {
            let itemArr = []
            let key = 0
            for (let i = 0; i < oneData.content_list.length; i++) {
                //取出每一条数据，根据类型判断item的样式
                let data = oneData.content_list[i]
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
                        <OneListMusic key={key} page={page} data={data} navigator={this.props.navigator} />
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
            if (oneData.menu) {
                itemArr.splice(2, 0,
                    <ExpandMenu key={2} menu={oneData.menu} navigator={this.props.navigator} date={this.props.showDate}
                                todayRadio={() => {
                                    toast.showMsg('今晚22:30主播在这里等你', toast.SHORT)
                                }}/>
                );
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


    render(){
        return(
            <ScrollView
                style={{flex:1}}
                horizontal={true} ref='sv_one' pagingEnabled={true}
                        scrollEnabled={true} showsHorizontalScrollIndicator={false}
                        onMomentumScrollEnd={this.onMomentumScrollEnd}>
                {/*渲染分页*/}
                {this.itemPageArr}

            </ScrollView>
        )
    }
}
const styles = StyleSheet.create({
    menuLine: {
        height: width * 0.012,
        width: width
    },
})
export default OneTabPage