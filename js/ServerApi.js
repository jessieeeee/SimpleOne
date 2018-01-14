
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
export var SearchCategory=server_host+'/all/list/{category_id}';

// 文章
//问答
export var Question=server_host+'/question/htmlcontent/{content_id}';
export var QuestionComment=server_host+'/comment/praiseandtime/question/{content_id}';

//连载
export var SerialContent=server_host+'/serialcontent/htmlcontent/{content_id}';
export var SerialContentComment=server_host+'/comment/praiseandtime/serial/{content_id}/0';

//音乐
export var Music=server_host+'/music/htmlcontent/{content_id}';
export var MusicComment=server_host+'/comment/praiseandtime/music/{content_id}/0';

//电影
export var Movie=server_host+'/movie/htmlcontent/{content_id}';
export var MovieComment=server_host+'/comment/praiseandtime/movie/{content_id}/0';

// 文章内容和作者
export var Essay=server_host+'/essay/htmlcontent/{content_id}';
// 文章评论
export var EssayComment=server_host+'/comment/praiseandtime/essay/{content_id}/0';

//电台
export var Radio=server_host+'/radio/htmlcontent/{content_id}';
export var RadioComment=server_host+'/comment/praiseandtime/radio/{content_id}/0';

//专题
export var Topic=server_host+'/topic/htmlcontent/{content_id}';
export var TopicComment=server_host+'/comment/praiseandtime/topic/{content_id}/0';

//作者页
export var AuthorPage=server_host+'/author/works?page_num={page_num}&author_id={author_id}&version=4.3.4';
