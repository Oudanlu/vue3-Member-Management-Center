import request from '@/utils/request'

export default {
    // 分页条件查询
    search(page, size, searchMap) {
        return request({
            url: `/goods/list/search/${page}/${size}`,
            method: 'post',
            data: searchMap
        })
    },

    add(pojo) {
        return request({
            url: `/goods`,
            method: 'post',
            data: pojo
        })
    },

    getById(id) {
        return request({
            url: `/goods/${id}`,
            method: 'get'
        })
    },

    update(pojo) {
        return request({
            url: `/goods/${pojo.id}`,
            method: 'put',
            data: pojo
        })
    },

    deleteById(id) {
        return request({
            url: `/goods/${id}`,
            method: 'delete'
        })
    }

}