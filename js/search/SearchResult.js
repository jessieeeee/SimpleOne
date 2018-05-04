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
let {width, height} = constants.ScreenWH;
class SearchResult extends Component{
    constructor(props){
        super(props);
        this.state={
            result:'',
            curText: '',
        };
        this.itemArr=[];

    }

    componentDidMount(){
        this.searchKey(this.props.route.params.searchKey);
    }

    searchKey(key){
        let url='http://v3.wufazhuce.com:8000/api/search/hp/'+ encodeURI(key);
        NetUtils.get(url,null,(result) => {
            console.log('result'+JSON.stringify(result));
            this.setState({
                result:result.data
            })
        })
    }

    /**
     * 渲染单个item
     * @returns {*}
     */
    renderItem(){
        for(let i=0;i<this.state.result.length;i++){
            let itemResult=this.state.result[i];
            this.itemArr.push(
                <TouchableOpacity key={i} style={styles.itemView} activeOpacity={1} onPress={() => this.pushToRead(itemResult)}>
                    <Image style={styles.itemImg} source={{uri:itemResult.hp_img_url}}/>
                    <View style={styles.itemText}>
                        <Text style={styles.itemTitle} numberOfLines={1} ellipsizeMode='tail'>{itemResult.hp_content}</Text>
                        <Text style={styles.itemOrder}>{itemResult.hp_title}</Text>
                    </View>
                </TouchableOpacity>
            );
        }
        return this.itemArr;
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
                    contentId:rowData.hpcontent_id,
                    contentType:rowData.template_category,
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
                  page={1}
                  onChangeTab={(currentPage)=>{
                      console.log(currentPage.i);
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
                  <ScrollView tabLabel='图文' style={{flex:1,backgroundColor:'white'}}>
                      {this.renderItem()}
                  </ScrollView>
                  <ScrollView tabLabel='阅读'/>
                  <ScrollView tabLabel='音乐'/>
                  <ScrollView tabLabel='影视'/>
                  <ScrollView tabLabel='深夜电台'/>
                  <ScrollView tabLabel='作者/音乐人'/>
              </ScrollableTabView>
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
    }
});
export default SearchResult;