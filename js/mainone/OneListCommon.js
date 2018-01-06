/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 *
 * 大多数item 除广告和顶部item
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
import DateUtil from "../util/DateUtil";
import Toast, {DURATION} from 'react-native-easy-toast'

var Dimensions = require('Dimensions');
var {width, height} = Dimensions.get('window');
var Share=require('../share/Share');

var OneListCommon = React.createClass({

    //初始化变量
    getInitialState() {
        return {
            like: false
        }
    },

    //要传入的参数
    getDefaultProps() {
        return {
            category: 1,
            userName: '谁答',
            title: '标题',
            imgUrl: '谁答下面的插图',
            forward: '插图下面的一句话',
            postDate: '发布的日期',
            likeNum: 0,
            tagTitle: '',
            shareInfo:null,
            shareList:null,
        }
    },

    //渲染
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.category}>{this.getCategory()}</Text>
                {/*标题*/}
                <Text style={styles.title}>{this.props.title}</Text>
                {/*回答者*/}
                <Text style={styles.author}>{this.getAuthor()}</Text>
                {/*回答者下面的插图*/}
                <Image source={{uri: this.props.imgUrl}} style={styles.centerImg}/>
                {/*插图下面的那句话*/}
                <Text style={styles.forward}>{this.props.forward}</Text>
                {/*最下面的bar*/}
                <View style={styles.bar}>
                    {/*左边的按钮*/}
                    <Text style={styles.date}>{DateUtil.showDate(this.props.postDate)}</Text>

                    {/*右边的按钮*/}
                    <View style={styles.rightBtn}>
                        <View style={{flexDirection: 'row' ,width:width * 0.1 ,marginRight: width * 0.03}}>
                        <TouchableOpacity
                            onPress={() => this.likeClick()}>
                            <Image source={{uri: this.showLikeIcon()}} style={styles.barRightBtnsIcon1}/>
                        </TouchableOpacity>

                            {this.renderlikeNum()}

                        </View>
                        <TouchableOpacity
                            onPress={() => this.pushToShare()}>
                            <Image source={{uri: 'share_image'}} style={styles.barRightBtnsIcon2}/>
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
    /**
     * 渲染喜欢数量
     */
    renderlikeNum(){
       if(this.props.likeNum>0){
           return(
           <Text style={{position:'relative',left:width * 0.003,bottom:width * 0.016,fontSize: width * 0.024,color:'#A7A7A7'}}>
               {this.props.likeNum}
           </Text>
           );
       }
    },

    /**
     * 显示分类
     */
    getCategory(){
        if(this.props.tagTitle!==''){
            return '- '+this.props.tagTitle+' -';
        }
        else if(this.props.category==1){
            return '- 阅读 -';
        }
        else if(this.props.category==2){
            return '- 连载 -';
        }
        else if(this.props.category==3){
            return '- 问答 -';
        }

    },

    /**
     * 获取回答者
     * @returns {*}
     */
    getAuthor() {
        var tempStr = new Array();
        tempStr = this.props.userName.split(' ');
        if(this.props.category==1){
           return '文 / '+tempStr[0];
        }
        return tempStr[0];
    },



    /**
     * 点击喜欢
     */
    likeClick(){
        this.setState({
            like: !this.state.like
        });
    },

    /**
     * 根据当前状态，显示喜欢图标
     * @returns {*}
     */
    showLikeIcon(){
        //喜欢
        if(this.state.like===true){
            return 'bubble_liked';
        }else{
            return 'bubble_like';
        }
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
    category:{
        marginTop: width * 0.03,
        fontSize: width * 0.032,
        color: '#8B8B8B'
    },
    title: {
        fontSize: width*0.056,
        color: '#333333',
        width: width,
        paddingLeft: width*0.05,
        marginTop: width* 0.03,
    },
    author: {
        width: width,
        marginTop: width * 0.03,
        paddingLeft: width*0.05,
        fontSize: width*0.038,
        color: '#808080'
    },
    centerImg: {
        marginTop: width * 0.02,
        width: width * 0.9,
        height: width * 0.52,
    },
    forward: {
        width: width,
        paddingLeft: width*0.05,
        paddingRight: width*0.05,
        marginTop: width * 0.02,
        fontSize: width*0.038,
        color: '#808080',
        lineHeight: parseInt(width * 0.08)
    },
    bar: {
        alignItems:'center',
        marginTop: width * 0.06,
        flexDirection: 'row',
        width: width,
        height: Platform.OS == 'ios' ? height * 0.06 : height * 0.057,
    },
    date: {

        fontSize: 12,
        color: '#B6B6B6',
        flexDirection: 'row',
        position: 'absolute',
        left: width * 0.05,
    },
    rightBtn: {
        flexDirection: 'row',
        position: 'absolute',
        right: width * 0.05,
    },
    barRightBtnsIcon1: {
        width: width * 0.045,
        height: width * 0.045,
    },
    barRightBtnsIcon2: {
        width: width * 0.045,
        height: width * 0.045,

    },

});

module.exports = OneListCommon;
