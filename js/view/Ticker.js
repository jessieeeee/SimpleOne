/**
 * @author : JessieK
 * @email : lyj1246505807@gmail.com
 * @description : 滚动数字效果
 */

import React, { Component } from "react";
import { StyleSheet, Text, View, Animated } from "react-native";
import PropTypes from "prop-types";
const styles = StyleSheet.create({
    // 数字水平浮动排列
    row: {
        flexDirection: 'row',
        overflow: 'hidden',
    },
    // 隐藏
    hide: {
        position: 'absolute',
        left: 0,
        right: 0,
        opacity: 0,
    },
});


const getPosition = ({ text, items, height }) => {
    // 获得文本在数组的下标
    const index = items.findIndex(p => p === text);
    // 返回文本绘制的y轴坐标
    return index * height * -1;
};
// 切割
const splitText = (text = "") => (text + "").split("");
// 是十进制数字判断
const isNumber = (text = "") => !isNaN(parseInt(text, 10));
// 是字符串判断
const isString = (text = "") => typeof text === "string";
// 指定范围创建数组
const range = length => Array.from({ length }, (x, i) => i);
// 创建"0","1","2","3","4"..."9"的数组,默认绘制数据
const numberRange = range(10).map(p => p + "");

// 设置动画属性,垂直方向上平移
const getAnimationStyle = animation => {
    return {
        transform: [
            {
                translateY: animation,
            },
        ],
    };
};
/**
 *
 * @param children 子组件
 * @param style 样式
 * @param height 高度
 * @param textStyle 文本样式
 * @returns 无动画绘制文本
 * @constructor
 */
const Piece = ({ children, style, height, textStyle }) => {
    return (
        <View style={style}>
            <Text style={[textStyle, { height }]}>{children}</Text>
        </View>
    );
};

class Ticker extends Component {

    // 定义属性类型
    static propTypes = {
        text: PropTypes.string,
        textStyle: PropTypes.oneOfType([PropTypes.number, PropTypes.object, PropTypes.array]),
    };
    // 定义默认属性值
    static defaultProps = {
        rotateTime: 250, // 默认滚动时间
    };

    state = {
        measured: false, // 是否已测量
        height: 0, // 高度
        fontSize: StyleSheet.flatten(this.props.textStyle).fontSize, // 获取props中的字体大小
    };

    // props变动时回调
    componentWillReceiveProps(nextProps) {
        this.setState({
            fontSize: StyleSheet.flatten(nextProps.textStyle).fontSize,
        });
    }

    handleMeasure = e => {
        this.setState({
            measured: true, // 修改flag为已测量
            height: e.nativeEvent.layout.height, //测量高度
        });
    };

    /**
     * 渲染
     * @returns {*}
     */
    render() {
        // 获取文本内容,子组件,样式,滚动时长
        const { text, children, textStyle, style, rotateTime } = this.props;
        // 获取高度, 是否测量标记
        const { height, measured } = this.state;
        // 如果未测量则透明
        const opacity = measured ? 1 : 0;
        // 文本内容获取,读取text或子组件内容,两种方式配置文本内容
        const childs = text || children;
        // 如果子组件是字符串,字符串渲染,否则子组件渲染
        return (
            <View style={[styles.row, { height, opacity }, style]}>
                {/*渲染逻辑*/}
                {numberRenderer({
                    children: childs,
                    textStyle,
                    height,
                    rotateTime,
                    rotateItems: numberRange,
                })}
                {/*测量text高度,不显示该组件*/}
                <Text style={[textStyle, styles.hide]} onLayout={this.handleMeasure} pointerEvents="none">
                    0
                </Text>
            </View>
        );
    }
}

const numberRenderer = ({ children, textStyle, height, rotateTime, rotateItems }) => {
    // 切割子组件遍历
    return splitText(children).map((piece, i) => {
        if (!isNumber(piece)) { //如果不是数字
            return (
                <Piece key={i} style={{ height }} textStyle={textStyle}>
                    {piece}
                </Piece>
            );
        }
        return (
            <Tick
                duration={rotateTime}
                key={i}
                text={piece}
                textStyle={textStyle}
                height={height}
                rotateItems={rotateItems}
            />
        );
    });
};

class Tick extends Component {
    /**
     * 创建动画初始值
     * @type {{animation: Animated.Value}}
     */
    state = {
        animation: new Animated.Value(
            getPosition({
                text: this.props.text,
                items: this.props.rotateItems,
                height: this.props.height,
            }),
        ),
    };
    componentDidMount() {
        // 如果高度已测量,设置动画初始值
        if (this.props.height !== 0) {
            this.setState({
                animation: new Animated.Value(
                    getPosition({
                        text: this.props.text,
                        items: this.props.rotateItems,
                        height: this.props.height,
                    }),
                ),
            });
        }
    }

    componentWillReceiveProps(nextProps) {
        // 高度变化,重置动画初始值
        if (nextProps.height !== this.props.height) {
            this.setState({
                animation: new Animated.Value(
                    getPosition({
                        text: nextProps.text,
                        items: nextProps.rotateItems,
                        height: nextProps.height,
                    }),
                ),
            });
        }
    }

    componentDidUpdate(prevProps) {
        const { height, duration, rotateItems, text } = this.props;
        // 数字变化,用当前动画值和变化后的动画值进行插值,并启动动画
        if (prevProps.text !== text) {
            Animated.timing(this.state.animation, {
                toValue: getPosition({
                    text: text,
                    items: rotateItems,
                    height,
                }),
                duration,
                useNativeDriver: true,
            }).start();
        }
    }

    render() {
        const { animation } = this.state;
        const { textStyle, height, rotateItems } = this.props;

        return (
            <View style={{ height }}>
                <Animated.View style={getAnimationStyle(animation)}>
                    {/*遍历数组绘制数字*/}
                    {rotateItems.map(v => (
                        <Text key={v} style={[textStyle, { height }]}>
                            {v}
                        </Text>
                    ))}
                </Animated.View>
            </View>
        );
    }
}

export { Tick, numberRange };
export default Ticker;