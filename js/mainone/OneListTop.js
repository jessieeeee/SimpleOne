/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow 最顶部的item，摄影和一句话
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
import Remark from '../remark/Remark';
import Login from '../login/Login';
import constants from '../Constants';
import Share from '../share/Share';
var {width, height} = constants.ScreenWH;

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
            <View style={styles.container}>

                {/*顶部大图*/}
                <TouchableOpacity onPress={() => this.pushToDisplay()}>
                    <Image source={{uri: this.props.data.img_url} } style={{  width: width,
                        height: this.getHeight(this.state.originalW,this.state.originalH),
                    }}/>
                </TouchableOpacity>
                {/*标题和作者*/}
                <Text style={styles.imgAuthor}>
                    {this.props.data.title + ' | ' + this.props.data.pic_info}
                </Text>
                {/*一句话*/}
                <Text style={styles.textForward}>
                    {this.props.data.forward}
                </Text>
                {/*一句话的作者*/}
                <Text style={styles.textAuthor}>
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
                            }}>小记</Text>
                        </View>
                    </TouchableOpacity>

                    {/*右边按钮区域*/}
                    <View style={styles.rightBtn}>

                        <TouchableOpacity
                            onPress={() => this.likeClick()}>
                            <Image source={{uri: this.showLikeIcon()}} style={styles.rightBtnIconLeft}/>
                        </TouchableOpacity>

                        {this.renderlikeNum()}

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

            </View>
        );
    }

    /**
     * 渲染喜欢数量
     */
    renderlikeNum(){
        if(this.state.likeNum>0){
            return(
                <Text style={{position:'relative',left:width * 0.003,bottom:width * 0.016,fontSize: width * 0.024, color:'#A7A7A7'}}>
                    {this.state.likeNum}
                </Text>
            );
        }
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

export default OneListTop;