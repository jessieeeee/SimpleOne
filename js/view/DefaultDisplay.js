/**
 * @author : JessieK
 * @email : lyj1246505807@gmail.com
 * @description : 默认界面展示
 */
import React, {Component} from 'react'
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native'
import PropTypes from 'prop-types'
import Status from '../util/Status'
import constants from '../Constants'
let {width, height} = constants.ScreenWH
class DefaultDisplay extends Component {

    constructor(props){
        super(props)
        this.state = {
            status: props.status
        }
    }
    static propTypes = {
        status: PropTypes.number, // 展示状态,
    }

    static defaultProps = {
        status: Status.hide, // 默认加载状态
    }

    render() {
        return (
            <View style={{
                flex:1,
                justifyContent: 'center',
                alignItems: 'center',
                position: 'absolute',
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                backgroundColor: constants.nightMode ? constants.nightModeGrayLight : 'white'
            }}>
                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                    {this.renderStatus()}
                    {
                        this.state.status !== Status.Loading ?
                            <TouchableOpacity onPress={() =>
                            {
                                this.props.onRetry()
                                this.setState({
                                    status: Status.Loading
                                })
                            }}>
                                <Text style={[styles.retryText,{ color: constants.nightMode ? 'white' : constants.normalTextColor,}]}>重新加载</Text>
                            </TouchableOpacity> : null
                    }
                </View>
            </View>
        )
    }

    renderStatus() {
        switch (this.state.status) {
            case Status.Loading:
                return this.renderLoading()
            case Status.Empty:
                return this.renderEmpty()
            case Status.Error:
                return this.renderError()
        }
    }

    /**
     * 渲染空界面
     */
    renderEmpty() {
        return (
            <Text style={[styles.tipText,{ color: constants.nightMode ? 'white' : constants.normalTextColor,}]}>咦？这里是空的？</Text>
        )
    }

    /**
     * 渲染错误界面
     */
    renderError() {
        return (
            <Text style={[styles.tipText,{ color: constants.nightMode ? 'white' : constants.normalTextColor,}]}>咦？出错了吗？</Text>
        )
    }

    /**
     * 渲染加载界面
     */
    renderLoading() {
        return (
            <Text style={[styles.tipText,{ color: constants.nightMode ? 'white' : constants.normalTextColor,}]}>正在加载中.....</Text>
        )
    }
}

const styles = StyleSheet.create({
    retryText: {
        fontSize: width * 0.03,
        borderWidth: 0.5,
        borderColor: constants.bottomDivideColor,
        borderRadius: 4,
        padding:  width * 0.02,
        marginTop: width * 0.04,
    },
    tipText: {
        fontSize: width * 0.04,
    },
})

export default DefaultDisplay