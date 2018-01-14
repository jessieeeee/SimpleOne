package simpleone.jessie.com.simpleone.view;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.events.RCTEventEmitter;

/**
 * @author JessieK
 * @date 2018/1/12 0012
 * @email lyj1246505807@gmail.com
 * @description 选择日期模块
 */


public class PickDateViewManger extends SimpleViewManager<PickDateView> {
    private static final String REACT_CLASS = "PickDateView";
    private static final String TAG = "PickDateViewManger原生Tag";

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    protected PickDateView createViewInstance(final ThemedReactContext reactContext) {
        final PickDateView pickDateView=new PickDateView(reactContext);
        pickDateView.setCallBack(new PickDateView.CallBack() {
            @Override
            public void changeYear(int year) {
                WritableMap map = Arguments.createMap();
                map.putInt("target", pickDateView.getId());
                map.putString("msg", "year: " + year);
                reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(
                        pickDateView.getId(), "topChange", map
                );
            }

            @Override
            public void changeMonth(int month) {
                WritableMap map = Arguments.createMap();
                map.putInt("target", pickDateView.getId());
                map.putString("msg", "month: " + month);
                reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(
                        pickDateView.getId(), "topChange", map
                );

            }

            @Override
            public void onSure(int year, int month, long time) {
                WritableMap map = Arguments.createMap();
                map.putInt("target", pickDateView.getId());

                WritableMap params=Arguments.createMap();
                params.putInt("year",year);
                params.putInt("month",month);
                params.putString("time",time+"");

//                String paramsStr=jsonEnclose(params).toString();
                map.putMap("msg", params);
                reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(
                        pickDateView.getId(), "topChange", map
                );

            }
        });
        return pickDateView;
    }

}
