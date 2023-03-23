<template>
    <div style="padding-top: 30px;">
        <van-cell title="城市管理" is-link to="/admin/type/index/0"/>
        <van-cell title="项目名称管理" is-link to="/admin/type/index/1"/>
        <div class="btn-div">
            <van-button color="linear-gradient(to right, #ff6034, #ee0a24)" block @click="logOut">退出</van-button>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue';
    import {Cell, CellGroup, Button} from 'vant';
    import {removeToken} from "../../../util/auth";

    Vue.use(Cell);
    Vue.use(CellGroup);
    Vue.use(Button);
    export default {
        name: "index",
        methods: {
            logOut() {
                removeToken();
                this.$router.replace({
                    path: '/login'
                })
            }
        }
    }
</script>

<style scoped>
    .btn-div {
        position: fixed;
        bottom: 65px;
        left: 15px;
        right: 15px;
    }
</style>