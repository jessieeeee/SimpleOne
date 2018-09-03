import {StyleSheet} from 'react-native'
// 默认提示文本
const tipText = {
    pulling: "下拉刷新",
    pullok: "松开刷新",
    pullrelease: "正在刷新"
}

// 自带样式
const styles = StyleSheet.create({
    wrap: {
        flex: 1,
        flexGrow: 1,
        flexDirection: 'column',
        zIndex: -999,
    },
    hide: {
        position: 'absolute',
        left: 10000
    },
    show: {
        position: 'relative',
        left: 0
    }
})

export default {tipText, styles}