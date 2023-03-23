<template>
    <div class="main">
        <van-nav-bar title="添加项目" left-arrow left-text="返回" @click-left="$router.back(-1)"/>

        <van-form @submit="onSubmit">
            <van-field
                    v-model="cityName"
                    name="cityName"
                    readonly clickable
                    label="城市"
                    placeholder="城市"
                    @click="showCityPicker = true"
                    :rules="[{ required: true, message: '请填写城市' }]"
            />
            <van-field
                    v-model="projectName"
                    readonly clickable
                    type="projectName"
                    name="项目"
                    label="项目"
                    @click="showProjectPicker = true"
                    placeholder="项目"
                    :rules="[{ required: true, message: '请填写项目' }]"
            />

            <van-field v-model="projectInfo.projectIp" name="projectIp" readonly clickable @click="showNumber = true"
                       label="IP"
                       :rules="[{ required: true, message: '请填写IP地址' }]"
                       placeholder="IP地址"/>
            <div style="margin: 16px;">
                <van-button round block type="info" native-type="submit">提交</van-button>
            </div>
        </van-form>


        <van-popup v-model="showCityPicker" round position="bottom">
            <van-picker
                    title="选择城市"
                    show-toolbar
                    :columns="cityList"
                    @confirm="onCityConfirm"
                    @cancel="showCityPicker = false"
            />
        </van-popup>

        <van-popup v-model="showProjectPicker" round position="bottom">
            <van-picker
                    title="选择项目"
                    show-toolbar
                    :columns="projectList"
                    @confirm="onProjectConfirm"
                    @cancel="showProjectPicker = false"
            />
        </van-popup>

        <van-number-keyboard
                :show="showNumber"
                theme="custom"
                extra-key="."
                close-button-text="完成"
                @blur="showNumber = false"
                @input="onInput"
                @delete="onDelete"
        />
    </div>
</template>

<script>
    const ipPattern = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
    import {selectTypeAll, createProject} from '../../../api/project'
    import Vue from 'vue';
    import {NavBar, Form, Field, Button, Picker, Popup, NumberKeyboard, Toast} from 'vant';

    Vue.use(NavBar);
    Vue.use(NumberKeyboard);
    Vue.use(Form);
    Vue.use(Field);
    Vue.use(Button);
    Vue.use(Picker);
    Vue.use(Popup);
    export default {
        name: "create",
        data() {
            return {
                projectInfo: {
                    cityId: '',
                    projectId: '',
                    projectIp: ''
                },
                showProjectPicker: false,
                showCityPicker: false,
                showNumber: false,
                cityList: [],
                cityName: '',
                projectName: '',
                projectList: []
            }
        },
        created() {
            this.selectType();
        },
        methods: {
            onSubmit(values) {
                if (!ipPattern.test(values.projectIp)) {
                    Toast.fail('请输入正确的IP地址')
                    return;
                }
                createProject(this.projectInfo).then(() => {
                    Toast.success('添加成功');
                    this.projectInfo = {cityId: '', projectId: '', projectIp: ''};
                    this.cityName = '';
                    this.projectName = '';
                })
            },
            selectType() {
                selectTypeAll().then(res => {
                    this.cityList = res.cityList;
                    this.projectList = res.projectList;
                })
            },
            onProjectConfirm(value) {
                this.showProjectPicker = false;
                this.projectInfo.projectId = value.value;
                this.projectName = value.text;
            },
            onCityConfirm(value) {
                this.showCityPicker = false;
                this.projectInfo.cityId = value.value;
                this.cityName = value.text;
            },
            onInput(value) {
                this.projectInfo.projectIp += value;
            },
            onDelete() {
                let len = this.projectInfo.projectIp.length;
                if (len) {
                    this.projectInfo.projectIp = this.projectInfo.projectIp.substring(0, len - 1);
                }
            },
        }
    }
</script>

<style scoped>

</style>