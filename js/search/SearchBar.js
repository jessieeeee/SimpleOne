/**
 * @author : JessieK
 * @email : lyj1246505807@gmail.com
 * @description : 搜索框
 */
import React, {Component} from 'react';
import {
    StyleSheet,
    TextInput,
    View,
    TouchableOpacity,
    Text,
    Platform
} from 'react-native'
import constants from "../Constants";
import PropTypes from 'prop-types';
import CommStyles from "../CommStyles"
let {width, height} = constants.ScreenWH;

class SearchBar extends Component{
    render(){
        return (
            <View style={[CommStyles.outNav, { borderBottomColor: constants.nightMode ? '#484848':'#dddddd',backgroundColor: constants.nightMode ? '#484848':'white'}]}>

                <TextInput
                    underlineColorAndroid='transparent'
                    autoCapitalize="none"
                    placeholder={this.props.searchKey?this.props.searchKey:"在这里写下你想寻找的"}
                    autoCorrect={false}
                    onFocus={() => this.props.onFocus()}
                    onBlur={() => this.props.onBlur()}
                    onChange={(event) => this.props.onChange(event)}
                    onEndEditing={(event) => this.props.onEndEditing(event)}
                    onSubmitEditing={(event) => this.props.onSubmitEditing(event)}
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
SearchBar.propsType={
    onFocus:PropTypes.func.isRequired,
    onBlur:PropTypes.func.isRequired,
    onChange:PropTypes.func.isRequired,
    onEndEditing:PropTypes.func.isRequired,
    onSubmitEditing:PropTypes.func.isRequired,
    searchKey:PropTypes.string
};

const styles=StyleSheet.create({
    rightBtn: {
        width: width * 0.1,
        position: 'absolute',
        right: width * 0.03,
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

    outNav: {
        height: Platform.OS == 'ios' ? height * 0.07 : height * 0.08,
        backgroundColor: '#f8f8f8',
        flexDirection: 'row',
        alignItems: 'center',
        width: width,
        justifyContent: 'center',
        borderBottomColor: '#dddddd',
        borderBottomWidth: constants.divideLineWidth
    },

});

export default SearchBar;
