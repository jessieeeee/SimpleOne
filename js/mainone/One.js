/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import NetUtil from '../util/NetUtil';
import constants from '../Constants';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    ScrollView,
    Image,
    Platform,
    TouchableOpacity,
    NativeModules,
    Animated,
    Easing
} from 'react-native';

var DisplayImg = require('../display/DisplayImg');
import Toast, {DURATION} from 'react-native-easy-toast'
import {PullView} from 'react-native-pull';
import DateUtil from "../util/DateUtil";

let toast = NativeModules.ToastNative;

var {width, height} = constants.ScreenWH;
var OneListTop = require('./OneListTop');
var OneListCommon = require('./OneListCommon');
var OneListMusic = require('./OneListMusic');
var OneListItemBottom = require('./OneListItemBottom');
var OneListMovie = require('./OneListMovie');
var OneListAudio = require('./OneListAudio');
var Search = require('../search/Search');
var ServerApi = require('../ServerApi');
var ExpandMenu = require('./menu/ExpandMenu');

var key = 0;
var date= '0'; //请求的日期
var itemPageArr = []; //分页数组
var  curPage= 0;//当前页数
// toast.show('Toast message',toast.SHORT,(message,count)=>{console.log("==",message,count)},(message,count)=>{console.log("++",message,count)})
var One = React.createClass({

    /**
     * 初始化状态变量
     * @returns {{oneData: null}}
     */
    getInitialState() {
        return {
            curOneData: null,  //缓存当前页
            nextOneData: null, //缓存下一页
            animatedValue: new Animated.Value(0),
            showSearch: false,//是否显示搜索按钮
            showArrow: false,//是否显示箭头
            showDisplay:false,//是否显示大图

            showDate:'0',//显示的日期
            play:true,
        }

    },

    /**
     * 发起网络请求
     */
    componentDidMount() {
        this.loadPage();
    },

    // 刷新释放回调
    onPullRelease(resolve) {
        //do something
        console.log('one分页调刷新');
        //发起请求
        this.getOneList((result) => {
            this.setState({
                curOneData: result,
            });
        },true);
        setTimeout(() => {
            resolve();
        }, 3000);

    },

    //动画
    animateLastDay() {
        Animated.timing(
            this.state.animatedValue,
            {
                toValue: 1,
                duration: 2000,
                easing: Easing.linear
            }
        ).start(() => this.animateLastDay())
    },

    /**
     * 界面绘制
     * @returns {XML}
     */
    render() {
        return (
            <View style={styles.container}>

                {this.renderNavBar()}
                <ScrollView horizontal={true} ref='sv_one' pagingEnabled={true}
                            scrollEnabled={true} showsHorizontalScrollIndicator={false}
                            onMomentumScrollEnd={this.onMomentumScrollEnd}>

                    {/*渲染分页*/}
                    {this.renderPage()}

                </ScrollView>
                {this.renderDisplay()}
                {constants.renderAudioPlay()}
                <Toast
                    ref="toast"
                    style={{backgroundColor: 'gray'}}
                    position='top'
                    positionValue={height * 0.4}
                    textStyle={{color: 'white'}}
                />
            </View>
        );
    },






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
                        onCancel={() => {this.setState({showDisplay: false})}}/>
        )
    },

    renderPage() {
        return itemPageArr;
    },

    /**
     * 滚动回调
     * @private
     */
    onMomentumScrollEnd(e) {
        //水平方向偏移量
        var offset = e.nativeEvent.contentOffset.x;
        //当前页数
        var currentPage = Math.floor(offset / width);
        // console.log(currentPage+'上一次页数;'+curPage);
        //往后翻
        if (currentPage > curPage) {
            // console.log('往后翻');
            //设置当前页数
            this.setState({
                showDate: DateUtil.getLastDate(this.state.showDate,currentPage-curPage),
                curOneData: this.state.nextOneData,
            });

            this.addPage(this.state.nextOneData.data);
            this.getOneList((result) => {
                this.setState({
                    nextOneData: result,
                });
                this.addEmptyView();
            },false);
        }
        else if(currentPage < curPage) {
            // console.log('往前翻');
            this.setState({
                showDate:DateUtil.getNextDate(this.state.showDate,curPage-currentPage)
            })
        }
        curPage=currentPage;
    },


    addEmptyView(){
        itemPageArr.push(
            <View key={key} style={{width:width,height:height}}/>
        );
        {
            key++
        }
    },
    /**
     * 添加下一页
     */
    // addPage(oneData) {
    //     itemPageArr.pop();
    //     key--;
    //     itemPageArr.push(
    //         <ScrollView key={key}  onScroll={this.onScroll}>
    //
    //             {this.renderAllItem(oneData)}
    //
    //         </ScrollView>
    //     );
    //     {
    //         key++
    //     }
    // },
    // /**
    //  * 添加下一页
    //  */
    addPage(oneData) {
        itemPageArr.pop();
        key--;
        itemPageArr.push(
            <PullView key={key} onPullRelease={this.onPullRelease} onScroll={this.onScroll}>

                {this.renderAllItem(oneData)}

            </PullView>
        );
        {
            key++
        }
    },

    /**
     * scrollview滑动回调
     */
    onScroll(event) {
        let y = event.nativeEvent.contentOffset.y;
        if (y > height * 0.1) {
            this.props.setNavigatorShow(true);
            this.setState({
                showSearch: true,
                showArrow: true
            });
        } else {
            this.props.setNavigatorShow(false);
            this.setState({
                showSearch: false,
                showArrow: false
            });
        }
    },

    /**
     * 回到今天
     */
    backToday() {
        //获得scrollView
        var scrollView = this.refs.sv_one;
        // console.log("offsetx:" + offsetx);
        scrollView.scrollResponderScrollTo({x: 0, y: 0, animated: true});
        curPage= 0;
        this.setState({
            showDate: constants.curDate
        });
    },

    /**
     * 列表item渲染
     * @param oneData
     * @returns {Array}
     */
    renderAllItem(oneData) {
        if (oneData !== null) {
            var itemArr = [];
            var key = 0;
            for (var i = 0; i < oneData.content_list.length; i++) {
                //取出每一条数据
                var data = oneData.content_list[i];
                //最顶部的摄影和一句话
                if (data.category == 0) {
                    //组件绑定数组
                    itemArr.push(
                        <OneListTop key={key}
                                    date={constants.curDate}
                                    weather={this.state.curOneData.data.weather}
                                    data={data}
                                    navigator={this.props.navigator}
                                    clickDisplay={(topText,imgUrl,bottomText,originalW,originalH)=>{
                                        this.setState({
                                            topText:topText,
                                            imgUrl:imgUrl,
                                            bottomText:bottomText,
                                            originalW:originalW,
                                            originalH:originalH,
                                            showDisplay:true
                                        })
                                    }}/>
                    );

                }

                //音乐
                else if (data.category == 4) {
                    itemArr.push(
                        <OneListMusic key={key} data={data} navigator={this.props.navigator}/>
                    );
                }
                //电影
                else if (data.category == 5) {
                    itemArr.push(
                        <OneListMovie key={key} data={data} navigator={this.props.navigator}/>
                    );
                }
                //电台
                else if (data.category == 8) {
                    itemArr.push(
                        <OneListAudio key={key} data={data} navigator={this.props.navigator} date={this.state.showDate}
                                      todayRadio={() => {
                                          toast.showMsg('今晚22:30主播在这里等你',toast.SHORT)
                                      }}/>
                    );
                }
                //普通item
                else {
                    itemArr.push(
                        <OneListCommon key={key}
                                       navigator={this.props.navigator}
                                       data={data}/>
                    );
                }
                key++;
                if (i !== 0) {
                    itemArr.push(
                        <View key={key} style={styles.bottomLine}/>
                    )
                } else {
                    itemArr.push(
                        <View key={key} style={styles.menuLine}/>
                    )
                }
                key++;
                if (key == 2) {
                    key = key + 2;
                }
            }
            //添加菜单
            if (oneData.menu != null) {
                itemArr.splice(2, 0,
                    <ExpandMenu key={2} menu={oneData.menu} navigator={this.props.navigator} date={this.state.showDate}
                                todayRadio={() => {
                                    toast.showMsg('今晚22:30主播在这里等你',toast.SHORT)
                                }}/>
                );
                itemArr.splice(3, 0,
                    <View key={3} style={styles.menuLine}/>
                );
            }
            key++;
            // 渲染底部item
            itemArr.push(
                <OneListItemBottom key={key}/>
            );
            return itemArr;
        }

    },


    /**
     * 顶部导航bar
     */
    renderNavBar() {
        // const movingMargin = this.state.animatedValue.interpolate({
        //     inputRange: [0, 0.5],
        //     outputRange: [0, height*0.06]
        // });
        {/*<Animated.Text style={[styles.dateText,{marginBottom:movingMargin}]} >{this.state.curOneData === null ? '' : this.getDateDay()}</Animated.Text>*/
        }

        return (
            <View style={styles.outNav}>
                {/*左边按钮*/}
                {this.renderToday()}


                {/*中间标题*/}
                <View style={styles.centerTitle}>
                    {/*上面日期*/}
                    <View style={styles.date}>
                        <Text
                            style={styles.dateText}>{this.state.showDate == '0' ? '' : this.state.showDate.substring(0, 4)}</Text>
                        <Text style={styles.dividerText}>{this.state.showDate == '0' ? '' : '    /    '}</Text>
                        <Text
                            style={styles.dateText}>{this.state.showDate == '0' ? '' : this.state.showDate.substring(5, 7)}</Text>
                        <Text style={styles.dividerText}>{this.state.showDate == '0' ? '' : '    /    '}</Text>
                        <Text
                            style={styles.dateText}>{this.state.showDate == '0' ? '' : this.state.showDate.substring(8, 10)}</Text>
                    </View>
                    {this.renderWeather()}

                </View>

                {this.renderSearch()}

            </View>
        );
    },

    /**
     * 天气绘制
     * @returns {XML}
     */
    renderWeather() {
        if (this.state.showArrow) {
            return (
                <Image source={{uri: 'triangle_down'}}
                       style={{position: 'absolute', bottom: width * 0.01, width: width * 0.03, height: width * 0.03}}/>
            );
        } else {
            return (
                <Text style={styles.weatherText}>
                    {this.state.curOneData === null ? '' : this.getWeatherInfo()}
                </Text>
            );
        }

    },

    /**
     * 搜索按钮绘制
     * @returns {XML}
     */
    renderSearch() {
        if (this.state.showSearch) {
            return (
                <TouchableOpacity style={styles.rightBtn}
                                  onPress={() => this.pushToSearch()}>
                    <Image source={{uri: 'search_night'}} style={styles.navRightBar}/>
                </TouchableOpacity>
            );
        }
    },



    /**
     * 跳转到搜索页
     * @param url
     */
    pushToSearch() {

        this.props.navigator.push(
            {
                component: Search
            }
        )
    },


    /**
     * 渲染左边今天按钮
     */
    renderToday() {
        if (curPage != 0) {
            return (
                <View style={styles.leftBtn}>
                    {/*左边按钮*/}
                    <TouchableOpacity
                        onPress={() => this.backToday()}>
                        <Image source={{uri: 'today'}} style={styles.navLeftBar}/>
                    </TouchableOpacity>
                </View>
            )
        }
    },

    /**
     * 初始化载入页面
     */
    loadPage() {

        //获取第一页后获取第二页
        this.loadFirstPage(() => {
            this.addEmptyView();
            this.getOneList((result) => {
                this.setState({
                    nextOneData: result,
                });

            },false);
        });
    },

    /**
     * 第一页获取
     * @param loadFirstSuccess 回调
     */
    loadFirstPage(loadFirstSuccess) {
        this.getOneList((result) => {
            this.setState({
                curOneData: result,
                cachePage: 1,
            });
            date=result.data.weather.date;
            this.setState({
                showDate:result.data.weather.date
            });
            console.log('今日日期'+date);
            constants.curDate = date;
            this.addPage(this.state.curOneData.data);
            loadFirstSuccess();
        },false);
    },


    /**
     * 获取内容列表
     * @param onSuccess
     */
    getOneList(onSuccess,refresh) {
        console.log('请求date'+date);
        var requestDate;
        if(date == '0'){
            requestDate= '0';
        }else{
            if(refresh){
                requestDate= this.state.showDate;
            }else{
                requestDate= DateUtil.getLastDate(date);
            }
        }

        var url = ServerApi.OneList.replace('{date}',  requestDate);

        console.log('请求日期date'+requestDate);

        NetUtil.get(url, null, (result) => {
            if(!refresh){

                date= requestDate;
            }
            onSuccess(result);
        }, (error) => {
            toast.showMsg('error' + error,toast.SHORT)
        });

    },


    /**
     * 得到天气信息
     * @returns {string}
     */
    getWeatherInfo() {
        var cityName = this.state.curOneData.data.weather.city_name;
        var climate = this.state.curOneData.data.weather.climate;
        var temperature = this.state.curOneData.data.weather.temperature;
        return cityName + '  ' + climate + '  ' + temperature;
    },


});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#eeeeee',
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
    weatherText: {
        textAlign: 'center',
        color: '#BFBFBF',
        fontSize: width * 0.03,
        position: 'absolute',
        bottom: width * 0.01
    },
    date: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: width * 0.01,
        height: height * 0.05,
    },
    centerTitle: {
        height: Platform.OS == 'ios' ? height * 0.07 : height * 0.08,
        alignItems: 'center',
        justifyContent: 'center',
    },
    dateText: {
        textAlign: 'center',
        fontSize: width * 0.05,
        color: '#525252',
    },
    dividerText: {
        fontSize: width * 0.05,
        color: '#AFAFAF',
        marginBottom: width * 0.02
    },
    navLeftBar: {
        width: width * 0.05 * 2.15,
        height: width * 0.05,

    },
    navRightBar: {
        width: width * 0.05,
        height: width * 0.05,
    },
    rightBtn: {
        position: 'absolute',
        right: width * 0.05,
    },
    leftBtn: {
        position: 'absolute',
        left: width * 0.038,
    },
    bottomLine: {
        backgroundColor: '#EEEEEE',
        height: width * 0.024,
        width: width
    },
    menuLine: {
        backgroundColor: '#EEEEEE',
        height: width * 0.012,
        width: width
    },
    text: {
        color: '#fff',
        fontSize: 30,
        fontWeight: 'bold',
    },
    refreshView: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: width * 0.5,
    },

});

module.exports = One;
