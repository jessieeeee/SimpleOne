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
    Animated,
    FlatList,
    TouchableOpacity,
    Modal
} from 'react-native';
import constants from '../Constants';
var TimerMixin = require('react-timer-mixin');
var Dimensions = require('Dimensions');
var {width, height} = Dimensions.get('window');
const VIEWABILITY_CONFIG = {
    minimumViewTime: 3000,
    viewAreaCoveragePercentThreshold: 100,
    waitForInteraction: true,
};

var PullMenu = React.createClass({
    //注册计时器
    mixins: [TimerMixin],
    getDefaultProps() {
        return {
            menuData: null,
            onSure: null,
            onCancel: null,
            onShow: false,
            select: '',

        }
    },

    getInitialState() {
        return {
            expanded: false,
            animation : new Animated.Value()
        }
    },

    componentDidMount(){
        var maxHeight=width * 0.14*this.props.menuData.length;
        var minHeight=0;
        let initialValue = this.state.expanded ? maxHeight + minHeight : minHeight,
            finalValue= this.state.expanded ? minHeight : maxHeight + minHeight;
        this.setState({
            expanded: !this.state.expanded //Step 2
        });
        console.log('最大高度'+maxHeight);
        console.log('初始值'+initialValue+'最终值'+finalValue);
        this.state.animation.setValue(initialValue); //Step 3

        this.timer = setTimeout(
            () => {
                this.toggle(finalValue);
            },
            2000
        );

    },

    render() {
        return (
            <Modal
                animationType={'none'}
                transparent={true}
                visible={this.props.onShow}
                onRequestClose={() => {
                    this.props.onCancel();
                }}>

                <TouchableOpacity style={styles.container} onPress={() => this.props.onCancel()}>

                    <Animated.View style={{height: this.state.animation}}>
                        <FlatList
                            data={this.props.menuData}
                            renderItem={this.renderRow}
                            keyExtractor={(item, index) => index}
                            onViewableItemsChanged={(info) => {
                                console.log('是否可见');
                                console.log(info);
                            }}

                            viewabilityConfig={VIEWABILITY_CONFIG}
                        >
                            }

                        </FlatList>
                    </Animated.View>

                </TouchableOpacity>

            </Modal>
        );
    },



    toggle(finalValue) { //Step 1

        Animated.spring( //Step 4
            this.state.animation,
            {
                toValue: finalValue
            }
        ).start(); //Step 5
    },

    // 单个item返回 线性布局
    renderRow(rowData) {
        console.log(rowData);
        if (typeof(rowData) !== 'undefined') {
            return (
                <TouchableOpacity activeOpacity={1} onPress={() => {
                    this.props.onSure(rowData.item);
                }}>
                    {this.renderItem(rowData)}

                </TouchableOpacity>
            )
        }

    },

    renderItem(rowData) {
        var color = '#808080';
        if (this.props.select == rowData.item.value) {
            color = '#333333';
        }
        return (
            <Text style={[styles.menu, {color: color}]}>{rowData.item.value}</Text>
        );
    }
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        marginTop: height * 0.08,
    },
    menu: {
        fontSize: width * 0.04,
        textAlign: 'center',
        width: width,
        height: width * 0.14,
        textAlignVertical: 'center',
        backgroundColor: 'white',
        borderBottomWidth: constants.divideLineWidth,
        borderBottomColor: '#dddddd'
    },

});

module.exports = PullMenu;
