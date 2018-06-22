/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow 主界面分页－一个－大多数item
 */

import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    Platform,
    TouchableOpacity
} from 'react-native';
import DateUtil from "../util/DateUtil";
import Read from '../read/Read';
import constants from '../Constants';
import Share from '../share/Share';
import CommStyles from "../CommStyles";
let {width, height} = constants.ScreenWH;

class OneListCommon extends Component{
    constructor(props){
        super(props);
        this.state={
            like: false,
            likeNum:this.props.data.like_count
        };
    }

    //渲染
    render() {
        return (
            <TouchableOpacity activeOpacity={1} onPress={() => this.pushToRead()}>
                <View style={CommStyles.containerItem}>
                    <Text style={CommStyles.categoryItem}>{this.getCategory()}</Text>
                    {/*标题*/}
                    <Text style={CommStyles.titleItem}>{this.props.data.title}</Text>
                    {/*回答者*/}
                    <Text style={styles.author}>{this.getAuthor()}</Text>
                    {this.renderImg()}
                    {/*插图下面的那句话*/}
                    <Text style={styles.forward}>{this.props.data.forward}</Text>
                    {/*最下面的bar*/}
                    <View style={styles.bar}>
                        {/*左边的按钮*/}
                        <Text style={CommStyles.dateItem}>{DateUtil.showDate(this.props.data.post_date)}</Text>

                        {/*右边的按钮*/}
                        <View style={CommStyles.rightBtnItem}>
                            <View style={{flexDirection: 'row', width: width * 0.1, marginRight: width * 0.03}}>
                                <TouchableOpacity
                                    onPress={() => this.likeClick()}>
                                    <Image source={{uri: this.showLikeIcon()}} style={CommStyles.barRightBtnsIconItem1}/>
                                </TouchableOpacity>

                                {constants.renderlikeNum(this.state.likeNum)}

                            </View>
                            <TouchableOpacity
                                onPress={() => this.pushToShare()}>
                                <Image source={{uri: 'share_image'}} style={CommStyles.barRightBtnsIconItem2}/>
                            </TouchableOpacity>
                        </View>
                    </View>

                </View>
            </TouchableOpacity>
        );
    }

    renderImg() {
        if (this.props.data.img_url !== '') {
            return (
                <Image source={{uri: this.props.data.img_url}} style={styles.centerImg}/>
            );
        }
    }

    /**
     * 跳转到阅读页
     * @param url
     */
    pushToRead() {

        this.props.navigator.push(
            {
                component: Read,
                title: '阅读',
                params: {
                    data: this.props.data,
                    entry: constants.OneRead
                }
            }
        )
    }

    /**
     * 跳转到分享
     * @param url
     */
    pushToShare() {
        this.props.navigator.push(
            {
                component: Share,
                title: '分享',
                params: {
                    showlink: true,
                    shareInfo: this.props.data.share_info,
                    shareList: this.props.data.share_list
                }
            }
        )
    }

    /**
     * 显示分类
     */
    getCategory() {
        if (this.props.data.tag_list != null && this.props.data.tag_list.length > 0) {
            return '- ' + this.props.data.tag_list[0].title + ' -';
        }
        else if (this.props.data.category === constants.CategoryRead) {
            return '- 阅读 -';
        }
        else if (this.props.data.category === constants.CategorySerial) {
            return '- 连载 -';
        }
        else if (this.props.data.category === constants.CategoryQuestion) {
            return '- 问答 -';
        }
        else {
            return '- 连载 -';
        }
    }

    /**
     * 获取回答者
     * @returns {*}
     */
    getAuthor() {
        if (this.props.data.author.user_name !== undefined){
            let tempStr
            tempStr = this.props.data.author.user_name.split(' ');
            if (this.props.data.category === constants.CategoryRead) {
                return '文 / ' + tempStr[0];
            }
            return tempStr[0];
        } else{
            return '';
        }

    }

    /**
     * 点击喜欢
     */
    likeClick() {
        this.setState({
            likeNum: this.state.like?this.props.data.like_count:this.props.data.like_count + 1,
            like: !this.state.like
        });
    }

    /**
     * 根据当前状态，显示喜欢图标
     * @returns {*}
     */
    showLikeIcon() {
        //喜欢
        if (this.state.like) {
            return 'bubble_liked';
        } else {
            return 'bubble_like';
        }
    }
}

const styles = StyleSheet.create({
    author: {
        width: width,
        marginTop: width * 0.03,
        paddingLeft: width * 0.05,
        fontSize: width * 0.038,
        color: '#808080'
    },
    centerImg: {
        marginTop: width * 0.02,
        width: width * 0.9,
        height: width * 0.52,
    },
    forward: {
        width: width,
        paddingLeft: width * 0.05,
        paddingRight: width * 0.05,
        marginTop: width * 0.02,
        fontSize: width * 0.038,
        color: '#808080',
        lineHeight: parseInt(width * 0.08)
    },
    bar: {
        alignItems: 'center',
        marginTop: width * 0.06,
        flexDirection: 'row',
        width: width,
        height: Platform.OS == 'ios' ? height * 0.06 : height * 0.057,
    },
});

export default OneListCommon;
