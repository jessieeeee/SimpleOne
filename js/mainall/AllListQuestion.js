/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow 主界面分页－所有－问题列表
 */

import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    ScrollView,
    Image,
    TouchableOpacity,
    NativeModules,
} from 'react-native';
import NetUtils from "../util/NetUtil";
import constants from "../Constants";
import Read from '../read/Read';
import ServerApi from '../ServerApi';
let {width, height} = constants.ScreenWH;

class  AllListQuestion extends Component{
    constructor(props){
        super(props);
        this.state={};
    }

    /**
     * 发起网络请求
     */
    componentDidMount() {
        this.getQuestionData();
    }

    /**
     * 父组件传参变化回调
     * @param nextProps
     */
    componentWillReceiveProps(nextProps){
        if(nextProps.refreshView){
            this.getQuestionData();
        }
    }

    render() {
        return (
            <View style={[styles.container,{backgroundColor:constants.nightMode ? constants.nightModeGrayLight : 'white'}]}>
                <Text style={[styles.title, {color: constants.nightMode ? 'white' : constants.normalTextColor}]}>
                    所有人问所有人
                </Text>
                <ScrollView style={styles.scrollview} horizontal={true} showsHorizontalScrollIndicator={false}>

                    {/*下部分*/}
                    {this.renderAllItem()}
                </ScrollView>


            </View>
        );
    }

    //返回所有的item
    renderAllItem() {
        if(this.state.questions!==undefined){
            //定义组件数组
            let itemArr = [];
            //取出数据
            let questionData = this.state.questions.data;
            for (let i = 0; i < questionData.length; i++) {
                //取出单个数据
                let data = questionData[i];
                //创建组件装入数组
                itemArr.push(
                    <QuestionItem key={i} data={data} navigator={this.props.navigator}/>
                );
            }
            return itemArr;
        }
    }

    // 请求问题数据
    getQuestionData() {
        NetUtils.get(ServerApi.AllQuestion, null, (result) => {
            this.setState({
                questions: result,
            });
            // console.log(result);
        }, (error) => {
            console.log('error' + error)
        });
    }
}

AllListQuestion.defaultProps={
    refreshView: false, //刷新
};

export class QuestionItem extends Component{
    constructor(props){
        super(props);

    }

    render() {
        return (
            <TouchableOpacity  onPress={() => this.pushToRead(this.props.data)}>
                <View style={styles.itemview}>
                    <Image source={{uri: this.props.data.cover}} style={{resizeMode:'stretch',width:width*0.56,height:width*0.33,borderRadius:width*0.01}}/>
                    <View style={{position:'absolute', top:0, backgroundColor:'#333333',width:width*0.56,height:width*0.33 , opacity:0.5,borderRadius:width*0.01}}/>
                    <View style={styles.itemText}>
                        <Text style={{color:'white',fontSize:width*0.04  ,width:width*0.4}}
                              numberOfLines={1}>{this.props.data.title}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }

    /**
     * 跳转到阅读页
     * @param url
     */
    pushToRead(itemData) {
        this.props.navigator.push(
            {
                component: Read,
                title:'阅读',
                params:{
                    contentId:itemData.content_id,
                    contentType:itemData.category,
                    entry:constants.AllRead
                }
            }
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    scrollview: {
        margin:width*0.05,
        flexDirection: 'row',
        height:width*0.37,
    },
    itemview:{
        width:width*0.56,
        height:width*0.33,
        justifyContent:'center',
        alignItems:'center',
        marginRight:width*0.03,

    },
    itemText:{
        width:width*0.56,
        height:width*0.33,
        justifyContent:'center',
        alignItems:'center',
        position:'absolute',
        top:0
    },
    title:{
        fontSize:width*0.04,
        marginTop:width*0.03,
        marginLeft:width*0.05,
    }
});

export default AllListQuestion;
