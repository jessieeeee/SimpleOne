/**
 * @author : JessieK
 * @email : lyj1246505807@gmail.com
 * @description : 界面状态管理
 */

import React from 'react'
import Status from './Status'
import {action, observable ,computed, autorun} from 'mobx'
class StatusManager {

    @observable
    status = Status.Loading

    targetEmptyKey: null //目标空数据

    @action
    setStatus = (status) => {
        this.status = status;
        console.log('update status is  ' + status)
    }

    @computed
    get Status() {
        return this.status;
    }


    /**
     * 返回空数据判断的目标数据
     * @returns {null}
     */
    getTargetEmptyKey(){
      return this.targetEmptyKey
    }

    /**
     * 设置目标空数据属性名称
     * @param targetEmptyData
     */
    setTargetEmptyKey(targetEmptyKey){
        this.targetEmptyKey = targetEmptyKey
    }

}

autorun(() => {
    console.log('status change')
})

export default StatusManager