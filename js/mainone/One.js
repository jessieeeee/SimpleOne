/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import NetUtil from '../util/NetUtil';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    ScrollView,
    Image,
    Platform,
    TouchableOpacity,
    RefreshControl,
} from 'react-native';

import Toast, {DURATION} from 'react-native-easy-toast'

import DateUtil from "../util/DateUtil";
var Dimensions = require('Dimensions');
var {width, height} = Dimensions.get('window');
var OneListTop = require('./OneListTop');
var OneListCommon = require('./OneListCommon');
var OneListMusic = require('./OneListMusic');
var OneListItemBottom = require('./OneListItemBottom');
var OneListMovie = require('./OneListMovie');
var OneListAudio = require('./OneListAudio');
var Search=require('../search/Search');
var ServerApi = require('../ServerApi');

var key=0;
var itemPageArr=[]; //分页数组

var One = React.createClass({
    /**
     * 初始化状态变量
     * @returns {{oneData: null}}
     */
    getInitialState() {
        return {
            curOneData: null,  //缓存当前页
            nextOneData: null, //缓存下一页
            isRefreshing: false,
            date: '0', //请求的日期
            curPage:0,//当前页数
        }

    },


    /**
     * 发起网络请求
     */
    componentDidMount() {
        this.loadPage();
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
                            scrollEnabled={true} showsHorizontalScrollIndicator={false} onMomentumScrollEnd ={this.onMomentumScrollEnd}>

                    {/*渲染分页*/}
                    {this.renderPage()}

                </ScrollView>
                <Toast
                    ref="toast"
                    style={{backgroundColor: 'gray'}}
                    position='bottom'
                    positionValue={height * 0.24}
                    textStyle={{color: 'white'}}
                />


            </View>
        );
    },

    renderPage(){
        return itemPageArr;
    },

    /**
     * 滚动回调
     * @private
     */
    onMomentumScrollEnd(e){
        //水平方向偏移量
        var offset = e.nativeEvent.contentOffset.x;
        //当前页数
        var currentPage = Math.floor(offset / width);


        //往后翻
        if(currentPage>this.state.curPage){
            //设置当前页数
            this.setState({
                curOneData:this.state.nextOneData,
                curPage: currentPage
            });

            this.getOneList((result)=>{
                this.setState({
                    nextOneData: result,
                    isRefreshing: false,
                });
                this.addPage(this.state.nextOneData.data);
            });
        }else{
            this.setState({
                curPage: currentPage
            });
        }
    },

    /**
     * 添加下一页
     */
    addPage(oneData){
        itemPageArr.push(

            <ScrollView  key={key} scrollEventThrottle={50} refreshControl={
                <RefreshControl
                    refreshing={this.state.isRefreshing}
                    onRefresh={this.onRefresh}
                    title="Loading..."
                    titleColor="#00ff00"
                    colors={['#ff0000', '#00ff00', '#0000ff', '#3ad564']}
                    progressBackgroundColor="#ffffff"
                />
            }>

            {this.renderAllItem(oneData)}

            </ScrollView>

        );
        {key++}

    },
    /**
     * 刷新操作
     */
    onRefresh() {
        //更改刷新状态
        this.setState({isRefreshing: true});
        //发起请求
        this.getOneList((result)=>{
            this.setState({
                curOneData: result,
                isRefreshing: false,
            });
        });
    },

    /**
     * 回到今天
     */
    backToday(){
        //获得scrollView
        var scrollView = this.refs.sv_one;
        // console.log("offsetx:" + offsetx);
        scrollView.scrollResponderScrollTo({x: 0, y: 0, animated: true});
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
                        <OneListTop key={key} topImgUrl={data.img_url} title={data.title} picInfo={data.pic_info}
                                    forward={data.forward} wordsInfo={data.words_info} likeNum={data.like_count}/>
                    );
                }
                //音乐
                else if (data.category == 4) {
                    itemArr.push(
                        <OneListMusic key={key} imgUrl={data.img_url} title={data.title}
                                      userName={data.author.user_name} musicName={data.music_name}
                                      audioAuthor={data.audio_author} audioAlbum={data.audio_album}
                                      forward={data.forward} postDate={data.post_date} likeNum={data.like_count}/>
                    );
                }
                //电影
                else if (data.category == 5) {
                    itemArr.push(
                        <OneListMovie key={key} imgUrl={data.img_url} title={data.title}
                                      userName={data.author.user_name} subTitle={data.subtitle} forward={data.forward}
                                      postDate={data.post_date} likeNum={data.like_count}/>
                    );
                }
                //电台
                else if (data.category == 8) {
                    itemArr.push(
                        <OneListAudio key={key} imgUrl={data.img_url} title={data.title} likeNum={data.like_count}/>
                    );
                }
                //普通item
                else {
                    itemArr.push(
                        <OneListCommon key={key} category={data.category} userName={data.author.user_name}
                                       title={data.title} imgUrl={data.img_url} forward={data.forward}
                                       postDate={data.post_date} likeNum={data.like_count}
                                       tagTitle={this.showOneStory(data)}/>
                    );
                }
                key++;
                if (i !== oneData.content_list.length - 1) {
                    itemArr.push(
                        <View key={key} style={styles.bottomLine}/>
                    )
                }
                key++;
            }
            // 渲染底部item
            itemArr.push(
                <OneListItemBottom key={oneData.content_list.length * 2}/>
            );
            return itemArr;
        }

    },

    /**
     * 顶部导航bar
     */
    renderNavBar() {
        return (
            <View style={styles.outNav}>
                {/*左边按钮*/}
                {this.renderToday()}
                {/*中间标题*/}
                <View style={styles.centerTitle}>
                    {/*上面日期*/}
                    <View style={styles.date}>
                        <Text style={styles.dateText}>{this.state.curOneData === null ? '' : this.getDateYear()}</Text>
                        <Text style={styles.dividerText}>{this.state.curOneData === null ? '' : '    /    '}</Text>
                        <Text style={styles.dateText}>{this.state.curOneData === null ? '' : this.getDateMonth()}</Text>
                        <Text style={styles.dividerText}>{this.state.curOneData === null ? '' : '    /    '}</Text>
                        <Text style={styles.dateText}>{this.state.curOneData === null ? '' : this.getDateDay()}</Text>
                    </View>
                    {/*下面天气*/}
                    <Text style={styles.weatherText}>
                        {this.state.curOneData === null ? '' : this.getWeatherInfo()}
                    </Text>

                </View>


                {/*右边按钮*/}
                <TouchableOpacity style={styles.rightBtn}
                                  onPress={() => this.pushToSearch()}>
                    <Image source={{uri: 'search_night'}} style={styles.navRightBar}/>
                </TouchableOpacity>
            </View>
        );
    },

    /**
     * 跳转到搜索页
     * @param url
     */
    pushToSearch(){

        this.props.navigator.push(
            {
                component: Search,
            }
        )
    },


    /**
     * 渲染左边今天按钮
     */
    renderToday() {
        if (this.state.curPage!=0) {
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
    loadPage(){

        //获取第一页后获取第二页
      this.loadFirstPage(()=>{
          this.getOneList((result)=>{
              this.setState({
                  nextOneData: result,
                  isRefreshing: false,
              });
              this.addPage(this.state.nextOneData.data);
          });
      });
    },

    /**
     * 第一页获取
     * @param loadFirstSuccess 回调
     */
    loadFirstPage(loadFirstSuccess){
        this.getOneList((result)=>{
            this.setState({
                curOneData: result,
                isRefreshing: false,
                cachePage:1,
                date:result.data.weather.date
            });
            this.addPage(this.state.curOneData.data);
            loadFirstSuccess();
        });
    },


    /**
     * 获取内容列表
     * @param onSuccess
     */
    getOneList(onSuccess) {
        var lastDate=DateUtil.getLastDate(this.state.date);
        var url=ServerApi.OneList.replace('{date}', this.state.date=='0'?'0':lastDate);
        this.setState({
            date:lastDate
        });

        NetUtil.get(url, null, (result) => {
            onSuccess(result);

        }, (error) => {
            this.refs.toast.close('error' + error, 500)
        });

    },


    /**
     * 获得年份
     * @param date
     * @returns {string}
     */
    getDateYear() {
        var yearMonthDay = this.state.curOneData.data.weather.date;
        return yearMonthDay.substring(0, 4);
    },

    /**
     * 获得月份
     * @param date
     * @returns {string}
     */
    getDateMonth() {
        var yearMonthDay = this.state.curOneData.data.weather.date;
        return yearMonthDay.substring(5, 7);
    },

    /**
     * 获得日期
     * @param date
     * @returns {string}
     */
    getDateDay() {
        var yearMonthDay = this.state.curOneData.data.weather.date;
        return yearMonthDay.substring(8, 10);
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
        backgroundColor: '#F5FCFF',
    },
    outNav: {
        height: Platform.OS == 'ios' ? height * 0.07 : height * 0.08,
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
        width: width,
        justifyContent: 'center',
        borderBottomWidth: width*0.00046,
        borderBottomColor: 'gray'
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
    text: {
        color: '#fff',
        fontSize: 30,
        fontWeight: 'bold',
    }
});

module.exports = One;
