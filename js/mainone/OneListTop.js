/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow 最顶部的item，摄影和一句话
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity
} from 'react-native';
import Remark from '../remark/Remark';
import Login from '../login/Login';
import constants from '../Constants';
import Share from '../share/Share';
import CommStyles from "../CommStyles";
let {width, height} = constants.ScreenWH;

class OneListTop extends Component{
    constructor(props){
        super(props);
        this.state={
            like: false,
            likeNum:this.props.data.like_count,
            originalW: 0,
            originalH: 0,
        };
    }

    /**
     * 发起网络请求
     */
    componentDidMount() {
        Image.getSize(this.props.data.img_url, (width, height) => {
            this.setState({
                    originalW:width,
                    originalH:height
                }
            );
        });
    }

    //按图片宽度缩放
    getHeight(w, h){
        var ratio=width/w;
        return h*ratio;
    }

    //渲染
    render() {
        return (
            <View style={[CommStyles.containerItem, {backgroundColor: constants.nightMode ? constants.nightModeGrayLight :'white'}]}>

                {/*顶部大图*/}
                <TouchableOpacity onPress={() => this.pushToDisplay()}>
                    <Image source={{uri: this.props.data.img_url} } style={{  width: width,
                        height: this.getHeight(this.state.originalW,this.state.originalH),
                    }}/>
                </TouchableOpacity>
                {/*标题和作者*/}
                <Text style={[CommStyles.imgAuthor,{ color: constants.nightMode ? 'white' : constants.normalTextLightColor}]}>
                    {this.props.data.title + ' | ' + this.props.data.pic_info}
                </Text>
                {/*一句话*/}
                <Text style={[styles.textForward,{color: constants.nightMode ? 'white' : constants.normalTextColor}]}>
                    {this.props.data.forward}
                </Text>
                {/*一句话的作者*/}
                <Text style={[CommStyles.textAuthor,{ color: constants.nightMode ? 'white' : constants.normalTextLightColor}]}>
                    {this.props.data.words_info}
                </Text>
                {/*底部小按钮bar*/}
                <View style={styles.bottomBtnsBar}>
                    {/*左边按钮区域*/}

                    <TouchableOpacity style={styles.leftBtn}
                                      onPress={() => this.pushToRemark()}>
                        <View style={{flexDirection: 'row', width: width * 0.2, alignItems: 'center'}}>
                            <Image source={{uri: 'bubble_diary'}} style={styles.bottomBtnsBarIcon}/>
                            <Text style={{
                                fontSize: width * 0.034,
                                marginLeft: width * 0.01,
                                color: constants.nightMode ? 'white' : constants.normalTextLightColor
                            }}>小记</Text>
                        </View>
                    </TouchableOpacity>

                    {/*右边按钮区域*/}
                    <View style={styles.rightBtn}>
                        <View style={{flexDirection: 'row', justifyContent:'center', width: width * 0.2}}>
                        <TouchableOpacity
                            onPress={() => this.likeClick()}>
                            <Image source={{uri: this.showLikeIcon()}} style={styles.rightBtnIcon} />
                        </TouchableOpacity>

                        {constants.renderlikeNum(this.state.likeNum)}
                        </View>
                        <TouchableOpacity onPress={() => this.pushToLogin()}>
                            <Image source={{uri: 'stow_default'}} style={[styles.rightBtnIcon,{marginRight: width * 0.04}]}/>
                        </TouchableOpacity>

                        <TouchableOpacity
                                          onPress={() => this.pushToShare()}>

                            <Image source={{uri: 'share_image'}} style={styles.rightBtnIcon}/>
                        </TouchableOpacity>
                    </View>

                </View>

            </View>
        );
    }

    /**
     * 跳转到大图
     * @param url
     */
    pushToDisplay(){
        // topText:this.props.data.volume,
        // imgUrl:this.props.data.img_url,
        //   bottomText:this.props.data.title + ' | ' + this.props.data.pic_info,
        //   originalW:this.state.originalW,
        //   originalH:this.state.originalH
        this.props.clickDisplay(
            this.props.data.volume,
            this.props.data.img_url,
            this.props.data.title + ' | ' + this.props.data.pic_info,
            this.state.originalW,
            this.state.originalH);
    }

    /**
     * 跳转到小记
     * @param url
     */
    pushToRemark(){

        this.props.navigator.push(
            {
                component: Remark,
                title:'小记',
                params:{
                    date:this.props.date,
                    weather:this.props.weather,
                    imgUrl:this.props.data.img_url,
                    bottomText:this.props.data.title + ' | ' + this.props.data.pic_info,
                    forward:this.props.data.forward,
                    wordsInfo:this.props.data.words_info,
                    originalW:this.state.originalW,
                    originalH:this.state.originalH,
                    shareInfo:this.props.data.share_info,
                    shareList:this.props.data.share_list
                }
            }
        )
    }


    /**
     * 跳转到登录
     * @param url
     */
    pushToLogin(){

        this.props.navigator.push(
            {
                component: Login,
                title:'登录',
                params:{

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


    //点击喜欢
    likeClick(){
        this.setState({
            likeNum: this.state.like?this.props.data.like_count:this.props.data.like_count + 1,
            like: !this.state.like
        });
    }

    //根据当前状态，显示喜欢图标
    showLikeIcon(){
        //喜欢
        if(this.state.like){
            return 'bubble_liked';
        }else{
            return 'bubble_like';
        }
    }
}


const styles = StyleSheet.create({
    imgAuthor: {
        marginTop: width * 0.02,
        fontSize: width * 0.035,
    },
    textForward: {
        width: width * 0.8,
        marginTop: width * 0.06,
        fontSize: width * 0.04,
        lineHeight: parseInt(width * 0.08)
    },
    textAuthor: {
        marginTop: width * 0.08,
        fontSize: width * 0.035,
    },
    bottomBtnsBar: {
        marginTop: width * 0.05,
        flexDirection: 'row',
        alignItems: 'center',
        width: width,
        height: height * 0.07,
    },
    leftBtn: {
        flexDirection: 'row',
        position: 'absolute',
        left: width * 0.04,
    },
    rightBtn: {
        flexDirection: 'row',
        position: 'absolute',
        right: width * 0.04,
    },
    bottomBtnsBarIcon: {
        width: width * 0.06,
        height: width * 0.06,
    },
    rightBtnIcon: {
        width: width * 0.045,
        height: width * 0.045,
    },
});

export default OneListTop;