package com.jessie.simpleone;


import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;
import com.jessie.simpleone.animation.ShowPlayViewManager;
import com.jessie.u_share.ULoginModule;
import com.jessie.u_share.UShareModule;
import java.util.ArrayList;
import java.util.List;

import com.jessie.simpleone.view.PickDateViewManager;


/**
 * @author JessieK
 * @date 2017/12/25 0025
 * @email lyj1246505807@gmail.com
 * @description 自定义的rn组件包
 */


public class MyReactPackage implements ReactPackage {

    /**
     * 引入原生的view
     * @param reactContext
     * @return
     */
    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        List<ViewManager> viewManagers=new ArrayList<>();
        viewManagers.add(new PickDateViewManager());
        viewManagers.add(new ShowPlayViewManager());
        return viewManagers;
    }

    /**
     * 引入原生的模块
     * @param reactContext
     * @return
     */
    @Override
    public List<NativeModule> createNativeModules(
            ReactApplicationContext reactContext) {
        List<NativeModule> modules = new ArrayList<>();
        modules.add(new UShareModule(reactContext));
        modules.add(new ULoginModule(reactContext));
        modules.add(new ToastModule(reactContext));
        modules.add(new MediaPlayerModule(reactContext));
        modules.add(new ClearCacheModule(reactContext));
        return modules;
    }
}
