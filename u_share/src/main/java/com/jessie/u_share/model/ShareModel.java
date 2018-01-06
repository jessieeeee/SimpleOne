package com.jessie.u_share.model;

/**
 * @author JessieK
 * @date 2018/1/4 0004
 * @email lyj1246505807@gmail.com
 * @description 分享参数封装
 */

public class ShareModel {
   private String title;
   private String content;
   private String imageUrl;
   private String targetUrl;


    public ShareModel(String title, String content, String imageUrl, String targetUrl) {
        this.title = title;
        this.content = content;
        this.imageUrl = imageUrl;
        this.targetUrl = targetUrl;

    }

    public String getTitle() {
        return title;
    }

    public String getContent() {
        return content;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public String getTargetUrl() {
        return targetUrl;
    }

}
