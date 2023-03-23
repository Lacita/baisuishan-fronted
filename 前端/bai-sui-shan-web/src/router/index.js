import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
import constantRouterMap from './routers'
// import store from '@/store'
import {getToken} from "../util/auth";

// 白名单
const whiteList = ['/login'];

const router = new Router({
    mode: 'history',
    scrollBehavior: () => ({
        y: 0
    }),
    routes: constantRouterMap
})


router.beforeEach((to, from, next) => {
    if (to.meta.title) {
        document.title = to.meta.title + ' - 百岁山'
    }
    let token = getToken();
    if (token) {
        // 已登录且要跳转的页面是登录页
        if (to.path === '/login') {
            next({path: '/index'})
        }
        let type = token.substring(7, 8);
        if (to.path.indexOf('/admin') === 0 && type === '0') {
            next({path: '/index'});
        }
        if (to.path.indexOf('/index') === 0 && type === '1') {
            next({path: '/admin/log'});
        }
        next()
    } else {
        /* has no token*/
        if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
            next()
        } else {
            next(`/login?redirect=${to.path}`) // 否则全部重定向到登录页
        }
    }
});

export default router;
