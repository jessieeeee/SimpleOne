package com.jessie.simpleone;

import android.content.Context;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;

import java.io.File;

/**
 * @author jessie
 * @date 7/30/18
 * @email lyj1246505807@gmail.com
 * @description
 */

public class ClearCacheModule extends ReactContextBaseJavaModule {
    static public ClearCacheModule myclearCacheModule;
    public ClearCacheModule(ReactApplicationContext reactContext) {
        super(reactContext);
        myclearCacheModule = this;
    }

    @Override
    public String getName() {
        return "ClearCache";
    }

    //获取缓存大小
    @ReactMethod
    public void getCacheSize(Callback callback){
        // 计算缓存大小
        long fileSize = 0;
        File filesDir = getReactApplicationContext().getFilesDir();// /data/data/package_name/files
        File cacheDir = getReactApplicationContext().getCacheDir();// /data/data/package_name/cache
        fileSize += getDirSize(filesDir);
        fileSize += getDirSize(cacheDir);
        // 2.2版本才有将应用缓存转移到sd卡的功能
        if(isMethodsCompat(android.os.Build.VERSION_CODES.FROYO)){
            File externalCacheDir = getExternalCacheDir(getReactApplicationContext());//"<sdcard>/Android/data/<package_name>/cache/"
            fileSize += getDirSize(externalCacheDir);
        }
        if (fileSize > 0){
            String strFileSize = formatFileSize(fileSize);
            String unit = formatFileSizeName(fileSize);
            callback.invoke(strFileSize,unit);
        }
        else{
            WritableMap params = Arguments.createMap();
            callback.invoke("0","B");
        }
    }

    //清除缓存
    @ReactMethod
    public void runClearCache(Callback callback){

        this.clearAppCache(callback);

    }



    /**
     * 获取目录文件大小
     *
     * @param dir
     * @return
     */
    private long getDirSize(File dir) {
        if (dir == null) {
            return 0;
        }
        if (!dir.isDirectory()) {
            return 0;
        }
        long dirSize = 0;
        File[] files = dir.listFiles();
        for (File file : files) {
            if (file.isFile()) {
                dirSize += file.length();
            } else if (file.isDirectory()) {
                dirSize += file.length();
                dirSize += getDirSize(file); // 递归调用继续统计
            }
        }
        return dirSize;
    }

    /**
     * 判断当前版本是否兼容目标版本的方法
     * @param VersionCode
     * @return
     */
    private boolean isMethodsCompat(int VersionCode) {
        int currentVersion = android.os.Build.VERSION.SDK_INT;
        return currentVersion >= VersionCode;
    }

    private File getExternalCacheDir(Context context) {

        // return context.getExternalCacheDir(); API level 8

        // e.g. "<sdcard>/Android/data/<package_name>/cache/"

        return context.getExternalCacheDir();
    }

    /**
     * 转换文件大小名称
     *
     * @param fileS
     * @return B/KB/MB/GB
     */
    private String formatFileSizeName(long fileS) {
        java.text.DecimalFormat df = new java.text.DecimalFormat("#.00");
        String fileSizeString = "";
        if (fileS < 1024) {
            fileSizeString = "B";
        } else if (fileS < 1048576) {
            fileSizeString = "KB";
        } else if (fileS < 1073741824) {
            fileSizeString = "MB";
        } else {
            fileSizeString = "G";
        }
        return fileSizeString;
    }


    /**
     * 转换文件大小
     *
     * @param fileS
     * @return B/KB/MB/GB
     */
    private String formatFileSize(long fileS) {
        java.text.DecimalFormat df = new java.text.DecimalFormat("#.00");
        String fileSizeString = "";
        if (fileS < 1024) {
            fileSizeString = df.format((double) fileS);
        } else if (fileS < 1048576) {
            fileSizeString = df.format((double) fileS / 1024);
        } else if (fileS < 1073741824) {
            fileSizeString = df.format((double) fileS / 1048576);
        } else {
            fileSizeString = df.format((double) fileS / 1073741824);
        }
        return fileSizeString;
    }

    /**
     * 转换文件大小
     *
     * @param fileS
     * @return B/KB/MB/GB
     */
//    private String formatFileSize(long fileS) {
//        java.text.DecimalFormat df = new java.text.DecimalFormat("#.00");
//        String fileSizeString = "";
//        if (fileS < 1024) {
//            fileSizeString = df.format((double) fileS) + "B";
//        } else if (fileS < 1048576) {
//            fileSizeString = df.format((double) fileS / 1024) + "KB";
//        } else if (fileS < 1073741824) {
//            fileSizeString = df.format((double) fileS / 1048576) + "MB";
//        } else {
//            fileSizeString = df.format((double) fileS / 1073741824) + "G";
//        }
//        return fileSizeString;
//    }


    /**
     * 清除app缓存
     */
    public void clearAppCache(Callback callback)
    {

        ClearCacheAsyncTask asyncTask = new ClearCacheAsyncTask(myclearCacheModule,callback);
        asyncTask.execute(10);

    }

    public void clearCache(){

        getReactApplicationContext().deleteDatabase("webview.db");
        getReactApplicationContext().deleteDatabase("webview.db-shm");
        getReactApplicationContext().deleteDatabase("webview.db-wal");
        getReactApplicationContext().deleteDatabase("webviewCache.db");
        getReactApplicationContext().deleteDatabase("webviewCache.db-shm");
        getReactApplicationContext().deleteDatabase("webviewCache.db-wal");
        //清除数据缓存
        clearCacheFolder(getReactApplicationContext().getFilesDir(),System.currentTimeMillis());
        clearCacheFolder(getReactApplicationContext().getCacheDir(),System.currentTimeMillis());
        //2.2版本才有将应用缓存转移到sd卡的功能
        if(isMethodsCompat(android.os.Build.VERSION_CODES.FROYO)){
            clearCacheFolder(getExternalCacheDir(getReactApplicationContext()),System.currentTimeMillis());
        }

    }

    /**
     * 清除缓存目录
     * 目录
     * 当前系统时间
     */
    private int clearCacheFolder(File dir, long curTime) {
        int deletedFiles = 0;
        if (dir!= null && dir.isDirectory()) {
            try {
                for (File child:dir.listFiles()) {
                    if (child.isDirectory()) {
                        deletedFiles += clearCacheFolder(child, curTime);
                    }
                    if (child.lastModified() < curTime) {
                        if (child.delete()) {
                            deletedFiles++;
                        }
                    }
                }
            } catch(Exception e) {
                e.printStackTrace();
            }
        }
        return deletedFiles;
    }

}
