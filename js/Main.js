/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow 主界面
 */

import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    Platform,
    BackHandler,
    NativeModules
} from 'react-native';

import {Navigator} from 'react-native-deprecated-custom-components';
import constants from './Constants';
import TabNavigator from 'react-native-tab-navigator';
import ONE from './mainone/One';
import ALL from './mainall/All';
import ME from './mainme/Me';
let toast = NativeModules.ToastNative;
let {width, height} = constants.ScreenWH;
let barHeight = height * 0.082;

let lastBackPressed=0;
class Main extends Component{
    constructor(props){
        super(props);
        this.onBackAndroid=this.onBackAndroid.bind(this);
        this.state={
            selectedTab: 'one',
            curBarHeight: 0,
        };
    }
    componentDidMount(){
        BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid);
    }

    render() {
        return (

            <TabNavigator animationEnabled={true} tabBarStyle={{height: this.state.curBarHeight, backgroundColor: 'white'}}
                          sceneStyle={{paddingBottom: this.state.curBarHeight}}>
                {/*首页*/}
                {this.renderTabBarItem('one', 'ONE', ONE, 'one_line', 'one_fill')}
                {/*音乐影视*/}
                {this.renderTabBarItem('all', 'ALL', ALL, 'all_line', 'all_fill')}
                {/*我的*/}
                {this.renderTabBarItem('me', 'ME', ME, 'me_line', 'me_fill')}

            </TabNavigator>

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
                        return <route.component navigator={this.props.navigator} setNavigatorShow={(isShow)=>{
                            this.setNavigatorShow(isShow);
                        }} {...route.passProps} />;
                    }}
                />
            </TabNavigator.Item>
        )
    }

    onBackAndroid(){
        console.log(this.props);
        const nav = this.props.navigator;
        const routers = nav.getCurrentRoutes();
        if (routers.length > 1) {
            // 默认行为： 退出当前界面。

            nav.pop();
            return true;
        }else{
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
        width: Platform.OS == 'ios' ? barHeight * 0.6 : barHeight * 0.8,
        height: Platform.OS == 'ios' ? barHeight * 0.6 : barHeight * 0.8,

    },
    selectedTitleStyle: {
        color: '#555555'
    }
});

export default Main;
