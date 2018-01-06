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
    Image,
    Platform
} from 'react-native';

import {Navigator} from 'react-native-deprecated-custom-components';
/**
 * 导入外部的组件类
 * */
import TabNavigator from 'react-native-tab-navigator';

var ONE = require('./mainone/One');
var ALL = require('./mainall/All');
var ME = require('./mainme/Me');

var Dimensions = require('Dimensions');
var {width, height} = Dimensions.get('window');
var barHeight = height * 0.082;


var Main = React.createClass({
    getInitialState() {
        return {
            selectedTab: 'one',
            curBarHeight: 0
        }
    },

    render() {
        return (
            <TabNavigator tabBarStyle={{height: this.state.curBarHeight, backgroundColor: 'white'}}
                          sceneStyle={{paddingBottom: this.state.curBarHeight}}>
                {/*首页*/}
                {this.renderTabBarItem('one', 'ONE', ONE, 'one_line', 'one_fill')}
                {/*音乐影视*/}
                {this.renderTabBarItem('all', 'ALL', ALL, 'all_line', 'all_fill')}
                {/*我的*/}
                {this.renderTabBarItem('me', 'ME', ME, 'me_line', 'me_fill')}
            </TabNavigator>
        );
    },

    /**
     * 设置底部导航是否可见
     * @param isShow
     */
    setNavigatorShow(isShow) {
        var updateHeight;
        if (isShow) {
            updateHeight = barHeight;
        } else {
            updateHeight = 0;
        }

        this.setState({
            curBarHeight: updateHeight
        });
    },

    renderTabBarItem(selectedTab, componentName, component, iconNormal, iconSelected) {
        return (
            <TabNavigator.Item
                renderIcon={() => <Image source={{uri: iconNormal}} style={styles.iconStyle}/>}
                renderSelectedIcon={() => <Image source={{uri: iconSelected}} style={styles.iconStyle}/>}
                onPress={() => {
                    this.setState({selectedTab: selectedTab})
                }}
                selected={this.state.selectedTab == selectedTab}
                selectedTitleStyle={styles.selectedTitleStyle}
            >

                <Navigator
                    initialRoute={{name: componentName, component: component}}
                    configureScene={() => {
                        return Navigator.SceneConfigs.PushFromRight;
                    }}
                    renderScene={(route, tabNavigator) => {
                        return <route.component navigator={this.props.navigator} setNavigatorShow={(isShow)=>{
                            this.setNavigatorShow(isShow);
                        }} {...route.passProps} />;
                    }}
                />
            </TabNavigator.Item>


        )


    }

});

const styles = StyleSheet.create({
    iconStyle: {
        position: 'relative',
        bottom: -8,
        width: Platform.OS == 'ios' ? barHeight * 0.6 : barHeight * 0.8,
        height: Platform.OS == 'ios' ? barHeight * 0.6 : barHeight * 0.8,
    },
    selectedTitleStyle: {
        color: '#555555'
    }
});

module.exports = Main;
