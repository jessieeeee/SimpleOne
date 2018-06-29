/**
 * @date : 6/28/18
 * @author : JessieK
 * @email : lyj1246505807@gmail.com
 * @description : 下拉刷新,上拉加载更多
 */


import React, { Component } from 'react';
import {
    StyleSheet,
    ScrollView,
    View,
    Text,
    PanResponder,  //手势
    Animated,
    Easing,
    Dimensions,
} from 'react-native';

const pullOkMargin = 100; //下拉到位状态时距离顶部的高度
const defaultDuration = 300; //默认时长
const defaultTopRefreshHeight = 50; //顶部刷新视图的高度
/**
 * 提示文字的显示状态
 * @type {{pulling: boolean, pullok: boolean, pullrelease: boolean}}
 */
const defaultState = {pulling: false, pullok: false, pullrelease: false}; //默认状态
const statePulling = {pulling: true, pullok: false, pullrelease: false}; //正在下拉状态
const statePullok = {pulling: false, pullok: true, pullrelease: false}; //下拉到位状态
const statePullrelease = {pulling: false, pullok: false, pullrelease: true}; //下拉释放状态
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

export default class PullScollView extends Component {

    constructor(props) {
        super(props);
        this.defaultScrollEnabled = false;
        this.topRefreshHeight = this.props.topRefreshHeight ? this.props.topRefreshHeight : defaultTopRefreshHeight;
        this.defaultXY = {x: 0, y: this.topRefreshHeight * -1};
        this.pullOkMargin = this.props.pullOkMargin ? this.props.pullOkMargin : pullOkMargin;
        this.state = Object.assign({}, props, {
            pullPan: new Animated.ValueXY(this.defaultXY), //下拉区域
            scrollEnabled: this.defaultScrollEnabled, //滚动启动
            height: 0,
            spinValue : new Animated.Value(0), //旋转值
        });
        // 滚动监听
        this.onScroll = this.onScroll.bind(this);
        // 布局监听
        this.onLayout = this.onLayout.bind(this);
        // 下拉状态监听
        this.isPullState = this.isPullState.bind(this);
        // 下拉未到位，重置回调
        this.resetDefaultXYHandler = this.resetDefaultXYHandler.bind(this);
        // 数据加载完，重置归位
        this.resolveHandler = this.resolveHandler.bind(this);
        // 顶部绘制
        this.renderTopRefresh = this.renderTopRefresh.bind(this);
        // 默认顶部绘制
        this.defaultTopRefreshRender = this.defaultTopRefreshRender.bind(this);
        // 多点触摸识别
        this.panResponder = PanResponder.create({
            onStartShouldSetPanResponder: this.onShouldSetPanResponder.bind(this),
            onMoveShouldSetPanResponder: this.onShouldSetPanResponder.bind(this),
            onPanResponderGrant: () => {}, // 开始手势操作。给用户一些视觉反馈，让他们知道发生了什么事情！
            onPanResponderMove: this.onPanResponderMove.bind(this),// 最近一次的移动距离为gestureState.move{X,Y}
            onPanResponderRelease: this.onPanResponderRelease.bind(this),//用户放开了所有的触摸点，且此时视图已经成为了响应者。
            onPanResponderTerminate: this.onPanResponderRelease.bind(this),// 另一个组件已经成为了新的响应者，所以当前手势将被取消。
        });
        this.setPullState(defaultState);// 设置提示文字的默认状态
        // 初始化刷新视图中的转圈动画
        this.animation=Animated.timing(
            this.state.spinValue,
            {
                toValue: 1,
                duration: 3000,
                easing: Easing.linear
            }
        );
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
            if(this.isPullState()) {
                this.resetDefaultXYHandler();
            } else { // 恢复到默认位置
                this.scroll.scrollTo({x:0, y: gesture.dy * -1});
            }
        } else if (isDownGesture(gesture.dx, gesture.dy)) { //向下手势
            // 设置下拉区域
            this.state.pullPan.setValue({x: this.defaultXY.x, y: this.lastY + gesture.dy / 2});
            if (gesture.dy < this.topRefreshHeight + this.pullOkMargin) { //正在下拉
                // 之前状态不是正在下拉状态，调用正在下拉回调
                if (!this.curState.pulling) {
                    this.props.onPulling && this.props.onPulling();
                }
                // 记录当前为下拉状态
                this.setPullState(statePulling);
            } else { //下拉到位
                // 之前状态不是下拉到位状态，调用下拉到位回调
                if (!this.state.pullok) {
                    this.props.onPullOk && this.props.onPullOk();
                }
                // 记录当前为下拉到位状态
                this.setPullState(statePullok);
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
                    this.props.onPullRelease(this.resolveHandler);
                } else { // 重置
                    setTimeout(() => {this.resetDefaultXYHandler()}, 3000);
                }
            }
            this.setPullState(statePullrelease); //记录当前状态为完成下拉，已松开
            // 刷新view 的下拉动画开启
            Animated.timing(this.state.pullPan, {
                toValue: {x: 0, y: 0},
                easing: Easing.linear,
                duration: defaultDuration
            }).start();
            console.log('调用下拉');

            // 刷新视图中的转圈动画开启
            this.spin();
        }
    }

    // 转圈动画
    spin () {
      this.animation.start((result)=>{
            //正常转完1周,继续转
            if (Boolean(result.finished)) {
                this.animation = Animated.timing(
                    this.state.spinValue,
                    {
                        toValue: 1,
                        duration: 3000,
                        easing: Easing.linear
                    }
                );
                this.state.spinValue.setValue(0);// 每次转完都要重置
                this.spin();
            }
        });
    }

    // scrollview 的滚动回调
    onScroll(e) {
        if (e.nativeEvent.contentOffset.y <= 0) { //临界状态，此时已经到列表顶部，但是还没触发下拉刷新状态
            this.setState({scrollEnabled: this.defaultScrollEnabled});
        } else if(!this.isPullState()) {  //当前不是下拉状态允许滚动
            this.setState({scrollEnabled: true});
        }
        // 调用外部的滑动回调
        this.props.onScroll && this.props.onScroll(e);
    }

    //处于下拉过程判断
    isPullState() {
        return this.curState.pulling || this.curState.pullok || this.curState.pullrelease;
    }

    // 设置当前的下拉状态
    setPullState(pullState) {
        if (this.curState !== pullState) {
            this.curState = pullState;
            this.renderTopRefresh();
        }
    }

    /** 数据加载完成后调用此方法进行重置归位*/
    resolveHandler() {
        if (this.curState.pullrelease) { //仅触摸松开时才触发
            this.resetDefaultXYHandler();
        }
    }

    // 重置下拉
    resetDefaultXYHandler() {
        this.curState = defaultState;
        this.state.pullPan.setValue(this.defaultXY);
        this.state.spinValue.stopAnimation(value => {
            console.log('剩余时间' + (1 - value) * 3000);
            //计算角度比例
            this.animation = Animated.timing(this.state.spinValue, {
                toValue: 1,
                duration: (1 - value) * 3000,
                easing: Easing.linear,
            });
        });
    }


    // 获得测量的宽高，动态设置
    onLayout(e) {
        if (this.state.width !== e.nativeEvent.layout.width || this.state.height !== e.nativeEvent.layout.height) {
            this.scrollContainer.setNativeProps({style: {width: e.nativeEvent.layout.width, height: e.nativeEvent.layout.height}});
            this.width = e.nativeEvent.layout.width;
            this.height = e.nativeEvent.layout.height;
        }
    }



    render() {
        return (
            <View style={[styles.wrap, this.props.style]} onLayout={this.onLayout}>
                <Animated.View style={[this.state.pullPan.getLayout()]}>
                    {/*绘制下拉刷新view*/}
                    {this.renderTopRefresh()}
                    {/*绘制里面的子view*/}
                    <View ref={(c) => {this.scrollContainer = c;}} {...this.panResponder.panHandlers} style={{width: this.state.width, height: this.state.height}}>
                        <ScrollView ref={(c) => {this.scroll = c;}}  scrollEnabled={this.state.scrollEnabled} onScroll={this.onScroll}>
                            {this.props.children}
                        </ScrollView>
                    </View>
                </Animated.View>
            </View>
        );
    }

    // 绘制下拉刷新
    renderTopRefresh() {
        let { pulling, pullok, pullrelease } = this.curState;
        return this.defaultTopRefreshRender(pulling, pullok, pullrelease);
    }


    /**
     使用setNativeProps解决卡顿问题
     绘制默认的下拉刷新
     */
    defaultTopRefreshRender(pulling, pullok, pullrelease) {
        //控制下拉刷新提示文字显示状态
        setTimeout(() => {
            if (pulling) {
                this.txtPulling && this.txtPulling.setNativeProps({style: styles.show});
                this.txtPullok && this.txtPullok.setNativeProps({style: styles.hide});
                this.txtPullrelease && this.txtPullrelease.setNativeProps({style: styles.hide});
            } else if (pullok) {
                this.txtPulling && this.txtPulling.setNativeProps({style: styles.hide});
                this.txtPullok && this.txtPullok.setNativeProps({style: styles.show});
                this.txtPullrelease && this.txtPullrelease.setNativeProps({style: styles.hide});
            } else if (pullrelease) {
                this.txtPulling && this.txtPulling.setNativeProps({style: styles.hide});
                this.txtPullok && this.txtPullok.setNativeProps({style: styles.hide});
                this.txtPullrelease && this.txtPullrelease.setNativeProps({style: styles.show});
            }
        }, 1);
        // 初始化旋转角度
        const spin = this.state.spinValue.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '1080deg']
        });
        // 绘制下拉刷新view
        return (
            <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: defaultTopRefreshHeight}}>
                <Animated.Image
                    style={{
                        width: 23,
                        height: 23,
                        transform: [{rotate: spin}] ,
                        position:'absolute',
                        left:24
                    }}
                    source={{uri: 'default_ptr_rotate'}}
                />

                <Text ref={(c) => {this.txtPulling = c;}} style={styles.hide}>{tipText.pulling}</Text>
                <Text ref={(c) => {this.txtPullok = c;}} style={styles.hide}>{tipText.pullok}</Text>
                <Text ref={(c) => {this.txtPullrelease = c;}} style={styles.hide}>{tipText.pullrelease}</Text>
            </View>
        );
    }
}
// 默认提示文本
const tipText = {
    pulling: "下拉刷新...",
    pullok: "松开刷新......",
    pullrelease: "刷新中......"
};

// 自带样式
const styles = StyleSheet.create({
    wrap: {
        flex: 1,
        flexGrow: 1,
        flexDirection: 'column',
        zIndex:-999,
    },
    hide: {
        position: 'absolute',
        left: 10000
    },
    show: {
        position: 'relative',
        left: 0
    }
});
