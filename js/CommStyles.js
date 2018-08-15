/**
 * @author : JessieK
 * @email : lyj1246505807@gmail.com
 * @description : 公共类型
 *
 */
import {
    StyleSheet,
} from 'react-native'
import constants from "./Constants"
let {width, height} = constants.ScreenWH

const styles = StyleSheet.create({
    outNav: {
        height: height * 0.08,
        flexDirection: 'row',
        alignItems: 'center',
        width: width,
        justifyContent: 'center',
        borderBottomWidth: constants.divideLineWidth
    },

    outNav2: {
        height:  height * 0.08,
        flexDirection: 'row',
        alignItems: 'center',
        width: width,
        justifyContent: 'center',
    },

    centerTitle: {
        height:  height * 0.08,
        alignItems: 'center',
        justifyContent: 'center',
    },

    bottomLine: {
        height: width * 0.024,
        width: width
    },

    bottomLineAll: {
        height: width * 0.028,
        width: width
    },

    navRightBar: {
        width: width * 0.05,
        height: width * 0.05,
    },
    rightBtn: {
        position: 'absolute',
        right: width * 0.05,
    },
    leftBack: {
        position: 'absolute',
        left: width * 0.024,
    },
    navLeftBack: {
        width: height * 0.04,
        height: height * 0.05,
    },

    containerItem: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    categoryItem: {
        marginTop: width * 0.03,
        fontSize: width * 0.032,
    },
    titleItem: {
        fontSize: width * 0.056,
        width: width,
        paddingLeft: width * 0.05,
        marginTop: width * 0.03,
    },
    dateItem: {
        fontSize: 12,
        flexDirection: 'row',
        position: 'absolute',
        left: width * 0.05,
    },
    rightBtnItem: {
        flexDirection: 'row',
        position: 'absolute',
        right: width * 0.05,
    },
    barRightBtnsIconItem1: {
        width: width * 0.045,
        height: width * 0.045,
    },
    barRightBtnsIconItem2: {
        width: width * 0.045,
        height: width * 0.045,

    },
});
export default styles;