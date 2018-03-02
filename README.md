# SimpleOne
高仿one一个，基于react-native实现的客户端

先上目前的效果图：

 ![image](http://oqujmbgen.bkt.clouddn.com/simpleone1.jpg?imageView2/1/100/100)
 ![image](http://oqujmbgen.bkt.clouddn.com/simpleone2.jpg){:height="50%" width="50%"}
 ![image](http://oqujmbgen.bkt.clouddn.com/simpleone3.jpg){:height="50%" width="50%"}
 ![image](http://oqujmbgen.bkt.clouddn.com/simpleone4.jpg){:height="50%" width="50%"}
 ![image](http://oqujmbgen.bkt.clouddn.com/simpleone5.jpg){:height="50%" width="50%"}
 ![image](http://oqujmbgen.bkt.clouddn.com/simpleone6.jpg){:height="50%" width="50%"}
 ![image](http://oqujmbgen.bkt.clouddn.com/simpleone7.jpg){:height="50%" width="50%"}
 ![image](http://oqujmbgen.bkt.clouddn.com/simpleone8.jpg){:height="50%" width="50%"}
 ![image](http://oqujmbgen.bkt.clouddn.com/simpleone9.jpg){:height="50%" width="50%"}
 ![image](http://oqujmbgen.bkt.clouddn.com/simpleone10.jpg){:height="50%" width="50%"}
 ![image](http://oqujmbgen.bkt.clouddn.com/simpleone12.jpg){:height="50%" width="50%"}
 ![image](http://oqujmbgen.bkt.clouddn.com/simpleone13.jpg){:height="50%" width="50%"}
 ![image](http://oqujmbgen.bkt.clouddn.com/simpleone14.jpg){:height="50%" width="50%"}

# api接口清单

这里对提取出的api接口做个记录，本人以学习为目的，希望读者也不要用于任何商业项目中，目前列出的接口是基于4.3.4的android版：

1. one首页（第一页，date=0，更多页date=yyyy-MM-dd）

   `http://v3.wufazhuce.com:8000/api/channel/one/{date}/0`

2. 专题列表（第一页，last_id=0，更多页last_id=上次请求结束的id）

   `http://v3.wufazhuce.com:8000/api/banner/list/4?last_id={last_id}`

3. 横着的列表（所有人问所有人）

   `http://v3.wufazhuce.com:8000/api/banner/list/5`

4. 近期热门作者

   `http://v3.wufazhuce.com:8000/api/author/hot`

5. one首页菜单跳转
   - 问答
     `http://v3.wufazhuce.com:8000/api/comment/praiseandtime/question/{content_id}`
     `http://v3.wufazhuce.com:8000/api/question/htmlcontent/{content_id}`

   - 连载
     `http://v3.wufazhuce.com:8000/api/comment/praiseandtime/serial/{content_id}/0`
     `http://v3.wufazhuce.com:8000/api/serialcontent/htmlcontent/{content_id}`

   - 音乐
     `http://v3.wufazhuce.com:8000/api/music/htmlcontent/{content_id}`
     `http://v3.wufazhuce.com:8000/api/comment/praiseandtime/music/{content_id}/0`

   - 电影
     `http://v3.wufazhuce.com:8000/api/comment/praiseandtime/movie/{content_id}/0`
     `http://v3.wufazhuce.com:8000/api/movie/htmlcontent/{content_id}`

   - 文章内容和作者
     `http://v3.wufazhuce.com:8000/api/essay/htmlcontent/{content_id}`
     文章评论
     `http://v3.wufazhuce.com:8000/api/comment/praiseandtime/essay/{content_id}/0`

6.  搜索模块分类跳转（category_id，0图文 3问答 1阅读 2连载 5影视 4音乐 8电台）

    `http://v3.wufazhuce.com:8000/api/all/list/{category_id}`

7.  one首页和专题列表的item点击阅读跳转详情和获取评论
   - 问答
     `http://v3.wufazhuce.com:8000/api/question/htmlcontent/{content_id}`
     `http://v3.wufazhuce.com:8000/api/comment/praiseandtime/question/{content_id}`

   - 连载
     `http://v3.wufazhuce.com:8000/api/serialcontent/htmlcontent/{content_id}`
     `http://v3.wufazhuce.com:8000/api/comment/praiseandtime/serial/{content_id}/0`

   - 音乐
     `http://v3.wufazhuce.com:8000/api/music/htmlcontent/{content_id}`
     `http://v3.wufazhuce.com:8000/api/comment/praiseandtime/music/{content_id}/0`

   - 电影
     `http://v3.wufazhuce.com:8000/api/movie/htmlcontent/{content_id}`
     `http://v3.wufazhuce.com:8000/api/comment/praiseandtime/movie/{content_id}/0`

   - 文章内容和作者
     `http://v3.wufazhuce.com:8000/api/essay/htmlcontent/{content_id}`
   - 文章评论
     `http://v3.wufazhuce.com:8000/api/comment/praiseandtime/essay/{content_id}/0`
   - 电台
     `http://v3.wufazhuce.com:8000/api/radio/htmlcontent/{content_id}`
     `http://v3.wufazhuce.com:8000/api/comment/praiseandtime/radio/{content_id}/0`

   - 专题
     `http://v3.wufazhuce.com:8000/api/topic/htmlcontent/{content_id}`
     `http://v3.wufazhuce.com:8000/api/comment/praiseandtime/topic/{content_id}/0`

8. 作者页
  `http://v3.wufazhuce.com:8000/api/author/works?page_num={page_num}&author_id={author_id}&version=4.3.4`

# 功能模块：

根据android 4.3.4整理：

一级界面：

欢迎界面，按星期几展示不同的欢迎界面

one分页，也是首页，展示今日列表（插图，one-story, 问答，文章，影视，音乐，电台），折叠菜单，可翻页查看以前的列表，每翻一页，查看前一天的内容，列表头部可以下拉刷新。

all分页，长列表展示，顶部banner，分类导航，专题列表（下拉到底部以后，可加载更多），列表头部可以下拉刷新。

me分页，个人资料页，未登录时，为登录界面入口和设置入口

二级界面：

设置界面

阅读界面

登录界面

分享界面

搜索界面

第三方平台分享，登录sdk对接

## 当前未完成部分：

阅读界面js回调（包含音乐播放）夜间模式

设置模块缓存

阅读界面交互动画

one分页翻页标题动画

# 目前用到的技术：

由于我最初学习的时候资料是用ES5进行编写的，这是我自学ReactNative后的第一个项目，所以本项目ES5和ES6混用，我知道这样不是很好，有时间了会全部使用ES6

react-native对原生组件进行了封装。

1. 基本控件的使用 View，Text，Image，ScrollView，ListView，WebView，Clipboard，Platform，TouchableOpacity，ActivityIndicator，StatusBar，SliderBar。
2. 动画的调用，Animated，Easing
3. 计时器的使用，react-timer-mixin
4. react-native调用原生模块（原生toast，调android第三方分享sdk）
5. 底部导航栏TabNavigator，页面导航Navigator
6. 子组件的封装，调用以及回调
7. 父组件和子组件之间的参数传递
8. 页面导航跳转时的参数传递，以及回调
9. 下拉刷新，第三方react-native控件的引入( react-native-pull )，并进行部分修改
10. 自定义折叠控件（one分页中的菜单）实现折叠动画
11. 自定义banner控件，实现all分页中的广告栏展示
12. 自定义加载更多控件，监听ScrollView的滑动，实现加载更多
13. 自定义阅读界面loading时的帧动画展示
14. 半透明界面，悬浮窗实现，自定义单选对话框实现
15. 相册，拍照实现，react-native第三方库接入
16. 调用基于Android原生封装的ui控件
17. 在Android原生项目的基础上引入react-native框架进行混合开发
18. 音乐专辑封面旋转动画（解决动画循环播放中的暂停与播放事件），通过直接修改属性setNativeProps实现帧动画提高性能
