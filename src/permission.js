/**
 * 权限校验：
 *  Vue Router中的 前置钩子函数 beforeEach(to, from, next)
 * 当进行路由跳转之前，进行判断 是否已经登录 过，登录过则允许访问非登录页面，否则 回到登录页
 * 
 * to:  即将要进入的目标路由对象
 * from: 即将要离开的路由对象
 * next: 是一个方法，可以指定路由地址，进行路由跳转
 */

 import router from './router'
 import {getUserInfo} from './api/login'

 router.beforeEach((to, from , next) => {
    // 1. 获取token
    const token = localStorage.getItem('mxg-msm-token')
    console.log('token', token)
    
    if(!token) {
        // 1.1 如果没有获取到，
        // 要访问非登录页面，则不让访问，加到登录页面 /login
        if(to.path !== '/login') {
            next({path: '/login'})
        }else {
            // 请求登录页面 /login
            next()
        }
    }else {
        // 1.2 获取到token, 
        // 1.2.1 请求路由 /login ，那就去目标路由
        if(to.path === '/login') {
            next()
        }else {
            // 1.2.2 请求路由非登录页面，先在本地查看是否有用户信息，
            const userInfo = localStorage.getItem('mxg-msm-user')
            if(userInfo) {
                // 本地获取到，则直接让它去目标路由
                next()
            }else {
                // 如果本地没有用户信息， 就通过token去获取用户信息，
                getUserInfo(token).then(response => {
                    const resp = response.data
                    if(resp.flag) {
                        // 如果获取到用户信息，则进行非登录页面，否则回到登录页面
                        // 保存到本地
                        localStorage.setItem('mxg-msm-user', JSON.stringify(resp.data))
                        next()
                    }else {
                        // 未获取到用户信息，重新登录 
                        next({path: '/login'})
                    }
                })
            }
            
        }
    }
    

 })