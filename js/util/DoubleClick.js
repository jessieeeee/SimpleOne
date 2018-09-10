/**
 * @author : JessieK
 * @email : lyj1246505807@gmail.com
 * @description : 过滤重复点击工具类
 */
const  diffTime = 2000 //2秒时间差
class DoubleClick {
    lastClickTime = 0

    // 过滤重复点击
    filterDoubleClick(callback){
        let currentTime = new Date().getTime()
        console.log('cur',currentTime)
        console.log('last',this.lastClickTime)
        // 如果这次点击距离上次点击时间大于时间差为有效点击
        if (currentTime - this.lastClickTime > diffTime){
            callback()
        }
        // 刷新上一次点击时间
        this.lastClickTime = currentTime
    }
}
export default DoubleClick