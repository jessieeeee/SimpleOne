/**
 * @date :2017/12/15 0015
 * @author :JessieK
 * @email :lyj1246505807@gmail.com
 * @description : 加载更多view
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
} from 'react-native';

import constants from '../Constants';
var {width, height} = constants.ScreenWH;

class LoadingMore extends Component{
    constructor(props){
        super(props);
    }

    render() {
        return (
            <View style={styles.container}>
                {this.loading()}
            </View>
        );
    }

    loading() {
        if (this.props.loading) {
            return (
                <Text style={{
                    color: 'gray',
                    fontSize: width * 0.04,
                    margin: width * 0.04,
                }}>
                    正在加载中...
                </Text>
            );
        }
    }
}
LoadingMore.defaultProps={
    loading: false, //加载更多
};
LoadingMore.propTypes={
    loading: React.PropTypes.bool.isRequired
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    menu: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
});

export default LoadingMore;