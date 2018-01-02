
// 服务器主机ip
export var server_host='http://v3.wufazhuce.com:8000/api';
// 热门作家
export var HotAuthor= server_host+ '/author/hot';
// 全部banner
export var AllBanner= server_host+ '/banner/list/3';
// 所有人问所有人
export var AllQuestion= server_host+ '/banner/list/5';
// 所有专题
export var AllTopic= server_host+ '/banner/list/4?last_id={id}';
// 首页one的列表
export var OneList= server_host+ '/channel/one/{date}/0?version=4.3.4';
// 搜索模块
export var SearchCategory='http://v3.wufazhuce.com:8000/api/all/list/{category_id}';

// 文章
//问答
export var Question=' http://v3.wufazhuce.com:8000/api/question/htmlcontent/{content_id}';
// http://v3.wufazhuce.com:8000/api/comment/praiseandtime/question/{content_id}

//连载
export var SerialContent='http://v3.wufazhuce.com:8000/api/serialcontent/htmlcontent/{content_id}';
// http://v3.wufazhuce.com:8000/api/comment/praiseandtime/serial/{content_id}/0

//音乐
export var Music='http://v3.wufazhuce.com:8000/api/music/htmlcontent/{content_id}';
// http://v3.wufazhuce.com:8000/api/comment/praiseandtime/music/{content_id}/0

//电影
export var Movie=' http://v3.wufazhuce.com:8000/api/movie/htmlcontent/{content_id}';
// http://v3.wufazhuce.com:8000/api/comment/praiseandtime/movie/{content_id}/0

// 文章内容和作者
export var Essay='http://v3.wufazhuce.com:8000/api/essay/htmlcontent/{content_id}';
// 文章评论
// http://v3.wufazhuce.com:8000/api/comment/praiseandtime/essay/{content_id}/0

//电台
export var Radio='http://v3.wufazhuce.com:8000/api/radio/htmlcontent/{content_id}';
// http://v3.wufazhuce.com:8000/api/comment/praiseandtime/radio/{content_id}/0