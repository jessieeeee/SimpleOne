package simpleone.jessie.com.simpleone;

import android.media.MediaPlayer;
import android.util.Log;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.io.IOException;
import java.util.Timer;
import java.util.TimerTask;

/**
 * Created by lipeiwei on 16/10/14.
 */
public class MediaPlayerModule extends ReactContextBaseJavaModule {

    private MediaPlayer mPlayer; //音频播放对象

    private ReactContext mContext;


    private static String STOP_PLAY_MEDIA= "STOP_PLAY_MEDIA";//停止播放
    private static String LOADING_MEDIA_SUCCESS= "LOADING_MEDIA_SUCCESS";//缓冲成功
    private static String PLAY_EXCEPTION= "PLAY_EXCEPTION";//播放异常
    private static String PLAY_COMPLETE="PLAY_COMPLETE";//播放完成
    private static String PLAY_PROGRESS="PLAY_PROGRESS";//播放进度
    private static String PLAY_STATE="PLAY_STATE";//播放状态
    private static int MEDIA_PROGRESS_UPDATE_PERIOD = 1000;//更新周期
    private TimerTask mTimerTask;
    private Timer mTimer;

    private final static int STATE_PAUSE=2;
    private final static int STATE_NO_PLAYING = -1;
    private final static int STATE_PLAYING = 1;
    private int mState = STATE_NO_PLAYING;

    private int mCurrentPosition;

    public MediaPlayerModule(ReactApplicationContext reactContext) {
        super(reactContext);
        mContext = reactContext;
    }

    @Override
    public String getName() {
        return "MediaPlayer";
    }

    private boolean isPlaying() {
        return (mState == STATE_PLAYING);
    }

    @ReactMethod
    public void start(final String url) {
        if (mPlayer != null) {  //播放对象不为空
            if (isPlaying()) {  //当前正在播放
                mPlayer.reset(); //重置
                stopTimerTask(); //停止进度监听
            }
            else{
                mState = STATE_PLAYING;
                WritableMap map=Arguments.createMap();
                map.putString("state",LOADING_MEDIA_SUCCESS);
                //开始播放了
                sendEvent(mContext,PLAY_STATE,map);
                mPlayer.start();
                startTimeTask();
            }
        } else {
            stopTimerTask();
            mPlayer = new MediaPlayer();
            try {
                mState = STATE_PLAYING;
                mPlayer.setDataSource(url);//设置播放源
                //缓冲
                mPlayer.setOnPreparedListener(new MediaPlayer.OnPreparedListener() {
                    @Override
                    public void onPrepared(MediaPlayer mp) {
                        WritableMap map=Arguments.createMap();
                        map.putString("state",LOADING_MEDIA_SUCCESS);
                        //开始播放了
                        sendEvent(mContext,PLAY_STATE,map);
                        mPlayer.seekTo(MediaPlayerModule.this.mCurrentPosition);
                        mPlayer.start();
                        startTimeTask();
                    }
                });
                //完成监听
                mPlayer.setOnCompletionListener(new MediaPlayer.OnCompletionListener() {

                    @Override
                    public void onCompletion(MediaPlayer mp) {
                        //播放完成, 通过sendEvent发送事件
                        mState=STATE_NO_PLAYING;
                        stopTimerTask();
                        mPlayer.reset();
                        WritableMap map=Arguments.createMap();
                        map.putString("state",PLAY_COMPLETE);
                        sendEvent(mContext,PLAY_STATE,map);
                    }
                });
                mPlayer.prepareAsync();//异步
            } catch (IOException e) {
                mState = STATE_NO_PLAYING;
                mPlayer.reset();
                WritableMap map=Arguments.createMap();
                map.putString("state",PLAY_EXCEPTION);
                sendEvent(mContext,PLAY_STATE,map);
            }
        }

    }

    @ReactMethod
    public void stop() {
        mState = STATE_PAUSE;
        if (mPlayer == null || !isPlaying()) {
            WritableMap map=Arguments.createMap();
            map.putString("state",STOP_PLAY_MEDIA);
            sendEvent(mContext,PLAY_STATE,map);
            return;
        }
        stopTimerTask();
        WritableMap map=Arguments.createMap();
        map.putString("state",STOP_PLAY_MEDIA);
        sendEvent(mContext,PLAY_STATE,map);
    }

    /**
     * 拖动进度
     * @param msec 单位毫秒
     */
    @ReactMethod
    public void seekTo(int msec) {
        this.mCurrentPosition = msec;
        if (mPlayer != null && isPlaying()) {
            mPlayer.seekTo(msec);
            mPlayer.start();
        }
    }


    public  static void sendEvent(ReactContext reactContext, String eventName, WritableMap map)
    {
        System.out.println("reactContext="+reactContext);

        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName,map);
    }

    /**
     * 开启刷新进度任务
     */
    private void startTimeTask() {
        stopTimerTask();
        mTimer = new Timer();
        mTimerTask = new TimerTask() {
            @Override
            public void run() {
                if (mPlayer != null && isPlaying()) {
                    updateMediaProgress();
                }
            }
        };
        mTimer.schedule(mTimerTask, 0, MEDIA_PROGRESS_UPDATE_PERIOD);
    }

    /**
     * 停止刷新进度任务
     */
    private void stopTimerTask() {
        if (mTimerTask == null || mTimer == null) {
            return;
        }
        mTimerTask.cancel();
        mTimer.cancel();
        mTimer.purge();
        mTimerTask = null;
        mTimer = null;
        this.mCurrentPosition = 0;
    }

    /**
     * 刷新进度
     */
    private void updateMediaProgress() {
        int currentPosition = mPlayer.getCurrentPosition();
        MediaPlayerModule.this.mCurrentPosition = currentPosition;
        int totalDuration = mPlayer.getDuration();//单位都是毫秒
        WritableMap map = Arguments.createMap();
        map.putInt("currentPosition", currentPosition);
        map.putInt("totalDuration", totalDuration);
        sendEvent(mContext,PLAY_PROGRESS,map);
        Log.i("lpw", "currentPosition = " + currentPosition + "  totalDuration = " + totalDuration);
    }
}
