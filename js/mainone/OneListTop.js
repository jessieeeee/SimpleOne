/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 * 最顶部的item，摄影和一句话
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

import Toast, {DURATION} from 'react-native-easy-toast'

var Dimensions = require('Dimensions');
var {width, height} = Dimensions.get('window');
var DisplayImg=require('../display/DisplayImg');
var Remark=require('../remark/Remark');
var Login=require('../login/Login');
var Share=require('../share/Share');

var OneListTop = React.createClass({

    //初始化变量
    getInitialState() {
        return {
            like: false,
            originalW: 0,
            originalH: 0,
        }
    },

    //要传入的参数
    getDefaultProps() {
        return {
            topImgUrl: '顶部图片地址',
            title: '标题',
            picInfo: '标题竖线旁边的作者',
            forward: '下面的一句话',
            wordsInfo: '一句话下面的作者',
            likeNum: 0,
            topText:'',
            date:'',
            weather:'',
            shareInfo:null,
            shareList:null,
        }
    },

    /**
     * 发起网络请求
     */
    componentDidMount() {
        Image.getSize(this.props.topImgUrl, (width, height) => {
            this.setState({
                originalW:width,
                originalH:height
                }
            );
        });
    },

    //按图片宽度缩放
    getHeight(w, h){
        var ratio=width/w;
        return h*ratio;
    },

    //渲染
    render() {
        return (
            <View style={styles.container}>

                {/*顶部大图*/}
                <TouchableOpacity onPress={() => this.pushToDisplay()}>
                    <Image source={{uri: this.props.topImgUrl} } style={{  width: width,
                        height: this.getHeight(this.state.originalW,this.state.originalH),
                        }}/>
                </TouchableOpacity>
                {/*标题和作者*/}
                <Text style={styles.imgAuthor}>
                    {this.props.title + ' | ' + this.props.picInfo}
                </Text>
                {/*一句话*/}
                <Text style={styles.textForward}>
                    {this.props.forward}
                </Text>
                {/*一句话的作者*/}
                <Text style={styles.textAuthor}>
                    {this.props.wordsInfo}
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
                            }}>小记</Text>
                        </View>
                    </TouchableOpacity>

                    {/*右边按钮区域*/}
                    <View style={styles.rightBtn}>

                        <TouchableOpacity
                            onPress={() => this.likeClick()}>
                            <Image source={{uri: this.showLikeIcon()}} style={styles.rightBtnIconLeft}/>
                        </TouchableOpacity>

                        <Text style={{position:'relative',left:width * 0.003,bottom:width * 0.016,fontSize: width * 0.024, marginRight: width * 0.03,color:'#A7A7A7'}}>
                            {this.props.likeNum}
                        </Text>

                        <TouchableOpacity style={styles.rightBtnIconCenter}
                                          onPress={() => this.pushToLogin()}>

                            <Image source={{uri: 'stow_default'}} style={styles.rightBtnIconCenter}/>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.rightBtnIconRight}
                                          onPress={() => this.pushToShare()}>

                            <Image source={{uri: 'share_image'}} style={styles.rightBtnIconRight}/>
                        </TouchableOpacity>
                    </View>

                </View>

                <Toast
                    ref="toast"
                    style={{backgroundColor: 'gray'}}
                    position='top'
                    positionValue={height * 0.24}
                    textStyle={{color: 'white'}}
                />
            </View>
        );
    },

    /**
     * 跳转到大图
     * @param url
     */
    pushToDisplay(){

        this.props.navigator.push(
            {
                component: DisplayImg,
                title:'展示大图',
                params:{
                    topText:this.props.topText,
                    imgUrl:this.props.topImgUrl,
                    bottomText:this.props.title + ' | ' + this.props.picInfo,
                    originalW:this.state.originalW,
                    originalH:this.state.originalH

                }
            }
        )
    },


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
                    imgUrl:this.props.topImgUrl,
                    bottomText:this.props.title + ' | ' + this.props.picInfo,
                    forward:this.props.forward,
                    wordsInfo:this.props.wordsInfo,
                    originalW:this.state.originalW,
                    originalH:this.state.originalH
                }
            }
        )
    },



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
    },

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
                    shareInfo:this.props.shareInfo,
                    shareList:this.props.shareList
                }
            }
        )
    },
    //点击喜欢
    likeClick(){
        this.setState({
            like: !this.state.like
        });
    },

    //根据当前状态，显示喜欢图标
    showLikeIcon(){
        //喜欢
        if(this.state.like===true){
            return 'bubble_liked';
        }else{
            return 'bubble_like';
        }
    }
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    imgAuthor: {
        marginTop: width * 0.02,
        color: '#808080',
        fontSize: width * 0.035,
    },
    textForward: {
        width: width * 0.8,
        marginTop: width * 0.06,
        color: '#333333',
        fontSize: width * 0.04,
        lineHeight: parseInt(width * 0.08)
    },
    textAuthor: {
        marginTop: width * 0.08,
        color: '#808080',
        fontSize: width * 0.035,
    },
    bottomBtnsBar: {
        marginTop: width * 0.05,
        flexDirection: 'row',
        alignItems: 'center',
        width: width,
        height: Platform.OS == 'ios' ? height * 0.06 : height * 0.07,
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
    rightBtnIconLeft: {
        width: width * 0.045,
        height: width * 0.045,
    },
    rightBtnIconCenter: {
        marginRight: width * 0.1,
        width: width * 0.045,
        height: width * 0.045,
    },
    rightBtnIconRight: {
        width: width * 0.045,
        height: width * 0.045,
    },
});

module.exports = OneListTop;