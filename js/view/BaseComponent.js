import constants from "../Constants";

/**
 * @author : JessieK
 * @email : lyj1246505807@gmail.com
 * @description : 高阶组件公共基类
 */
import React, {Component} from 'react';
import {View} from 'react-native';
import {autorun} from 'mobx';
import {observer} from "mobx-react/native";
import ShowPlayMusic from '../view/ShowPlayMusic';
import MusicControl from '../musiccontrol/MusicControl';

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
            if (constants.appState.playMusic) {
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


        render() {
            return (
                <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#eeeeee',
                }}>
                    <WrapComponent {...this.props}/>
                    {this.renderAudioPlay()}
                    {this.renderMusicControl()}
                </View>
            )
        }

    }
};
autorun(() => {
    console.log('playmusic state change');
});