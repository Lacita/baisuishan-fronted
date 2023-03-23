import Layout from '../views/admin/layout/index'

const constantRouterMap = [
    {
        path: '/',
        redirect: '/index'
    },
    {
        path: '/login',
        meta: {
            title: '登录',
            noCache: true
        },
        component: () => import('../views/login'),
        hidden: true
    },
    {
        path: '/index',
        meta: {
            title: '操作',
            noCache: true
        },
        component: () => import('../views/user/index'),
        hidden: true
    },
    {
        path: '/admin',
        component: Layout,
        children: [
            {
                path: 'log',
                component: () => import('../views/admin/log/index'),
                meta: {
                    title: '日志'
                }
            },
            {
                path: 'project',
                component: () => import('../views/admin/project/index'),
                meta: {
                    title: '项目'
                }
            }, {
                path: 'user',
                component: () => import('../views/admin/user/index'),
                meta: {
                    title: '用户'
                }
            },
            {
                path: 'type',
                component: () => import('../views/admin/type/index'),
                meta: {
                    title: '其他'
                }
            }
        ]
    },
    {
        path: '/admin/project/create',
        meta: {
            title: '添加',
            noCache: true
        },
        component: () => import('../views/admin/project/create'),
        hidden: true
    },
    {
        path: '/admin/user/create',
        meta: {
            title: '添加',
            noCache: true
        },
        component: () => import('../views/admin/user/create'),
        hidden: true
    },
    {
        path: '/admin/type/index/:type',
        meta: {
            title: '其他',
            noCache: true
        },
        component: () => import('../views/admin/type/type'),
        hidden: true
    },
];

export default constantRouterMap;