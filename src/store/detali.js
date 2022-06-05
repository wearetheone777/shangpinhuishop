// detail模块的小仓库
import { reqGoodsInfo, reqAddOrUpdateShopCart } from "@/api"; //引入api里面的axios
// 封装游客身份模块uuid--->生成一个随机字符串（不能在变了）
import { getUUID } from "@/utils/uuid_token";
const state = {
    goodIofo: {},
    //游客临时身份
    uuid_token: getUUID(),
};
const mutations = {
    GETGOODIOFO(state, goodIofo) {
        state.goodIofo = goodIofo;
    },
};
const actions = {
    async getGoodIofo({ commit }, skuId) {
        let result = await reqGoodsInfo(skuId);
        if (result.code == 200) {
            commit("GETGOODIOFO", result.data);
        }
    },
    async addOrUpdateShopCart({ commit }, { skuId, skuNum }) {
        let result = await reqAddOrUpdateShopCart(skuId, skuNum);
        if (result.code == 200) {
            return "ok";
        } else {
            return Promise.reject(new Error("faile"));
        }
    },
};
const getters = {
    categoryView(state) {
        //比如：state.goodInfo初始状态空对象，空对象的categoryview属性值undefined
        //当前计算出的categoryview属性值至少是一个空对象，假的报错不会有了。|
        return state.goodIofo.categoryView || {};
    },
    skuInfo(state) {
        return state.goodIofo.skuInfo || {};
    },
    spuSaleAttrList(state) {
        return state.goodIofo.spuSaleAttrList || [];
    },
};
export default {
    state,
    mutations,
    actions,
    getters,
};