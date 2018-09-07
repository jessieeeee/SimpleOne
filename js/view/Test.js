/**
 * @date : 6/28/18
 * @author : JessieK
 * @email : lyj1246505807@gmail.com
 * @description : 组件测试界面
 */


import React, {Component} from 'react';

import {AppRegistry, StyleSheet, View, Text, requireNativeComponent, TextInput, Button, Alert} from 'react-native';
import PickDate from './PickDate';
import ShowPlayMusic from './ShowPlayMusic'
import Ticker from './Ticker';
class Test extends Component {
    constructor(props){
        super(props)
        this.state={
            value: "0"
        }
    }
    componentDidMount() {
        setInterval(() => {
            this.setState({
                value: parseInt(this.state.value) + 1 + ""
            })
        }, 2000)
    }
    render() {
        return (
            <View style={{flex: 1}}>
                {/*<PickDate*/}
                {/*onChange={(obj) => {*/}
                {/*console.log('onSure收到事件'+obj.nativeEvent.msg+"目标id"+obj.nativeEvent.target);*/}

                {/*}}*/}
                {/*style={{flex: 1, width: '100%'}}*/}
                {/*/>*/}

                {/*<ShowPlayMusic*/}
                {/*onChange={(obj) => {*/}
                {/*console.log('onSure收到事件'+obj.nativeEvent.msg+"目标id"+obj.nativeEvent.target);*/}

                {/*}}*/}
                {/*style={{height:'109%', width: '18%'}}*/}
                {/*/>*/}
                <Ticker text={this.state.value} textStyle={styles.text} rotateTime={1000} />

            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        marginTop: 30,
    },
    text: {
        fontSize: 40,
        color: "#FFF",
    }
})

export default Test