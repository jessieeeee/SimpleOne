/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import NetUtil from '../NetUtil';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    ScrollView,
    Image,
    Platform,
    TouchableOpacity
} from 'react-native';

import Toast, {DURATION} from 'react-native-easy-toast'

var Dimensions = require('Dimensions');
var {width, height} = Dimensions.get('window');

var One = React.createClass({
    /**
     * 初始化状态变量
     * @returns {{oneData: null}}
     */
    getInitialState() {
        return {
            oneData: null
        }
    },

    /**
     * 发起网络请求
     */
    componentDidMount() {
        this.getIdList('http://v3.wufazhuce.com:8000/api/onelist/idlist');
    },

    /**
     * 界面绘制
     * @returns {XML}
     */
    render() {
        return (
            <View style={styles.container}>
                {this.renderNavBar()}
                <ScrollView>
                    <Text style={styles.welcome}>
                        这是主界面
                    </Text>


                </ScrollView>

                <Toast
                    ref="toast"
                    style={{backgroundColor:'gray'}}
                    position='bottom'
                    positionValue={height*0.2}
                    textStyle={{color:'white'}}
                />
            </View>
        );
    },

    renderNavBar() {
        return (
            <View style={styles.outNav}>

                <TouchableOpacity style={styles.leftBtn} onPress={() => this.refs.toast.show('click', DURATION.LENGTH_LONG)}>
                    <Image source={{uri: 'today'}} style={styles.navLeftBar}/>
                </TouchableOpacity>



                <Text style={styles.title}>
                        {this.state.oneData==null?'':this.getDate(this.state.oneData.data.date)}
                 </Text>


                <TouchableOpacity style={styles.rightBtn} onPress={() => this.refs.toast.show('click', DURATION.LENGTH_LONG)}>
                    <Image source={{uri: 'search_night'}} style={styles.navRightBar}/>
                </TouchableOpacity>
            </View>
        );
    },

    /**
     * 获取id列表
     * @param url 请求地址
     */
    getIdList(url) {
        NetUtil.get(url, null, (result) => {
            console.log(result);
            this.getOneList('http://v3.wufazhuce.com:8000/api/onelist/{id}/0', result.data[0]);
        }, (error) =>{
            this.refs.toast.close('error'+error, 500)
        });
    },

    /**
     * 根据id获取内容列表
     * @param url 请求地址
     * @param id  id值
     */
    getOneList(url, id) {
        url = url.replace('{id}', id);
        NetUtil.get(url, null, (result) => {
            this.setState({
                oneData: result,
            })
            console.log(result);
            console.log(this.state.oneData.data.date);
        }, (error) =>{
            this.refs.toast.close('error'+error, 500)
        });
    },

    getDate(date){
        console.log(date);
        var tempDate=new Array();
        tempDate=date.split(' ');
        console.log(tempDate);
        return tempDate[0];
    }
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    outNav: {
        height: Platform.OS == 'ios' ? 64 : height*0.08,
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
        width: width,
        justifyContent: 'center',
        borderBottomWidth: 0.2,
        borderBottomColor:'gray'
    },
    title: {
        fontWeight: 'bold',
        fontFamily: 'hp-title',
        fontSize: width*0.05
    },
    navLeftBar:{
        width: width*0.05*2.15,
        height:width*0.05,
    },
    navRightBar: {
        width: width*0.05,
        height: width*0.05,
    },
    rightBtn: {
        position: 'absolute',
        right: width*0.05,
    },
    leftBtn:{
        position: 'absolute',
        left: width*0.05,
    }
});

module.exports = One;
