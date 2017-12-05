'use strict';

import React from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';

import {Navigator} from 'react-native-deprecated-custom-components';


var LaunchImage=require('./js/launchImage');
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
                return <Component {...route.passProps} navigator={navigator}/>;
            }}
        />
    )
  }
}
var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  hello: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
});

AppRegistry.registerComponent('SimpleOne', () => SimpleOne)
