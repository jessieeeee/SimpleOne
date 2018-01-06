package simpleone.jessie.com.simpleone;

import android.app.Application;
import android.util.Log;

import com.facebook.soloader.SoLoader;
import com.umeng.socialize.PlatformConfig;
import com.umeng.socialize.UMShareAPI;

/**
 * @author JessieKate
 * @date 23/12/2017
 * @email lyj1246505807@gmail.com
 * @describe
 */
public class MainApplication extends Application {

    {
        PlatformConfig.setWeixin("wx967daebe835fbeac", "5bb696d9ccd75a38c8a0bfe0675559b3");
        PlatformConfig.setQQZone("1105188803", "yE7Sg1o4vevLYBKf");
        PlatformConfig.setSinaWeibo("784241162", "0720307710beb53a0382345be698a803", "http://sns.whalecloud.com");
    }

    @Override
    public void onCreate() {
        super.onCreate();
        SoLoader.init(this, /* native exopackage */ false);
        UMShareAPI.get(this);
        Log.d("app", "onCreate: ");
    }
}
