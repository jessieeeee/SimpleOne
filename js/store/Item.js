/**
 * @author : JessieK
 * @email : lyj1246505807@gmail.com
 * @description : item数据管理
 */
import {observable, action,computed} from 'mobx';

export default class Item {

    /*
    * 商品名称(此值是不变的所以不需要检测此值)
    * */
    name;

    /*
    * 监控商品个数
    * */
    @observable
    count;

    constructor(item) {
        this.name = item.name;
        this.count = item.count;
    };

    /*
    * 商品个数+1
    * */
    @action
    add = () => {
        this.count += 1;
    };

    /*
    * 商品个数-1
    * */
    @action
    dec= () => {
        this.count > 0 && (this.count -= 1);
    };

    @computed get msg() {
        return `${this.count}`;
    }
}

