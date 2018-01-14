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
    FlatList,
    Image,
} from 'react-native';


import Toast, {DURATION} from 'react-native-easy-toast'
import NetUtils from "../util/NetUtil";
import constants from "../Constants";
var ServerApi = require('../ServerApi');
var Dimensions = require('Dimensions');
var {width, height} = Dimensions.get('window');
var Read=require('../read/Read');
const VIEWABILITY_CONFIG = {
    minimumViewTime: 3000,
    viewAreaCoveragePercentThreshold: 100,
    waitForInteraction: true,
};

var AllListTopic = React.createClass({


    getDefaultProps() {
        return {
            showNum: 10,//展示个数
            refreshView: false, //刷新
            loading: false, //加载更多
            startId: 0,  //请求起始id
            endId: 0,
            // 外层回调函数参
            getEndId: null,
        }
    },

    getInitialState() {

        return {
            topic: null,
            dataSource: null,

        };
    },

    /**
     * 发起网络请求
     */
    componentDidMount() {
        this.getTopicData();
    },

    /**
     * 父组件传参变化回调
     * @param nextProps
     */
    componentWillReceiveProps(nextProps) {
        if (nextProps.refreshView) {
            console.log('刷新了');
            this.getTopicData();
        }
    },

    render() {
        return (
            <View>
                {this.renderList()}

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

    renderList() {
        if (this.state.dataSource !== null) {
            return (
                <FlatList data={this.state.dataSource}
                          renderItem={this.renderRow}
                          keyExtractor={(item, index) => item.id}
                          onViewableItemsChanged={(info) => {
                              console.log('是否可见');
                              console.log(info);
                          }}

                          viewabilityConfig={VIEWABILITY_CONFIG}
                >
                    }

                </FlatList>
            );
        }
    },

    // 单个item返回 线性布局
    renderRow(rowData) {
        // console.log(rowData);
        if (typeof(rowData) !== 'undefined') {
            return (
                <TouchableOpacity activeOpacity={0.5}
                                  onPress={() => this.pushToRead(rowData.item)}>
                    <View style={styles.contentContainer}>
                        {this.renderImage(rowData)}
                        {/*下面的文字*/}
                        <Text style={styles.bottomText}>
                            {rowData.item.title}
                        </Text>
                    </View>


                </TouchableOpacity>
            )
        }

    },

    /*上面的图片*/
    renderImage(rowData) {
        return (
            <Image source={{uri: rowData.item.cover}}
                         style={styles.TopImage}/>
        );
    },
    // 请求专题数据
    getTopicData() {
        var itemArr = []; //把显示数据放到一个数组里
        var url = ServerApi.AllTopic.replace('{id}', this.props.startId);

        NetUtils.get(url, null, (result) => {
            this.setState({
                topic: result,
            });
            var end = false;
            if (this.state.topic.data.length >= this.props.showNum) {
                for (var i = 0; i < this.props.showNum; i++) {
                    console.log(this.state.topic.data[i].cover);
                    itemArr.push(this.state.topic.data[i]);
                }
                // console.log('调用回调' + this.state.topic.data[this.props.showNum - 1].id + ":" + end);
                this.setState({
                    endId: this.state.topic.data[this.props.showNum - 1].id
                });
                this.props.getEndId(this.state.topic.data[this.props.showNum - 1].id, end);
            }
            //如果专题的数据数量小于显示数量，直接全部放进去
            else {
                for (var i = 0; i < this.state.topic.data.length; i++) {
                    console.log(this.state.topic.data[i].cover);
                    itemArr.push(this.state.topic.data[i]);
                }
                end = true;
                this.setState({
                    endId: this.state.topic.data[this.props.showNum - 1].id
                });
                // console.log('调用回调' + this.state.topic.data[this.state.topic.data.length - 1].id + ":" + end);
                this.props.getEndId(this.state.topic.data[this.state.topic.data.length - 1].id, end);
            }


            //将这个数组作为数据源
            this.setState({
                dataSource: itemArr,
            });

        }, (error) => {
            this.refs.toast.show('error' + error, 500)
        });
    },

    /**
     * 跳转到阅读页
     * @param url
     */
    pushToRead(rowData) {
        this.props.navigator.push(
            {
                component: Read,
                title:'阅读',
                params:{
                    contentId:rowData.content_id,
                    contentType:rowData.category,
                    entry:constants.AllRead
                }
            }
        )
    },
});

const styles = StyleSheet.create({

    contentContainer: {
        backgroundColor: 'white',
        justifyContent: 'center',
        borderBottomColor: '#EEEEEE',
        borderBottomWidth: width * 0.028,

    },

    TopImage: {
        margin: width * 0.045,
        width: width * 0.9,
        height: width * 0.54,
    },
    bottomText: {
        marginLeft: width * 0.045,
        marginRight: width * 0.045,
        marginTop: width * 0.01,
        marginBottom: width * 0.04,
        color: '#333333',
        fontSize: width * 0.042
    }
});

module.exports = AllListTopic;
