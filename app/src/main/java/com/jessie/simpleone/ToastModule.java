package com.jessie.simpleone;

import android.widget.Toast;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;
import java.util.HashMap;
import java.util.Map;

/**
 * @author JessieK
 * @date 2017/12/25 0025
 * @email lyj1246505807@gmail.com
 * @description 引入原生的模块，暴露原生toast调用的接口，给rn调
 */


public class ToastModule extends ReactContextBaseJavaModule {
    private static final String DURATION_SHORT_KEY = "SHORT";
    private static final String DURATION_LONG_KEY = "LONG";
    boolean flag=true;
    int count=100000;
    public ToastModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    // 复写方法，返回react-native中调用的 组件名
    @Override
    public String getName() {
        return "ToastNative";
    }

    // 复写方法，返回常量
    @Override
    public Map<String, Object> getConstants() {
        final Map<String, Object> constants = new HashMap<>();
        constants.put(DURATION_SHORT_KEY, Toast.LENGTH_SHORT);
        constants.put(DURATION_LONG_KEY, Toast.LENGTH_LONG);
        return constants;
    }
    // 使用 @ReactMethod注解返回react-native中可调用的 方法
    @ReactMethod
    public void show(String message, int duration ,Callback successCallback, Callback errorCallback) {
        Toast.makeText(getReactApplicationContext(), message, duration).show();
        // 通过invoke调用，随便你传参
        if(flag) {
            successCallback.invoke("success", ++count);
        } else {
            errorCallback.invoke("error", ++count);
        }
        flag = !flag;
    }


    // 使用 @ReactMethod注解返回react-native中可调用的 方法
    @ReactMethod
    public void showMsg(String message, int duration) {
        Toast.makeText(getReactApplicationContext(), message, duration).show();
    }
}
