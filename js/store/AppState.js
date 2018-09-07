/**
 * @author : JessieK
 * @email : lyj1246505807@gmail.com
 * @description : mobx 列表数据管理
 */
import {observable, action, computed} from 'mobx'
export default class AppState {

    /**
     * observable 用于要观察的字段
     */
    // @observable
    // dataSource = []; // 数据源
    @observable
    playMusic = false

    // 开始播放
    @action
    startPlay = () => {
        this.playMusic=true
        console.log('playMusic start')
    }

    // 停止播放
    @action
    stopPlay = () => {
        this.playMusic=false
        console.log('playMusic stop')
    }

    @computed
    get state() {
        return this.playMusic
    }

}




