/**
 * @author : JessieK
 * @email : lyj1246505807@gmail.com
 * @description : 测试mobx
 */
import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    Text,
} from 'react-native';


import {observer} from 'mobx-react/native';
import AppState from './AppState';
import {autorun} from 'mobx';


const datas = [
    {name:'苹果',count:0},
    {name:'梨',count:0},
    {name:'香蕉',count:0},
    {name:'草莓',count:0},
    {name:'橘子',count:0},
];

@observer
export default class MobxTest extends Component {
    /**
     * 数据管理器
     */
    static dataManager = new AppState();

    componentWillMount() {

        /*
        * 赋值初始数据
        * */
        MobxTest.dataManager.replace(datas);
    }

    /*
    * 添加一个新的 Item
    * */
    addItem = () => {
        let item = {name:'西瓜',count:0}; MobxTest.dataManager.addItem(item)
    };

    /*
    * 删除第一个 Item
    * */
    deleteItem = () => {
        MobxTest.dataManager.deleteItem(0);
    };

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.addItemView}>
                    <Text style={styles.addItem} onPress={this.addItem}>增加</Text>
                    <Text style={styles.addItem} onPress={this.deleteItem}>删除</Text>
                </View>
                <ScrollView>
                    {
                        MobxTest.dataManager.dataSource.slice(0).map(
                            (item,i)=> <ItemView key = {i} item = {item}/>
                        )
                    }
                </ScrollView>
            </View>
        );
    }

}
// autorun(() => {
//     console.log('show'+MobxTest.dataManager.dataSource);
// }, {
//     onError(e) {
//         console.log('error'+e)
//     }
// });
/*
* itemview组件封装
* */
@observer
class ItemView extends Component {

    countAdd = () => {
        this.props.item.add();
    };

    countDec = () => {
        this.props.item.dec();
    };

    render() {
        const {item} = this.props;
        return (
            <View style={styles.itemContainer}>
                <Text>{item.name}</Text>
                <Text>{item.count}</Text>
                <Text style={styles.btn} onPress={this.countAdd}> + </Text>
                <Text style={styles.btn} onPress={this.countDec}> - </Text>
            </View>
        );
    };
}
const styles=StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#eeeeee',
    },
    itemContainer:{
        justifyContent: 'center',
        alignItems: 'center',
    },
    btn:{
        backgroundColor:'green',
        color:'red'
    },
    addItemView:{
        backgroundColor:'blue',
        justifyContent: 'center',
        alignItems: 'center',
    }
});
