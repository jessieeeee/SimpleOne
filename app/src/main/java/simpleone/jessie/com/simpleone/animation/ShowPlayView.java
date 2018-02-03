package simpleone.jessie.com.simpleone.animation;

import android.content.Context;
import android.graphics.drawable.AnimationDrawable;
import android.view.View;

import simpleone.jessie.com.simpleone.R;


/**
 * @author JessieK
 * @date 2018/2/1 0001
 * @email lyj1246505807@gmail.com
 * @description 正在播放帧动画view
 */


public class ShowPlayView extends View {

    Callback callback;
    private AnimationDrawable animationDrawable;

    public interface Callback{
        void onClick();
    }

    public void setCallback(Callback callback) {
        this.callback = callback;
    }

    public ShowPlayView(Context context) {
        super(context);
        setXmlFrameAnim();
        startAnim();
        setOnClickListener(new OnClickListener() {
            @Override
            public void onClick(View v) {
                callback.onClick();
            }
        });
    }


    /**
     * 通过XML添加帧动画
     */
    private void setXmlFrameAnim() {
        // 把动画资源设置为imageView的背景,也可直接在XML里面设置
        setBackgroundResource(R.drawable.frame_anim);
        animationDrawable = (AnimationDrawable) getBackground();
    }

    /**
     * 启动动画
     */
    public void startAnim(){
        animationDrawable.start();
    }

    /**
     * 停止动画
     */
    public void stopAnim(){
        animationDrawable.stop();
    }
}
