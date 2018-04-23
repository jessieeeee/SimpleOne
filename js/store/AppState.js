/**
 * @author : JessieK
 * @email : lyj1246505807@gmail.com
 * @description : mobx 列表数据管理
 */
import {observable, action} from 'mobx';
import Item from './Item';
export default class AppState {

    /**
     * observable 用于要观察的字段
     */
    @observable
    dataSource = []; // 数据源

    // 添加初始数据
    @action
    replace = (items) => {
        // 1. 清空原数据
        this.dataSource.splice(0, this.dataSource.length);
        // 2. 添加新数据
        items.map((item, i) => {
            this.dataSource.push(new Item(item));
        });
    };

    /**
     * action 用于修改字段的方法
     */

    // 添加数据
    @action
    addItem = (item) => {
        this.dataSource.unshift(new Item(item));
    };
    // 删除一条数据
    @action
    deleteItem = (idx) => {
        this.dataSource.splice(idx, 1);
    };
}




