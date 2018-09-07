/**
 * @date : 9/6/18
 * @author : JessieK
 * @email : lyj1246505807@gmail.com
 * @description :主界面-all分页
 */

import React, {Component} from 'react'
import {View} from 'react-native'
import AllTopBar from './AllTopBar'
import {BaseComponent} from "../view/BaseComponent" // 基础组件
import LoadMoreState from "../view/LoadMoreState"
import Status from "../util/Status"
import StatusManager from "../util/StatusManager" // 加载更多状态
import AllContentPage from './AllContentPage' //all分页内容
import {observer} from "mobx-react/native"

@observer
class All extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loadingState: LoadMoreState.state.tip,//加载更多状态
        }

        // 初始化状态界面管理器
        this.statusManager = new StatusManager()
    }

    /**
     * 刷新内容
     */
    retry() {
        this.content.onPullRelease()
    }

    componentDidMount() {
        this.statusManager.setStatus(Status.Loading)
    }

    /**
     * 渲染正常界面
     */
    renderNormal() {
        return (
            <AllContentPage navigator={this.props.navigator} ref={(c) => {
                this.content = c
            }} onError={() => {
                this.statusManager.setStatus(Status.Error)
            }} onSuccess={() => {
                this.statusManager.setStatus(Status.Normal)
            }
            }/>
        )
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <AllTopBar navigator={this.props.navigator}/>
                <View style={{flex: 1}}>
                    {/*渲染正常界面*/}
                    {this.renderNormal()}
                    {/*渲染状态界面*/}
                    {this.props.displayStatus(this.statusManager)}
                </View>
            </View>
        )
    }


}


export default AllPage = BaseComponent(All)
