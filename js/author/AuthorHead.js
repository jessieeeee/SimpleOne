/**
 * @date : 9/7/18
 * @author : JessieK
 * @email : lyj1246505807@gmail.com
 * @description :作者信息的头部
 */


import React, { Component } from 'react'
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
} from 'react-native'
import constants from '../Constants'
import NetUtils from "../util/NetUtil"
import ServerApi from '../ServerApi'
import PropTypes from 'prop-types'
let {width, height} = constants.ScreenWH

class AuthorHead extends Component{
    static defaultProps = {
        authorId: '',
    }
    static propTypes = {
        onError: PropTypes.func.isRequired,
        onSuccess: PropTypes.func.isRequired,
        authorId: PropTypes.string.isRequired,
    }

    constructor(props){
        super(props)
        this.state={
            result:''
        }
    }

    componentDidMount(){
        let url= ServerApi.AuthorHead.replace('{author_id}', this.props.authorId)
        NetUtils.get(url,null,(result) => {
            this.setState({
                result:result.data
            })
            console.log('head')
            this.props.onSuccess && this.props.onSuccess()

        },(error) => {
            console.log('error',error)
            this.props.onError && this.props.onError()
        })
    }

    render() {
        return (
            <View style={[styles.container,{backgroundColor: constants.nightMode? constants.nightModeGrayLight:'white'}]}>
                <Image source={{uri:this.state.result.web_url}} style={styles.avatar}/>
                <Text style={[styles.name,{color: constants.nightMode ? constants.nightModeTextColor : constants.normalTextColor,}]}>{this.state.result.user_name} </Text>
                <Text style={[styles.summary,{color: constants.nightMode ? constants.nightModeTextColor : constants.normalTextColor,}]}>{this.state.result.summary}</Text>
                <TouchableOpacity onPress={() => {}}>
                    <Text style={[styles.follow,
                        {color: constants.nightMode ? constants.nightModeTextColor : constants.normalTextColor,
                            borderColor: constants.nightMode ? constants.nightModeTextColor : constants.normalTextColor,}
                        ]}>关注</Text>
                </TouchableOpacity>
                <Text style={[styles.followNum,{color: constants.nightMode ? constants.nightModeTextColor : constants.normalTextColor,}]}>{this.state.result.fans_total+'关注'}</Text>
            </View>
        )
    }

}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatar:{
        resizeMode: 'stretch',
        marginTop:width*0.05,
        width:width*0.16,
        height:width*0.16,
        borderRadius:width,
    },
    name:{
        marginTop:width*0.03,
        fontSize:width*0.05,
    },
    summary:{
        margin:width*0.04,
        fontSize:width*0.04,
    },
    follow:{
        fontSize:width*0.04,
        borderWidth:width*0.002,
        borderRadius:width*0.006,
        textAlign:'center',
        textAlignVertical:'center',
        paddingTop:width*0.01,
        paddingBottom:width*0.01,
        paddingLeft:width*0.02,
        paddingRight:width*0.02
    },
    followNum:{
        marginTop:width*0.014,
        fontSize:width*0.026,
        marginBottom:width*0.04
    }
})

export default AuthorHead

