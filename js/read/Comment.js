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
    TouchableOpacity,
    Image,
} from 'react-native';

var Login = require('../login/Login');
var Dimensions = require('Dimensions');
var {width, height} = Dimensions.get('window');
import constants from '../Constants';
var Comment = React.createClass({

    getDefaultProps() {
        return {
            data: null,

        }
    },
    getInitialState() {
        return {
            praise: false,
            praiseNum: this.props.data.praisenum,
        }
    },
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.topView}>
                    <Image source={{uri: this.props.data.user.web_url}} style={styles.avatar}/>
                    <Text style={styles.username}>{this.props.data.user.user_name}</Text>
                    <Text style={styles.date}>{this.props.data.input_date.substring(0, 18)}</Text>
                </View>
                <Text style={styles.content}>{this.props.data.content}</Text>
                <View
                    style={{width: width, height: width * 0.1, justifyContent: 'center', marginBottom: width * 0.03,}}>
                    <View style={styles.bottomView}>
                        <TouchableOpacity style={styles.iconComment}onPress={() => {
                            this.pushToLogin()
                        }}>
                            <Image source={{uri: 'comment_image'}} style={styles.icon}/>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.iconPraise}onPress={() => {
                             this.praiseClick()
                        }}>
                            {this.renderPraise()}
                        </TouchableOpacity>
                        <Text style={styles.praiseNum}>{this.state.praiseNum}</Text>
                    </View>
                </View>
            </View>
        );
    },

    praiseClick(){
        this.setState({
            praiseNum: this.state.praise?this.props.data.praisenum:this.props.data.praisenum + 1,
            praise: !this.state.praise,
        });

    },
    renderPraise() {
        if (this.state.praise) {
            return (
                <Image source={{uri: 'comment_laud_selected'}} style={styles.icon}/>
            );
        } else {
            return (
                <Image source={{uri: 'comment_laud'}} style={styles.icon}/>
            );
        }
    },
    /**
     * 跳转到登录
     * @param url
     */
    pushToLogin() {

        this.props.navigator.push(
            {
                component: Login,
                title: '登录',
                params: {}
            }
        )
    },
});

const styles = StyleSheet.create({
        container: {
            flex: 1,
            marginLeft: width * 0.05,
            marginRight: width * 0.05,
            justifyContent: 'center',
            alignItems: 'center',
            borderBottomWidth: constants.divideLineWidth,
            borderBottomColor: '#dddddd',
            backgroundColor: 'white'
        },
        topView: {
            marginTop: width * 0.034,
            width: width,
            flexDirection: 'row',
            alignItems: 'center'
        },
        avatar: {
            marginLeft: width * 0.06,
            width: width * 0.056,
            height: width * 0.056,
            borderRadius: width * 0.04
        },
        username: {
            marginLeft: width * 0.02,
            color: '#999999',
            fontSize: width * 0.04
        },
        date: {
            color: '#8f8f8f',
            fontSize: width * 0.035,
            position: 'absolute',
            right: width * 0.02
        },
        content: {
            width: width * 0.8,
            lineHeight: parseInt(width * 0.08),
            marginTop: width * 0.04,
            color: '#333333',
            fontSize: width * 0.04
        },
        bottomView: {
            flex: 1,
            flexDirection: 'row',
            position: 'absolute',
            right: width * 0.1,
        },
        iconPraise: {
            marginRight: width * 0.02,
            position: 'relative',
            bottom: -width * 0.02
        },
        iconComment: {
            marginRight: width * 0.05,
            position: 'relative',
            bottom: -width * 0.026
        },
        icon: {
            width: width * 0.046,
            height: width * 0.046,
        },
        praiseNum: {
            color: '#666666',
            fontSize: width * 0.03,
            position: 'relative',
            bottom: -width * 0.026
        },
    }
);

module.exports = Comment;
