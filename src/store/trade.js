import { reqAddressInfo, reqOrderInfo } from "@/api";

const actions = {
    //获取用户地址信息
    async getUserAddress({ commit }) {
        let result = await reqAddressInfo();
        // console.log(result);
        if (result.code == 200) {
            commit("GETUSERADDRESS", result.data);
        }
    },
    //获取商品清单数据
    async getOrderInfo({ commit }) {
        let result = await reqOrderInfo();
        if (result.code == 200) {
            commit("GETORDERINFO", result.data);
        }
    },
};
const mutations = {
    GETUSERADDRESS(state, address) {
        state.address = address;
    },
    GETORDERINFO(state, orderInfo) {
        state.orderInfo = orderInfo;
    },
};
const state = {
    address: [],
    orderInfo: {},
};
const getters = {};
export default {
    actions,
    mutations,
    state,
    getters,
};