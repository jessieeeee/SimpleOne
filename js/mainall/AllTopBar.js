/**
 * @author : JessieK
 * @email : lyj1246505807@gmail.com
 * @description : all分页顶部bar
 */
import React, {Component} from 'react'
import constants from "../Constants"
import CommStyles from "../CommStyles"
import {
    View,
    Image,
    TouchableOpacity, StyleSheet,
} from 'react-native'
import Search from "../search/Search"
let {width, height} = constants.ScreenWH
class AllTopBar extends Component{
   render(){
       return (
           // 顶部导航bar
           <View style={[CommStyles.outNav, {
               borderBottomColor: constants.nightMode ? constants.nightModeGrayLight : constants.bottomDivideColor,
               backgroundColor: constants.nightMode ? constants.nightModeGrayLight : 'white'
           }]}>

               <Image source={{uri: constants.nightMode ? 'one_is_all_night' : 'one_is_all'}} style={styles.allTitle}/>

               {/*右边按钮*/}
               <TouchableOpacity style={CommStyles.rightBtn}
                                 onPress={() => this.pushToSearch()}>
                   <Image source={{uri: 'search_night'}} style={CommStyles.navRightBar}/>
               </TouchableOpacity>
           </View>
       )
   }

    /**
     * 跳转到搜索页
     * @param url
     */
    pushToSearch() {
        this.props.navigator.push(
            {
                component: Search,
            }
        )
    }
}
const styles = StyleSheet.create({
    allTitle: {
        width: width * 0.36,
        height: width * 0.04,
    },
})

export default AllTopBar
