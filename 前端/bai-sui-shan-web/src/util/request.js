import axios from 'axios'
import {getToken} from "./auth";
import {
    Notify,
    Toast
} from 'vant'

let loadingInstance;

// 创建axios实例
const request = axios.create({
    baseURL: process.env.NODE_ENV === 'production' ? process.env.VUE_APP_BASE_API : '/api/', // api 的 base_url
    timeout: 600000 // 请求超时时间
})

// request拦截器
request.interceptors.request.use(
    config => {
        loadingInstance = Toast.loading({
            duration: 0,
            forbidClick: true,
            message: '加载中',
        });
        if (getToken()) {
            config.headers['Authorization'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
        }
        config.headers['Content-Type'] = 'application/json'
        return config
    },
    error => {
        // Do something with request error
        return Promise.reject(error)
    }
)

// response 拦截器
request.interceptors.response.use(
    response => {
        loadingInstance.clear();
        const code = response.status
        if (code < 200 || code > 300) {
            Notify({type: 'danger', message: response.data.message});
            return Promise.reject(response.data.message)
        } else {
            if (response.data.code === 2000 && response.data.flag) {
                return response.data.content;
            }
            Notify({type: 'danger', message: response.data.message});
            return Promise.reject(response.data.message);
        }
    },
    error => {
        loadingInstance.clear();
        if (error.toString().indexOf('Error: timeout') !== -1) {
            Notify({type: 'danger', message: '网络请求超时'});
            return Promise.reject(error)
        }
        return Promise.reject('网络请求超时')
    }
)

export default request
