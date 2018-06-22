/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow 分享界面
 */

import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Platform,
    Image,
    NativeModules,
    ScrollView,
    TouchableOpacity,
    Clipboard,
} from 'react-native';
import constants from '../Constants';
import CommStyles from "../CommStyles";
let toast = NativeModules.ToastNative;
let {width, height} = constants.ScreenWH;
let UShare = NativeModules.UShare;

class Share extends Component{
    constructor(props){
        super(props);
        this.state={
            content: 'Content will appear here',
        };
    }
    
    render() {
        return (
            <View style={styles.container}>
                {this.renderNavBar()}
                <ScrollView showsVerticalScrollIndicator={false}>
                    <TouchableOpacity onPress={() => this.platformShare(constants.PlatformWeChatMoments)}>
                        <Image source={{uri: 'bubble_moment'}} style={[styles.shareIcon, {marginTop: width * 0.01}]}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.platformShare(constants.PlatformWeChat)}>
                        <Image source={{uri: 'bubble_wechat'}} style={styles.shareIcon}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.platformShare(constants.PlatformQQ)}>
                        <Image source={{uri: 'bubble_qq'}} style={styles.shareIcon}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.platformShare(constants.PlatformSina)}>
                        <Image source={{uri: 'bubble_weibo'}} style={styles.shareIcon}/>
                    </TouchableOpacity>
                    {this.showLink()}
                </ScrollView>
            </View>
        );
    }

    /**
     * 调起原生分享模块
     * @param platform
     */
    platformShare(platform) {
        let title='',content='',image='',url='';
        if(this.props.route.params.shareList !== undefined){
            let data;
            switch(platform){
                case constants.PlatformWeChatMoments:
                    data=this.props.route.params.shareList.wx_timeline;
                    break;
                case constants.PlatformWeChat:
                    data=this.props.route.params.shareList.wx;
                    break;
                case constants.PlatformSina:
                    data=this.props.route.params.shareList.weibo;
                    break;
                case constants.PlatformQQ:
                    data=this.props.route.params.shareList.qq;
                    break;
            }
            if(data.title==null||data.title === ""){
                title=this.props.route.params.shareInfo.title;
            }else{
                title=data.title;
            }
            if(data.desc==null||data.desc === ""){
                content=this.props.route.params.shareInfo.content;
            }else{
                content=data.desc;
            }
            if(data.imgUrl==null||data.imgUrl === ""){
                image=this.props.route.params.shareInfo.image;
            }else{
                image=data.imgUrl;
            }
            if(data.link==null||data.link === ""){
                url=this.props.route.params.shareInfo.url;
            }else{
                url=data.link;
            }

        }

        UShare.share(platform,title ,content ,
            image,url,
            (platform) => {
                console.log(platform + '成功');
            },
            (platform, msg) => {
                console.log(platform + '失败' + msg);
                toast.showMsg(msg,toast.SHORT);
            },
            (platform) => {
                console.log(platform + '取消');
            });
    }

    /**
     * 复制到剪贴板
     * @returns {Promise.<void>}
     */
    async setClipboardContent() {
        if(this.props.route.params.shareInfo!==undefined){
            Clipboard.setString(this.props.route.params.shareInfo.url);
            try {
                let content = await Clipboard.getString();
                this.setState({content: content});
                toast.showMsg('已复制到剪切板',toast.SHORT);
            } catch (e) {
                this.setState({content: e.message});
            }
        }else{
            toast.showMsg('当前内容不支持分享',toast.SHORT);
        }
    }

    showLink() {
        if (this.props.route.params.showlink) {
            return (
                <TouchableOpacity onPress={() => this.setClipboardContent()}>
                    <Image source={{uri: 'bubble_copy_link'}} style={styles.shareIcon}/>
                </TouchableOpacity>
            );
        }
    }


    /**
     * 渲染顶部导航
     */
    renderNavBar() {
        return (
            // 顶部导航bar
            <View style={CommStyles.outNav2}>
                <View style={styles.rightBtnBar}>
                    <TouchableOpacity onPress={() => this.props.navigator.pop()}>
                        <Image style={styles.rightBtn} source={{uri: 'close_gray'}}/>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#fafafa',
    },

    rightBtn: {
        width: height * 0.031,
        height: height * 0.031,
    },

    rightBtnBar: {
        position: 'absolute',
        right: width * 0.04,
        flexDirection: 'row'
    },

    shareIcon: {
        width: height * 0.06,
        height: height * 0.06,
        marginBottom: width * 0.16
    }
});

export default Share;
