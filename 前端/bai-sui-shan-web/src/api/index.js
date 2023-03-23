import request from "../util/request";
import qs from 'qs';

/**
 * 查询
 * @param url
 * @param params
 */
export function searchPage(url, params) {
    return request({
        url: url + '?' + qs.stringify(params, {
            indices: false
        }),
        method: 'get'
    })
}

/**
 * 删除
 * @param url
 * @param id
 * @returns {AxiosPromise}
 */
export function removeInfo(url, id) {
    return request({
        url: `${url}/${id}`,
        method: 'get'
    })
}

/**
 * 创建
 * @param url
 * @param data
 * @returns {AxiosPromise}
 */
export function createInfo(url, data) {
    return request({
        url: url,
        method: 'post',
        data
    })
}