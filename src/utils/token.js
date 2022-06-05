// 对外暴露一个函数存储token
export const setToken = (token) => {
    localStorage.setItem('Token', token);
};
//对外暴露一个函数获得token
export const getToken = () => {
    return localStorage.getItem('Token');
};
// 对外暴露一个函数清空token
export const removeToken = () => {
    return localStorage.removeItem('Token');
};