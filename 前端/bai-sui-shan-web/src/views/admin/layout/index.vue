<template>
    <div>
        <template v-if="isPcValue">
            <el-container>
                <el-aside width="200px">
                    <el-menu :default-active="''+active">
                        <router-link to="/admin/log">
                            <el-menu-item index="0">
                                <i class="el-icon-s-order"></i>日志
                            </el-menu-item>
                        </router-link>
                        <router-link to="/admin/project">
                            <el-menu-item index="1">
                                <i class="el-icon-s-promotion"></i>项目
                            </el-menu-item>
                        </router-link>
                        <router-link to="/admin/user">
                            <el-menu-item index="2">
                                <i class="el-icon-user"></i>用户
                            </el-menu-item>
                        </router-link>
                        <router-link to="/admin/type">
                            <el-menu-item index="3">
                                <i class="el-icon-setting"></i>其他
                            </el-menu-item>
                        </router-link>
                    </el-menu>
                </el-aside>
                <el-main>
                    <router-view/>
                </el-main>
            </el-container>
        </template>
        <template v-else>
            <router-view/>
            <van-tabbar v-model="active">
                <van-tabbar-item icon="clock-o" replace to="/admin/log">日志</van-tabbar-item>
                <van-tabbar-item icon="points" replace to="/admin/project">项目</van-tabbar-item>
                <van-tabbar-item icon="friends-o" replace to="/admin/user">用户</van-tabbar-item>
                <van-tabbar-item icon="apps-o" replace to="/admin/type">其他</van-tabbar-item>
            </van-tabbar>
        </template>
    </div>
</template>

<script>
    import {isPC} from "../../../util";
    import Vue from 'vue';
    import {Tabbar, TabbarItem} from 'vant';

    Vue.use(Tabbar);
    Vue.use(TabbarItem);
    import {
        Container, Aside,
        Main, Menu,
        MenuItem
    } from 'element-ui'

    Vue.use(Container);
    Vue.use(Aside);
    Vue.use(Main);
    Vue.use(Menu);
    Vue.use(MenuItem);


    export default {
        name: "index",
        data() {
            return {
                isPcValue: isPC(),
                active: 0
            }
        },
        created() {
            let url = this.$route.path;
            if (url.indexOf('project') !== -1) {
                this.active = 1;
                return;
            }
            if (url.indexOf('user') !== -1) {
                this.active = 2;
                return;
            }
            if (url.indexOf('type') !== -1) {
                this.active = 3;
                return;
            }
        },
    }
</script>

<style scoped>

</style>