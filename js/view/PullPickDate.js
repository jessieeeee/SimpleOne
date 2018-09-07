/**
 * @date : 6/28/18
 * @author : JessieK
 * @email : lyj1246505807@gmail.com
 * @description : 选择日期
 */


import React, { Component } from 'react'
import {
    View,
    Modal,
    Animated,
    TouchableOpacity
} from 'react-native';
import PickDateView from '../view/PickDate'
import constants from '../Constants'
import PropTypes from 'prop-types'
let {width, height} = constants.ScreenWH
class PullPickDate extends Component{
    static propTypes = {
        year: PropTypes.string.isRequired,
        month: PropTypes.string.isRequired,
        onSure: PropTypes.func.isRequired,
        onCancel: PropTypes.func.isRequired,
        onShow: PropTypes.bool,
    }

    static defaultProps ={
        onShow: false
    }
    constructor(props){
        super(props)
        this.onLayout=this.onLayout.bind(this)
        this.state={
            expanded: false,
            animation : new Animated.Value()
        }
    }
    showAnimation(height){
        let maxHeight=height
        let minHeight=0
        let initialValue = this.state.expanded ? maxHeight + minHeight : minHeight,
            finalValue= this.state.expanded ? minHeight : maxHeight + minHeight
        this.setState({
            expanded: !this.state.expanded //Step 2
        });
        console.log('最大高度'+maxHeight)
        console.log('初始值'+initialValue+'最终值'+finalValue)
        this.state.animation.setValue(initialValue) //Step 3

        this.timer = setTimeout(
            () => {
                this.toggle(finalValue)
            },
            5000
        )
    }

    toggle(finalValue) {
        Animated.spring(
            this.state.animation,
            {
                toValue: finalValue
            }
        ).start()
    }

    render() {
        return (
            <Modal
                animationType={'none'}
                transparent={true}
                visible={this.props.onShow}
                onRequestClose={() => {
                    this.props.onCancel()
                }}>

                <View style={{width: width, flex: 1, marginTop: height * 0.08 + 0.12 * width,backgroundColor: 'rgba(0, 0, 0, 0.7)'}}>
                    <PickDateView
                        setYear={this.props.year}
                        setMonth={this.props.month}
                        onLayout={this.onLayout}
                        onChange={(obj) => {
                            console.log('onSure收到事件' + obj.nativeEvent.msg + "目标id" + obj.nativeEvent.msg.year)
                            //当此回调被onSure调用时
                            let year = obj.nativeEvent.msg.year + ''
                            let month = obj.nativeEvent.msg.month + ''
                            let time= obj.nativeEvent.msg.time + ''
                            if (year !== 'undefined' && month !== 'undefined') {
                                this.props.onCancel();
                            }else{
                                this.props.onSure(year,month,time)
                            }

                        }}
                        style={{width: '100%', flex: 0.42,}}/>
                    <TouchableOpacity style={{flex:0.58}} onPress={() => this.props.onCancel()}/>
                </View>
            </Modal>
        )
    }

    onLayout(event){
        this.showAnimation(event.nativeEvent.layout.height)
    }
}

export default PullPickDate
