const state = {
    hide: 0,
    loading: 1,
    noMore: 2,
    tip: 3,
    error: 4,
}
const stateText = {
    loading: '正在加载更多',
    noMore: '没有更多了',
    tip: '上拉加载更多',
    error: '加载失败'
}
export default {state,stateText}