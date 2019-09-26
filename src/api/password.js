import request from '@/utils/request'

export default {

    // 校验密码, userId, password 旧密码
    checkPwd(userId, password) {
        return request({
            url: '/user/pwd',
            method: 'post',
            data: {
                userId,
                password
            }
        })
    },

    // 修改密码userId 用户ID, password 新密码
    updatePwd(userId, password) {
        return request({
            url: '/user/pwd',
            method: 'put',
            data: {
                userId,
                password
            }
        })
    }
}