/**
 * @author : JessieK
 * @email : lyj1246505807@gmail.com
 * @description :网络请求的工具类
 */
export default class NetUtils {

    /**
     * 普通的get请求
     * @param {*} url 地址
     * @param {*} params  参数
     * @param {*} callbackSuccess  成功后的回调
     * @param {*} callbackError  失败后的回调
     */
    static get(url,params,callbackSuccess,callbackError){
        console.log('NetUtil----'+url);
        fetch(url,{
            method:'GET',
            body:params
        })
            .then((response) => {
                if(response.ok){//如果相应码为200
                    return response.json(); //将字符串转换为json对象
                }
            })
            .then((json) => {
                callbackSuccess(json);
            }).catch(error => {
            console.log(url+':'+error);
            callbackError(error);
        });
    };

    /**
     * post key-value 形式 hader为'Content-Type': 'application/x-www-form-urlencoded'
     * @param {*} url
     * @param {*} params
     * @param {*} callbackSuccess  成功后的回调
     * @param {*} callbackError  失败后的回调
     */
    static post(url,params,callbackSuccess,callbackError){
        fetch(url,{
            method:'POST',
            headers:{
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'//key-value形式
            },
            body:params
        })
            .then((response) => {
                if(response.ok){
                    return response.json();
                }
            })
            .then((json) => {
                callbackSuccess(json);
            }).catch(error => {
            console.log(url+':'+error);
            callbackError(error);
        });
    };

    /**
     * post json形式  header为'Content-Type': 'application/json'
     * @param {*} url
     * @param {*} jsonObj
     * @param {*} callbackSuccess  成功后的回调
     * @param {*} callbackError  失败后的回调
     */
    static postJson(url,jsonObj,callbackSuccess,callbackError){
        fetch(url,{
            method:'POST',
            headers:{
                'Content-Type': 'application/json;charset=UTF-8'
            },
            body:JSON.stringify(jsonObj),//json对象转换为string
        })
            .then((response) => {
                if(response.ok){
                    return response.json();
                }
            })
            .then((json) => {
                callbackSuccess(json);
            }).catch(error => {
            console.log(url+':'+error);
            callbackError(error);
        });
    };
}
