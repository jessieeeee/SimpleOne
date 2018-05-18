/**
 * @date :2017/12/15 0015
 * @author :JessieK
 * @email :lyj1246505807@gmail.com
 * @description : 加载更多view
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    Animated,
    Easing
} from 'react-native';

import constants from '../Constants';
import PropTypes from 'prop-types';
var {width, height} = constants.ScreenWH;
const pointsNum = 3; //点数量

class LoadingMore extends Component {

    constructor(props) {
        super(props);
        // 初始化点的数量
        this.arr = [];
        for (let i = 0; i < pointsNum; i++) {
            this.arr.push(i);
        }
        // 初始化动画
        this.animatedValue = [];
        this.arr.forEach((value) => {
            this.animatedValue[value] = new Animated.Value(0)
        });
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
        });
        this.loadingAnim = Animated.sequence(animations);
        this.loadingAnim.start((result) => {
            if (Boolean(result.finished)) this.animate()
        })

    }

    componentDidMount() {
        this.animate()
    }

    render() {
        return (
            <View style={styles.container}>
                {this.loading()}
            </View>
        );
    }


    componentWillReceiveProps(nextProps) {

        if (nextProps.loading) {
            console.log('callback---start');
            this.animate();
        } else {
            console.log('callback---stop');
            this.arr.forEach((item) => {
                this.animatedValue[item].stopAnimation(value => {
                    console.log('剩余时间' + (1 - value) * 200);
                });
            });
        }
    }

    loading() {
        const animations = this.arr.map((item) => {
            return (
                <Animated.Text key={item} style={{
                    opacity: this.animatedValue[item], fontSize: width * 0.06, color: 'gray', marginRight: width * 0.02
                }}>.</Animated.Text>
            );
        });

        if (this.props.loading) {
            return (
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={{
                        color: 'gray',
                        fontSize: width * 0.04,
                        marginRight: width * 0.02
                    }}>
                        正在加载中
                    </Text>
                    <View style={styles.pointsView}>
                        {animations}
                    </View>
                </View>
            );
        }
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
        backgroundColor: 'white',
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