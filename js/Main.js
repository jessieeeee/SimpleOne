/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow 主界面
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Image,
    BackHandler,
    NativeModules
} from 'react-native';

import {Navigator} from 'react-native-deprecated-custom-components';
import constants from './Constants';
import TabNavigator from 'react-native-tab-navigator';
import ONE from './mainone/One';
import ALL from './mainall/All';
import ME from './mainme/Me';
import LaunchImage from './launchImage'

let toast = NativeModules.ToastNative;
let {width, height} = constants.ScreenWH;
let barHeight = height * 0.082;

let lastBackPressed = 0;

class Main extends Component {
    constructor(props) {
        super(props);
        this.onBackAndroid = this.onBackAndroid.bind(this);
        this.state = {
            selectedTab: 'one',
            curBarHeight: 0,
            welcome: true
        };
    }

    componentDidMount() {

        setTimeout(() => {
            this.setState({
                welcome: false
            })
        }, 2000);

        BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid)
    }

    render() {
        const one_line = constants.nightMode ? 'one_line_night' : 'one_line'
        const one_fill = constants.nightMode ? 'one_fill_night' : 'one_fill'
        const all_line = constants.nightMode ? 'all_line_night' : 'all_line'
        const all_fill = constants.nightMode ? 'all_fill_night' : 'all_fill'
        const me_line = constants.nightMode ? 'me_line_night' : 'me_line'
        const me_fill = constants.nightMode ? 'me_fill_night' : 'me_fill'
        return (
            <View style={{flex: 1}}>
                <TabNavigator animationEnabled={true} tabBarStyle={{
                    height: this.state.curBarHeight,
                    backgroundColor: constants.nightMode ? constants.nightModeGrayLight : 'white'
                }}
                              sceneStyle={{paddingBottom: this.state.curBarHeight}}>
                    {/*首页*/}
                    {this.renderTabBarItem('one', 'ONE', ONE, one_line, one_fill)}
                    {/*音乐影视*/}
                    {this.renderTabBarItem('all', 'ALL', ALL, all_line, all_fill)}
                    {/*我的*/}
                    {this.renderTabBarItem('me', 'ME', ME, me_line, me_fill)}

                </TabNavigator>
                {this.state.welcome ? <LaunchImage/> : null}
            </View>
        );

    }


    /**
     * 设置底部导航是否可见
     * @param isShow
     */
    setNavigatorShow(isShow) {
        let updateHeight
        if (isShow) {
            updateHeight = barHeight;
        } else {
            updateHeight = 0;
        }

        this.setState({
            curBarHeight: updateHeight
        });
    }

    renderTabBarItem(selectedTab, componentName, component, iconNormal, iconSelected) {
        return (
            <TabNavigator.Item
                renderIcon={() => <Image source={{uri: iconNormal}} style={styles.iconStyle}/>}
                renderSelectedIcon={() => <Image source={{uri: iconSelected}} style={styles.iconStyle}/>}
                onPress={() => {
                    this.setState({selectedTab: selectedTab})
                }}
                selected={this.state.selectedTab === selectedTab}
                selectedTitleStyle={styles.selectedTitleStyle}
            >

                <Navigator
                    initialRoute={{name: componentName, component: component}}
                    configureScene={() => {
                        return Navigator.SceneConfigs.PushFromRight;
                    }}
                    renderScene={(route, tabNavigator) => {
                        return <route.component navigator={this.props.navigator} setNavigatorShow={(isShow) => {
                            this.setNavigatorShow(isShow);
                        }} {...route.passProps} />;
                    }}
                />
            </TabNavigator.Item>
        )
    }

    onBackAndroid() {
        console.log(this.props);
        const nav = this.props.navigator;
        const routers = nav.getCurrentRoutes();
        if (routers.length > 1) {
            // 默认行为： 退出当前界面。

            nav.pop();
            return true;
        } else {
            if (lastBackPressed && lastBackPressed + 2000 >= Date.now()) {
                //最近2秒内按过back键，可以退出应用。
                return false;
            }
            lastBackPressed = Date.now();
            toast.showMsg('再按一次退出应用', toast.SHORT);
            return true;
        }
    }

}


const styles = StyleSheet.create({
    iconStyle: {
        position: 'relative',
        bottom: -8,
        width: barHeight * 0.8,
        height: barHeight * 0.8,

    },
    selectedTitleStyle: {
        color: '#555555'
    }
});

export default Main;
