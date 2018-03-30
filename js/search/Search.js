/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow　分类搜索界面
 */

import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    TextInput,
    Platform,
    TouchableOpacity

} from 'react-native';
import constants from '../Constants';
import SearchCategory from '../search/SearchCategory';
var {width, height} = constants.ScreenWH;

class Search extends Component{
    constructor(props){
        super(props);
        this.state={
            curText: '<No Event>',
            prevText: '<No Event>',
            prev2Text: '<No Event>',
        }
    }

    render() {
        return (
            <View style={styles.container}>
                {this.renderNavBar()}
                <TouchableOpacity activeOpacity={0.5} onPress={() => this.pushToSearchCategory(0)}>
                    <Text style={[styles.menu, {marginTop: width * 0.149}]}>
                        图文
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.5}
                                  onPress={() => this.pushToSearchCategory(3)}>
                    <Text style={styles.menu}>
                        问答
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.5}
                                  onPress={() => this.pushToSearchCategory(1)}>
                    <Text style={styles.menu}>
                        阅读
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.5}
                                  onPress={() => this.pushToSearchCategory(2)}>
                    <Text style={styles.menu}>
                        连载
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.5}
                                  onPress={() => this.pushToSearchCategory(5)}>
                    <Text style={styles.menu}>
                        影视
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.5}
                                  onPress={() => this.pushToSearchCategory(4)}>
                    <Text style={styles.menu}>
                        音乐
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.5}
                                  onPress={() => this.pushToSearchCategory(8)}>
                    <Text style={styles.menu}>
                        电台
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }

    /**
     * 跳转到搜索分类
     * @param url
     */
    pushToSearchCategory(id){
        this.props.navigator.push(
            {
                component: SearchCategory,
                title:'搜索分类',
                params:{
                    categoryId:id
                }
            }
        )
    }

    updateText(text) {
        this.setState((state) => {
            return {
                curText: text,
                prevText: state.curText,
                prev2Text: state.prevText,
            };
        });
    }

    /**
     * 顶部导航bar
     */
    renderNavBar() {
        return (
            <View style={styles.outNav}>

                <TextInput
                    underlineColorAndroid='transparent'
                    autoCapitalize="none"
                    placeholder="在这里写下你想寻找的"
                    autoCorrect={false}
                    onFocus={() => this.updateText('onFocus')}
                    onBlur={() => this.updateText('onBlur')}
                    onChange={(event) => this.updateText(
                        'onChange text: ' + event.nativeEvent.text
                    )}
                    onEndEditing={(event) => this.updateText(
                        'onEndEditing text: ' + event.nativeEvent.text
                    )}
                    onSubmitEditing={(event) => this.updateText(
                        'onSubmitEditing text: ' + event.nativeEvent.text
                    )}
                    style={styles.singleLine}
                />
                {/*右边按钮*/}
                <TouchableOpacity style={styles.rightBtn}
                                  onPress={() => this.props.navigator.pop()}>
                    <Text style={styles.cancel}>取消</Text>
                </TouchableOpacity>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    outNav: {
        height: Platform.OS == 'ios' ? height * 0.07 : height * 0.08,
        backgroundColor: '#f8f8f8',
        flexDirection: 'row',
        alignItems: 'center',
        width: width,
        borderBottomWidth: width * 0.00046,
        borderBottomColor: 'gray'
    },
    menu: {
        fontSize: width * 0.038,
        textAlign: 'center',
        margin: width * 0.05,
    },
    singleLine: {
        fontSize: width * 0.04,
        padding: 4,
        width: width * 0.82,
        color: '#b1b1b1',
        backgroundColor: 'white',
        position: 'absolute',
        left: width * 0.03,
        height: Platform.OS == 'ios' ? height * 0.04 : height * 0.05,
    },
    cancel: {
        fontSize: width * 0.04,
        color: '#808080',
        textAlign: 'center',
    },
    rightBtn: {
        width: width * 0.1,
        position: 'absolute',
        right: width * 0.03,
    },
});

export default Search;
