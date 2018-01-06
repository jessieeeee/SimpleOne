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
    ActivityIndicator,
    NativeModules,
    Animated,
    Easing
} from 'react-native';

let toast = NativeModules.ToastNative;
import Toast, {DURATION} from 'react-native-easy-toast'
import {PullView} from 'react-native-pull';
import DateUtil from "../util/DateUtil";

var Dimensions = require('Dimensions');
var {width, height} = Dimensions.get('window');
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
var itemPageArr = []; //分页数组
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
            date: '0', //请求的日期
            curPage: 0,//当前页数
            animatedValue: new Animated.Value(0),
            showSearch: false,//是否显示搜索按钮
            showArrow: false//是否显示箭头
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
        });
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


        //往后翻
        if (currentPage > this.state.curPage) {
            //设置当前页数
            this.setState({
                curOneData: this.state.nextOneData,
                curPage: currentPage
            });

            this.getOneList((result) => {
                this.setState({
                    nextOneData: result,
                });
                this.addPage(this.state.nextOneData.data);
            });


        } else {
            this.setState({
                curPage: currentPage
            });
        }
    },


    /**
     * 添加下一页
     */
    addPage(oneData) {
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
        this.setState({
            curPage: 0
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
                                    topImgUrl={data.img_url}
                                    title={data.title}
                                    picInfo={data.pic_info}
                                    forward={data.forward}
                                    wordsInfo={data.words_info}
                                    likeNum={data.like_count}
                                    date={this.state.date}
                                    weather={this.state.curOneData.data.weather}
                                    topText={data.volume}
                                    shareInfo={data.share_info}
                                    shareList={data.share_list}
                                    navigator={this.props.navigator}/>
                    );

                }

                //音乐
                else if (data.category == 4) {
                    itemArr.push(
                        <OneListMusic key={key} imgUrl={data.img_url} title={data.title}
                                      userName={data.author.user_name} musicName={data.music_name}
                                      audioAuthor={data.audio_author} audioAlbum={data.audio_album}
                                      forward={data.forward} postDate={data.post_date} likeNum={data.like_count}
                                      shareInfo={data.share_info}
                                      shareList={data.share_list}/>
                    );
                }
                //电影
                else if (data.category == 5) {
                    itemArr.push(
                        <OneListMovie key={key} imgUrl={data.img_url} title={data.title}
                                      userName={data.author.user_name} subTitle={data.subtitle} forward={data.forward}
                                      postDate={data.post_date} likeNum={data.like_count}
                                      shareInfo={data.share_info}
                                      shareList={data.share_list}/>
                    );
                }
                //电台
                else if (data.category == 8) {
                    itemArr.push(
                        <OneListAudio key={key} imgUrl={data.img_url} title={data.title} likeNum={data.like_count}
                                      shareInfo={data.share_info}
                                      shareList={data.share_list}/>
                    );
                }
                //普通item
                else {
                    itemArr.push(
                        <OneListCommon key={key} category={data.category} userName={data.author.user_name}
                                       title={data.title} imgUrl={data.img_url} forward={data.forward}
                                       postDate={data.post_date} likeNum={data.like_count}
                                       tagTitle={this.showOneStory(data)}
                                       shareInfo={data.share_info}
                                       shareList={data.share_list}/>
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
                    <ExpandMenu key={2} menu={oneData.menu} navigator={this.props.navigator} date={this.state.date}
                                todayRadio={() => {
                                    this.refs.toast.show('今晚22:30主播在这里等你', 1500)
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
                            style={styles.dateText}>{this.state.curOneData === null ? '' : DateUtil.getNextDate(this.state.date).substring(0, 4)}</Text>
                        <Text style={styles.dividerText}>{this.state.curOneData === null ? '' : '    /    '}</Text>
                        <Text
                            style={styles.dateText}>{this.state.curOneData === null ? '' : DateUtil.getNextDate(this.state.date).substring(5, 7)}</Text>
                        <Text style={styles.dividerText}>{this.state.curOneData === null ? '' : '    /    '}</Text>
                        <Text
                            style={styles.dateText}>{this.state.curOneData === null ? '' : DateUtil.getNextDate(this.state.date).substring(8, 10)}</Text>
                    </View>
                    {this.renderWeather()}

                </View>

                {this.renderSearch()}

            </View>
        );
    },

    renderWeather() {
        if (this.state.showArrow) {
            return (
                <Image source={{uri: 'triangle_down'}}
                       style={{position: 'absolute', bottom: width * 0.01, width: width * 0.02, height: width * 0.02}}/>
            );
        } else {
            return (
                <Text style={styles.weatherText}>
                    {this.state.curOneData === null ? '' : this.getWeatherInfo()}
                </Text>
            );
        }

    },

    renderSearch() {
        if (this.state.showSearch) {
            return (
                <TouchableOpacity style={styles.rightBtn}
                                  onPress={() =>  toast.show('Toast message',toast.SHORT,(message,count)=>{console.log("==",message,count)},(message,count)=>{console.log("++",message,count)})
                                      }>
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
                component: Search,
                params: {
                    date: DateUtil.getNextDate(this.state.date).substring(0, 4) + '年' + DateUtil.getNextDate(this.state.date).substring(5, 7) + '月',

                }
            }
        )
    },


    /**
     * 渲染左边今天按钮
     */
    renderToday() {
        if (this.state.curPage != 0) {
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
            this.getOneList((result) => {
                this.setState({
                    nextOneData: result,
                });
                this.addPage(this.state.nextOneData.data);
            });
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
                date: result.data.weather.date
            });
            constants.curDate = result.data.weather.date;
            this.addPage(this.state.curOneData.data);
            loadFirstSuccess();
        });
    },


    /**
     * 获取内容列表
     * @param onSuccess
     */
    getOneList(onSuccess) {
        var lastDate = DateUtil.getLastDate(this.state.date);
        var url = ServerApi.OneList.replace('{date}', this.state.date == '0' ? '0' : lastDate);
        this.setState({
            date: lastDate
        });

        NetUtil.get(url, null, (result) => {
            onSuccess(result);

        }, (error) => {
            this.refs.toast.show('error' + error, 500)
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

    /**
     * 是否是onestory判断
     * @param data
     * @returns {boolean}
     */
    showOneStory(data) {
        if (data.tag_list != null && data.tag_list.length > 0) {
            return data.tag_list[0].title;
        } else {
            return '';
        }
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
        borderBottomWidth: 0.167
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
        fontFamily: 'hp-title'
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
