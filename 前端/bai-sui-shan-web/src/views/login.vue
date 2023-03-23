<template>
    <div class="main">
        <div class="main-top">
            <p>用户登录</p>
        </div>
        <div class="main-form">
            <van-form @submit="onSubmit">
                <van-field
                        v-model="username"
                        name="username"
                        label="用户名"
                        placeholder="用户名"
                        :rules="[{ required: true, message: '请填写用户名' }]"
                />
                <van-field
                        v-model="password"
                        type="password"
                        name="password"
                        label="密码"
                        placeholder="密码"
                        :rules="[{ required: true, message: '请填写密码' }]"
                />
                <van-field name="userType" label="用户类型">
                    <template #input>
                        <van-radio-group v-model="userType" direction="horizontal">
                            <van-radio name="0">操作员</van-radio>
                            <van-radio name="1">管理员</van-radio>
                        </van-radio-group>
                    </template>
                </van-field>
                <div style="margin: 16px;">
                    <van-button round block type="info" native-type="submit">登录</van-button>
                </div>
            </van-form>
        </div>
    </div>
</template>

<script>
    import {setToken} from '../util/auth'
    import { getToken } from '../util/auth';
    import {Form, Button, Field, Radio, RadioGroup} from 'vant';
    import {login} from '../api/login'
    import Vue from 'vue'

    Vue.use(Form);
    Vue.use(Button);
    Vue.use(Field);
    Vue.use(Radio);
    Vue.use(RadioGroup);

    export default {
        name: "login",
        data() {
            return {
                username: '',
                password: '',
                userType: '0'
            };
        },
        methods: {
            onSubmit(values) {
                login(values).then(res => {
                    console.log(res)
                    setToken(this.userType,res);
                        this.$router.replace ({
                        path: this.userType === '0' ? '/index' : '/admin/log'
                    })
                    let token = getToken()
                    console.log(token);
                });
            },
        },
    }
</script>

<style scoped>
    .main-top {
        height: 30vh;
        line-height: 30vh;
        text-align: center;
    }

    .main-top > p {

        font-size: 32px;
        letter-spacing: 15px
    }

    .main-form {
        height: 60vh;
    }
</style>