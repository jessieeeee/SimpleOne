package com.jessie.u_share;


import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

/**
 * @author JessieK
 * @date 2018/1/4 0004
 * @email lyj1246505807@gmail.com
 * @description 暴露原生分享sdk调用方法
 */


public class UShareModule extends ReactContextBaseJavaModule {
    public UShareModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "UShare";
    }

    @ReactMethod
    public static void share(int platform, String title, String content, String imageUrl, String targetUrl, final Callback successCallback, final Callback errorCallback, final Callback cancelCallback) {
        UShare.share(platform,title,content,imageUrl,targetUrl,successCallback,errorCallback,cancelCallback);
    }

}
