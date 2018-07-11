/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow 主界面-one分页
 */

import React, {Component} from 'react';
import NetUtil from '../util/NetUtil';
import constants from '../Constants';
import CommStyles from '../CommStyles';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    ScrollView,
    Image,
    TouchableOpacity,
    NativeModules,
    Animated,
    Easing
} from 'react-native';

import PullScollView from '../view/PullScollView';
import DateUtil from "../util/DateUtil";

import Search from '../search/Search';
import GuideView from './GuideView';
import DisplayImg from '../display/DisplayImg';
import ExpandMenu from './menu/ExpandMenu';
import OneListItemBottom from './OneListItemBottom';
import OneListCommon from './OneListCommon';
import OneListAudio from './OneListAudio';
import OneListMusic from './OneListMusic';
import OneListMovie from './OneListMovie';
import OneListTop from './OneListTop';
import MyStorage from '../util/MySorage';
import ServerApi from '../ServerApi';
import Ticker from '../view/Ticker'
import {BaseComponent} from "../view/BaseComponent";
let toast = NativeModules.ToastNative;
let {width, height} = constants.ScreenWH;
let key = 1;
let date= '0'; //请求的日期
let itemPageArr = []; //分页数组
let curPage= 0;//当前页数
// toast.show('Toast message',toast.SHORT,(message,count)=>{console.log("==",message,count)},(message,count)=>{console.log("++",message,count)})

class One extends Component{
    constructor(props){
        super(props);
        this.onMomentumScrollEnd=this.onMomentumScrollEnd.bind(this);
        this.onPullRelease=this.onPullRelease.bind(this);
        this.onScroll=this.onScroll.bind(this);
        this.state={
            curOneData: null,  //缓存当前页
            nextOneData: null, //缓存下一页
            animatedValue: new Animated.Value(0),
            showSearch: false,//是否显示搜索按钮
            showArrow: false,//是否显示箭头
            showDisplay:false,//是否显示大图
            showDate:'0',//显示的日期
            showGuide:false,//显示引导
        };
    }

    /**
     * 发起网络请求
     */
    componentDidMount() {
        //初始化数据库
        MyStorage.initStorage();
        //检查是否第一次打开
        MyStorage.loadByKey('isFirst',(result)=>{
            console.log("查询结果"+result);
        },(err)=>{
            //第一次打开，显示引导，刷新标记
           this.setState({
               showGuide:true
           });
            MyStorage.save('isFirst',false);
        });

        //检查界面渲染模式
        MyStorage.loadByKey('nightMode', (result) => {
            console.log("查询夜间模式" + result)
            constants.nightMode = result
        }, (err) => {
            //第一次设置，默认为正常模式
            MyStorage.save('nightMode', false)
        })

        this.loadPage();
    }

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
    }

    /**
     * 界面绘制
     * @returns {XML}
     */
    render() {
        return (
            <View >
                {this.renderNavBar()}
                <ScrollView horizontal={true} ref='sv_one' pagingEnabled={true}
                            scrollEnabled={true} showsHorizontalScrollIndicator={false}
                            onMomentumScrollEnd={this.onMomentumScrollEnd}>

                    {/*渲染分页*/}
                    {itemPageArr}

                </ScrollView>
                {this.renderDisplay()}

                <GuideView  isVisible={this.state.showGuide}
                            onCancel={() => {this.setState({showGuide: false})}}/>
            </View>
        );
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
                        onCancel={() => {this.setState({showDisplay: false})}}/>
        )
    }


    /**
     * 滚动回调
     * @private
     */
    onMomentumScrollEnd(e) {
        //水平方向偏移量
        let offset = e.nativeEvent.contentOffset.x
        console.log(':'+offset+'宽度'+width);
        //当前页数
        let currentPage = Math.round(offset / width)
        console.log(':'+currentPage+'缓存页数'+this.state.cachePage);
        //往后翻
        if (currentPage > curPage) {
            this.setState({
                showDate: DateUtil.getLastDate(this.state.showDate,currentPage-curPage)
            });
            console.log('往后翻:'+currentPage+'缓存页数'+this.state.cachePage);
            //添加下一页缓存
            if(currentPage === this.state.cachePage){
                console.log('添加下一页缓存');
                //设置当前页数
                this.setState({
                    curOneData: this.state.nextOneData,
                    cachePage: this.state.cachePage+1,
                });
                this.addPage(this.state.nextOneData.data);
                this.getOneList((result) => {
                    this.setState({
                        nextOneData: result,
                    });
                    this.addEmptyView();
                },false);
            }

        }
        else if(currentPage < curPage) {
            // console.log('往前翻');
            this.setState({
                showDate: DateUtil.getNextDate(this.state.showDate,curPage-currentPage)
            });
        }
        curPage=currentPage;
    }


    addEmptyView(){
        itemPageArr.push(
            <View key={key} style={{width:width,height:height}}/>
        );
        {
            key++
        }
    }

    addPage(oneData) {
        itemPageArr.pop();
        key--;
        itemPageArr.push(
            <PullScollView key={key} onPullRelease={this.onPullRelease} onScroll={this.onScroll}>

                {this.renderAllItem(oneData,key)}

            </PullScollView>
        );
        {
            key++
        }
    }

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
    }

    /**
     * 回到今天
     */
    backToday() {
        //获得scrollView
        let scrollView = this.refs.sv_one
        // console.log("offsetx:" + offsetx);
        scrollView.scrollResponderScrollTo({x: 0, y: 0, animated: true});
        curPage= 0;
        this.setState({
            showDate: constants.curDate
        });
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
                //取出每一条数据
                let data = oneData.content_list[i]
                //最顶部的摄影和一句话
                if (data.category === constants.CategoryGraphic) {
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
                else if (data.category === constants.CategoryMusic) {
                    itemArr.push(
                        <OneListMusic key={key} page={page} data={data} navigator={this.props.navigator} onShow={()=>{
                            this.setState({
                                refresh:true,
                            });
                        }}/>
                    );
                }
                //电影
                else if (data.category === constants.CategoryMovie) {
                    itemArr.push(
                        <OneListMovie key={key} data={data} navigator={this.props.navigator}/>
                    );
                }
                //电台
                else if (data.category === constants.CategoryRadio) {
                    itemArr.push(
                        <OneListAudio key={key} page={page} data={data} navigator={this.props.navigator} date={this.state.showDate}
                                      onShow={()=>{
                                          this.setState({
                                              refresh:true,
                                          });
                                      }}
                                      todayRadio={() => {
                                          toast.showMsg('今晚22:30主播在这里等你',toast.SHORT);
                                      }}/>
                    );
                }
                //排除广告的普通item
                else if (data.category !== constants.CategoryAd){
                    itemArr.push(
                        <OneListCommon key={key}
                                       navigator={this.props.navigator}
                                       data={data}/>
                    );
                }
                key++;
                if (i !== 0) {
                    itemArr.push(
                        <View key={key} style={[CommStyles.bottomLine, {backgroundColor: constants.nightMode ? constants.nightModeGrayDark : constants.itemDividerColor}]}/>
                    )
                } else {
                    itemArr.push(
                        <View key={key} style={[styles.menuLine, {backgroundColor: constants.nightMode ? constants.nightModeGrayDark : constants.itemDividerColor}]}/>
                    )
                }
                key++;
                if (key === 2) {
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
                    <View key={3} style={[styles.menuLine, {backgroundColor: constants.nightMode ? constants.nightModeGrayDark : constants.itemDividerColor}]}/>
                );
            }
            key++;
            // 渲染底部item
            itemArr.push(
                <OneListItemBottom key={key}/>
            );
            return itemArr;
        }
    }


    /**
     * 顶部导航bar
     */
    renderNavBar() {
        return (
            <View style={[CommStyles.outNav, { borderBottomColor: constants.nightMode ? constants.nightModeGrayLight:constants.bottomDivideColor ,backgroundColor: constants.nightMode ? constants.nightModeGrayLight:'white'}]}>
                {/*左边按钮*/}
                {this.renderToday()}


                {/*中间标题*/}
                <View style={CommStyles.centerTitle}>
                    {/*上面日期*/}
                    <View style={styles.date}>

                        <Ticker text={this.state.showDate === '0' ? '' : this.state.showDate.substring(0, 4)} textStyle={[styles.dateText, {color: constants.nightMode ? 'white':constants.normalTextColor}]} rotateTime={1000} />

                        <Text style={[styles.dividerText, {color: constants.nightMode ? 'white' : constants.normalTextColor}]}>{this.state.showDate === '0' ? '' : '    /    '}</Text>

                        <Ticker text={this.state.showDate === '0' ? '' : this.state.showDate.substring(5, 7)} textStyle={[styles.dateText, {color: constants.nightMode ? 'white':constants.normalTextColor}]} rotateTime={1000} />
                        <Text style={[styles.dividerText, {color: constants.nightMode ? 'white' : constants.normalTextColor}]}>{this.state.showDate === '0' ? '' : '    /    '}</Text>

                        <Ticker text={this.state.showDate === '0' ? '' : this.state.showDate.substring(8, 10)} textStyle={[styles.dateText, {color: constants.nightMode ? 'white':constants.normalTextColor}]} rotateTime={1000} />

                    </View>
                    {this.renderWeather()}

                </View>

                {this.renderSearch()}

            </View>
        );
    }

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
                <Text style={[styles.weatherText, {color: constants.nightMode ? 'white' : constants.normalTextLightColor}]}>
                    {this.state.curOneData === null ? '' : this.getWeatherInfo()}
                </Text>
            );
        }
    }

    /**
     * 搜索按钮绘制
     * @returns {XML}
     */
    renderSearch() {
        if (this.state.showSearch) {
            return (
                <TouchableOpacity style={CommStyles.rightBtn}
                                  onPress={() => this.pushToSearch()}>
                    <Image source={{uri: 'search_night'}} style={CommStyles.navRightBar}/>
                </TouchableOpacity>
            );
        }
    }

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
    }

    /**
     * 渲染左边今天按钮
     */
    renderToday() {
        if (curPage !== 0) {
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
    }

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
    }

    /**
     * 获取内容列表
     * @param onSuccess
     */
    getOneList(onSuccess, refresh) {
        console.log('请求date'+date);
        let requestDate;
        if(date === '0'){
            requestDate= '0';
        }else{
            if(refresh){
                requestDate= this.state.showDate;
            }else{
                requestDate= DateUtil.getLastDate(date);
            }
        }

        let url = ServerApi.OneList.replace('{date}',  requestDate);

        console.log('请求日期date'+requestDate);

        NetUtil.get(url, null, (result) => {
            if(!refresh){

                date= requestDate;
            }
            onSuccess(result);
        }, (error) => {
            toast.showMsg('error' + error,toast.SHORT)
        });
    }


    /**
     * 得到天气信息
     * @returns {string}
     */
    getWeatherInfo() {
        let cityName = this.state.curOneData.data.weather.city_name;
        let climate = this.state.curOneData.data.weather.climate;
        let temperature = this.state.curOneData.data.weather.temperature;
        return cityName + '  ' + climate + '  ' + temperature;
    }
}


const styles = StyleSheet.create({
    weatherText: {
        textAlign: 'center',
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
    dateText: {
        textAlign: 'center',
        fontSize: width * 0.05,
    },
    dividerText: {
        fontSize: width * 0.05,
    },
    menuLine: {
        height: width * 0.012,
        width: width
    },
    text: {
        fontSize: 30,
        fontWeight: 'bold',
    },
    refreshView: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: width * 0.5,
    },
    navLeftBar: {
        width: width * 0.05 * 2.15,
        height: width * 0.05,

    },
    leftBtn: {
        position: 'absolute',
        left: width * 0.038,
    },
});

export default OnePage = BaseComponent(One);
