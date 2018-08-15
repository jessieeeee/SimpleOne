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
    TouchableOpacity

} from 'react-native';
import constants from '../Constants';
import SearchCategory from '../search/SearchCategory';
import SearchBar from './SearchBar';
import SearchResult from './SearchResult';
let {width, height} = constants.ScreenWH;

class Search extends Component{
    constructor(props){
        super(props);
        this.state={
            curText: '',
        }
    }

    render() {
        return (
            <View style={[styles.container,{ backgroundColor: constants.nightMode ? constants.nightModeGrayLight :'white'}]}>
                <SearchBar
                    navigator={this.props.navigator}
                    onFocus={()=>{

                    }}
                    onBlur={()=>{

                    }}
                    onChange={(event)=>{
                        this.updateText(event.nativeEvent.text)
                }} onEndEditing={(event)=>{
                    this.updateText(event.nativeEvent.text)
                }} onSubmitEditing={(event) => {
                    this.updateText(event.nativeEvent.text);
                    this.pushToSearchResult();
                }}/>

                <TouchableOpacity activeOpacity={0.5} onPress={() => this.pushToSearchCategory(parseInt(constants.CategoryGraphic))}>
                    <Text style={[styles.menu, {marginTop: width * 0.149, color:constants.nightMode ? constants.nightModeTextColor:constants.normalTextColor}]}>
                        图文
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.5}
                                  onPress={() => this.pushToSearchCategory(parseInt(constants.CategoryQuestion))}>
                    <Text style={[styles.menu,{color:constants.nightMode ? constants.nightModeTextColor:constants.normalTextColor}]}>
                        问答
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.5}
                                  onPress={() => this.pushToSearchCategory(parseInt(constants.CategoryRead))}>
                    <Text style={[styles.menu, {color:constants.nightMode ? constants.nightModeTextColor:constants.normalTextColor}]}>
                        阅读
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.5}
                                  onPress={() => this.pushToSearchCategory(parseInt(constants.CategorySerial))}>
                    <Text style={[styles.menu, {color:constants.nightMode ? constants.nightModeTextColor:constants.normalTextColor}]}>
                        连载
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.5}
                                  onPress={() => this.pushToSearchCategory(parseInt(constants.CategoryMovie))}>
                    <Text style={[styles.menu, {color:constants.nightMode ? constants.nightModeTextColor:constants.normalTextColor}]}>
                        影视
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.5}
                                  onPress={() => this.pushToSearchCategory(parseInt(constants.CategoryMusic))}>
                    <Text style={[styles.menu, {color:constants.nightMode ? constants.nightModeTextColor:constants.normalTextColor}]}>
                        音乐
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.5}
                                  onPress={() => this.pushToSearchCategory(parseInt(constants.CategoryRadio))}>
                    <Text style={[styles.menu, {color:constants.nightMode ? constants.nightModeTextColor:constants.normalTextColor}]}>
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

    /**
     * 跳转到搜索结果
     */
    pushToSearchResult(){
        this.props.navigator.push(
            {
                component:SearchResult,
                title:'搜索结果',
                params:{
                    searchKey:this.state.curText
                }
            }
        )
    }

    updateText(text) {
        this.setState({
            curText: text,
        });
    }

}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    menu: {
        fontSize: width * 0.038,
        textAlign: 'center',
        margin: width * 0.05,
    },



});

export default Search;
