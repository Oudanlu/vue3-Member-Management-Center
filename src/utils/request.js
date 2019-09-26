import axios from 'axios'
import { Loading, Message } from 'element-ui';


const loading = {
    loadingInstance: null, // Loading 实例
    // 打开加载
    open: function () {
        // 创建实例,而且会打开加载窗口
        console.log(this.loadingInstance, 'loadingInstance')
        if(this.loadingInstance === null) {
            // 如果实例 为空，则创建
            console.log('创建加载实例。。。')
            this.loadingInstance = Loading.service({
                target: '.main',
                text: '拼命加载中...',
                background: 'rgba(0, 0, 0, 0.5)'
             })
        }
       
    },
    // 关闭加载
    close: function () {
        // 不为空时, 则关闭加载窗口
        if(this.loadingInstance !== null) {
            this.loadingInstance.close()
        }
        this.loadingInstance = null
        
    }
}


const request = axios.create({
    // /db.json >  通过 axios > /dev-api/db.json >  通过 代理转发（vue.config.js）》 http://localhost:8001/db.json
    // baseURL: '/dev-api', 
    baseURL: process.env.VUE_APP_BASE_API, 
    // baseURL: '/',
    timeout: 5000 // 请求超时，5000毫秒
})

// 请求拦截器
request.interceptors.request.use(config => {
    // 打开加载窗口
    loading.open()

    return config
}, error => {
    // 关闭加载窗口
    loading.close()
    // 出现异常
    return Promise.reject(error);
})

// 响应拦截器
request.interceptors.response.use(response =>{
    // 关闭加载窗口
    loading.close()
    const resp = response.data

    // 后台正常响应的状态，如果不是 2000， 说明后台处理有问题
    if(resp.code !== 2000) {
        Message({
            message: resp.message || '系统异常',
            type: 'warning',
            duration: 5 * 1000
        })
    }

    // return response.data // 可以在这里统一的获取后台响应的数据进行返回，而这里面就没有请求头那些
    return response
}, error => {
    // 关闭加载窗口
    loading.close()
    console.log('response.error', error.response.status)
    Message({
        message: error.message,
        type: 'error',
        duration: 5 * 1000
    })
    return Promise.reject(error);
})

//  http://localhost:8888/dev-api/db.json 404
// request.get('/db.json').then(response => {
//     console.log(response.data)
// })

export default request // 导出自定义创建 axios 对象