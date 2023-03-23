import axios from 'axios'
import {
    Notify,
    Toast
} from 'vant'

let loadingInstance;

// 创建axios实例
const commonrequest = axios.create({
    baseURL: 'http://10.191.1.4:8082', // api 的 base_url
    timeout: 600000 // 请求超时时间
})

// request拦截器
commonrequest.interceptors.request.use(
    config => {
        loadingInstance = Toast.loading({
            duration: 0,
            forbidClick: true,
            message: '加载中',
        });
        config.headers['Content-Type'] = 'application/json'
        return config
    },
    error => {
        // Do something with request error
        return Promise.reject(error)
    }
)

// response 拦截器
commonrequest.interceptors.response.use(
    response => {
        loadingInstance.clear();
        const code = response.status
        if (code < 200 || code > 300) {
            Notify({type: 'danger', message: response.data.message});
            return Promise.reject(response.data.message)
        } else {
            if (response.data.code === 2000) {
                return response.data.message;
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

export default commonrequest
