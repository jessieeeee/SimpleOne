/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow　显示大图详情
 */

import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    Modal,
    TouchableOpacity
} from 'react-native';

import constants from '../Constants';
var {width, height} = constants.ScreenWH;

class DisplayImg extends Component{
  constructor(props){
      super(props);
  }
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
            ;
    }

    //按图片宽度缩放
    getHeight(w, h) {
        var ratio = (width * 0.8) / w;
        return h * ratio;
    }
}

DisplayImg.propTypes ={
    topText:React.PropTypes.string,
    imgUrl:React.PropTypes.string,
    bottomText:React.PropTypes.string,
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
};



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
});

export default DisplayImg;
