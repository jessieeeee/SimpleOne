
import React, {Component} from 'react'
import {StyleSheet,Text,Image,View,TouchableOpacity} from 'react-native'
import constants from '../Constants'
import CommStyles from "../CommStyles"
import Login from '../login/Login'
import PropTypes from 'prop-types'
let {width, height} = constants.ScreenWH
class ReadTopBar extends Component {
    static propTypes = {
        bgColor: PropTypes.string
    }
    render(){
        return (
            // 顶部导航bar
            <View style={[CommStyles.outNav, {
                borderBottomColor: constants.nightMode ? constants.nightModeGrayLight : constants.bottomDivideColor,
                backgroundColor: constants.nightMode ? constants.nightModeGrayLight : this.props.bgColor
            }]}>

                {/*左边按钮*/}
                <TouchableOpacity style={CommStyles.leftBack}
                                  onPress={() => {
                                      this.props.navigator.pop();
                                  }}>
                    <Image source={{uri: 'icon_back'}} style={CommStyles.navLeftBack}/>
                </TouchableOpacity>

                <Text style={[styles.title,{color:constants.nightMode ? 'white' : constants.normalTextColor}]}>{this.getCategory()}</Text>

                <TouchableOpacity
                    onPress={() => this.pushToLogin()} style={{position: 'absolute', right: width * 0.032}}>
                    <Image source={{uri: 'stow_default'}} style={styles.rightBtn}/>
                </TouchableOpacity>
            </View>
        )
    }


    /**
     * 获取分类
     */
    getCategory() {
        let contentType
        if (this.props.route.params.entry === constants.MenuRead) {
            let tag = this.props.route.params.data.tag
            contentType = this.props.route.params.data.content_type
            if (tag) {
                return tag.title
            }
        }
        if (this.props.route.params.entry === constants.OneRead) {
            let tagList = this.props.route.params.data.tag_list
            contentType = this.props.route.params.data.content_type
            if (tagList && tagList.length > 0) {
                return tagList[0].title
            }
        } else {
            contentType = this.props.route.params.contentType
        }

        switch (contentType){
            case 1:
                return '阅读'
            case 3:
                return '问答'
            case 2:
                return '连载'
            case 4:
                return '音乐'
            case 5:
                return '影视'
            case 8:
                return '电台'
            case 11:
                return '专题'
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
    title: {
        fontSize: width * 0.038,
    },
    rightBtn: {
        width: height * 0.035,
        height: height * 0.035,
    },

})
export default ReadTopBar