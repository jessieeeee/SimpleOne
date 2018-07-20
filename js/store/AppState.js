/**
 * @author : JessieK
 * @email : lyj1246505807@gmail.com
 * @description : mobx 列表数据管理
 */
import {observable, action, computed} from 'mobx';
import Item from './Item';
export default class AppState {

    /**
     * observable 用于要观察的字段
     */
    // @observable
    // dataSource = []; // 数据源
    @observable
    playMusic = false;

    // 开始播放
    @action
    startPlay = () => {
        this.playMusic=true;
        console.log('playMusic start')
    };

    // 停止播放
    @action
    stopPlay = () => {
        this.playMusic=false;
        console.log('playMusic stop')
    };

    @computed
    get state() {
        return this.playMusic;
    }
    // 添加初始数据
    // @action
    // replace = (items) => {
    //     // 1. 清空原数据
    //     this.dataSource.splice(0, this.dataSource.length);
    //     // 2. 添加新数据
    //     items.map((item, i) => {
    //         this.dataSource.push(new Item(item));
    //     });
    // };

    /**
     * action 用于修改字段的方法
     */

    // 添加数据
    // @action
    // addItem = (item) => {
    //     this.dataSource.unshift(new Item(item));
    // };
    // 删除一条数据
    // @action
    // deleteItem = (idx) => {
    //     this.dataSource.splice(idx, 1);
    // };
}




