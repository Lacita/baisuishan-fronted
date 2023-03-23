import request from "../util/request";


/**
 * 登录
 * @param data
 */
export function login(data) {
    return request({
        url: '/login',
        method: 'post',
        data
    });
}