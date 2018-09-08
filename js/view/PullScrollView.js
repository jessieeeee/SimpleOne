/**
 * @date : 6/28/18
 * @author : JessieK
 * @email : lyj1246505807@gmail.com
 * @description : 下拉刷新,上拉加载更多
 */


import React, {Component} from 'react';
import {
    ScrollView,
    View,
    Text,
    PanResponder,  //手势
    Animated,
    Easing,
} from 'react-native'
import PropTypes from 'prop-types'
import LottieView from 'lottie-react-native'
import LoadMore from './LoadMore';// 加载更多的view
import Refresh from './Refresh'
const defaultDuration = 300 //默认时长
/**
 * 提示文字的显示状态
 * @type {{pulling: boolean, pullok: boolean, pullrelease: boolean}}
 */
const defaultState = {pulling: false, pullok: false, pullrelease: false} //默认状态
const statePulling = {pulling: true, pullok: false, pullrelease: false} //正在下拉状态
const statePullok = {pulling: false, pullok: true, pullrelease: false} //下拉到位状态
const statePullrelease = {pulling: false, pullok: false, pullrelease: true} //下拉释放状态
//向下手势
const isDownGesture = (x, y) => {
    return y > 0 && (y > Math.abs(x));
};
//向上手势
const isUpGesture = (x, y) => {
    return y < 0 && (Math.abs(x) < Math.abs(y));
};
//垂直方向手势
const isVerticalGesture = (x, y) => {
    return (Math.abs(x) < Math.abs(y));
};

export default class PullScrollView extends Component {

    static defaultProps = {
        topRefreshHeight: 50, //顶部刷新视图的高度
        pullOkMargin:100 //下拉到位状态时距离顶部的高度
    }

    static propTypes = {
        topRefreshHeight: PropTypes.number,
        pullOkMargin: PropTypes.number,
        onPulling: PropTypes.func,
        onPullOk: PropTypes.func,
        onPullRelease: PropTypes.func,
        onLoadMore: PropTypes.func,
        onScroll: PropTypes.func,
        children: PropTypes.array,
        style: PropTypes.object,
        loadMoreState: PropTypes.number,
        onRetry: PropTypes.func,
    }

    constructor(props) {
        super(props)
        this.defaultScrollEnabled = false
        this.topRefreshHeight = this.props.topRefreshHeight
        this.defaultXY = {x: 0, y: this.topRefreshHeight * -1}
        this.pullOkMargin = this.props.pullOkMargin
        this.state = Object.assign({}, props, {
            pullPan: new Animated.ValueXY(this.defaultXY), //下拉区域
            scrollEnabled: this.defaultScrollEnabled, //滚动启动
            height: 0,
        })
        // 滚动监听
        this.onScroll = this.onScroll.bind(this)
        // 布局监听
        this.onLayout = this.onLayout.bind(this)
        // 下拉状态监听
        this.isPullState = this.isPullState.bind(this)
        // 下拉未到位，重置回调
        this.resetDefaultXYHandler = this.resetDefaultXYHandler.bind(this)
        // 数据加载完，重置归位
        this.resolveHandler = this.resolveHandler.bind(this)
        // 顶部绘制
        this.renderTopRefresh = this.renderTopRefresh.bind(this)
        // 默认顶部绘制
        this.defaultTopRefreshRender = this.defaultTopRefreshRender.bind(this)
        // 多点触摸识别
        this.panResponder = PanResponder.create({
            onMoveShouldSetPanResponder: this.onShouldSetPanResponder.bind(this),
            onPanResponderMove: this.onPanResponderMove.bind(this),// 最近一次的移动距离为gestureState.move{X,Y}
            onPanResponderRelease: this.onPanResponderRelease.bind(this),//放开了所有的触摸点，且此时视图已经成为了响应者。
        })
        this.setPullState(defaultState)// 设置提示文字的默认状态

    }

    // 手势响应回调，是否处理
    onShouldSetPanResponder(e, gesture) {
        //非垂直手势不处理
        if (!isVerticalGesture(gesture.dx, gesture.dy)) {
            return false;
        }
        if (!this.state.scrollEnabled) {
            this.lastY = this.state.pullPan.y._value;
            return true;
        } else {
            return false;
        }
    }

    // 手势移动的处理
    onPanResponderMove(e, gesture) {
        if (isUpGesture(gesture.dx, gesture.dy)) { //向上手势
            // 如果处于下拉状态，重置
            if (this.isPullState()) {
                this.resetDefaultXYHandler()
            } else { // 恢复到默认位置
                this.scroll.scrollTo({x: 0, y: gesture.dy * -1})
            }
        } else if (isDownGesture(gesture.dx, gesture.dy)) { //向下手势
            // 设置下拉区域
            this.state.pullPan.setValue({x: this.defaultXY.x, y: this.lastY + gesture.dy / 2})
            if (gesture.dy < this.topRefreshHeight + this.pullOkMargin) { //正在下拉
                // 之前状态不是正在下拉状态，调用正在下拉回调
                if (!this.curState.pulling) {
                    this.props.onPulling && this.props.onPulling()
                }
                // 记录当前为下拉状态
                this.setPullState(statePulling)
            } else { //下拉到位
                // 之前状态不是下拉到位状态，调用下拉到位回调
                if (!this.state.pullok) {
                    this.props.onPullOk && this.props.onPullOk()
                }
                // 记录当前为下拉到位状态
                this.setPullState(statePullok)
            }
        }
    }

    // 手势释放
    onPanResponderRelease() {
        if (this.curState.pulling) { // 之前是下拉状态
            this.resetDefaultXYHandler(); //重置状态
        }
        if (this.curState.pullok) { // 之前是下拉到位状态
            // 之前没有松开
            if (!this.curState.pullrelease) {
                // 之前是刷新中，调用数据处理回调
                if (this.props.onPullRelease) {
                    this.props.onPullRelease(this.resolveHandler)
                } else { // 重置
                    setTimeout(() => {
                        this.resetDefaultXYHandler()
                    }, 3000)
                }
            }
            this.setPullState(statePullrelease); //记录当前状态为完成下拉，已松开
            // 刷新view 的下拉动画开启
            Animated.timing(this.state.pullPan, {
                toValue: {x: 0, y: 0},
                easing: Easing.linear,
                duration: defaultDuration
            }).start()

            // 刷新视图中的转圈动画开启
            this.spin()
        }
    }

    // 转圈动画
    spin() {
        this.animation.play()
    }

    // scrollview 的滚动回调
    onScroll(e) {
        if (e.nativeEvent.contentOffset.y <= 0) { //临界状态，此时已经到列表顶部，但是还没触发下拉刷新状态
            this.setState({scrollEnabled: this.defaultScrollEnabled})
        } else if (!this.isPullState()) {  //当前不是下拉状态允许滚动
            this.setState({scrollEnabled: true})
        }
        let y = e.nativeEvent.contentOffset.y;
        // console.log('滑动距离' + y);
        let height = e.nativeEvent.layoutMeasurement.height;
        // console.log('列表高度' + height);
        let contentHeight = e.nativeEvent.contentSize.height;
        // console.log('内容高度' + contentHeight);
        // console.log('判断条件' + (y + height));
        if (y + height >= contentHeight - 20) {
            console.log('触发加载更多');
            this.props.onLoadMore && this.props.onLoadMore()
        }
        // 调用外部的滑动回调
        this.props.onScroll && this.props.onScroll(e)
    }

    //处于下拉过程判断
    isPullState() {
        return this.curState.pulling || this.curState.pullok || this.curState.pullrelease
    }

    // 设置当前的下拉状态
    setPullState(pullState) {
        if (this.curState !== pullState) {
            this.curState = pullState
            this.renderTopRefresh()
        }
    }

    /** 数据加载完成后调用此方法进行重置归位*/
    resolveHandler() {
        if (this.curState.pullrelease) { //仅触摸松开时才触发
            this.resetDefaultXYHandler()
        }
    }

    // 重置下拉
    resetDefaultXYHandler() {
        this.curState = defaultState
        this.state.pullPan.setValue(this.defaultXY)
        this.animation.reset()
    }


    // 获得测量的宽高，动态设置
    onLayout(e) {
        if (this.state.width !== e.nativeEvent.layout.width || this.state.height !== e.nativeEvent.layout.height) {
            this.scrollContainer.setNativeProps({
                style: {
                    width: e.nativeEvent.layout.width,
                    height: e.nativeEvent.layout.height
                }
            })
            this.width = e.nativeEvent.layout.width
            this.height = e.nativeEvent.layout.height
        }
    }


    render() {
        return (
            <View style={[Refresh.styles.wrap, this.props.style]} onLayout={this.onLayout}>
                <Animated.View style={[this.state.pullPan.getLayout()]}>
                    {/*绘制下拉刷新view*/}
                    {this.renderTopRefresh()}
                    {/*绘制里面的子view*/}
                    <View ref={(c) => {
                        this.scrollContainer = c
                    }} {...this.panResponder.panHandlers} style={{width: this.state.width, height: this.state.height}}>
                        <ScrollView {...this.props} ref={(c) => {
                            this.scroll = c
                        }} scrollEnabled={this.state.scrollEnabled} onScroll={this.onScroll}>
                            {this.props.children}
                            <LoadMore state={this.props.loadMoreState} onRetry={() => this.props.onRetry()}/>

                        </ScrollView>
                    </View>
                </Animated.View>
            </View>
        )
    }

    // 绘制下拉刷新
    renderTopRefresh() {
        let {pulling, pullok, pullrelease} = this.curState
        return this.defaultTopRefreshRender(pulling, pullok, pullrelease)
    }


    /**
     使用setNativeProps解决卡顿问题
     绘制默认的下拉刷新
     */
    defaultTopRefreshRender(pulling, pullok, pullrelease) {
        //控制下拉刷新提示文字显示状态
        setTimeout(() => {
            if (pulling) {
                this.txtPulling && this.txtPulling.setNativeProps({style: Refresh.styles.show})
                this.txtPullok && this.txtPullok.setNativeProps({style: Refresh.styles.hide})
                this.txtPullrelease && this.txtPullrelease.setNativeProps({style: Refresh.styles.hide})
            } else if (pullok) {
                this.txtPulling && this.txtPulling.setNativeProps({style: Refresh.styles.hide})
                this.txtPullok && this.txtPullok.setNativeProps({style: Refresh.styles.show})
                this.txtPullrelease && this.txtPullrelease.setNativeProps({style: Refresh.styles.hide})
            } else if (pullrelease) {
                this.txtPulling && this.txtPulling.setNativeProps({style: Refresh.styles.hide})
                this.txtPullok && this.txtPullok.setNativeProps({style: Refresh.styles.hide})
                this.txtPullrelease && this.txtPullrelease.setNativeProps({style: Refresh.styles.show})
            }
        }, 1)

        // 绘制下拉刷新view
        return (
            <View style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                height: this.props.topRefreshHeight
            }}>

                <Text ref={(c) => {
                    this.txtPulling = c
                }} style={Refresh.styles.hide}>{Refresh.tipText.pulling}</Text>
                <Text ref={(c) => {
                    this.txtPullok = c
                }} style={Refresh.styles.hide}>{Refresh.tipText.pullok}</Text>
                <Text ref={(c) => {
                    this.txtPullrelease = c
                }} style={Refresh.styles.hide}>{Refresh.tipText.pullrelease}</Text>

                <LottieView
                    style={{
                        width: 50,
                        height: 50,
                    }}
                    ref={animation => {
                        this.animation = animation;
                    }}
                    source={require('./trail_loading')}
                />
            </View>
        );
    }
}

