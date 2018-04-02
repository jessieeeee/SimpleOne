/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow 主界面-one列表-最后一项
 */

import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image
} from 'react-native';
import constants from '../Constants';
var {width, height} = constants.ScreenWH;
class OneListItemBottom extends Component{
    constructor(props){
        super(props);
    }

    render() {
        return (
            <View style={styles.container}>
                <Image source={{uri:'feeds_bottom_image'}} style={{width:width*0.36,height:width*0.26}}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height:height*0.3,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#eeeeee',
    },

});

export default OneListItemBottom;
