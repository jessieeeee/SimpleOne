/**
 * @author :JessieK
 * @email :lyj1246505807@gmail.com
 * @description : 本地存储封装
 */
import React, { Component } from 'react';
import Storage from 'react-native-storage';

import {
    AppRegistry,
    View,
    AsyncStorage
} from 'react-native';

let storage;//返回存储对象
let defaultExpires = null;      // 数据过期时间，默认一整天（1000 * 3600 * 24 毫秒），设为null则永不过期
let size = 1000; // 最大容量，默认值1000条数据循环存储

export default class MySorage extends Component{

    //初始化数据库
    static initStorage(){
        if(storage === undefined){
            storage = new Storage({
                size: size,
                // 存储引擎
                // 如果不指定则数据只会保存在内存中，重启后即丢失
                storageBackend: AsyncStorage,
                defaultExpires: defaultExpires,
                // 读写时在内存中缓存数据。默认启用。
                enableCache: true,
            });
        }
    }


    /**
     key:保存的key值
     object：保存的value
     */
    static save(key,object){
        //校验是否初始化
        this.isInit();
        storage.save({
            key: key,  // 注意:请不要在key中使用_下划线符号!
            data: object
        });
    }

    /**
     * 删除单个数据
     * @param key 保存的key值
     */
    static remove(key){
        //校验是否初始化
        this.isInit();
        // 删除单个数据
        storage.remove({
            key: key,
        });
    }

    /**
     * 删除所有的数据
     */
    static removeAll(){
        //校验是否初始化
        this.isInit();
        // 移除所有数据（但会保留只有key的数据）
        storage.clearMap();
    }

    /**
     * 删除所有数据
     * @param key
     */
    static clearMapForKey(key){
        //校验是否初始化
        this.isInit();
        // 清除某个key下的所有数据
        storage.clearMapForKey(key);
    }

    /**
     查询所有数据
     */
    static loadAll(key,callBack){
        this.load(key,null,null,callBack);
    }

    /**
     * 获取某个key下的所有数据
     */
    static loadByKey(key,callback,exceptionCallback){
        // 读取
        storage.load({
            key: key
        }).then(result => {
           callback(result);
        }).catch(err => {
            //如果没有找到数据且没有sync方法，
            //或者有其他异常，则在catch中返回
            exceptionCallback(err);
            console.warn('数据库查询异常'+err.message);
        });
    }


    /**
     * 是否初始化检查
     */
    static isInit(){
        if(storage === undefined){
            throw "请先调用初始化";
        }
    }

}