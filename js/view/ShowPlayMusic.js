/**
 * @date : 6/28/18
 * @author : JessieK
 * @email : lyj1246505807@gmail.com
 * @description : 右边显示音乐正在播放的view
 */

import React from 'react'
import PropTypes from 'prop-types'
import {requireNativeComponent, View} from 'react-native'


let iface = {
    name: 'ShowPlayView',
    propTypes: {

        //回调
        onChange: PropTypes.func,
        ...View.propTypes  //支持View组件的所有属性
    }
}

let RCTShowPlayMusicView = requireNativeComponent('ShowPlayView', iface)


export default RCTShowPlayMusicView;