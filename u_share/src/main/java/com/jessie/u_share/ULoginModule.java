package com.jessie.u_share;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

/**
 * @author JessieK
 * @date 2018/1/11 0011
 * @email lyj1246505807@gmail.com
 * @description 暴露原生第三方登录sdk调用方法
 */


public class ULoginModule extends ReactContextBaseJavaModule {
    public ULoginModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "ULogin";
    }

    @ReactMethod
    public static void login(int platform,final Callback successCallback, final Callback errorCallback, final Callback cancelCallback) {
        ULogin.login(platform,successCallback,errorCallback,cancelCallback);
    }

}
