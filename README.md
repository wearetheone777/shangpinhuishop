# shangpinhuishop
## Build Setup

```bash
# 克隆项目
git clone https://github.com/wearetheone777/shangpinhuishop.git

# 进入项目目录
cd shangpinhuishop

# 安装依赖
npm install

# 建议不要直接使用 cnpm 安装以来，会有各种诡异的 bug。可以通过如下操作解决 npm 下载速度慢的问题
npm install --registry=https://registry.npm.taobao.org

# 启动服务
npm run serve
```
## 技术选型

![image-20220608150139753](https://150-9155-1312350958.cos.ap-chengdu.myqcloud.com/img202206091116053.png)

## 前端路由

![image-20220608150232527](https://150-9155-1312350958.cos.ap-chengdu.myqcloud.com/img202206091116055.png)

## API接口

![image-20220608150314003](https://150-9155-1312350958.cos.ap-chengdu.myqcloud.com/img202206091116056.png)

## 目录介绍

![image-20220608150502494](https://150-9155-1312350958.cos.ap-chengdu.myqcloud.com/img202206091116057.png)

## header组件

![image-20220608151719241](https://150-9155-1312350958.cos.ap-chengdu.myqcloud.com/img202206091116058.png)

使用声明式路由导航与编程式路由导航

解决编程式路由导航的一个错误

编程式路由跳转到当前路由(参数不变), 会抛出NavigationDuplicated的警告错误,如何解决?

通过修正Vue原型上的push和replace方法

```js
// 缓存原型上的push函数
const originPush = VueRouter.prototype.push
const originReplace = VueRouter.prototype.replace
// 给原型对象上的push指定新函数函数
VueRouter.prototype.push = function (location, onComplete, onAbort) {
  // 判断如果没有指定回调函数, 通过call调用源函数并使用catch来处理错误
  if (onComplete===undefined && onAbort===undefined) {
    return originPush.call(this, location, onComplete, onAbort).catch(() => {})
  } else { // 如果有指定任意回调函数, 通过call调用源push函数处理
    originPush.call(this, location, onComplete, onAbort)
  }
}
VueRouter.prototype.replace = function (location, onComplete, onAbort) {
  if (onComplete===undefined && onAbort===undefined) {
    return originReplace.call(this, location, onComplete, onAbort).catch(() => {})
  } else {
    originReplace.call(this, location, onComplete, onAbort)
  }
}
```



## Footer组件

![image-20220608152337887](https://150-9155-1312350958.cos.ap-chengdu.myqcloud.com/img202206091116059.png)

利用路由元信息meta配置和v-show控制footer组件的显示和隐藏在

```js
{
  path: '/register',
  component: Register,
  meta: { // 需要隐藏footer的路由添加此配置
    isHideFooter: true
  }
},

{
  path: '/login',
  component: Login,
  meta: {
    isHideFooter: true
  }
},
//在组件上面添加<Footer v-show="!$route.meta.isHideFooter"/>
```

## Home组件

![image-20220608152939577](https://150-9155-1312350958.cos.ap-chengdu.myqcloud.com/img202206091116060.png)

子组件

![image-20220608153006927](https://150-9155-1312350958.cos.ap-chengdu.myqcloud.com/img202206091116061.png)

## 封装ajax请求模块

```js
/* 
对axios进行二次包装
1. 配置通用的基础路径和超时
2. 显示请求进度条
3. 成功返回的数据不再是response, 而直接是响应体数据response.data
4. 统一处理请求错误, 具体请求也可以选择处理或不处理
*/
import axios from 'axios'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// 配置不显示右上角的旋转进度条, 只显示水平进度条
NProgress.configure({ showSpinner: false }) 

const service = axios.create({
  baseURL: "/api", // 基础路径
  timeout: 15000   // 连接请求超时时间
})

service.interceptors.request.use((config) => {
  // 显示请求中的水平进度条
  NProgress.start()

  // 必须返回配置对象
  return config
})

service.interceptors.response.use((response) => {
  // 隐藏进度条
  NProgress.done()
  // 返回响应体数据
  return response.data
}, (error) => {
  // 隐藏进度条
  NProgress.done()

  // 统一处理一下错误
  alert( `请求出错: ${error.message||'未知错误'}`)

  // 后面可以选择不处理或处理
  return Promise.reject(error)
})

export default service
```

## 配置代理服务器

```js
devServer: {
  proxy: {
    '/api': { // 只对请求路由以/api开头的请求进行代理转发
      target: 'http://182.92.128.115', // 转发的目标url
      changeOrigin: true // 支持跨域
    }
  }
},
```

## 使用vuex管理状态

由于项目体积比较大，向服务器发请求的接口过多，服务器返回的数据也会很多，如果还用以前的方式存储数据，导致vuex中的state数据格式比较复杂。采用vuex模块式管理数据。
Vuex核心概念:state、actions、mutations、getters、modules

## Mock/模拟数据接口

Mockjs: 用来拦截ajax请求, 生成随机数据返回

mock/mockServer.js

```js
// 先引入mockjs模块

import Mock from 'mockjs'
//把JSON数据格式引入进来[JSON数据格式根本没有对外暴露，但是可以引入]
//webpack默认对外暴露的：图片、JSoN数据格式
import banner from './banner.json'
import floor from './floor.json'
//mock数据：第一个参数请求地址第二个参数：请求数据
Mock.mock("/mock/banner", { code: 200, data: banner }) //模拟首页大的轮播图的数据
Mock.mock("/mock/floor", { code: 200, data: floor })
```

api/ajaxMock.js

```js
/* 
专门请求mock接口的axios封装
*/
import axios from 'axios'

const mockAjax = axios.create({
  baseURL: "/mock", // 路径前缀
  timeout: 10000 // 请求超时时间
})

mockAjax.interceptors.request.use((config) => {
  return config
})

mockAjax.interceptors.response.use((response) => {
  return response.data
}, (error) => {
  return Promise.reject(error)
})

export default mockAjax
```

api/index.js

```js
import mockAjax from './mockAjax'

// 获取广告轮播列表
export const reqBanners = ()=> mockAjax.get('/banners')

// 获取首页楼层列表
export const reqFloors = ()=> mockAjax.get('/floors')
```

## Search路由

1.搜索查询条件参数理解与准备
2.组件动态数据显示
3.根据分类和关键字进行搜索
4.根据品牌进行搜索
5.根据属性进行搜索
6.排序搜索
7.自定义分页组件

![image-20220608155022983](https://150-9155-1312350958.cos.ap-chengdu.myqcloud.com/img202206091116062.png)

![image-20220608155044667](https://150-9155-1312350958.cos.ap-chengdu.myqcloud.com/img202206091116063.png)

## Detail路由

1)图片放大镜效果
2)小图轮播

![image-20220608155212247](https://150-9155-1312350958.cos.ap-chengdu.myqcloud.com/img202206091116064.png)

## AddCartSuccess路由

区别使用sessionStorage与localStorage

![image-20220608155413517](https://150-9155-1312350958.cos.ap-chengdu.myqcloud.com/img202206091116065.png)

## ShopCart路由

1)用户临时ID的处理
2)购物车数据的管理(复杂)
3)不使用v-model监控用户输入
4)async / await / Promise.all() 的使用

![image-20220608155635581](https://150-9155-1312350958.cos.ap-chengdu.myqcloud.com/img202206091116066.png)

## 注册与登陆路由

1)注册/登陆请求后组件的响应处理
2)登陆后自动携带token数据

![image-20220608155847993](https://150-9155-1312350958.cos.ap-chengdu.myqcloud.com/img202206091116067.png)

![image-20220608155904866](https://150-9155-1312350958.cos.ap-chengdu.myqcloud.com/img202206091116068.png)

测试用的账号和密码:

账号:13700000000
密码:111111

## 导航和路由守卫

a.只有登陆了, 才能查看交易/支付/个人中心界面
b.只有没有登陆, 才能查看登陆界面
c.只有携带的skuNum以及sessionStorage中有skuInfo数据, 才能查看添加购物车成功的界面
d.只能从购物车界面, 才能跳转到交易界面
e.只能从交易界面, 才能跳转到支付界面
f.只有从支付界面, 才能跳转到支付成功的界面

## 订单与支付

1)提交订单
2)支付二维码
3)获取订单状态

![image-20220609105837105](https://150-9155-1312350958.cos.ap-chengdu.myqcloud.com/img202206091116069.png)

![image-20220609105953404](https://150-9155-1312350958.cos.ap-chengdu.myqcloud.com/img202206091116070.png)

![image-20220609110004433](https://150-9155-1312350958.cos.ap-chengdu.myqcloud.com/img202206091116071.png)

## 支付组件

![image-20220609110322172](https://150-9155-1312350958.cos.ap-chengdu.myqcloud.com/img202206091116072.png)

![image-20220609110333949](https://150-9155-1312350958.cos.ap-chengdu.myqcloud.com/img202206091116073.png)

## 支付成功组件

![image-20220609110358429](https://150-9155-1312350958.cos.ap-chengdu.myqcloud.com/img202206091116074.png)

## 我的订单组件

![image-20220609110438770](https://150-9155-1312350958.cos.ap-chengdu.myqcloud.com/img202206091116075.png)

## 图片懒加载

还没有加载得到目标图片时, 先显示loading图片
在<img>进入可视范围才加载请求目标图片

## 路由懒加载

(1)当打包构建应用时，JS包会变得非常大，影响页面加载。如果我们能把不同路由对应的组件分割成不同的代码块，然后当路由被访问的时候才加载对应组件，这样就更加高效了
(2)本质就是Vue 的异步组件在路由组件上的应用
需要使用动态import语法, 也就是import()函数

## 前台表单校验

(1)项目中有一些如注册/登陆表单, 在提交请求前是需要进行表单输入数据校验的
(2)只有前台表单验证成功才会发请求
(3)如果校验失败, 以界面红色文本的形式提示, 而不是用alert的形式
(4)校验的时机, 除了点击提交时, 还有输入过程中实时进行校验

![image-20220609110707175](https://150-9155-1312350958.cos.ap-chengdu.myqcloud.com/img202206091116077.png)
