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
    Platform,
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
            <View style={styles.container}>
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
        backgroundColor: 'white',
    },
    menu: {
        fontSize: width * 0.038,
        textAlign: 'center',
        margin: width * 0.05,
    },



});

export default Search;
