import request from '@/utils/request'

export default {
    getList() {
        return request({
            url: '/supplier/list',
            method: 'get'
        })
    },

    search(page, size, searchMap) {
        return request({
            url: `/supplier/list/search/${page}/${size}`,
            method: 'post',
            data: searchMap
        })
    },

    add(pojo) {
        return request({
            url: '/supplier',
            method: 'post',
            data: pojo
        })
    },

    getById(id) {
        return request({
            url: `/supplier/${id}`,
            method: 'get'
        })
    },
    // 更新操作
    update(pojo) {
        return request({
            url: `/supplier/${pojo.id}`,
            method: 'put',
            data: pojo
        })
    },

    deleteById(id) {
        return request({
            url: `/supplier/${id}`,
            method: 'delete'
        })
    }
}