import React,{Component} from 'react';

/**
 * @date :2017/12/15 0015
 * @author :JessieK
 * @email :lyj1246505807@gmail.com
 * @description : 时间工具类
 */

export default class DateUtil extends Component{

    static chnNumChar=['〇','一','二','三','四','五','六','七','八','九'];


    /**
     * 获取当前系统时间 yyyyMMdd
     */
    static getCurrentDateFormat(){
        var space = "-";
        var dates = new Date();
        var years = dates.getFullYear();
        var months = dates.getMonth()+1;
        if(months<10){
            months = "0"+months;
        }

        var days = dates.getDate();
        if(days<10){
            days = "0"+days;
        }
        var time = years+space+months+space+days;
        return time;
    };


    /**
     * 得到当前中文年月日
     * @returns {string}
     */
    static getCurrentDateChinese() {
        var dates = new Date();
        var years = dates.getFullYear();
        var months = dates.getMonth() + 1;
        var days = dates.getDate();
        var time = this.getYearChinese(years) + '年' +this.getMonthChinese(months) +'月'+ this.getDayChinese(days)+'日';
        return time;
    }

    /**
     * 得到当前年份中文
     * @param year
     * @returns {string}
     */
    static getYearChinese(year) {
        var str = year.toString();
        for(var i=0;i<10;i++){
            str = str.replace(i+'', this.chnNumChar[i]);
        }

        return str;
    }

    /**
     * 得到当前月份中文
     * @param month
     * @returns {string}
     */
    static getMonthChinese(month){
        if(month/10>1 ){
            var numStr='';
            if(month%10!==0){
                numStr=this.chnNumChar[month%10];
            }
            return '十'+ numStr;
        }else{
            return this.chnNumChar[month%10];
        }
    }

    /**
     * 得到当前日中文
     * @param day
     * @returns {string}
     */
    static getDayChinese(day){
        if(day/10>=1){
            var numStr='';
            var numFirstStr='';
            if(day%10!==0){
                numStr=this.chnNumChar[day%10];
            }
            if(day/10>=2){
                numFirstStr=this.chnNumChar[day/10];
            }
            return numFirstStr+'十'+ numStr;
        }else{
            return this.chnNumChar[day%10];
        }
    }
    /**
     * 获取当前星期几
     * @param time
     * @returns {*}
     */
    static getweek() {
        var dates = new Date();
        var d = dates.getDay();
        return d;
    }
}