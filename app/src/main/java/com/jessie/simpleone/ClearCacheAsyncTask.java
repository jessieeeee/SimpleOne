package com.jessie.simpleone;
import com.facebook.react.bridge.Callback;
import android.os.AsyncTask;

/**
 * @author jessie
 * @date 7/30/18
 * @email lyj1246505807@gmail.com
 * @description
 */

public class ClearCacheAsyncTask extends AsyncTask<Integer,Integer,String> {
    public ClearCacheModule myclearCacheModule = null;
    public Callback callback;
    public ClearCacheAsyncTask(ClearCacheModule clearCacheModule, Callback callback) {
        super();
        this.myclearCacheModule = clearCacheModule;
        this.callback = callback;
    }

    @Override
    protected void onPreExecute() {
        super.onPreExecute();
    }

    @Override
    protected void onPostExecute(String s) {
        super.onPostExecute(s);
        callback.invoke();

    }

    @Override
    protected String doInBackground(Integer... params) {
        myclearCacheModule.clearCache();
        return null;
    }
}
