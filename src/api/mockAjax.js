// 利用axios进行二次封装
import axios from 'axios'
//引入进度条
import nprogress from 'nprogress'
// 引入进度条样式
import "nprogress/nprogress.css"
// 利用axios的creat方法创建一个axios实例，requests就是axios只不过要配置一下
const requests = axios.create({
        baseURL: '/mock', //基础路径发送请求的时候就不用配置api了
        timeout: 5000, //代表超时时间5s
    })
    //请求拦截器：在发请求之前，请求拦截器可以检测到，可以在请求发出去之前做一些事情
requests.interceptors.request.use(
        (config) => { //config：配置对象，对象里面有一个属性很重要，headers请求头
            // 进度条开始
            nprogress.start()
            return config
        }
    )
    //相应拦截器
requests.interceptors.response.use(
    (res) => {
        nprogress.done()
        return res.data //成功的回调函数：服务器相应数据回来以后，响应拦截器可以检测到，可以做一些事情
    },
    (error) => {
        return Promise.reject(new Error('faile')) //响应失败的回调函数 终止promise链
    }
)
export default requests