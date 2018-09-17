import React, {Component} from 'react'
import {View, TouchableOpacity, Text ,Image ,StyleSheet} from 'react-native'
import constants from '../Constants'
import Login from '../login/Login'
import PropTypes from 'prop-types'
import Share from '../share/Share'
let {width, height} = constants.ScreenWH
class ReadBottomBar extends Component {
    static defaultProps = {
        like: false,
        likeNum: 0,
        readData: null
    }

    static propTypes ={
        likeNum : PropTypes.number,
        readData: PropTypes.object,
        like: PropTypes.bool,
        likeClick: PropTypes.func.isRequired
    }

    render(){
        return (
            <View
                style={[styles.bottomView, {backgroundColor: constants.nightMode ? constants.nightModeGrayLight : 'white',  borderTopColor: constants.nightMode ? constants.nightModeGrayLight: constants.itemDividerColor}]}>

                <TouchableOpacity style={{position: 'absolute', left: width * 0.05,}}
                                  onPress={() => this.pushToLogin()}>
                    <Text style={[styles.textInput, {
                        borderColor: constants.nightMode ? constants.nightModeGrayDark : constants.divideLineWidth,
                        backgroundColor: constants.nightMode ? constants.nightModeGrayDark : 'white',
                    }]}>写一个评论..</Text>
                </TouchableOpacity>

                <View style={styles.buttomBar}>
                    <View style={{flexDirection: 'row', justifyContent: 'center', width: width * 0.1,position: 'absolute', right: width * 0.38}}>
                        <TouchableOpacity onPress={this.props.likeClick}>
                            <Image source={{uri: this.showLikeIcon()}} style={styles.rightBtnIcon}/>
                        </TouchableOpacity>

                        {constants.renderlikeNum(this.props.likeNum)}
                    </View>
                    <View style={{flexDirection: 'row', justifyContent: 'center', width: width * 0.1 ,position: 'absolute', right: width * 0.18}}>
                        <TouchableOpacity onPress={() => {}} >
                            <Image source={{uri: 'bottom_comment'}} style={styles.rightBtnIcon}/>
                        </TouchableOpacity>

                        {this.renderCommentNum()}
                    </View>
                    {this.renderShare()}
                </View>
            </View>
        )
    }

    renderShare() {
        if (this.props.route.params.data) {
            return (
                <TouchableOpacity style={{position: 'absolute', right: 0}}
                                  onPress={() => this.pushToShare()}>

                    <Image source={{uri: 'share_image'}} style={styles.rightBtnIcon}/>
                </TouchableOpacity>
            );
        }
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
                    shareInfo: this.props.route.params.data.share_info,
                    shareList: this.props.route.params.data.share_list,
                }
            }
        )
    }

    renderCommentNum() {
        if (this.props.readData && this.props.readData.commentnum > 0) {
            return (
                <Text style={{
                    position: 'relative',
                    left: width * 0.003,
                    bottom: width * 0.016,
                    fontSize: width * 0.024,
                    color: '#A7A7A7',
                }}>
                    {this.props.readData.commentnum}
                </Text>
            )
        }
    }

    //根据当前状态，显示喜欢图标
    showLikeIcon() {
        //喜欢
        if (this.props.like) {
            return 'bubble_liked'
        } else {
            return 'bubble_like'
        }
    }

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
    }

}
const styles = StyleSheet.create({
    bottomView: {
        height: width * 0.14,
        width: width,
        position: 'absolute',
        bottom: 0,
        flexDirection: 'row',
        alignItems: 'center',
        borderTopWidth: 0.2
    },
    buttomBar: {
        width: width * 0.5,
        height: width * 0.1,
        flexDirection: 'row',
        position: 'absolute',
        right: width * 0.05,
        alignItems: 'center',
    },
    textInput: {
        width: width * 0.36,
        height: width * 0.096,
        color: '#a8a8a8',
        borderRadius: width * 0.01,
        borderWidth: 1,
        textAlignVertical: 'center',
        paddingLeft: width * 0.03
    },
    rightBtnIcon: {
        width: width * 0.06,
        height: width * 0.06,
    },
    rightBtn: {
        width: height * 0.035,
        height: height * 0.035,
    },

})
export default ReadBottomBar