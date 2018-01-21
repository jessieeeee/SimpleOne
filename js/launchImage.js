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
    Image
} from 'react-native';
import DateUtils from "./util/DateUtil";
import constants from './Constants';

var Main = require('./Main');
var {width, height} = constants.ScreenWH;
var LaunchImage = React.createClass({
    render() {
        return (
            <View style={styles.container}>
                <Image source={{uri:'opening_title_image'}} style={{width:width*0.34,height:width*0.14}}/>
                <Image source={{uri:this.getOpenImg()}} style={{width:width*0.7,height:width*0.8,marginTop:width*0.08}}/>
                <Text style={styles.date}>
                    {DateUtils.getCurrentDateChinese()}
                </Text>
            </View>
        );
    },
    //返回当前星期对应的图片名称
    getOpenImg(){
        var str;
       switch (DateUtils.getweek()){
           case 0:
               str='opening_sunday';

               break;
           case 1:
               str='opening_monday';

               break;
           case 2:
               str='opening_tuesday';

               break;
           case 3:
               str='opening_wednesday';

               break;
           case 4:
               str='opening_thursday';

               break;
           case 5:
               str='opening_friday';

               break;
           case 6:
               str='opening_saturday';

               break;
       }
        return str;
    },
    componentDidMount() {
        setTimeout(() => {
          this.props.navigator.replace({component:Main})
        }, 2000);
    }
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    date:{
        position:'absolute',
        bottom:width*0.04,
        right:width*0.04,
    }
});

module.exports = LaunchImage;
