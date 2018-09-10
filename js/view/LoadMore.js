/**
 * @date :2017/12/15 0015
 * @author :JessieK
 * @email :lyj1246505807@gmail.com
 * @description : 加载更多view
 */

import React, {Component} from 'react'
import {
    TouchableOpacity,
    StyleSheet,
    View,
    Text,
    Animated,
    Easing
} from 'react-native'

import constants from '../Constants'
import PropTypes from 'prop-types'
import LoadMoreState from './LoadMoreState'
import DoubleClick from '../util/DoubleClick'
let {width, height} = constants.ScreenWH
const pointsNum = 3 //点数量

class LoadMore extends Component {

    constructor(props) {
        super(props)
        // 初始化点的数量
        this.arr = []
        for (let i = 0; i < pointsNum; i++) {
            this.arr.push(i)
        }
        // 初始化动画
        this.animatedValue = []
        this.arr.forEach((value) => {
            this.animatedValue[value] = new Animated.Value(0)
        })
        this.state = {
            curState: LoadMoreState.state.tip
        }
    }

    componentDidMount(){
        this.isMount = true
    }

    componentWillUnmount(){
        this.isMount = false
    }
    /**
     * 动画执行，逐个显示
     */
    animate() {
        this.arr.forEach((value) => {
            this.animatedValue[value].setValue(0)
        })
        const animations = this.arr.map((item) => {
            return Animated.timing(
                this.animatedValue[item],
                {
                    toValue: 1,
                    duration: 200,
                    easing: Easing.linear
                }
            )
        })
        this.loadingAnim = Animated.sequence(animations)
        this.loadingAnim.start((result) => {
            if (Boolean(result.finished)) this.animate()
        })
    }

    render() {
        return (
            <View style={[styles.container,{backgroundColor:constants.nightMode ? constants.nightModeGrayLight : 'white'}]}>
                { this.state.curState !== LoadMoreState.state.hide ? this.renderLoad() : null}
            </View>
        )
    }


    componentWillReceiveProps(nextProps) {
        this.setState({
            curState: nextProps.state
        })
        switch (nextProps.state) {
            case LoadMoreState.state.loading:
//                console.log('callback---start')
                this.animate()
                break
            case LoadMoreState.state.hide:
//                console.log('callback---stop');
                this.arr.forEach((item) => {
                    this.animatedValue[item].stopAnimation(value => {
                        // console.log('剩余时间' + (1 - value) * 200);
                    })
                })
                break
            case LoadMoreState.state.noMore:
                setTimeout(() => {
                   if(this.isMount){
                       this.setState({
                           curState: LoadMoreState.state.hide
                       })
                   }
                }, 3000)
                break

        }
    }

    renderLoadText() {
        switch (this.state.curState) {
            case LoadMoreState.state.loading:
                return LoadMoreState.stateText.loading
                return LoadMoreState.stateText.loading
            case LoadMoreState.state.noMore:
                return LoadMoreState.stateText.noMore
            case LoadMoreState.state.tip:
                return LoadMoreState.stateText.tip
            case LoadMoreState.state.error:
                return LoadMoreState.stateText.error
        }
    }

    renderLoad() {
        const animations = this.arr.map((item) => {
            return (
                <Animated.Text key={item} style={{
                    opacity: this.animatedValue[item], fontSize: width * 0.06, color: constants.nightMode ? constants.nightModeTextColor : constants.normalTextColor, marginRight: width * 0.02
                }}>.</Animated.Text>
            )
        })
            return (
                <TouchableOpacity
                    style={{flexDirection: 'row', alignItems: 'center', height: width * 0.14,}}
                    onPress={() =>new DoubleClick().filterDoubleClick(
                     function () {
                         if (this.state.curState === LoadMoreState.state.error){
                             this.props.onRetry && this.props.onRetry()
                             this.setState({
                                 curState:LoadMoreState.state.loading
                             })
                             this.animate()
                         }
                     }.bind(this)
                    )}>
                    <Text style={{
                        color: constants.nightMode ? constants.nightModeTextColor : constants.normalTextColor,
                        fontSize: width * 0.04,
                        marginRight: width * 0.02,
                    }}>
                        {this.renderLoadText()}
                    </Text>
                    {this.state.curState === LoadMoreState.state.loading ?
                        <View style={styles.pointsView}>
                            {animations}
                        </View> : null}
                </TouchableOpacity>
            )
    }
}
LoadMore.propTypes = {
    state: PropTypes.number, //加载更多
    onRetry: PropTypes.func //重试回调
}
LoadMore.defaultProps = {
    state: LoadMoreState.state.hide
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    pointsView: {
        height: width * 0.14,
        flexDirection: 'row',
        alignItems: 'center',
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
})

export default LoadMore