
// 服务器主机ip
const server_host='http://v3.wufazhuce.com:8000/api'
const object={
    HotAuthor: server_host+ '/author/hot',// 热门作家
    AllBanner: server_host+ '/banner/list/3',// 全部banner
    AllQuestion: server_host+ '/banner/list/5',// 所有人问所有人
    AllTopic: server_host+ '/banner/list/4?last_id={id}',// 所有专题
    OneList: server_host+ '/channel/one/{date}/0?version=4.3.4',// 首页one的列表
    SearchCategory:server_host+'/all/list/{category_id}',// 搜索模块
    Question:server_host+'/question/htmlcontent/{content_id}',//问答
    QuestionComment:server_host+'/comment/praiseandtime/question/{content_id}',//问答
    SerialContent:server_host+'/serialcontent/htmlcontent/{content_id}',//连载
    SerialContentComment:server_host+'/comment/praiseandtime/serial/{content_id}/0',
    Music:server_host+'/music/htmlcontent/{content_id}',//音乐
    MusicComment:server_host+'/comment/praiseandtime/music/{content_id}/0',
    Movie:server_host+'/movie/htmlcontent/{content_id}',//电影
    MovieComment:server_host+'/comment/praiseandtime/movie/{content_id}/0',
    Essay:server_host+'/essay/htmlcontent/{content_id}',// 文章内容和作者
    EssayComment:server_host+'/comment/praiseandtime/essay/{content_id}/0',// 文章评论
    Radio:server_host+'/radio/htmlcontent/{content_id}',//电台
    RadioComment:server_host+'/comment/praiseandtime/radio/{content_id}/0',
    Topic:server_host+'/topic/htmlcontent/{content_id}',//专题
    TopicComment:server_host+'/comment/praiseandtime/topic/{content_id}/0',
    AuthorPage:server_host+'/author/works?page_num={page_num}&author_id={author_id}&version=4.3.4',//作者页
    AuthorHead:server_host+'/author/info?&author_id={author_id}&version=4.3.4',//作者页头部
}

export default object

