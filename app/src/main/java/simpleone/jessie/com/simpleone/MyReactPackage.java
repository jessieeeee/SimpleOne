package simpleone.jessie.com.simpleone;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;
import com.jessie.u_share.UShareModule;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;


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
        return Collections.emptyList();
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
        modules.add(new ToastModule(reactContext));

        return modules;
    }
}
