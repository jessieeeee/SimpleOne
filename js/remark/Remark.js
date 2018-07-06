/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow 主界面分页-one顶部图片的小记
 */

import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    Platform,
    TextInput,
    ScrollView,
    NativeModules,
    TouchableOpacity
} from 'react-native';
import constants from '../Constants';
import DateUtil from "../util/DateUtil";
import Login from '../login/Login';
import ChangeImg from './ChangeImg';
import Share from '../share/Share';
import CommStyles from "../CommStyles";
let toast = NativeModules.ToastNative;
let {width, height} = constants.ScreenWH;

class Remark extends Component{
    constructor(props){
        super(props);
        this.state={
            curText: '<No Event>',
            prevText: '<No Event>',
            prev2Text: '<No Event>',
            imgUri: ''
        };
    }
    componentDidMount() {
        toast.showMsg('您可以修改图片和文字来创建自己的小记', toast.SHORT);
    }

    render() {
        return (

            <View style={styles.container}>
                {this.renderNavBar()}
                <ScrollView>
                    {/*中间标题*/}
                    <View style={CommStyles.centerTitle}>
                        {/*上面日期*/}
                        <View style={styles.date}>
                            <Text
                                style={styles.dateText}>{DateUtil.getNextDate(this.props.route.params.date).substring(0, 4)}</Text>
                            <Text style={styles.dividerText}>{'    /    '}</Text>
                            <Text
                                style={styles.dateText}>{DateUtil.getNextDate(this.props.route.params.date).substring(5, 7)}</Text>
                            <Text style={styles.dividerText}>{'    /    '}</Text>
                            <Text
                                style={styles.dateText}>{DateUtil.getNextDate(this.props.route.params.date).substring(8, 10)}</Text>
                        </View>
                        {/*下面天气*/}
                        <Text style={styles.weatherText}>
                            {this.getWeatherInfo()}
                        </Text>

                    </View>
                    <TouchableOpacity
                        onPress={() => {
                            this.pushToChangeImg()
                        }}>
                        {this.renderImg()}
                    </TouchableOpacity>
                    <Text style={styles.showText}>{this.props.route.params.bottomText}</Text>

                    <View style={styles.editView}>
                        <TextInput
                            underlineColorAndroid='transparent'
                            autoCapitalize="none"
                            multiline={true}
                            placeholder={this.props.route.params.forward}
                            autoCorrect={false}
                            onFocus={() => this.updateText('onFocus')}
                            onBlur={() => this.updateText('onBlur')}
                            onChange={(event) => this.updateText(
                                'onChange text: ' + event.nativeEvent.text
                            )}
                            onEndEditing={(event) => this.updateText(
                                'onEndEditing text: ' + event.nativeEvent.text
                            )}
                            onSubmitEditing={(event) => this.updateText(
                                'onSubmitEditing text: ' + event.nativeEvent.text
                            )}
                            style={styles.editRemark}/>
                    </View>
                    <Text
                        style={[styles.showText, {marginBottom: width * 0.14}]}>{this.props.route.params.wordsInfo}</Text>
                </ScrollView>
            </View>

        );
    }

    renderImg() {
        let uri = '';
        if (this.state.imgUri !== '') {
            uri = this.state.imgUri;
        } else {
            uri = this.props.route.params.imgUrl;
        }
        return (
            <Image style={{
                width: width,
                height: this.getHeight(this.props.route.params.originalW, this.props.route.params.originalH),
            }} source={{uri: uri}}/>
        );
    }

    updateText(text) {
        this.setState((state) => {
            return {
                curText: text,
                prevText: state.curText,
                prev2Text: state.prevText,
            };
        });
    }

    /**
     * 跳转到修改图片
     */
    pushToChangeImg() {
        this.props.navigator.push(
            {
                component: ChangeImg,
                title: '修改图片',
                params: {
                    response: this.changeImgResponse
                }
            }
        );
    }

    changeImgResponse(response) {
        console.log('receive = ', response);
        this.setState({
            imgUri: 'data:image/jpeg;base64,' + response.data
        });
    }

    /**
     * 跳转到分享
     * @param url
     */
    pushToShare() {

        this.props.navigator.push(
            {
                component: Share,
                title: '分享',
                params: {
                    showlink: true,
                    shareInfo: this.props.route.params.shareInfo,
                    shareList: this.props.route.params.shareList
                }
            }
        )
    }

    /**
     * 跳转到登录
     * @param url
     */
    pushToLogin() {

        this.props.navigator.push(
            {
                component: Login,
                title: '登录',
                params: {}
            }
        )
    }

    //按图片宽度缩放
    getHeight(w, h) {
        let ratio = width / w;
        return h * ratio;
    }

    /**
     * 渲染顶部导航
     */
    renderNavBar() {
        return (
            // 顶部导航bar
            <View style={[CommStyles.outNav, { borderBottomColor: constants.nightMode ? '#484848':'#dddddd',backgroundColor: constants.nightMode ? '#484848':'white'}]}>

                {/*左边按钮*/}
                <TouchableOpacity style={CommStyles.leftBack}
                                  onPress={() => this.props.navigator.pop()}>
                    <Image source={{uri: 'icon_back'}} style={CommStyles.navLeftBack}/>
                </TouchableOpacity>

                <Text style={styles.title}>小记</Text>

                <View style={styles.rightBtnBar}>
                    <TouchableOpacity
                        onPress={() => {
                            this.pushToLogin()
                        }}>
                        <Image style={styles.rightBtn1} source={{uri: 'bubble_save'}}/>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => this.pushToShare()}>
                        <Image style={styles.rightBtn2} source={{uri: 'share_image'}}/>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    /**
     * 得到天气信息
     * @returns {string}
     */
    getWeatherInfo() {
        let cityName = this.props.route.params.weather.city_name;
        let climate = this.props.route.params.weather.climate;
        return cityName + '  ' + climate;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'white',
    },
    showText: {
        fontSize: width * 0.032,
        textAlign: 'center',
        marginTop: width * 0.03,
    },
    editView: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: width * 0.07,
        marginLeft: width * 0.08,
        marginRight: width * 0.08,
        marginBottom: width * 0.012,
        borderRadius: width * 0.02,
        borderWidth: width * 0.002,
        borderColor: '#dddddd'
    },
    editRemark: {
        width: width * 0.82,
        height: width * 0.41,
        fontSize: width * 0.04,
        padding: 4,
        color: '#333333',
        backgroundColor: 'white',
    },
    weatherText: {
        textAlign: 'center',
        color: '#414141',
        fontSize: width * 0.028,
        position: 'absolute',
        bottom: width * 0.01
    },
    date: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: width * 0.01,
        height: height * 0.055,
    },
    dateText: {
        textAlign: 'center',
        fontSize: width * 0.056,
        color: '#525252',
    },

    title: {
        fontSize: width * 0.04,
        color: '#414141',
        fontWeight: 'bold'
    },
    rightBtn1: {
        width: height * 0.03,
        height: height * 0.04,
    },
    rightBtn2: {
        marginLeft: width * 0.05,
        width: height * 0.04,
        height: height * 0.04,
    },
    rightBtnBar: {
        position: 'absolute',
        right: width * 0.04,
        flexDirection: 'row'
    }
});

export default Remark;
