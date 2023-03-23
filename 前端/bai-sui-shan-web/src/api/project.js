import {searchPage, createInfo, removeInfo} from './index';


/**
 * 查询
 * @param data
 * @returns {AxiosPromise}
 */
export function search(data) {
    return searchPage('/system/project/desk-search', data);
}

/**
 * 查询
 * @param data
 * @returns {AxiosPromise}
 */
export function searchProject(data) {
    return searchPage('/system/project/search', data);
}

/**
 * 创建项目
 * @param data
 * @returns {AxiosPromise}
 */
export function createProject(data) {
    return createInfo('/system/project/save', data);
}

/**
 * 修改项目
 * @param data
 * @returns {AxiosPromise}
 */
export function modifyProject(data) {
    return createInfo('/system/project/modify', data);
}

/**
 * 删除
 * @param id
 */
export function removeProject(id) {
    return removeInfo('/system/project/remove', id);
}

/**
 * 查询所有类别
 * @returns {AxiosPromise}
 */
export function selectTypeAll() {
    return searchPage('/system/type/all');
}


/**
 * 查询
 * @param data
 * @returns {AxiosPromise}
 */
export function searchLog(data) {
    return searchPage('/system/project/log-search', data);
}

/**
 * 保存
 * @param data
 * @returns {AxiosPromise}
 */
export function saveUser(data) {
    return createInfo("/system/user/save", data);
}

/**
 * 删除
 * @param id
 * @returns {AxiosPromise}
 */
export function removeUser(id) {
    return removeInfo("/system/user/remove", id);
}


/**
 * 修改状态
 * @param id
 * @returns {AxiosPromise}
 */
export function modifyUserEnable(id) {
    return removeInfo("/system/user/modify-enable", id);
}

/**
 * 查询
 * @param data
 * @returns {AxiosPromise}
 */
export function searchUser(data) {
    return searchPage('/system/user/search', data);
}

/*--------------------------------------------------*/


/**
 * 保存
 * @param data
 * @returns {AxiosPromise}
 */
export function saveType(data) {
    return createInfo("/system/type/save", data);
}

/**
 * 删除
 * @param id
 * @returns {AxiosPromise}
 */
export function removeType(id) {
    return removeInfo("/system/type/remove", id);
}


/**
 * 查询
 * @param data
 * @returns {AxiosPromise}
 */
export function searchType(data) {
    return searchPage('/system/type/search', data);
}