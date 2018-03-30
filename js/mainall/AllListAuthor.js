/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow　主界面分页－所有－作者列表
 */

import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    ListView,
    TouchableOpacity,
} from 'react-native';

import Toast, {DURATION} from 'react-native-easy-toast'
import NetUtils from "../util/NetUtil";

import constants from '../Constants';
import AuthorPage from '../author/AuthorPage';
var {width, height} = constants.ScreenWH;
var serverApi=require('../ServerApi');
//设置数据源
var ds = new ListView.DataSource({
    //返回条件，任意两条不等
    rowHasChanged: (r1, r2) => r1 != r2

});

var AllListAuthor = React.createClass({
    getDefaultProps() {
        return {
            // 外层回调函数参
            refreshView: false, //刷新
        }
    },
    getInitialState() {
        return {
            author: null,
            dataSource: null,
        };
    },

    /**
     * 发起网络请求
     */
    componentDidMount() {
        this.getHotAuthorData();
    },

    /**
     * 父组件传参变化回调
     * @param nextProps
     */
    componentWillReceiveProps(nextProps){
        if(nextProps.refreshView){
            this.getHotAuthorData();
        }
    },

    render() {
        return (
            <View style={styles.container}>
                <Text style={{
                    color: '#373737',
                    fontSize: width * 0.04,
                    marginTop: width * 0.016,
                    marginLeft: width * 0.06
                }}>近期热门作者</Text>
                {this.renderList()}

                <View style={{width:width, height:width*0.26,alignItems: 'center',justifyContent: 'center',}}>
                <View style={{
                    width: width * 0.22,
                    height: width * 0.096,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderColor: '#808080',
                    borderWidth: width * 0.003,
                    borderRadius: width * 0.005,
                }}>
                    <Text style={{
                        textAlign: 'center',
                        fontSize: width * 0.034,
                        color: '#333333'
                    }}>
                        换一换
                    </Text>
                </View>

                </View>
                <Toast
                    ref="toast"
                    style={{backgroundColor: 'gray'}}
                    position='top'
                    positionValue={height * 0.1}
                    textStyle={{color: 'white'}}
                />
            </View>
        );
    },

    // 热门作者列表
    renderList() {
        if (this.state.dataSource !== null) {
            return (
                <ListView dataSource={this.state.dataSource}
                          renderRow={this.renderRow}
                >
                    }

                </ListView>
            );
        }
    },

    // 单个item返回 线性布局
    renderRow(rowData, sectionID, rowID, highlightRow) {
        // console.log(rowData);
        return (

            <View style={styles.contentContainer}>
                <TouchableOpacity activeOpacity={0.5} style={{flexDirection: 'row'}}
                                  onPress={() => this.pushToRead(rowData)}>
                    {/*左边头像*/}
                    <Image source={{uri: rowData.web_url}} style={styles.leftImage}>
                    </Image>
                    {/*右边文字*/}
                    <View style={styles.rightContainer}>
                        {/*上面名字*/}
                        <Text style={styles.topText}>
                            {rowData.user_name}
                        </Text>
                        {/*下面介绍*/}
                        <Text style={styles.bottomText} numberOfLines={1}>
                            {rowData.desc}
                        </Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.follow}
                    activeOpacity={0.5}
                    onPress={() => this.refs.toast.show('点击了' + rowID + '行', DURATION.LENGTH_LONG)}>

                    <Text style={{
                        textAlign: 'center',
                        fontSize: width * 0.034,
                        color: '#5c5c5c'
                    }}>
                        关注
                    </Text>

                </TouchableOpacity>
            </View>

        )
    },

    // 请求专题数据
    getHotAuthorData() {
        NetUtils.get(serverApi.HotAuthor, null, (result) => {
            this.setState({
                author: result,
            });

            var itemArr = [];
            for (var i = 0; i < 3; i++) {
                itemArr.push(this.state.author.data[i]);
            }

            this.setState({
                dataSource: ds.cloneWithRows(itemArr),
            });
            // console.log(result);
        }, (error) => {
            this.refs.toast.show('error' + error, 500)
        });
    },

    /**
     * 跳转到作者页
     * @param url
     */
    pushToRead(itemData) {
        this.props.navigator.push(
            {
                component: AuthorPage,
                title:'作者页',
                params:{
                    authorData:itemData
                }
            }
        )
    },
});

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        justifyContent: 'center',
    },
    contentContainer: {
        marginTop: width * 0.05,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },

    rightContainer: {
        justifyContent: 'center'
    },
    leftImage: {
        marginTop: width * 0.02,
        marginBottom: width * 0.02,
        marginRight: width * 0.04,
        width: width * 0.11,
        height: width * 0.11,
        borderRadius: width * 0.6,
        resizeMode: 'stretch',
    },
    topText: {
        width: width * 0.54,
        color: '#333333',
        fontSize: width * 0.04,

    },
    bottomText: {
        width: width * 0.54,
        marginTop: width * 0.004,
        color: '#878787',
        fontSize: width * 0.034,
    },

    follow: {
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: '#b4b4b4',
        borderWidth: width * 0.003,
        borderRadius: width * 0.005,
        marginLeft: width * 0.06,
        width: width * 0.14,
        height: width * 0.09,
    }
});

module.exports = AllListAuthor;
