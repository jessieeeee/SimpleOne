

/**
 * @author : JessieK
 * @email : lyj1246505807@gmail.com
 * @description : 高阶组件公共基类
 */
import React, {Component} from 'react'
import {View} from 'react-native'
import {autorun} from 'mobx'
import {observer} from "mobx-react/native"
import ShowPlayMusic from '../view/ShowPlayMusic'
import MusicControl from '../musiccontrol/MusicControl'
import Status from '../util/Status'
import NetUtil from '../util/NetUtil'
import DefaultDisplay from '../view/DefaultDisplay'
import constants from "../Constants"
@observer
export const BaseComponent = (WrapComponent) => {
    return class HOC extends Component {

        constructor(props) {
            super(props);
            // 公共状态
            this.state = {
                showMusicControl:false,//是否显示音乐控制板
            }
        }

        // 渲染音乐播放
        renderAudioPlay(){
            if (constants.appState.state) {
              return(
                  <ShowPlayMusic
                      onChange={(obj) => {
                          console.log('onSure收到事件' + obj.nativeEvent.msg + "目标id" + obj.nativeEvent.target);
                          this.setState({
                              showMusicControl:true,
                          });
                      }}
                      style={{
                          position: 'absolute',
                          top: constants.ScreenWH.height * 0.17,
                          right: 0,
                          zIndex: 100,
                          width: constants.ScreenWH.width * 0.11,
                          height: constants.ScreenWH.width * 0.1
                      }}
                  />
              )
            }
        }

        // 渲染音乐控制面板
        renderMusicControl(){
            return(
                <MusicControl navigator={this.props.navigator} isVisible={this.state.showMusicControl}
                              onCancel={()=>{
                                  this.setState({
                                      showMusicControl:false,
                                  });
                              }}/>
            )
        }

        /**
         * 状态界面处理相关
         * @param url 请求地址
         * @param params 参数
         * @param statusManager 状态管理器
         * @param next 正常返回后的逻辑
         * @param err 错误逻辑
         * @param showLoading 是否显示加载中的界面（避免和下拉刷新冲突）
         */
        request(url, params, statusManager , next ,err ,showLoading) {
            if (showLoading){
                statusManager.setStatus(Status.Loading)
            }
            NetUtil.get(url, params, (result) => {
                // 如果设置了目标空数据的key
                if (statusManager.getTargetEmptyKey()) {
                    // 检查目标空数据是否为空
                    if (!result[statusManager.getTargetEmptyKey()]) {
                        statusManager.setStatus(Status.Empty)
                    } else {
                        statusManager.setStatus(Status.Normal)
                        next(result)
                    }
                } else {
                    // 如果没有结果数据
                    if (!result) {
                        statusManager.setStatus(Status.Empty)
                    } else {
                        statusManager.setStatus(Status.Normal)
                        next(result)
                    }
                }
            }, (error) => {
                console.log(error)
                if (showLoading){
                    statusManager.setStatus(Status.Error)
                }
                err(error)

            })
        }


        /**
         * 根据状态展示
         * @param statusManager
         * @returns {*}
         */
        displayStatus(statusManager){
            if (statusManager.Status === Status.Normal){
                console.log('显示正常界面')
                return null
            }
            console.log('显示异常界面')
            return (
                <DefaultDisplay status={statusManager.Status} onRetry={() => this.retryCallback() }/>
            )
        }

        /**
         * 重试
         */
        retryCallback(){
            if(this.component.retry){
                this.component.retry()
            }
        }

        render() {
            return (
                <View style={{
                    flex: 1,
                }}>
                    <WrapComponent ref={(ref) => {
                        this.component = ref
                    }} {...this.props} request={(url, params, statusManager, next ,err) => {
                        this.request(url, params, statusManager ,next, err)
                    }} displayStatus={(statusManager) => {return this.displayStatus(statusManager)}}
                    />
                    {this.renderAudioPlay()}
                    {this.renderMusicControl()}
                </View>
            )
        }

    }
}
autorun(() => {
    console.log('playmusic state change')
})