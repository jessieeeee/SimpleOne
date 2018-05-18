'use strict';

import React from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';

import {Navigator} from 'react-native-deprecated-custom-components';
import LaunchImage from './js/launchImage';
// import Test from './js/store/Test';
// import Test from './js/view/Test';
class SimpleOne extends React.Component {
  render() {
    return (
        <Navigator
            initialRoute={{name:'启动页',component:LaunchImage}}
            configureScene={()=>{
                return Navigator.SceneConfigs.PushFromRight;
            }}
            renderScene={(route,navigator)=>{
                let Component = route.component;
                return <Component {...route.passProps} navigator={navigator} route={route}/>;
            }}
        />
    )
  }
}

// console.disableYellowBox = true; 忽略警告弹窗
AppRegistry.registerComponent('SimpleOne', () => SimpleOne);
