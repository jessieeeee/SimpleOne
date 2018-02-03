package simpleone.jessie.com.simpleone.animation;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.events.RCTEventEmitter;

/**
 * @author JessieK
 * @date 2018/2/1 0001
 * @email lyj1246505807@gmail.com
 * @description 展示播放音乐模块
 */


public class ShowPlayViewManager extends SimpleViewManager<ShowPlayView> {
    private static final String REACT_CLASS = "ShowPlayView";
    private static final String TAG = "ShowPlayViewManager原生Tag";
    private ShowPlayView showPlayView;
    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    protected ShowPlayView createViewInstance(final ThemedReactContext reactContext) {
        showPlayView=new ShowPlayView(reactContext);
        showPlayView.setCallback(new ShowPlayView.Callback() {
            @Override
            public void onClick() {
                WritableMap map = Arguments.createMap();
                map.putInt("target", showPlayView.getId());
                map.putString("msg", "click");
                reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(
                        showPlayView.getId(), "topChange", map
                );
            }
        });
        return showPlayView;
    }


}
