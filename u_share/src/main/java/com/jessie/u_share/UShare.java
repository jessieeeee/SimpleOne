package com.jessie.u_share;

import android.Manifest;
import android.app.Activity;
import android.content.pm.PackageManager;
import android.support.v4.app.ActivityCompat;
import android.support.v4.content.ContextCompat;
import android.text.TextUtils;
import android.widget.Toast;

import com.facebook.react.bridge.Callback;
import com.jessie.u_share.model.ShareModel;
import com.jessie.u_share.util.Constants;
import com.umeng.socialize.ShareAction;
import com.umeng.socialize.UMShareListener;
import com.umeng.socialize.bean.SHARE_MEDIA;
import com.umeng.socialize.media.UMImage;
import com.umeng.socialize.media.UMWeb;

import java.lang.ref.WeakReference;



/**
 * @author JessieK
 * @date 2018/1/4 0004
 * @email lyj1246505807@gmail.com
 * @description 权限申请和分享操作
 */


public class UShare {
    private static WeakReference<Activity> mActivity;
    private static WeakReference<ShareModel> mShareModel;
    private static int mPlatform;
    private static Callback mSuccessCallback;
    private static Callback mErrorCallback;
    private static Callback mCancelCallback;
    public static void init(Activity activity) {
        if (activity == null) {
            return;
        }
        mActivity = new WeakReference<>(activity);
    }

    public static void share(final int platform, final String title, final String content, final String imageUrl, final String targetUrl, final Callback successCallback,final Callback errorCallback,final Callback cancelCallback) {
        if (mActivity == null) {
            return;
        }
        mPlatform = platform;
        mSuccessCallback=successCallback;
        mErrorCallback=errorCallback;
        mCancelCallback=cancelCallback;

        boolean granted = true;
        if (!TextUtils.isEmpty(imageUrl)) {
            granted = ContextCompat.checkSelfPermission(mActivity.get(), Manifest.permission.WRITE_EXTERNAL_STORAGE) == PackageManager.PERMISSION_GRANTED ? true : false;
        }
        if (!granted) {
            ShareModel shareModel = new ShareModel(title, content, imageUrl, targetUrl);
            mShareModel = new WeakReference<>(shareModel);
            ActivityCompat.requestPermissions(mActivity.get(), new String[]{Manifest.permission.WRITE_EXTERNAL_STORAGE}, Constants.RC_REQUEST_PERMISSIONS);
            return;
        }

        mActivity.get().runOnUiThread(new Runnable() {
            @Override
            public void run() {
                openShare(platform, title, content, imageUrl, targetUrl);
            }
        });

    }

    public static void share(final ShareModel shareModel) {
        mActivity.get().runOnUiThread(new Runnable() {
            @Override
            public void run() {
                openShare(mPlatform, shareModel.getTitle(), shareModel.getContent(), shareModel.getImageUrl(), shareModel.getTargetUrl());
            }
        });
    }

    public static void openShare(final int platform, final String title, final String content, final String imageUrl, final String targetUrl) {
        UMWeb web = new UMWeb(targetUrl);
        web.setTitle(title);//标题
        UMImage thumb = new UMImage(mActivity.get(), R.drawable.umeng_socialize_qq);
        web.setThumb(thumb);  //缩略图
        web.setDescription(content);//描述
        SHARE_MEDIA shareMedia = SHARE_MEDIA.QQ;
        switch (platform) {
            case Constants.QQ:
                shareMedia = SHARE_MEDIA.QQ;
                break;
            case Constants.WeChat:
                shareMedia = SHARE_MEDIA.WEIXIN;
                break;
            case Constants.WeChatMoments:
                shareMedia = SHARE_MEDIA.WEIXIN_CIRCLE;
                break;
            case Constants.Sina:
                shareMedia = SHARE_MEDIA.SINA;
                break;
            default:
                break;
        }
        new ShareAction(mActivity.get())
                .setPlatform(shareMedia)//传入平台
                .withMedia(web)
                .setCallback(shareListener)//回调监听器
                .share();

    }

    public static void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        if (mShareModel == null) {
            return;
        }
        if (requestCode == Constants.RC_REQUEST_PERMISSIONS) {
            for (int i = 0, j = permissions.length; i < j; i++) {
                if (TextUtils.equals(permissions[i], Manifest.permission.WRITE_EXTERNAL_STORAGE)) {
                    if (grantResults[i] == PackageManager.PERMISSION_GRANTED) {
                        share(mShareModel.get());
                    } else {
                        if (mActivity == null) {
                            return;
                        }
                        Toast.makeText(mActivity.get(), "没有使用SD卡的权限，请在权限管理中为GitHubPopular开启使用SD卡的权限", Toast.LENGTH_SHORT).show();
                    }
                }
            }
        }
    }

    static UMShareListener shareListener = new UMShareListener() {
        /**
         * @descrption 分享开始的回调
         * @param platform 平台类型
         */
        @Override
        public void onStart(SHARE_MEDIA platform) {

        }

        /**
         * @descrption 分享成功的回调
         * @param platform 平台类型
         */
        @Override
        public void onResult(SHARE_MEDIA platform) {
            mSuccessCallback.invoke(platform.toString());
        }

        /**
         * @descrption 分享失败的回调
         * @param platform 平台类型
         * @param t 错误原因
         */
        @Override
        public void onError(SHARE_MEDIA platform, Throwable t) {
            mErrorCallback.invoke(platform.toString(), "失败" + t.getMessage());
        }

        /**
         * @descrption 分享取消的回调
         * @param platform 平台类型
         */
        @Override
        public void onCancel(SHARE_MEDIA platform) {
            mCancelCallback.invoke(platform.toString());
        }
    };

}
