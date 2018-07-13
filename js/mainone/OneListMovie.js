/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow 主界面分页－一个－视频item
 */

import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    Platform,
    TouchableOpacity
} from 'react-native';

import constants from '../Constants';
import DateUtil from "../util/DateUtil";
import Share from '../share/Share';
import Read from '../read/Read';
import CommStyles from "../CommStyles";
let {width, height} = constants.ScreenWH;
class OneListMovie extends Component{
    constructor(props){
        super(props);
        this.state={
            like: false,
            likeNum:this.props.data.like_count
        };
    }

    //渲染
    render() {
        return (
            <TouchableOpacity activeOpacity={1} onPress={() => this.pushToRead()}>
                <View style={[CommStyles.containerItem, {backgroundColor: constants.nightMode ? constants.nightModeGrayLight :'white'}]}>
                    <Text style={[CommStyles.categoryItem,{ color: constants.nightMode ? 'white' : constants.normalTextLightColor}]}>
                        - 影视 -
                    </Text>
                    {/*标题*/}
                    <Text style={[CommStyles.titleItem,{color: constants.nightMode ? 'white' : constants.normalTextColor}]}>{this.props.data.title}</Text>
                    {/*用户名*/}
                    <Text style={[styles.author,{color: constants.nightMode ? 'white' : constants.normalTextLightColor}]}>{this.getAuthor()}</Text>
                    <View style={styles.centerImgBg}>
                        <Image source={{uri: 'feeds_movie'}} style={{width: width * 0.9, height: width * 0.56,}}/>
                        {/*用户名下面的插图*/}
                        <Image source={{uri: this.props.data.img_url}} style={styles.centerImg}/>
                    </View>
                    {/*插图下面的那句话*/}
                    <Text style={[styles.forward,{color: constants.nightMode ? 'white' : constants.normalTextLightColor}]}>{this.props.data.forward}</Text>
                    <View style={{width:width}}>
                        {/*那句话右边的副标题*/}
                        <Text style={[styles.subtitle,{color: constants.nightMode ? 'white' : constants.normalTextLightColor}]}>{'-- 《' + this.props.data.subtitle + '》'}</Text>
                    </View>
                    {/*最下面的bar*/}
                    <View style={styles.bar}>
                        {/*左边的按钮*/}
                        <Text style={[CommStyles.dateItem,{color: constants.nightMode ? 'white' : constants.normalTextLightColor}]}>{DateUtil.showDate(this.props.data.post_date)}</Text>

                        {/*右边的按钮*/}
                        <View style={CommStyles.rightBtnItem}>
                            <View style={{flexDirection: 'row', justifyContent:'center', width: width * 0.1, marginRight: width * 0.03}}>
                                <TouchableOpacity
                                    onPress={() => this.likeClick()}>
                                    <Image source={{uri: this.showLikeIcon()}} style={CommStyles.barRightBtnsIconItem1}/>
                                </TouchableOpacity>

                                {constants.renderlikeNum(this.state.likeNum)}

                            </View>
                            <TouchableOpacity
                                onPress={() => this.pushToShare()}>
                                <Image source={{uri: 'share_image'}} style={CommStyles.barRightBtnsIconItem2}/>
                            </TouchableOpacity>
                        </View>
                    </View>

                </View>
            </TouchableOpacity>
        );
    }

    /**
     * 跳转到阅读页
     * @param url
     */
    pushToRead() {
        this.props.navigator.push(
            {
                component: Read,
                title:'阅读',
                params:{
                    data:this.props.data,
                    entry:constants.OneRead
                }
            }
        )
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
                    shareInfo:this.props.data.share_info,
                    shareList:this.props.data.share_list
                }
            }
        )
    }

    /**
     * 获取回答者
     * @returns {*}
     */
    getAuthor() {
        if (this.props.data.author.user_name !== undefined){
            let tempStr = this.props.data.author.user_name.split(' ');
            return '文 / ' + tempStr[0];
        } else {
            return '';
        }


    }

    /**
     * 点击喜欢
     */
    likeClick() {
        this.setState({
            likeNum: this.state.like?this.props.data.like_count:this.props.data.like_count + 1,
            like: !this.state.like
        });
    }

    /**
     * 根据当前状态，显示喜欢图标
     * @returns {*}
     */
    showLikeIcon() {
        //喜欢
        if (this.state.like) {
            return 'bubble_liked';
        } else {
            return 'bubble_like';
        }
    }
}

const styles = StyleSheet.create({

    subtitle: {
        fontSize: width * 0.038,
        position:'absolute',
        right:width * 0.05,
    },
    author: {
        width: width,
        marginTop: width * 0.03,
        paddingLeft: width * 0.05,
        fontSize: width * 0.038,
    },
    centerImgBg: {
        marginTop: width * 0.02,
        width: width * 0.9,
        height: width * 0.56,
        justifyContent: 'center',
        alignItems: 'center',
    },
    centerImg: {
        position:'absolute',
        top:width*0.046,
        width: width * 0.9,
        height: width * 0.47,
    },
    forward: {
        width: width,
        paddingLeft: width * 0.05,
        paddingRight: width * 0.05,
        marginTop: width * 0.02,
        fontSize: width * 0.038,
        lineHeight: parseInt(width * 0.08)
    },
    bar: {
        alignItems: 'center',
        marginTop: width * 0.15,
        flexDirection: 'row',
        width: width,
        height: Platform.OS == 'ios' ? height * 0.06 : height * 0.057,
    },

});

export default OneListMovie;
