// 引入vue
import Vue from "vue";
// 引入vuex
import Vuex from "vuex";
// 先使用vuex一次
Vue.use(Vuex);
// 引入小仓库home和search
import home from "./home";
import search from "./Search";
import detail from "./detali";
import shopcart from "./shopcart";
import user from "./user";
import trade from "./trade";
// 对外暴露一个store类的实例
export default new Vuex.Store({
    //实现Vuex仓库模块式开发存储数据
    modules: {
        home,
        search,
        detail,
        shopcart,
        user,
        trade,
    },
});