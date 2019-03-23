import React, {Component} from 'react'
import {WebView, ScrollView, View, FlatList, TouchableOpacity} from 'react-native'
import constants from '../Constants'
let {width, height} = constants.ScreenWH
import PropTypes from 'prop-types'
import Comment from './Comment'
import Config from'./Config'
let WEBVIEW_REF = 'webview'
const VIEWABILITY_CONFIG = {
    minimumViewTime: 3000,
    viewAreaCoveragePercentThreshold: 100,
    waitForInteraction: true,
}
class ReadContent extends Component {

    static defaultProps = {
        bgColor: '',
        readData: null,
        commentData: null
    }

    static propTypes = {
        bgColor: PropTypes.string,
        readData: PropTypes.object,
        commentData: PropTypes.array,
        clickItem: PropTypes.func,
        getComments: PropTypes.func,
        loadEnd: PropTypes.func
    }

    constructor(props){
        super(props)
        this.onMessage = this.onMessage.bind(this)
        this.onScroll = this.onScroll.bind(this)
        this.renderRow = this.renderRow.bind(this)
        this.onNavigationStateChange = this.onNavigationStateChange.bind(this)
        this.onShouldStartLoadWithRequest = this.onShouldStartLoadWithRequest.bind(this)
        this.state = {
            height: 0,
            scalesPageToFit: true,
        }
    }

    componentDidMount(){
        this.isMount = true

    }

    componentWillUnmount(){
        this.isMount = false
    }

    render() {
        console.log(this.props.readData)
       return (
           <ScrollView style={{
               width: width,
               height: height - width * 0.1 - 0.08 * width,
               backgroundColor: constants.nightMode ? constants.nightModeGrayLight : this.props.bgColor
           }} onScroll={this.onScroll}>
               <WebView
                   ref={WEBVIEW_REF}
                   automaticallyAdjustContentInsets={true}
                   injectedJavaScript={constants.nightMode ? Config.BaseScriptChangeColor : Config.BaseScript}
                   style={{
                       width: width,
                       height: this.state.height,
                       backgroundColor: constants.nightMode ? constants.nightModeGrayLight :this.props.bgColor
                   }}
                   source={{html: !this.props.readData ? '' : this.props.readData.html_content}}
                   javaScriptEnabled={true}
                   domStorageEnabled={true}
                   decelerationRate="normal"
                   onLoad={(e) => console.log('onLoad')}
                   onNavigationStateChange={this.onNavigationStateChange}
                   onShouldStartLoadWithRequest={this.onShouldStartLoadWithRequest}
                   startInLoadingState={true}
                   onMessage={this.onMessage}
                   scalesPageToFit={this.state.scalesPageToFit}
                   scrollEnabled={false}
               />

               {this.renderCommentList()}

           </ScrollView>
       )
    }

    onMessage(event) {
        console.log('onMessage->event.nativeEvent.data:')
        console.log(event.nativeEvent.data)
        try {
            const action = JSON.parse(event.nativeEvent.data)
            if (this.isMount && action.type === 'setHeight' && action.height > 0 && this.state.height < height) {
                console.log('设置高度')
                this.setState({height: action.height})
            }
        } catch (error) {
            // pass
        }
    }

    renderCommentList() {
        if (this.props.commentData) {
            return (
                <View style={{width: width, position: 'relative', bottom: width * 0.22}}>
                    <FlatList
                        data={this.props.commentData}
                        renderItem={this.renderRow}
                        keyExtractor={(item, index) => item.id}
                        onViewableItemsChanged={(info) => {
                            console.log(info)
                        }}
                        viewabilityConfig={VIEWABILITY_CONFIG}>


                    </FlatList>
                </View>
            )
        }
    }


    // 单个item返回 线性布局
    renderRow(rowData) {
        console.log(rowData)
        if (typeof(rowData) !== 'undefined') {
            return (
                <TouchableOpacity activeOpacity={1} onPress={() => this.props.clickItem(rowData)}>
                    <Comment data={rowData.item} bgColor={this.props.bgColor} navigator={this.props.navigator}/>

                </TouchableOpacity>
            )
        }
    }

    onShouldStartLoadWithRequest(event) {
        // Implement any custom loading logic here, don't forget to return!
        return true
    }

    onNavigationStateChange(navState) {
        this.props.loadEnd && this.props.loadEnd(navState)
        this.setState({
            scalesPageToFit: true
        })
        if(!navState.loading){
            setTimeout(()=>{
                if (!this.props.commentData) {
                    this.props.getComments && this.props.getComments()
                }
            },2000)
        }
    }
    /**
     * scrollview滑动回调
     */
    onScroll(event) {
        let y = event.nativeEvent.contentOffset.y
        // console.log('滑动距离' + y);
        let height = event.nativeEvent.layoutMeasurement.height
        // console.log('列表高度' + height);
        let contentHeight = event.nativeEvent.contentSize.height
        // console.log('内容高度' + contentHeight);
        // console.log('判断条件' + (y + height));
        if (y + height >= contentHeight - 20) {
            console.log('加载更多')
            if (!this.props.commentData) {
                this.props.getComments && this.props.getComments()
            }
        }
    }
}

export default ReadContent