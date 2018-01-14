package com.jessie.u_share;

import android.app.Activity;

import com.facebook.react.bridge.Callback;
import com.jessie.u_share.util.Constants;
import com.umeng.socialize.UMAuthListener;
import com.umeng.socialize.UMShareAPI;
import com.umeng.socialize.bean.SHARE_MEDIA;

import java.lang.ref.WeakReference;
import java.util.Map;

/**
 * @author JessieK
 * @date 2018/1/11 0011
 * @email lyj1246505807@gmail.com
 * @description 第三方登录
 */


public class ULogin {
    private static WeakReference<Activity> mActivity;
    private static int mPlatform;
    private static Callback mSuccessCallback;
    private static Callback mErrorCallback;
    private static Callback mCancelCallback;
    public static void init(Activity activity) {
        if (activity == null) {
            return;
        }
        mActivity = new WeakReference<>(activity);
    }


    public static void login(final int platform,final Callback successCallback,final Callback errorCallback,final Callback cancelCallback) {
        if (mActivity == null) {
            return;
        }
        mPlatform = platform;
        mSuccessCallback=successCallback;
        mErrorCallback=errorCallback;
        mCancelCallback=cancelCallback;


        mActivity.get().runOnUiThread(new Runnable() {
            @Override
            public void run() {
                openLogin(platform);
            }
        });

    }


    public static void openLogin(final int platform) {
        SHARE_MEDIA shareMedia = SHARE_MEDIA.QQ;
        switch (platform) {
            case Constants.QQ:
                shareMedia = SHARE_MEDIA.QQ;
                break;
            case Constants.WeChat:
                shareMedia = SHARE_MEDIA.WEIXIN;
                break;
            case Constants.WeChatMoments:
                shareMedia = SHARE_MEDIA.WEIXIN_CIRCLE;
                break;
            case Constants.Sina:
                shareMedia = SHARE_MEDIA.SINA;
                break;
            default:
                break;
        }
        UMShareAPI.get(mActivity.get()).getPlatformInfo(mActivity.get(), shareMedia, umAuthListener);
    }

    static UMAuthListener umAuthListener = new UMAuthListener() {
        @Override
        public void onStart(SHARE_MEDIA platform) {
            //授权开始的回调
        }
        @Override
        public void onComplete(SHARE_MEDIA platform, int action, Map<String, String> data) {
            mSuccessCallback.invoke(platform.toString());
        }

        @Override
        public void onError(SHARE_MEDIA platform, int action, Throwable t) {
            mErrorCallback.invoke(platform.toString(), "失败" + t.getMessage());
        }

        @Override
        public void onCancel(SHARE_MEDIA platform, int action) {
            mCancelCallback.invoke(platform.name());
        }
    };
}
