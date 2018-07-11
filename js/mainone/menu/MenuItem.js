/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow　主界面分页－一个－展开菜单列表项
 */

import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
} from 'react-native';
import constants from '../../Constants';
import Read from '../../read/Read';
let {width, height} = constants.ScreenWH;

class MenuItem extends Component{
    constructor(props){
        super(props);
    }

    render() {
        return (
            <TouchableOpacity activeOpacity={0.5} style={{flexDirection: 'row'}}
                              onPress={() => this.pushToRead()}>
                <View style={styles.container}>
                    <Image source={{uri: 'arrow_right'}} style={styles.menuButton}/>
                    <View style={styles.titleView}>
                        <Text style={[styles.category, {color: constants.nightMode ? 'white' : constants.normalTextColor}]}>{this.props.category}</Text>
                        <Text style={[styles.title, {color: constants.nightMode ? 'white' : constants.normalTextColor}]}  numberOfLines={1}
                              ellipsizeMode='tail'>{this.props.title}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }


    /**
     * 跳转到阅读页
     * @param url
     */
    pushToRead() {
        if(this.props.data.content_type === 8 && this.props.date === constants.curDate ){
            this.props.todayRadio();
            return;
        }
        this.props.navigator.push(
            {
                component: Read,
                title:'阅读',
                params:{
                    data:this.props.data,
                    entry:constants.MenuRead
                }
            }
        )
    }
}
MenuItem.defaultProps={
    category: '分类',
    title: '分类标题',
    data:null,
    date:'',
    todayRadio:null,
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginTop:width*0.06,
        paddingLeft:width*0.06,
        paddingRight:width*0.06,
        height:width*0.1,
    },
    menuButton: {
        width: width*0.036,
        height: width*0.036,
    },
    titleView: {
        justifyContent:'center',
        marginLeft:width*0.04
    },
    category: {
        fontSize: width * 0.032
    },
    title: {
        fontSize: width * 0.038,
        width:width*0.8
    }
});

export default MenuItem;
