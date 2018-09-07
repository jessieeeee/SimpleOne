/**
 * @date : 9/7/18
 * @author : JessieK
 * @email : lyj1246505807@gmail.com
 * @description : 修改小记图片
 */


import React, {Component} from 'react'
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity
} from 'react-native'

let ImagePicker = require('react-native-image-picker')
import constants from '../Constants'
let {width, height} = constants.ScreenWH

let options = {
    title: 'Select Avatar',
    customButtons: [
        {name: 'fb', title: 'Choose Photo from Facebook'},
    ],
    storageOptions: {
        skipBackup: true,
        path: 'images'
    }
}
class ChangeImg extends Component{

    render() {
        return (
            <TouchableOpacity  style={styles.container} onPress={() => { this.props.navigator.pop()
            }}>
                <View style={styles.btns}>
                    <TouchableOpacity style={{justifyContent: 'center', alignItems: 'center'}} onPress={() => {
                        this.openCamera()
                    }}>
                        <Text style={styles.text}>拍照</Text>
                        <Image source={{uri: 'abc_btn_switch_to_on_mtrl_00001'}} style={styles.iconBg}/>
                        <Image source={{uri: 'bubble_photo'}} style={[styles.icon, {}]}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { this.openLibrary()
                    }}
                                      style={{
                                          marginLeft: width * 0.3,
                                          justifyContent: 'center',
                                          alignItems: 'center',
                                      }}>
                        <Text style={styles.text}>相册</Text>
                        <Image source={{uri: 'abc_btn_switch_to_on_mtrl_00001'}} style={styles.iconBg}/>
                        <Image source={{uri: 'bubble_album'}} style={[styles.icon, {}]}/>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        )
    }

    openCamera() {
        // Launch Camera:
        ImagePicker.launchCamera(options, (response) => {
            // Same code as in above section!
            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled image picker');
            }
            else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            }
            else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            }
            else {
                // let source = { uri: 'data:image/jpeg;base64,' + response.data }
                // console.log('source = ', source)
                this.props.route.params.response(response)
                this.props.navigator.pop()
            }
        })

    }

    openLibrary() {
        // Open Image Library:
        ImagePicker.launchImageLibrary(options, (response) => {
            // Same code as in above section!
            console.log('Response = ', response)

            if (response.didCancel) {
                console.log('User cancelled image picker')
            }
            else if (response.error) {
                console.log('ImagePicker Error: ', response.error)
            }
            else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton)
            }
            else {
                // let source = { uri: 'data:image/jpeg;base64,' + response.data };
                // console.log('source = ', source);
                this.props.route.params.response(response)
                this.props.navigator.pop()

            }
        })
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f7f8f9',
    },
    icon: {
        width: width * 0.1,
        height: width * 0.1,
        position: 'absolute',
        top: width * 0.1,
        left: width * 0.06,
    },
    iconBg: {
        width: width * 0.22,
        height: width * 0.22
    },
    btns: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    text: {
        color: '#7d7d7d',
        fontSize: width * 0.03,
    },

})

export default ChangeImg
