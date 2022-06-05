import { reqGetCode, reqUserRegister, reqUserLogin, reqUserInfo, reqlogout } from '@/api';
import { setToken, getToken, removeToken } from '../utils/token';
const state = {
    code: '',
    token: getToken(),
    userInfo: {},
};
const actions = {
    //获取验证码
    async getCode({ commit }, phone) {
        let result = await reqGetCode(phone);
        // console.log(result);
        if (result.code == 200) {
            commit('GETCODE', result.data);
        }
    },
    //注册
    async userRegister({ commit }, user) {
        let result = await reqUserRegister(user);
        // console.log(result);
        if (result.code == 200) {
            return 'ok';
        } else {
            return Promise.reject(new Error('faile'));
        }
    },
    //登录业务
    async reqUserLogin({ commit }, user) {
        let result = await reqUserLogin(user);
        // console.log(result);
        //服务器下发token，用户唯一标识符(uuid)
        //将来经常通过带token找服务器要用户信息进行展示
        if (result.code === 200) {
            commit('USERLOGIN', result.data.token);
            setToken(result.data.token); //持久化存储token
        }
    },
    //获取用户信息在首页展示【需要带着用户的token向服务器要用户信息】
    async getUserInfo({ commit }) {
        let result = await reqUserInfo();
        // console.log(result);
        if (result.code == 200) {
            commit('USERINFO', result.data);
            return 'ok';
        } else {
            return Promise.reject(new Error('fail'));
        }
    },
    // 退出登录
    async logout({ commit }) {
        //只是向服务器发起一次请求，通知服务器清除token
        let result = await reqlogout();
        // console.log(result);
        //action里面不能操作state，提交mutation修改state
        if (result.code == 200) {
            commit('CLEAR', result.data);
        } else {
            return Promise.reject(new Error('falie'));
        }
    },
};
const mutations = {
    GETCODE(state, code) {
        state.code = code;
    },
    USERLOGIN(state, token) {
        state.token = token;
    },
    USERINFO(state, userInfo) {
        state.userInfo = userInfo;
    },
    CLEAR(state) {
        //帮仓库中先关用户信息清空
        state.userInfo = {};
        state.token = '';
        //本地存储数据清空
        removeToken();
    },
};
const getters = {};
export default {
    state,
    actions,
    mutations,
    getters,
};