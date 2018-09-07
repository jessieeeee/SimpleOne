/**
 * @date : 9/7/18
 * @author : JessieK
 * @email : lyj1246505807@gmail.com
 * @description : 设置标题
 */

import React, { Component } from 'react'
import {
    StyleSheet,
    Text,
    View,
} from 'react-native'
import constants from '../Constants'
import PropTypes from 'prop-types'
let {width, height} = constants.ScreenWH
class SettingLabel extends Component{
    render() {
        return (
            <View style={[styles.container,{backgroundColor: constants.nightMode ? constants.nightModeGrayDark: constants.labelBgColor}]}>
                <Text style={[styles.label,{color: constants.nightMode ? constants.nightModeTextColor: constants.normalTextColor}]}>
                    {this.props.text}
                </Text>
            </View>
        )
    }
}

SettingLabel.propTypes={
    text: PropTypes.string.isRequired
}
const styles = StyleSheet.create({
    container: {
        justifyContent:'center',
        height:width*0.1,
    },
    label: {
        fontSize: width*0.034,
        width:width,
        marginLeft:width*0.12,
    },
})


export default SettingLabel
