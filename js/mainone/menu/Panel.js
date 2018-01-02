/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    Animated
} from 'react-native';

var Dimensions = require('Dimensions');
var {width, height} = Dimensions.get('window');

var Panel = React.createClass({

    getDefaultProps() {
        return {
            title: '',
        }
    },

    /**
     * 初始化状态变量
     * @returns {{oneData: null}}
     */
    getInitialState() {
        return {
            up: 'arrow_up_black',    //箭头向上图片
            down: 'arrow_down_black', //箭头向下图片
            title: this.props.title,
            expanded: false,
            animation: new Animated.Value(),
            maxHeight: 0,       //最大高度
            minHeight: 0,       //最小高度
        }
    },

    componentDidMount() {
        this.setState({
            maxHeight: width * (0.7 + 0.1 * this.props.children.length),
            minHeight: width * 0.1,
        });

        let initialValue = this.state.expanded ? width * (0.7 + 0.1 * this.props.children.length) : width * 0.1;
        this.state.animation.setValue(initialValue);
    },


    /**
     * 展开或折叠动画
     */
    toggle() {
        let initialValue = this.state.expanded ? this.state.maxHeight + this.state.minHeight : this.state.minHeight,
            finalValue = this.state.expanded ? this.state.minHeight : this.state.maxHeight + this.state.minHeight;

        this.setState({
            expanded: !this.state.expanded
        });

        this.state.animation.setValue(initialValue);
        Animated.spring(
            this.state.animation,
            {
                toValue: finalValue
            }
        ).start();
    },


    render() {
        let icon = this.state.down;
        if (this.state.expanded) {
            icon = this.state.up;
        }
        return (
            <Animated.View
                style={[styles.container, {height: this.state.animation}]}>

                <TouchableOpacity
                    style={styles.titleContainer}
                    onPress={this.toggle}
                    underlayColor="#f1f1f1">
                    <Text style={styles.title}>{this.state.title}</Text>
                    <Image
                        style={styles.buttonImage}
                        source={{uri: icon}}
                    />
                </TouchableOpacity>

                <View style={styles.body}>
                    {this.props.children}
                </View>

            </Animated.View>
        );

    }
});

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        overflow: 'hidden',
    },
    titleContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: width * 0.02,
        paddingBottom: width * 0.02,
    },
    title: {
        color: '#808080',
        textAlign: 'center',
        fontSize: width * 0.036,
    },
    button: {},
    buttonImage: {
        width: width * 0.04,
        height: width * 0.04,
        marginLeft: width * 0.02,
        position: 'relative',
        right: 0
    },
    body: {
        paddingTop: width * 0.04,
        paddingBottom: width * 0.08
    }
});

module.exports = Panel;
