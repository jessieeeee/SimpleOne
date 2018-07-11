/**
 * @author : JessieK
 * @email : lyj1246505807@gmail.com
 * @description : 搜索图文详情
 */
import React, {Component} from 'react';
import {
    View,
    TouchableOpacity,
    Text,
    Image,
    StyleSheet,
    ScrollView
} from 'react-native'
import NetUtils from "../util/NetUtil";
import CommStyles from "../CommStyles";
import constants from "../Constants";
import OneListTop from '../mainone/OneListTop';
import DisplayImg from '../display/DisplayImg';
import Share from "../share/Share";

let {width, height} = constants.ScreenWH;

class SearchHpDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            result: '',
            showDisplay: false,//是否显示大图
        }
    }

    componentDidMount() {
        this.getHpDetail();
    }

    /**
     * 获取图文详情
     */
    getHpDetail() {
        let url = 'http://v3.wufazhuce.com:8000/api/hp/feeds/' + this.props.route.params.contentId + '/';
        NetUtils.get(url, null, (result) => {
            console.log('result-----' + JSON.stringify(result.data));
            this.setState({
                result: result.data
            })
        })
    }

    /**
     * 跳转到分享
     * @param url
     */
    pushToShare(){

        this.props.navigator.push(
            {
                component: Share,
                title:'分享',
                params:{
                    showlink:true,
                    shareInfo:this.state.result.share_info,
                    shareList:this.state.result.share_list
                }
            }
        )
    }

    /**
     * 渲染顶部导航
     */
    renderNavBar() {
        return (
            // 顶部导航bar
            <View style={[CommStyles.outNav, { borderBottomColor: constants.nightMode ? constants.nightModeGrayLight:constants.bottomDivideColor,backgroundColor: constants.nightMode ? constants.nightModeGrayLight:'white'}]}>

                {/*左边按钮*/}
                <TouchableOpacity style={CommStyles.leftBack}
                                  onPress={() => this.props.navigator.pop()}>
                    <Image source={{uri: 'icon_back'}} style={CommStyles.navLeftBack}/>
                </TouchableOpacity>

                <Text
                    style={styles.title}>{this.state.result === '' ? '' : this.state.result.post_date.substring(0, 10)}</Text>

                {/*右边分享*/}
                <TouchableOpacity style={CommStyles.rightBtn}
                                  onPress={() => this.pushToShare()}>

                    <Image source={{uri: 'share_image'}} style={CommStyles.navRightBar}/>
                </TouchableOpacity>
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
                        onCancel={() => {
                            this.setState({showDisplay: false})
                        }}/>
        )
    }

    /**
     * 渲染内容
     */
    renderContent() {
        if (this.state.result !== '') {
            return (
                <OneListTop date={constants.curDate}
                            weather={this.state.result.weather}
                            data={this.state.result}
                            navigator={this.props.navigator}
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
            );
        }
    }

    render() {
        return (
            <View style={styles.container}>
                {this.renderNavBar()}
                <ScrollView style={{flex:1,backgroundColor:'white'}}>
                    {this.renderContent()}
                </ScrollView>
                {this.renderDisplay()}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },

    title: {
        fontSize: width * 0.04,
        color: '#414141',
        fontWeight: 'bold'
    },

});

export default SearchHpDetail;
