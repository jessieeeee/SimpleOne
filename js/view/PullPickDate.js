/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Modal,
    Animated,
    TouchableOpacity
} from 'react-native';
import PickDateView from '../view/PickDate';
import constants from '../Constants';
var {width, height} = constants.ScreenWH;
class PullPickDate extends Component{
    constructor(props){
        super(props);
        this.onLayout=this.onLayout.bind(this);
        this.state={
            expanded: false,
            animation : new Animated.Value()
        };
    }
    showAnimation(height){
        var maxHeight=height;
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
            5000
        );
    }

    toggle(finalValue) { //Step 1

        Animated.spring( //Step 4
            this.state.animation,
            {
                toValue: finalValue
            }
        ).start(); //Step 5
    }

    render() {
        return (
            <Modal
                animationType={'none'}
                transparent={true}
                visible={this.props.onShow}
                onRequestClose={() => {
                    this.props.onCancel();
                }}>

                <View style={{width: width, flex: 1, marginTop: height * 0.08 + 0.12 * width,backgroundColor: 'rgba(0, 0, 0, 0.7)'}}>
                    <PickDateView
                        setYear={this.props.year}
                        setMonth={this.props.month}
                        onLayout={this.onLayout}
                        onChange={(obj) => {
                            console.log('onSure收到事件' + obj.nativeEvent.msg + "目标id" + obj.nativeEvent.msg.year);
                            //当此回调被onSure调用时
                            var year = obj.nativeEvent.msg.year + '';
                            var month = obj.nativeEvent.msg.month + '';
                            var time= obj.nativeEvent.msg.time + '';
                            if (year != 'undefined' && month != 'undefined') {
                                this.props.onCancel();
                            }else{
                                this.props.onSure(year,month,time);
                            }

                        }}
                        style={{width: '100%', flex: 0.42,}}/>
                    <TouchableOpacity style={{flex:0.58}} onPress={() => this.props.onCancel()}/>
                </View>
            </Modal>
        );
    }

    onLayout(event){
        this.showAnimation(event.nativeEvent.layout.height);
    }
}

export default PullPickDate;
