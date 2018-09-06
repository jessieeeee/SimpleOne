/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow　显示大图详情
 */

import React, {Component} from 'react'
import {
    StyleSheet,
    Text,
    Image,
    Modal,
    TouchableOpacity
} from 'react-native'
import PropTypes from 'prop-types'
import constants from '../Constants'
let {width, height} = constants.ScreenWH

class DisplayImg extends Component{

    render() {
        return (
            <Modal
                animationType={'fade'}
                transparent={true}
                visible={this.props.isVisible}
                onRequestClose={() => {
                    this.props.onCancel()
                }}>
                <TouchableOpacity style={styles.container} onPress={() => this.props.onCancel()}>
                    <Text style={styles.showText}>{this.props.topText}</Text>
                    <Image style={[styles.displayImg, {
                        width: width * 0.8,
                        height: this.getHeight(this.props.originalW, this.props.originalH)
                    }]} source={{uri: this.props.imgUrl}}/>
                    <Text style={styles.showText}>{this.props.bottomText}</Text>
                </TouchableOpacity>
            </Modal>
        )
    }

    //按图片宽度缩放
    getHeight(w, h) {
        let ratio = (width * 0.8) / w
        return h * ratio
    }
}

DisplayImg.propTypes ={
    topText:PropTypes.string,
    imgUrl:PropTypes.string,
    bottomText:PropTypes.string,
};

DisplayImg.defaultProps={
    duration: 10,
    topText:'',
    originalW:0,
    originalH:0,
    imgUrl:'',
    bottomText:'',
    isVisible:false,
    onCancel:null,
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.74)'
    },
    displayImg: {
        marginTop: width * 0.04,
        marginBottom: width * 0.04,
    },
    showText: {
        textAlign: 'center',
        color: 'white',
    },
})

export default DisplayImg
