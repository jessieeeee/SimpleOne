/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow　设置项
 */

import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,

} from 'react-native';
import constants from '../Constants';
let {width, height} = constants.ScreenWH;

class SettingItem extends Component{
    render() {
        return (
            <View style={[styles.container,{backgroundColor: constants.nightMode ? constants.nightModeGrayLight:'white',borderBottomColor:constants.nightMode?constants.nightModeGrayLight:constants.bottomDivideColor,}]}>
                <Text style={[styles.item,{color:constants.nightMode ? constants.nightModeTextColor:constants.normalTextColor}]}>
                    {this.props.text}
                </Text>

                {this.renderRight()}
            </View>
        );
    }

    renderRight() {
        if(this.props.rightStyle === 0){
            return (
                constants.nightMode ? <Image style={styles.iconArrow} source={{uri:'arrow_right_white'}}/>
                : <Image style={styles.iconArrow} source={{uri:'arrow_right'}}/>
            );
        }else if(this.props.rightStyle === 1){
            return (
                <View style={styles.checkBoxView} >
                    <Image source={{uri:'checkbox_bg'}} style={{width:width*0.064,height:width*0.06}}/>
                    {this.renderSelected()}
                </View>
            );
        }else if(this.props.rightStyle === 2){
            return (
                <Text style={styles.rightText}>
                    4.3.4
                </Text>
            );
        }
    }

    /**
     * 渲染选中
     * @returns {*}
     */
    renderSelected(){
        if(this.props.selected){
            return (
                <Image source={{uri:'checkbox_click'}} style={{width:width*0.05,height:width*0.04,position:'absolute',top:width*0.01}}/>
            )
        }
    }
}
SettingItem.defaultProps={
    text: '',
    rightStyle:0,
};

const styles = StyleSheet.create({
    container: {
        justifyContent:'center',
        height:width*0.1384,
        borderBottomWidth: constants.divideLineWidth
    },
    item: {
        fontSize: width*0.04,
        width:width,
        marginLeft:width*0.12,

    },
    rightText:{
        position:'absolute',
        right: width*0.085,
        color:'#b5b5b5',
        fontSize:width*0.038
    },
    iconArrow:{
        position:'absolute',
        right: width*0.084,
        height:width*0.046,
        width:width*0.046
    },
    checkBoxView:{
        position:'absolute',
        right: width*0.08,
        alignItems:'center',
        justifyContent:'center',
    }
});

export default SettingItem;
