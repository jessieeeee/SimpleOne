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
    ListView,
} from 'react-native';
import Toast, {DURATION} from 'react-native-easy-toast'
import NetUtils from "../util/NetUtil";
var ServerApi=require('../ServerApi');
var Dimensions = require('Dimensions');
var {width, height} = Dimensions.get('window');
//设置数据源
var ds = new ListView.DataSource({
    //返回条件，任意两条不等
    rowHasChanged: (r1, r2) => r1 != r2

});
var AllListTopic = React.createClass({


    getDefaultProps() {
        return {
            showNum: 10 ,//展示个数
            refreshView: false, //刷新
            loadMore: false, //加载更多
            startId: 0,  //请求起始id

            // 外层回调函数参
            getEndId:null,
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
    componentWillReceiveProps(nextProps){
        if(nextProps.refreshView){
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
        console.log(rowData);
        return (
            <TouchableOpacity activeOpacity={0.5}
                              onPress={() => this.refs.toast.show('点击了' + rowID + '行', DURATION.LENGTH_LONG)}>
                <View style={styles.contentContainer}>
                    {/*上面的图片*/}
                    <Image source={{uri: rowData.cover}} style={styles.TopImage}>
                    </Image>
                    {/*下面的文字*/}
                    <Text style={styles.bottomText}>
                        {rowData.title}
                    </Text>
                </View>


            </TouchableOpacity>
        )
    },

    // 请求专题数据
    getTopicData() {
        var url=ServerApi.AllTopic.replace('{id}',this.props.startId);
        NetUtils.get(url, null, (result) => {
            this.setState({
                topic: result,
            });

            var itemArr=[];
            for(var i=0;i<this.props.showNum;i++){
                itemArr.push(this.state.topic.data[i]);
            }

            this.setState({
                dataSource: ds.cloneWithRows(itemArr),
            });
            this.props.getEndId(this.state.topic.data[this.props.showNum].id);
            console.log(result);
        }, (error) => {
            this.refs.toast.close('error' + error, 500)
        });
    }
});

const styles = StyleSheet.create({

    contentContainer: {
        backgroundColor: 'white',
        justifyContent: 'center',
        borderBottomColor:'#EEEEEE',
        borderBottomWidth: width * 0.028,

    },

    TopImage: {
        margin:width*0.045,
        width: width * 0.9,
        height: width * 0.54,
    },
    bottomText: {
        marginLeft:width*0.045,
        marginRight:width*0.045,
        marginTop: width * 0.01,
        marginBottom: width * 0.04,
        color: '#333333',
        fontSize:width*0.042
    }
});

module.exports = AllListTopic;
