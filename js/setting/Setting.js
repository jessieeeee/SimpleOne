/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow 设置界面
 */

import React, {Component} from 'react'
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    Platform,
    ScrollView,
    NativeModules,
    TouchableOpacity,
    Alert,
    Linking
} from 'react-native';
import constants from '../Constants'
import SettingItem from './SettingItem'
import SettingLabel from './SettingLabel'
import CommStyles from "../CommStyles"
import MyStorage from "../util/MySorage"

let toast = NativeModules.ToastNative

let {width, height} = constants.ScreenWH

class Setting extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nightMode: constants.nightMode
        }
    }

    render() {
        return (
            <ScrollView style={[styles.container,{backgroundColor: constants.nightMode? '#272727':'#f8f8f8'}]}>
                <View >
                    {this.renderNavBar()}
                    <SettingLabel text={'设置'}/>
                    <TouchableOpacity onPress={() => {
                        constants.nightMode = !constants.nightMode
                        // 修改当前模式
                        MyStorage.save('nightMode', constants.nightMode)
                        console.log('当前渲染' + constants.nightMode)
                        this.setState({
                            nightMode: constants.nightMode
                        })

                    }}>
                        <SettingItem text={'夜间模式'} rightStyle={1} selected={this.state.nightMode}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        toast.showMsg('demo不支持此功能', toast.SHORT)
                    }}>
                        <SettingItem text={'流量播放提醒'} rightStyle={1} selected={false}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        Alert.alert(
                            '',
                            '确认要清除缓存?',
                            [
                                {
                                    text: '确定', onPress: () => {
                                        toast.showMsg('清除缓存成功!', toast.SHORT)
                                    }
                                },
                                {
                                    text: '取消', onPress: () => {
                                    }
                                },
                            ]
                        )
                    }}>
                        <SettingItem text={'清除缓存'} rightStyle={0}/>
                    </TouchableOpacity>

                    <SettingLabel text={'反馈'}/>
                    <TouchableOpacity onPress={() => {
                        toast.showMsg('欢迎到github提交issue!', toast.SHORT)
                    }}>
                        <SettingItem text={'意见与反馈'} rightStyle={0}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        Linking.openURL('https://github.com/jessieeeee/SimpleOne').catch(err => console.error('发生了一个错误', err))
                    }}>
                        <SettingItem text={'关注我们'} rightStyle={0}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        toast.showMsg('demo不支持此功能', toast.SHORT)
                    }}>
                        <SettingItem text={'给一个评分'} rightStyle={0}/>
                    </TouchableOpacity>

                    <SettingLabel text={'关于'}/>
                    <TouchableOpacity onPress={() => {
                        toast.showMsg('遵守开源协议，仅供学习', toast.SHORT)
                    }}>
                        <SettingItem text={'用户协议'} rightStyle={0}/>
                    </TouchableOpacity>
                    <SettingItem text={'版本号'} rightStyle={1}/>

                </View>
            </ScrollView>
        );
    }

    /**
     * 渲染顶部导航
     */
    renderNavBar() {
        return (
            // 顶部导航bar
            <View style={[CommStyles.outNav, { borderBottomColor: constants.nightMode ? '#484848':'#dddddd',backgroundColor: constants.nightMode ? '#484848':'white'}]}>

                {/*左边按钮*/}
                <TouchableOpacity style={CommStyles.leftBack}
                                  onPress={() => this.props.navigator.pop()}>
                    {
                        constants.nightMode ?
                            <Image source={{uri: 'icon_back_white'}} style={CommStyles.navLeftBack}/> :
                            <Image source={{uri: 'icon_back'}} style={CommStyles.navLeftBack}/>
                    }
                </TouchableOpacity>

                <Text style={[styles.title, {color: constants.nightMode ? '#fcfcfc' : '#414141'}]}> 设置</Text>

            </View>
        );
    }

}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    title: {
        fontSize: width * 0.04,
        fontWeight: 'bold'
    }
});
export default Setting
