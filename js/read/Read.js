/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow　阅读界面
 */

import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Platform,
    WebView,
    Image,
    NativeModules,
    ScrollView,
    FlatList,
    TouchableOpacity,
    Clipboard
} from 'react-native';
import constants from '../Constants';
import NetUtils from "../util/NetUtil";
import Login from '../login/Login';
import SingleChoiceDialog from '../view/SingleChoiceDialog';
import MusicControl from '../musiccontrol/MusicControl';
const VIEWABILITY_CONFIG = {
    minimumViewTime: 3000,
    viewAreaCoveragePercentThreshold: 100,
    waitForInteraction: true,
};

let toast = NativeModules.ToastNative;
var {width, height} = constants.ScreenWH;

var FrameAnimation = require('../view/FrameAnimationView');
var WEBVIEW_REF = 'webview';
var serverApi = require('../ServerApi');
var Share = require('../share/Share');

var Comment = require('./Comment');
var itemChoiceArr = [{"label": "拷贝", "value": "0"}, {"label": "举报", "value": "1"}];
const BaseScript =
    `
    (function () {
        var height = null;
        function changeHeight() {
          if (document.body.scrollHeight != height) {
            height = document.body.scrollHeight;
            if (window.postMessage) {
              window.postMessage(JSON.stringify({
                type: 'setHeight',
                height: height,
              }))
            }
          }
        }
        setInterval(changeHeight, 100);
    } ())
    `;

class Read extends Component{
    constructor(props){
        super(props);
        this.onScroll=this.onScroll.bind(this);
        this.renderRow=this.renderRow.bind(this);
        this.onNavigationStateChange=this.onNavigationStateChange.bind(this);
        this.onShouldStartLoadWithRequest=this.onShouldStartLoadWithRequest.bind(this);
        this.onMessage=this.onMessage.bind(this);
        this.state={
            like: false,
            likeNum: 0,
            readData: null,

            backButtonEnabled: false,
            forwardButtonEnabled: false,
            url: '',
            status: '',
            scalesPageToFit: true,
            bgColor: 'white',
            commentData: null,
            height: 0,
            isVisible: false,
            curItem: null,
            loading: true,
            showMusicControl:false,
        }
    }

    componentDidMount() {
        let url;
        if (this.props.route.params.entry == constants.AllRead) {
            url = this.getContentUrl().replace('{content_id}', this.props.route.params.contentId);
        } else {
            url = this.getContentUrl().replace('{content_id}', this.props.route.params.data.content_id);
        }
        console.log('当前文章地址' + url);
        NetUtils.get(url, null, (result) => {
            this.setState({
                readData: result.data,
                likeNum: result.data.praisenum,
            });
            let bgColor;
            if (result.data.category == 11) {
                bgColor = result.data.bg_color;
            } else {
                bgColor = 'white';
            }
            this.setState({
                bgColor: bgColor
            });
            // console.log(result);
        }, (error) => {
            console.log('error address' + error);
        });

    }

    /**
     * 获取评论
     */
    getComments() {
        let url;
        if (this.props.route.params.entry == constants.AllRead) {
            url = this.getCommentUrl().replace('{content_id}', this.props.route.params.contentId);
        } else {
            url = this.getCommentUrl().replace('{content_id}', this.props.route.params.data.content_id);
        }
        console.log('请求评论' + url);
        NetUtils.get(url, null, (result) => {
            this.setState({
                commentData: result.data.data
            });
            console.log(result);
        }, (error) => {
            console.log('error comment' + error);

        });
    }

    getCommentUrl() {
        let contentType;
        if (this.props.route.params.entry == constants.AllRead) {
            contentType = this.props.route.params.contentType;
        } else {
            contentType = this.props.route.params.data.content_type;
        }
        switch (parseInt(contentType)) {
            case 1:
                return serverApi.EssayComment;
                break;
            case 3:
                return serverApi.QuestionComment;
                break;
            case 2:
                return serverApi.SerialContentComment;
                break;
            case 4:
                return serverApi.MusicComment;
                break;
            case 5:
                return serverApi.MovieComment;
                break;
            case 8:
                return serverApi.RadioComment;
                break;
            case 11:
                return serverApi.TopicComment;
                break;
        }
    }

    getContentUrl() {
        let contentType;
        if (this.props.route.params.entry == constants.AllRead) {
            contentType = this.props.route.params.contentType;
        } else {
            contentType = this.props.route.params.data.content_type;
        }
        switch (parseInt(contentType)) {
            case 1:
                return serverApi.Essay;
            case 3:
                return serverApi.Question;
            case 2:
                return serverApi.SerialContent;
            case 4:
                return serverApi.Music;
            case 5:
                return serverApi.Movie;
            case 8:
                return serverApi.Radio;
            case 11:
                return serverApi.Topic;
        }
    }

    onMessage(event) {
        console.log('onMessage->event.nativeEvent.data:');
        console.log(event.nativeEvent.data);
        try {
            const action = JSON.parse(event.nativeEvent.data);
            if (action.type === 'setHeight' && action.height > 0 && this.state.height < height) {
                console.log('设置高度');
                this.setState({height: action.height})
            }
        } catch (error) {
            // pass
        }
    }

    render() {
        return (
            <View style={[styles.container, {backgroundColor: this.state.bgColor}]}>

                {this.renderNavBar()}
                <ScrollView style={{width: width, height: height - width * 0.1 - 0.08 * width}}
                            onScroll={this.onScroll}>
                    <WebView
                        ref={WEBVIEW_REF}
                        automaticallyAdjustContentInsets={true}
                        injectedJavaScript={BaseScript}
                        style={{
                            width: width,
                            height: this.state.height
                        }}
                        source={{html: this.state.readData === null ? '' : this.state.readData.html_content}}
                        javaScriptEnabled={true}
                        domStorageEnabled={true}
                        decelerationRate="normal"
                        onNavigationStateChange={this.onNavigationStateChange}
                        onShouldStartLoadWithRequest={this.onShouldStartLoadWithRequest}
                        startInLoadingState={true}
                        onMessage={this.onMessage}
                        scalesPageToFit={this.state.scalesPageToFit}
                        scrollEnabled={false}

                    />

                    {this.renderCommentList()}

                </ScrollView>



                {this.renderBottomBar()}
                {this.renderSingleChoiceDialog()}
                {this.renderLoading()}

                <MusicControl navigator={this.props.navigator} isVisible={this.state.showMusicControl} onCancel={()=>{
                    this.setState({
                        showMusicControl:false,
                    });
                }}/>

                {constants.renderAudioPlay(()=>{
                    this.setState({
                        showMusicControl:true,
                    });
                })}


            </View>
        );
    }

    /**
     * scrollview滑动回调
     */
    onScroll(event) {
        let y = event.nativeEvent.contentOffset.y;
        // console.log('滑动距离' + y);
        let height = event.nativeEvent.layoutMeasurement.height;
        // console.log('列表高度' + height);
        let contentHeight = event.nativeEvent.contentSize.height;
        // console.log('内容高度' + contentHeight);
        // console.log('判断条件' + (y + height));
        if (y + height >= contentHeight - 20) {
            console.log('加载更多');
            if (this.state.commentData == null) {
                this.getComments();
            }
        }
    }

    renderCommentList() {
        if (this.state.commentData !== null) {
            return (

                <View style={{width: width, position: 'relative', bottom: width * 0.22}}>
                    <FlatList
                        data={this.state.commentData}
                        renderItem={this.renderRow}
                        keyExtractor={(item, index) => item.id}
                        onViewableItemsChanged={(info) => {
                            console.log(info);
                        }}

                        viewabilityConfig={VIEWABILITY_CONFIG}
                    >
                        }

                    </FlatList>
                </View>
            );
        }
    }

    // 单个item返回 线性布局
    renderRow(rowData) {
        console.log(rowData);
        if (typeof(rowData) !== 'undefined') {
            return (
                <TouchableOpacity activeOpacity={1} onPress={() => {
                    this.setState({isVisible: true, curItem: rowData.item});
                }}>
                    <Comment data={rowData.item} bgColor={this.state.bgColor} navigator={this.props.navigator}/>

                </TouchableOpacity>
            )
        }
    }

    renderSingleChoiceDialog() {
        return (
            <SingleChoiceDialog
                isVisible={this.state.isVisible}
                dataSource={itemChoiceArr}
                onConfirm={(option) => {
                    this.doSelected(option)
                }}
                onCancel={() => {
                    this.setState({isVisible: false})
                }}
            />
        );
    }

    /**
     * 点击评论，选择弹窗后的回调
     * @param option
     */
    doSelected(option) {
        if (option.value == '1') {
            this.pushToLogin();
        } else {
            this.setClipboardContent();
        }
    }

    /**
     * 复制到剪贴板
     * @returns {Promise.<void>}
     */
    async setClipboardContent() {
        Clipboard.setString(this.state.curItem.content);
        try {
            var content = await Clipboard.getString();
            toast.showMsg('已复制到剪切板', toast.SHORT);
            this.setState({content: content});
        } catch (e) {
            this.setState({content: e.message});
        }
    }


    renderLoading() {
        return (
            <FrameAnimation
                loadingArr={this.getLoadingIcon()}
                width={width * 0.14} height={width * 0.14}
                loading={this.state.loading} style={{
                position: 'absolute',
                top: height * 0.4 - width * 0.07,
                left: width / 2 - width * 0.07
            }}/>
        );
    }

    onShouldStartLoadWithRequest(event) {
        // Implement any custom loading logic here, don't forget to return!
        return true;
    }

    onNavigationStateChange(navState) {
        this.setState({
            backButtonEnabled: navState.canGoBack,
            forwardButtonEnabled: navState.canGoForward,
            url: navState.url,
            status: navState.title,
            loading:navState.loading,
            scalesPageToFit: true
        });
    }

    /**
     * 渲染底部bar
     */
    renderBottomBar() {
        return (
            <View style={[styles.bottomView, {backgroundColor: this.state.bgColor}]}>

                <TouchableOpacity style={{position: 'absolute', left: width * 0.05,}}
                                  onPress={() => this.pushToLogin()}>
                    <Text style={styles.textInput}>写一个评论..</Text>
                </TouchableOpacity>

                <View style={styles.buttomBar}>
                    <TouchableOpacity
                        onPress={() => this.likeClick()}>
                        <Image source={{uri: this.showLikeIcon()}} style={styles.rightBtnIcon}/>
                    </TouchableOpacity>

                    {constants.renderlikeNum(this.state.likeNum)}

                    <TouchableOpacity style={styles.rightBtnIconCenter}
                                      onPress={() => {
                                      }}>

                        <Image source={{uri: 'bottom_comment'}} style={styles.rightBtnIcon}/>
                    </TouchableOpacity>

                    {this.renderCommentNum()}

                    {this.renderShare()}
                </View>
            </View>
        );
    }
    /**
     * 渲染顶部导航
     */
    renderNavBar() {
        return (
            // 顶部导航bar
            <View style={[styles.outNav, {backgroundColor: this.state.bgColor}]}>

                {/*左边按钮*/}
                <TouchableOpacity style={styles.leftBtn}
                                  onPress={() => {
                                      this.props.navigator.pop();
                                  }}>
                    <Image source={{uri: 'icon_back'}} style={styles.navLeftBar}/>
                </TouchableOpacity>

                <Text style={styles.title}>{this.getCategory()}</Text>

                <TouchableOpacity
                    onPress={() => this.pushToLogin()} style={{position: 'absolute', right: width * 0.032}}>
                    <Image source={{uri: 'stow_default'}} style={styles.rightBtn}/>
                </TouchableOpacity>
            </View>
        );
    }

    renderShare(){
        if(this.props.route.params.data!==undefined){
            return(
                <TouchableOpacity style={styles.rightBtnIconRight}
                                  onPress={() => this.pushToShare()}>

                    <Image source={{uri: 'share_image'}} style={styles.rightBtnIcon}/>
                </TouchableOpacity>
            );
        }
    }

    renderCommentNum() {
        if (this.state.readData != null && this.state.readData.commentnum > 0) {
            return (
                <Text style={{
                    position: 'relative',
                    left: width * 0.003,
                    bottom: width * 0.016,
                    fontSize: width * 0.024,
                    marginRight: width * 0.06,
                    color: '#A7A7A7'
                }}>
                    {this.state.readData.commentnum}
                </Text>
            );
        }
    }

    /**
     * 获取分类
     */
    getCategory() {
        let contentType;
        if (this.props.route.params.entry == constants.MenuRead) {
            var tag = this.props.route.params.data.tag;
            contentType = this.props.route.params.data.content_type;
            if (tag != null) {
                return tag.title;
            }
        }
        if (this.props.route.params.entry == constants.OneRead) {
            var tagList = this.props.route.params.data.tag_list;
            contentType = this.props.route.params.data.content_type;
            if (tagList != null && tagList.length > 0) {
                return tagList[0].title;
            }
        } else {
            contentType = this.props.route.params.contentType;
        }

        if (contentType == 1) {
            return '阅读';
        }
        else if (contentType == 3) {
            return '问答';
        }
        else if (contentType == 1) {
            return '阅读';
        }
        else if (contentType == 2) {
            return '连载';
        }
        else if (contentType == 4) {
            return '音乐';
        }
        else if (contentType == 5) {
            return '影视';
        }
        else if (contentType == 8) {
            return '电台';
        }
        else if (contentType == 11) {
            return '专题';
        }
    }

    /**
     * 跳转到分享
     * @param url
     */
    pushToShare() {
        console.log(this.props.route.params.data);
        this.props.navigator.push(
            {
                component: Share,
                title: '分享',
                params: {
                    showlink: true,
                    shareInfo: this.props.route.params.data.share_info,
                    shareList: this.props.route.params.data.share_list,
                }
            }
        )
    }

    /**
     * 载入图标名称初始化
     */
    getLoadingIcon() {
        var loadingArr=[];
        for (var i = 0; i < 30; i++) {
            var postfix;
            if(i<10){
                postfix='0'+i;
            }else{
                postfix=i;
            }
            loadingArr.push(('webview_loading_' + postfix).toString());
        }
        return loadingArr;
    }

    //点击喜欢
    likeClick() {
        this.setState({
            likeNum: this.state.like ? this.state.readData.praisenum : this.state.readData.praisenum + 1,
            like: !this.state.like
        });
    }

    //根据当前状态，显示喜欢图标
    showLikeIcon() {
        //喜欢
        if (this.state.like) {
            return 'bubble_liked';
        } else {
            return 'bubble_like';
        }
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
}
Read.defaultProps={
    duration: 10,
    // 外层回调函数参
    refreshView: false, //刷新
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    bottomView: {
        height: width * 0.14,
        width: width,
        position: 'absolute',
        bottom: 0,
        flexDirection: 'row',
        alignItems: 'center',
        borderTopColor: '#dddddd',
        borderTopWidth: 0.2
    },
    buttomBar: {
        height: width * 0.1,
        flexDirection: 'row',
        position: 'absolute',
        right: width * 0.05,
        alignItems: 'center'
    },
    textInput: {
        width: width * 0.36,
        height: width * 0.096,
        color: '#a8a8a8',
        borderRadius: width * 0.01,
        borderWidth: 1,
        borderColor: '#a6a6a6',
        backgroundColor: 'white',
        textAlignVertical: 'center',
        paddingLeft: width * 0.03
    },
    outNav: {
        height: Platform.OS == 'ios' ? height * 0.07 : height * 0.08,
        flexDirection: 'row',
        alignItems: 'center',
        width: width,
        justifyContent: 'center',
        borderBottomColor: '#dddddd',
        borderBottomWidth: constants.divideLineWidth
    },
    leftBtn: {
        position: 'absolute',
        left: width * 0.024,
    },
    navLeftBar: {
        width: height * 0.04,
        height: height * 0.05,
    },

    rightBtnIcon: {
        width: width * 0.06,
        height: width * 0.06,
    },

    rightBtn: {
        width: height * 0.035,
        height: height * 0.035,

    }
});

export default Read;
