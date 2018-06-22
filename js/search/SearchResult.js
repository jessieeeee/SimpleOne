/**
 * @author : JessieK
 * @email : lyj1246505807@gmail.com
 * @description : 搜索结果
 */
import React, {Component} from 'react';
import ScrollableTabView, {ScrollableTabBar,} from 'react-native-scrollable-tab-view';
import {
    ScrollView,
    StyleSheet,
    Image,
    Text,
    View,
    TouchableOpacity
} from 'react-native';
import NetUtils from "../util/NetUtil";
import constants from "../Constants";
import SearchBar from './SearchBar';
import Read from "../read/Read";
import SearchHpDetail from './SearchHpDetail';
import AuthorPage from "../author/AuthorPage";
let {width, height} = constants.ScreenWH;

class SearchResult extends Component{
    constructor(props){
        super(props);
        this.state={
            result:[],
            curText: '',
            loading:true
        };
        this.itemArr=[]; // 展示列表缓存为二维数组
        this.scrollArr=[]; // 滚动布局数组
        this.curPage=0;//当前第几页
        this.pageTitle=['图文','阅读','音乐','影视','深夜电台','作者/音乐人'];//初始化页面标题
        this.itemId=this.pageTitle.length;//item的id
    }

    componentDidMount(){
        this.setState({
            curText:this.props.route.params.searchKey,
            loading:false
        });
        this.searchKey(this.props.route.params.searchKey);
    }

    /**
     * 获取搜索类型
     */
    getSearchType(){
        switch (this.curPage){
            case 0:
                return 'hp';
            case 1:
                return 'reading';
            case 2:
                return 'music';
            case 3:
                return 'movie';
            case 4:
                return 'radio';
            case 5:
                return 'author';
        }
    }

    /**
     * 关键词搜索
     * @param key
     */
    searchKey(key){
        this.setState({
            loading:true
        });
        let url='http://v3.wufazhuce.com:8000/api/search/'+this.getSearchType()+'/'+ encodeURI(key)+'/0?version=4.3.4';
        NetUtils.get(url,null,(result) => {
            this.state.result[this.curPage]=result.data.list;
            this.setState({
                loading:false
            });
        })
    }

    /**
     * 渲染多个分页滚动界面
     */
    renderScrollView(){
        this.scrollArr=[];
       for(let i=0;i<this.pageTitle.length;i++){
          this.scrollArr.push(
              <ScrollView key={i} tabLabel={this.pageTitle[i]} style={{flex:1,backgroundColor:'white'}}>
                  {this.renderItems(i)}
              </ScrollView>
          )
       }
       return this.scrollArr;
    }

    /**
     * 渲染左边的图片
     */
    renderLeftImg(itemResult){
        // 当前页是作者/音乐人
        if(this.pageTitle[this.curPage] === '作者/音乐人'){
           return(
               <Image style={styles.itemHead} source={{uri:itemResult.cover}}/>
           )
        }
        else {
            return(
                <Image style={styles.itemImg} source={{uri:itemResult.cover}}/>
            );
        }
    }
    /**
     * 渲染第几页的单个item
     * @returns {*}
     */
    renderItems(indexPage){
        this.itemArr[indexPage]=[];
        // 如果当前没有加载
        if(!this.state.loading){
            // 当前没有搜到数据
            if(this.state.result[this.curPage].length===0){
                console.log('当前没有数据');
                return(
                    <View style={{flex:1,alignItems:'center',justifyContent:'center',width:width,height:height*0.6}}>
                        <Image source={{uri:'no_search_result'}} style={styles.noResultImg}/>
                    </View>
                )
            }
            // 如果该页请求了数据
            else if(this.state.result[this.curPage]!==undefined && this.state.result[this.curPage].length>0){
                // 把该页的所有数据渲染出来
                for(let i=0;i<this.state.result[this.curPage].length;i++){

                    let itemResult=this.state.result[this.curPage][i];
                    this.itemArr[indexPage].push(
                        <TouchableOpacity key={this.itemId} style={styles.itemView} activeOpacity={1} onPress={() => this.pushToDetail(itemResult)}>
                            {this.renderLeftImg(itemResult)}
                            <View style={styles.itemText}>
                                <Text style={styles.itemTitle} numberOfLines={1} ellipsizeMode='tail'>{itemResult.title}</Text>
                                <Text style={styles.itemOrder}>{itemResult.subtitle}</Text>
                            </View>
                        </TouchableOpacity>
                    );
                    this.itemId++;
                }
                return this.itemArr[indexPage];
            }
        }



    }

    /***
     * 跳转到详情
     */
    pushToDetail(itemResult){
        switch (this.curPage){
            case 0:
                this.pushToHpDetail(itemResult.content_id);
                break;
            case 1:
            case 2:
            case 3:
            case 4:
                this.pushToRead(itemResult);
                break;
            case 5:
                this.pushToAuthorDetail(itemResult);
                break;
        }
    }

    /**
     * 跳转到作者详情
     */
    pushToAuthorDetail(rowData){
        this.props.navigator.push(
            {
                component: AuthorPage,
                title:'作者页',
                params:{
                    authorId:rowData.content_id,
                    authorName:rowData.title
                }
            }
        )
    }

    /**
     * 跳转到详情
     */
    pushToHpDetail(contentId){
        this.props.navigator.push({
            component:SearchHpDetail,
            title:'图文详情',
            params:{
                contentId:contentId
            }
        })
    }

    /**
     * 跳转到阅读页
     * @param url
     */
    pushToRead(rowData) {
        this.props.navigator.push(
            {
                component: Read,
                title:'阅读',
                params:{
                    contentId:rowData.content_id,
                    contentType:rowData.category,
                    entry:constants.AllRead
                }
            }
        )
    }

    updateText(text) {
        this.setState({
            curText: text,
        });
    }

    render(){
        return(
          <View style={styles.container}>
              <SearchBar
                  navigator={this.props.navigator}
                  searchKey={this.props.route.params.searchKey}
                  onFocus={()=>{

                  }}
                  onBlur={()=>{

                  }}
                  onChange={(event)=>{
                      this.updateText(event.nativeEvent.text)
                  }} onEndEditing={(event)=>{
                  this.updateText(event.nativeEvent.text)
              }} onSubmitEditing={(event) => {
                  this.updateText(event.nativeEvent.text);
                  this.searchKey(event.nativeEvent.text);
              }}/>
              <ScrollableTabView
                  style={{flex:1}}
                  page={this.curPage}
                  onChangeTab={(currentPage)=>{
                      this.curPage=currentPage.i;
                      this.searchKey(this.state.curText);
                  }}
                  renderTabBar={
                      () => <ScrollableTabBar
                          backgroundColor={'white'}
                          activeTextColor={'#0e0e0e'}
                          inactiveTextColor={'#b2b2b2'}
                          activeTab={0}
                          underlineStyle={{
                              position: 'absolute',
                              height: 2,
                              backgroundColor: '#808080',
                              bottom: 0,
                          }}/>}

              >
                  {this.renderScrollView()}

              </ScrollableTabView>
              {constants.renderLoading(this.state.loading)}
          </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    itemView:{
        width:width,
        height:width*0.18,
        flexDirection:'row',
        alignItems:'center',
        borderBottomWidth: constants.divideLineWidth,
        borderBottomColor:'#dddddd'
    },
    itemTitle:{
        color:'#0e0e0e',
        fontSize:width*0.04,
        flexWrap:'nowrap',
    },
    itemText:{
        justifyContent:'center',
        marginLeft:width*0.04,
        width:'74%'
    },
    itemOrder:{
        color:'#b2b2b2',
        fontSize:width*0.03,
    },
    itemImg:{
        width:width*0.1,
        height:width*0.1,
        marginLeft:width*0.04,
        resizeMode: 'stretch',
    },
    itemHead:{
        width:width*0.1,
        height:width*0.1,
        marginLeft:width*0.04,
        borderRadius: width * 0.6,
        resizeMode: 'stretch',
    },
    noResultImg:{
        width:width*0.4,
        height:width*0.51
    }
});
export default SearchResult;