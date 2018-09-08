/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow　阅读界面
 */

import React, {Component} from 'react'
import {
    View,
    NativeModules,
    Clipboard
} from 'react-native'
import constants from '../Constants'
import NetUtils from "../util/NetUtil"
import {observer} from "mobx-react/native"
import SingleChoiceDialog from '../view/SingleChoiceDialog'
import ServerApi from '../ServerApi'
import {BaseComponent} from '../view/BaseComponent'
import StatusManager from '../util/StatusManager'
import ReadBottomBar from './ReadBottomBar'
import ReadTopBar from './ReadTopBar'
import ReadContent from './ReadContent'
import Login from '../login/Login'
let toast = NativeModules.ToastNative

let itemChoiceArr = [{"label": "拷贝", "value": "0"}, {"label": "举报", "value": "1"}]

@observer
class Read extends Component {
    constructor(props) {
        super(props)
        // 初始化状态界面管理器
        this.statusManager = new StatusManager()
        this.state = {
            like: false,
            likeNum: 0,
            readData: null,
            backButtonEnabled: false,
            forwardButtonEnabled: false,
            url: '',
            status: '',
            bgColor: 'white',
            commentData: null,
            isVisible: false,
            curItem: null,
            loading: true,
        }
        this.likeClick = this.likeClick.bind(this)
        this.clickItem = this.clickItem.bind(this)
        this.getComments = this.getComments.bind(this)
        this.loadEnd = this.loadEnd.bind(this)
    }

    componentWillUnmount(){
        this.isMount = false
    }

    likeClick(){
        this.setState({
            likeNum: this.state.like ? this.state.readData.praisenum : this.state.readData.praisenum + 1,
            like: !this.state.like
        })
    }

    /**
     * 刷新内容
     */
    retry() {
        this.getArtical()
    }


    componentDidMount() {
        this.isMount = true
        this.getArtical()
    }

    /**
     * 获取文章内容
     */
    getArtical(){
        let url
        if (this.props.route.params.entry === constants.AllRead) {
            url = this.getContentUrl().replace('{content_id}', this.props.route.params.contentId)
        } else {
            url = this.getContentUrl().replace('{content_id}', this.props.route.params.data.content_id)
        }
        console.log('当前文章地址' + url)
        this.props.request(url, null, this.statusManager, (result) => {
            if (this.isMount){
                this.setState({
                    readData: result.data,
                    likeNum: result.data.praisenum,
                })
                let bgColor
                if (result.data.category === constants.CategoryReadBg) {
                    bgColor = result.data.bg_color
                } else {
                    bgColor = 'white'
                }
                this.setState({
                    bgColor: bgColor
                })
            }
        }, (error) => {
            console.log('error address' + error)
        }, true)

    }

    /**
     * 获取评论
     */
    getComments() {
        let url
        if (this.props.route.params.entry === constants.AllRead) {
            url = this.getCommentUrl().replace('{content_id}', this.props.route.params.contentId)
        } else {
            url = this.getCommentUrl().replace('{content_id}', this.props.route.params.data.content_id)
        }
        console.log('请求评论' + url)
        NetUtils.get(url, null, (result) => {
            if(this.isMount){
                this.setState({
                    commentData: result.data.data
                })
                console.log(result)
            }
            // console.log(result);
        }, (error) => {
            console.log('error comment' + error)
        })

    }

    getCommentUrl() {
        let contentType
        if (this.props.route.params.entry === constants.AllRead) {
            contentType = this.props.route.params.contentType
        } else {
            contentType = this.props.route.params.data.content_type
        }
        switch (parseInt(contentType)) {
            case 1:
                return ServerApi.EssayComment
            case 3:
                return ServerApi.QuestionComment
            case 2:
                return ServerApi.SerialContentComment
            case 4:
                return ServerApi.MusicComment
            case 5:
                return ServerApi.MovieComment
            case 8:
                return ServerApi.RadioComment
            case 11:
                return ServerApi.TopicComment
        }
    }

    getContentUrl() {
        let contentType
        if (this.props.route.params.entry === constants.AllRead) {
            contentType = this.props.route.params.contentType
        } else {
            contentType = this.props.route.params.data.content_type
        }
        switch (parseInt(contentType)) {
            case 1:
                return ServerApi.Essay
            case 3:
                return ServerApi.Question
            case 2:
                return ServerApi.SerialContent
            case 4:
                return ServerApi.Music
            case 5:
                return ServerApi.Movie
            case 8:
                return ServerApi.Radio
            case 11:
                return ServerApi.Topic
        }
    }

    clickItem(rowData) {
        this.setState({isVisible: true, curItem: rowData.item})
    }

    loadEnd(navState){
        this.setState({
            loading: navState.loading
        })
    }

    renderNormal(){
        return (
            <View style={{flex:1}}>
                <ReadContent clickItem={this.clickItem}
                             bgColor={this.state.bgColor}
                             readData={this.state.readData}
                             commentData={this.state.commentData}
                             getComments={this.getComments}
                             loadEnd={this.loadEnd}/>
                <ReadBottomBar route={this.props.route}
                               navigator={this.props.navigator}
                               likeNum ={this.state.likeNum}
                               readData={this.state.readData}
                               like={this.state.like}
                               likeClick={this.likeClick}/>
                {this.renderSingleChoiceDialog()}
                {constants.renderLoading(this.state.loading)}
            </View>
        )
    }

    render() {
        return (
            <View style={{ flex: 1 ,backgroundColor: this.state.bgColor}}>
                <ReadTopBar route={this.props.route}
                            navigator={this.props.navigator}
                            bgColor={this.state.bgColor}/>
                <View style={{flex:1}}>
                {/*渲染正常界面*/}
                {this.renderNormal() }
                {/*渲染状态界面*/}
                {this.props.displayStatus(this.statusManager)}
                </View>
            </View>
        )
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
        )
    }

    /**
     * 点击评论，选择弹窗后的回调
     * @param option
     */
    doSelected(option) {
        if (option.value === '1') {
            this.pushToLogin()
        } else {
            this.setClipboardContent()
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

    /**
     * 复制到剪贴板
     * @returns {Promise.<void>}
     */
    async setClipboardContent() {
        Clipboard.setString(this.state.curItem.content)
        try {
            let content = await Clipboard.getString()
            toast.showMsg('已复制到剪切板', toast.SHORT)
            this.setState({content: content})
        } catch (e) {
            this.setState({content: e.message})
        }
    }
}

export default ReadPage = BaseComponent(Read)
