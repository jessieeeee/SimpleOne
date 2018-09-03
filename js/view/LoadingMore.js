/**
 * @date :2017/12/15 0015
 * @author :JessieK
 * @email :lyj1246505807@gmail.com
 * @description : 加载更多view
 */

import React, {Component} from 'react';
import {
    TouchableOpacity,
    StyleSheet,
    View,
    Text,
    Animated,
    Easing
} from 'react-native';

import constants from '../Constants';
import PropTypes from 'prop-types';

let {width, height} = constants.ScreenWH;
const pointsNum = 3; //点数量

class LoadingMore extends Component {

    static state = {
        hide: 0,
        loading: 1,
        noMore: 2,
        tip: 3,
        error: 4,
    }
    static stateText = {
        loading: '正在加载更多',
        noMore: '没有更多了',
        tip: '上拉加载更多',
        error: '加载失败'
    }

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
            curState: LoadingMore.state.tip
        }
    }


    /**
     * 动画执行，逐个显示
     */
    animate() {
        this.arr.forEach((value) => {
            this.animatedValue[value].setValue(0);
        });
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
                { this.state.curState !== LoadingMore.state.hide ? this.renderLoad() : null}
            </View>
        );
    }


    componentWillReceiveProps(nextProps) {
        this.setState({
            curState: nextProps.state
        })
        switch (nextProps.state) {
            case LoadingMore.state.loading:
//                console.log('callback---start')
                this.animate()
                break
            case LoadingMore.state.hide:
//                console.log('callback---stop');
                this.arr.forEach((item) => {
                    this.animatedValue[item].stopAnimation(value => {
                        console.log('剩余时间' + (1 - value) * 200);
                    });
                })
                break
            case LoadingMore.state.noMore:
                setTimeout(() => {
                    this.setState({
                        curState: LoadingMore.state.hide
                    })
                }, 3000)
                break

        }
    }

    renderLoadText() {
        switch (this.state.curState) {
            case LoadingMore.state.loading:
                return LoadingMore.stateText.loading
            case LoadingMore.state.noMore:
                return LoadingMore.stateText.noMore
            case LoadingMore.state.tip:
                return LoadingMore.stateText.tip
            case LoadingMore.state.error:
                return LoadingMore.stateText.error
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
                    onPress={() => {
                        if (this.state.curState === LoadingMore.state.error){
                            this.props.onRetry && this.props.onRetry()
                        }
                    }}>
                    <Text style={{
                        color: constants.nightMode ? constants.nightModeTextColor : constants.normalTextColor,
                        fontSize: width * 0.04,
                        marginRight: width * 0.02,
                    }}>
                        {this.renderLoadText()}
                    </Text>
                    {this.state.curState === LoadingMore.state.loading ?
                        <View style={styles.pointsView}>
                            {animations}
                        </View> : null}
                </TouchableOpacity>
            )
    }
}

LoadingMore.defaultProps = {
    loading: false, //加载更多
};
LoadingMore.propTypes = {
    loading: PropTypes.bool.isRequired
};
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
});

export default LoadingMore;