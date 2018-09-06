/**
 * @author : JessieK
 * @email : lyj1246505807@gmail.com
 * @description : one分页顶部bar
 */
import React, {Component} from 'react'
import constants from "../Constants"
import CommStyles from "../CommStyles"
import Ticker from '../view/Ticker'
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image
} from 'react-native'
import Search from "../search/Search"
import PropTypes from 'prop-types'

let {width, height} = constants.ScreenWH

class OneTopBar extends Component {

    static defaultProps = {
        showDate: '',
        showArrow: false,
        showSearch: false
    }

    static propTypes = {
        showDate: PropTypes.string,
        showArrow: PropTypes.bool,
        showSearch: PropTypes.bool,
        curOneData: PropTypes.object.isRequired,
        backToday: PropTypes.func,
    }

    render() {
        return (
            <View style={[CommStyles.outNav, {
                borderBottomColor: constants.nightMode ? constants.nightModeGrayLight : constants.bottomDivideColor,
                backgroundColor: constants.nightMode ? constants.nightModeGrayLight : 'white'
            }]}>
                {/*左边按钮*/}
                {this.renderToday()}


                {/*中间标题*/}
                <View style={CommStyles.centerTitle}>
                    {/*上面日期*/}
                    <View style={styles.date}>

                        <Ticker text={this.props.showDate === '0' ? '' : this.props.showDate.substring(0, 4)}
                                textStyle={[styles.dateText, {color: constants.nightMode ? 'white' : constants.normalTextColor}]}
                                rotateTime={1000}/>

                        <Text
                            style={[styles.dividerText, {color: constants.nightMode ? 'white' : constants.normalTextColor}]}>{this.props.showDate === '0' ? '' : '    /    '}</Text>

                        <Ticker text={this.props.showDate === '0' ? '' : this.props.showDate.substring(5, 7)}
                                textStyle={[styles.dateText, {color: constants.nightMode ? 'white' : constants.normalTextColor}]}
                                rotateTime={1000}/>
                        <Text
                            style={[styles.dividerText, {color: constants.nightMode ? 'white' : constants.normalTextColor}]}>{this.props.showDate === '0' ? '' : '    /    '}</Text>

                        <Ticker text={this.props.showDate === '0' ? '' : this.props.showDate.substring(8, 10)}
                                textStyle={[styles.dateText, {color: constants.nightMode ? 'white' : constants.normalTextColor}]}
                                rotateTime={1000}/>

                    </View>
                    {this.renderWeather()}

                </View>

                {this.renderSearch()}

            </View>
        )
    }

    /**
     * 天气绘制
     * @returns {XML}
     */
    renderWeather() {
        if (this.props.showArrow) {
            return (
                <Image source={{uri: 'triangle_down'}}
                       style={{position: 'absolute', bottom: width * 0.01, width: width * 0.03, height: width * 0.03}}/>
            )
        } else {
            return (
                <Text
                    style={[styles.weatherText, {color: constants.nightMode ? 'white' : constants.normalTextLightColor}]}>
                    {this.props.curOneData === null ? '' : this.getWeatherInfo()}
                </Text>
            )
        }
    }

    /**
     * 得到天气信息
     * @returns {string}
     */
    getWeatherInfo() {
        let cityName = this.props.curOneData.data.weather.city_name;
        let climate = this.props.curOneData.data.weather.climate;
        let temperature = this.props.curOneData.data.weather.temperature;
        return cityName + '  ' + climate + '  ' + temperature;
    }

    /**
     * 搜索按钮绘制
     * @returns {XML}
     */
    renderSearch() {
        if (this.props.showSearch) {
            return (
                <TouchableOpacity style={CommStyles.rightBtn}
                                  onPress={() => this.pushToSearch()}>
                    <Image source={{uri: 'search_night'}} style={CommStyles.navRightBar}/>
                </TouchableOpacity>
            )
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
        if (this.curPage !== 0) {
            return (
                <View style={styles.leftBtn}>
                    {/*左边按钮*/}
                    <TouchableOpacity
                        onPress={() => this.props.backToday && this.props.backToday()}>
                        <Image source={{uri: 'today'}} style={styles.navLeftBar}/>
                    </TouchableOpacity>
                </View>
            )
        }
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

    navLeftBar: {
        width: width * 0.05 * 2.15,
        height: width * 0.05,

    },
    leftBtn: {
        position: 'absolute',
        left: width * 0.038,
    },
})
export default OneTopBar