import request from "../util/request";

/**
 * 打开数据库
 * @param ip
 * @returns {AxiosPromise}
 */
export function open(ip) {
    return request({
        url: `/operation/open/${ip}`,
        method: 'get'
    });
}

/**
 * 清楚
 * @param data
 * @returns {AxiosPromise}
 */
export function clear(data) {
    return request({
        url: '/operation/clear',
        method: 'post',
        data
    });
}

/**
 * 解锁
 * @param data
 * @returns {AxiosPromise}
 */
export function unlock(data) {
    return request({
        url: '/operation/unlock',
        method: 'post',
        data
    });
}


/**
 * 重置
 *
 * @param info
 * @return
 */
export function reset(data) {
    return request({
        url: '/operation/reset',
        method: 'post',
        data
    });
}

/**
 * 移除记录
 * @param data
 * @returns {AxiosPromise}
 */
export function remove(data) {
    return request({
        url: '/operation/remove',
        method: 'post',
        data
    });
}

/**
 * 移除记录
 * @param data
 * @returns {AxiosPromise}
 */
export function removeAll(data) {
    return request({
        url: '/operation/remove-all',
        method: 'post',
        data
    });
}


