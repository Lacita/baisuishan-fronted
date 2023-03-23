<template>
    <div class="main">
        <van-nav-bar title="添加用户" left-arrow left-text="返回" @click-left="$router.back(-1)"/>

        <van-form @submit="onSubmit">
            <van-field
                    v-model="dataInfo.username"
                    autofocus
                    clearable
                    name="username"
                    label="用户名"
                    placeholder="用户名"
                    :rules="[{ required: true, message: '请填写用户名' }]"
            />
            <van-field
                    v-model="dataInfo.password"
                    clearable
                    type="password"
                    name="password"
                    label="密码"
                    placeholder="密码"
                    :rules="[{ required: true, message: '请填写密码' }]"
            />
            <van-field
                    v-model="checkPass"
                    clearable
                    type="password"
                    name="checkPass"
                    label="确认密码"
                    placeholder="确认密码"
                    :rules="[{ required: true, message: '请填写密码' }]"
            />
            <van-field name="userType" label="用户类型">
                <template #input>
                    <van-radio-group v-model="dataInfo.userType"  direction="horizontal">
                        <van-radio name="0">操作员</van-radio>
                        <van-radio name="1">管理员</van-radio>
                    </van-radio-group>
                </template>
            </van-field>
            <div style="margin: 16px;">
                <van-button round block type="info" native-type="submit">提交</van-button>
            </div>
        </van-form>

    </div>
</template>

<script>
    import {saveUser} from '../../../api/project'
    import Vue from 'vue';
    import {NavBar, Form, Field, Button, Toast,RadioGroup,Radio} from 'vant';

    Vue.use(NavBar);
    Vue.use(Form);
    Vue.use(Field);
    Vue.use(Button);
    Vue.use(Radio);
    Vue.use(RadioGroup);
    export default {
        name: "create",
        data() {
            return {
                dataInfo: {
                    username: '',
                    password: '',
                    userType: '0'
                },
                checkPass: ''
            }
        },
        methods: {
            onSubmit(value) {
                if(value.checkPass !== value.password){
                    Toast.fail('两次密码不一致');
                    return false;
                }
                saveUser(this.dataInfo).then(() => {
                    Toast.success('添加成功');
                    this.checkPass = '';
                    this.dataInfo = {
                        username: '',
                        password: '',
                        userType: '0'
                    }
                })
            }
        }
    }
</script>

<style scoped>

</style>