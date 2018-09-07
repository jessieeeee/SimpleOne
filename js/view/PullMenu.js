/**
 * @date : 6/28/18
 * @author : JessieK
 * @email : lyj1246505807@gmail.com
 * @description : 下拉菜单
 */

import React, {Component} from 'react'
import {
    StyleSheet,
    Text,
    Animated,
    FlatList,
    TouchableOpacity,
    Modal
} from 'react-native'
import constants from '../Constants'
import PropTypes from 'prop-types'
let {width, height} = constants.ScreenWH
const VIEWABILITY_CONFIG = {
    minimumViewTime: 3000,
    viewAreaCoveragePercentThreshold: 100,
    waitForInteraction: true,
}
class PullMenu extends Component{
    static propTypes = {
        menuData: PropTypes.array.isRequired, //数据源数组
        select: PropTypes.object, //当前选择项
        onShow: PropTypes.bool, // 是否展开菜单
        onSure: PropTypes.func.isRequired, // 点击确定回调
        onCancel: PropTypes.func.isRequired // 点击取消回调
    }

    static defaultProps = {
        onShow: false, // 默认不展开
        select: null // 默认选中为空
    }

    constructor(props){
        super(props)
        this.renderRow = this.renderRow.bind(this)
        this.state={
            expanded: false,
            animation : new Animated.Value()
        }
    }

    componentDidMount(){
        let maxHeight=width * 0.14*this.props.menuData.length
        let minHeight=0;
        let initialValue = this.state.expanded ? maxHeight + minHeight : minHeight,
            finalValue= this.state.expanded ? minHeight : maxHeight + minHeight
        this.setState({
            expanded: !this.state.expanded //Step 2
        })
        console.log('最大高度'+maxHeight)
        console.log('初始值'+initialValue+'最终值'+finalValue)
        this.state.animation.setValue(initialValue) //Step 3

        this.timer = setTimeout(
            () => {
                this.toggle(finalValue)
            },
            2000
        )
    }

    render() {
        return (
            <Modal
                animationType={'none'}
                transparent={true}
                visible={this.props.onShow}
                onRequestClose={() => {
                    this.props.onCancel();
                }}>

                <TouchableOpacity style={styles.container} onPress={() => this.props.onCancel()}>

                    <Animated.View style={{height: this.state.animation}}>
                        <FlatList
                            data={this.props.menuData}
                            renderItem={this.renderRow}
                            keyExtractor={(item, index) => index}
                            onViewableItemsChanged={(info) => {
                                console.log(info);
                            }}

                            viewabilityConfig={VIEWABILITY_CONFIG}
                        >
                            }

                        </FlatList>
                    </Animated.View>

                </TouchableOpacity>

            </Modal>
        )
    }

    toggle(finalValue) {
        Animated.spring(
            this.state.animation,
            {
                toValue: finalValue
            }
        ).start()
    }

    // 单个item返回 线性布局
    renderRow(rowData) {
        console.log(rowData)
        if (rowData) {
            return (
                <TouchableOpacity activeOpacity={1} onPress={() => {
                    this.props.onSure(rowData.item)
                }}>
                    {this.renderItem(rowData)}

                </TouchableOpacity>
            )
        }
    }

    renderItem(rowData) {
        let color = '#808080'
        if (this.props.select.key === rowData.item.key) {
            color = '#333333'
        }
        return (
            <Text style={[styles.menu, {color: color}]}>{rowData.item.value}</Text>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        marginTop: height * 0.08,
    },
    menu: {
        fontSize: width * 0.04,
        textAlign: 'center',
        width: width,
        height: width * 0.14,
        textAlignVertical: 'center',
        backgroundColor: constants.nightMode ? constants.nightModeGrayLight : 'white',
        borderBottomWidth: constants.divideLineWidth,
        borderBottomColor: constants.bottomDivideColor
    },
})

export default PullMenu
