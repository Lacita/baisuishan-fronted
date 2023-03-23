<template>
    <div>
        <div v-if="isPC" style="padding: 20px; margin: 0 auto; width: 1200px; text-align: center;">
            <div style="display: flex; width: 80%; margin: 0 auto;">
                <div style="width: 50%">
                    <el-input v-model="searchValue" size="small" placeholder="请输入项目名称"></el-input>
                </div>
                <div style="width: 20%; margin: 0px 20px;">
                    <el-button icon="el-icon-search" type="primary" size="small" @click="search">搜索</el-button>
                </div>
                <div style="width: 20%">
                    <el-button @click="tabBarChange(1)" type="info" style="width: 100px;" size="small">退出登录</el-button>
                </div>
            </div>

            <el-divider content-position="left">项目连接</el-divider>
            <div style="display: flex; width: 80%; margin: 0 auto;">
                <div style="width: 50%">
                    <el-cascader
                            size="small"
                            v-model="projectInfo.elName"
                            :options="pickerProjectColumns"
                            :props="{ expandTrigger: 'hover',label: 'text',value: 'text' }"
                            @change="onPickerProjectConfirm"
                            placeholder="请选择项目"
                    ></el-cascader>
                </div>
                <div style="width: 20%; margin: 0px 20px;">
                    <el-input size="small" v-model="projectInfo.ip" placeholder="请输入ip地址"></el-input>
                </div>
                <div style="width: 20%">
                    <el-button type="danger" v-if="isEnable" plain size="small" @click="closeConnection">断开
                    </el-button>
                    <el-button type="primary" v-if="!isEnable" plain size="small" @click="openConnection">连接
                    </el-button>
                </div>
            </div>

            <div v-if="isEnable">
                <el-divider>项目操作</el-divider>
                <div style="margin: 20px auto;">
                    <el-form size="small" label-width="80px">
                        <el-row :gutter="10">
                            <el-col :span="12">
                                <el-form-item label="用户名">
                                    <el-input v-model="operationInfo.userName" placeholder="请输入用户名"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="4">
                                <el-button type="success" @click="resetFun" size="small">重置密码</el-button>
                            </el-col>
                            <el-col :span="4">
                                <el-button type="info" @click="resrveCar" size="small">预约车辆</el-button>
                            </el-col>
                            <el-col :span="4">
                                <el-button type="primary" @click="unlockFun" size="small">账号一键解锁</el-button>
                            </el-col>
                        </el-row>
                        <el-row :gutter="10">
                            <el-col :span="6">
                                <el-form-item label="车牌号">
                                    <el-input v-model="operationInfo.carNo" placeholder="请输入车牌号"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="出入时间">
                                    <el-date-picker
                                            v-model="operationInfo.inOutTime"
                                            type="datetime"
                                            value-format="yyyy-MM-dd HH:mm:ss"
                                            placeholder="选择出入时间">
                                    </el-date-picker>
                                </el-form-item>
                            </el-col>
                            <el-col :span="4">
                                <el-button type="danger" @click="clearFun" size="small">清理车牌费用</el-button>
                            </el-col>
                            <el-col :span="4">
                                <el-button type="danger" @click="removeFun" size="small">删除场内出入记录</el-button>
                            </el-col>
                            <el-col :span="4">
                                <el-button type="danger" @click="removeAllFun" size="small">删除场内所有出入记录</el-button>
                            </el-col>
                        </el-row>
                    </el-form>
                </div>
            </div>
            <div v-else>
                <p style="text-align: center;margin-top: 20px; color: red;">请先连接</p>
            </div>
        </div>
        <div v-else>
            <van-notice-bar left-icon="volume-o" text="tip: 可以先模糊搜索项目名称,方便进行筛选"/>
            <van-search v-model="searchValue" placeholder="请输入项目名称" @search="search"/>
            <van-field
                    readonly
                    clickable
                    @click="showPicker = true"
                    label="项目"
                    :value="projectInfo.name"
                    placeholder="选择项目"
            />
            <van-field v-model="projectInfo.ip" readonly clickable @click="showNumber = true" label="IP"
                       placeholder="请输入IP"/>
            <div class="btn-div">
                <van-button block type="danger" v-if="isEnable" plain size="small" @click="closeConnection">断开
                </van-button>
                <van-button block type="primary" v-if="!isEnable" plain size="small" @click="openConnection">连接
                </van-button>
            </div>

            <van-divider>操作</van-divider>

            <div v-if="isEnable">
                <van-cell-group>
                    <van-field v-model="operationInfo.userName" label="用户" clearable placeholder="请输入用户名"/>
                </van-cell-group>
                <van-cell-group>
                    <van-field v-model="operationInfo.carNo" label="车牌" clearable placeholder="请输入车牌"/>
                </van-cell-group>
                <van-cell-group>
                    <van-field v-model="operationInfo.inOutTime" label="出入时间" placeholder="请选择出入时间"/>
                </van-cell-group>
                <van-row type="flex" class="btn-div" justify="space-around">
                    <van-col span="9">
                        <van-button block type="primary" @click="unlockFun" size="small">账号解锁</van-button>
                    </van-col>
                    <van-col span="9">
                        <van-button block type="info" @click="resetFun" size="small">重置密码</van-button>
                    </van-col>
                </van-row>
                <div class="btn-div">
                    <van-button block type="warning" @click="clearFun" size="small">清理车牌费用</van-button>
                </div>
                <div class="btn-div">
                    <van-button block type="danger" @click="removeFun" size="small">删除场内出入记录</van-button>
                </div>
                <div class="btn-div">
                    <van-button block type="info" @click="resrveCar" size="small">车辆预约功能</van-button>
                </div>
                <div class="btn-div">
                    <van-button block type="danger" @click="removeAllFun" size="small">删除场内所有出入记录</van-button>
                </div>
            </div>
            <div v-else>
                <van-empty description="暂无操作"/>
            </div>
            <van-number-keyboard
                    :show="showNumber"
                    theme="custom"
                    extra-key="."
                    close-button-text="完成"
                    @blur="showNumber = false"
                    @input="onInput"
                    @delete="onDelete"
            />

            <van-popup v-model="showPicker" round position="bottom">

                <van-picker
                        show-toolbar
                        :columns="pickerProjectColumns"
                        @cancel="showPicker = false"
                        @confirm="onPickerProjectConfirm"
                />
            </van-popup>

            <van-tabbar v-model="active" @change="tabBarChange">
                <van-tabbar-item icon="setting-o">操作</van-tabbar-item>
                <van-tabbar-item icon="close">退出</van-tabbar-item>
            </van-tabbar>
        </div>
    </div>
</template>

<script>
    const ipPattern = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
    import Vue from 'vue';
    import {isPC} from "../../util/index";

    import {
        Row as elRow,
        Col as elCol,
        Input,
        Button as elButton,
        Divider as elDivider,
        Form,
        FormItem,
        Cascader,
        DatePicker as elDatePicker,
    } from 'element-ui';

    Vue.use(elRow);
    Vue.use(elCol);
    Vue.use(Input);
    Vue.use(elButton);
    Vue.use(elDivider);
    Vue.use(Form);
    Vue.use(FormItem);
    Vue.use(Cascader);
    Vue.use(elDatePicker);
    import {
        NoticeBar,
        Search,
        Picker,
        Field,
        Popup,
        NumberKeyboard,
        Button,
        Col,
        Row,
        Divider,
        Empty,
        CellGroup,
        Toast,
        Tabbar, TabbarItem,
        Dialog
    } from 'vant';
    import {search} from '../../api/project';
    import {open, clear, unlock, reset, remove, removeAll} from '../../api/operation';
    import {stringIsEmpty} from '../../util/index';
    import {removeToken} from '../../util/auth';
    import {resrveCarNo} from '../../api/reserve';

    Vue.use(Search);
    Vue.use(NoticeBar);
    Vue.use(Picker);
    Vue.use(Field);
    Vue.use(Popup);
    Vue.use(NumberKeyboard);
    Vue.use(Button);
    Vue.use(Col);
    Vue.use(Row);
    Vue.use(Divider);
    Vue.use(Empty);
    Vue.use(CellGroup);
    Vue.use(Toast);
    Vue.use(Tabbar);
    Vue.use(TabbarItem);
    export default {
        name: "index",
        data() {
            return {
                isPC: isPC(),
                active: 0,
                minDate: new Date(2019, 0, 1),
                maxDate: new Date(),
                operationTime: new Date(),
                showNumber: false,
                showPicker: false,
                searchValue: '',
                isEnable: false,
                pickerProjectColumns: [],
                projectInfo: {
                    ip: '',
                    name: ''
                },
                operationInfo: {
                    ip: '',
                    name: '',
                    carNo: '',
                    userName: '',
                    inOutTime: '2021-02-30 00:00:00'
                }
            }
        },
        created() {
            this.search();
        },
        methods: {
            search() {
                this.projectInfo = {ip: '', name: ''};
                this.pickerProjectColumns.length = 0;
                this.pickerProjectColumns = [];
                search({name: this.searchValue}).then(res => {
                    if (res) {
                        this.pickerProjectColumns = res;
                    } else {
                        Toast.fail("没有符合条件的数据")
                    }
                });
            },
            openConnection() {
                if ('localhost' === this.projectInfo.ip) {
                    open(this.projectInfo.ip).then(() => {
                        this.isEnable = true;
                    });
                    return;
                }
                if (!ipPattern.test(this.projectInfo.ip)) {
                    Toast.fail('请输入正确的IP地址')
                    return;
                }
                open(this.projectInfo.ip).then(() => {
                    this.isEnable = true;
                    this.operationInfo.ip = this.projectInfo.ip;
                });
            },
            clearFun() {
                if (stringIsEmpty(this.operationInfo.carNo)) {
                    Toast.fail('请填写车牌号')
                    return false;
                }
                clear({
                    name: this.projectInfo.name,
                    ip: this.operationInfo.ip,
                    carNo: this.operationInfo.carNo.trim()
                }).then(() => {
                    Toast.success(`${this.operationInfo.carNo}费用清理成功`)
                });
            },
            unlockFun() {
                this.operationInfo.name = this.projectInfo.name;
                unlock(this.operationInfo).then(() => {
                    Toast.success('账号解锁成功')
                });
            },
            resrveCar(){
                if (stringIsEmpty(this.operationInfo.carNo)) {
                    Toast.fail('请填写车牌号')
                    return false;
                }
                resrveCarNo(this.operationInfo).then(() =>{
                    Toast.success('车辆预约成功')
                })
            },
            resetFun() {
                if (stringIsEmpty(this.operationInfo.userName)) {
                    Toast.fail('请填写用户名')
                    return false;
                }
                reset({
                    name: this.projectInfo.name,
                    ip: this.operationInfo.ip,
                    userName: this.operationInfo.userName.trim()
                }).then(() => {
                    Toast.success('密码重置为123456')
                });
            },
            removeFun() {
                if (stringIsEmpty(this.operationInfo.carNo)) {
                    Toast.fail('请填写车牌号')
                    return false;
                }
                Dialog.alert({
                    title: '提示',
                    message: '确认删除场内出入记录吗?',
                    theme: 'round-button',
                }).then(() => {
                    this.operationInfo.name = this.projectInfo.name;
                    remove(this.operationInfo).then(() => {
                        Toast.success('场内出入记录删除成功')
                    });
                });
            },
            removeAllFun() {
                if (stringIsEmpty(this.operationInfo.carNo)) {
                    Toast.fail('请填写车牌号')
                    return false;
                }
                Dialog.alert({
                    title: '提示',
                    message: '确认删除场内所有出入记录吗?',
                    theme: 'round-button',
                }).then(() => {
                    this.operationInfo.name = this.projectInfo.name;
                    removeAll(this.operationInfo).then(() => {
                        Toast.success('场内所有出入记录删除成功')
                    });
                });
            },
            closeConnection() {
                this.projectInfo = {ip: '', name: ''};
                this.operationInfo = {ip: '', carNo: '', userName: '', inOutTime: ''};
                this.isEnable = false;
            },
            onPickerProjectConfirm(value) {
                this.projectInfo = {ip: value[2], name: `${value[0]} / ${value[1]}`, elName: value};
                this.showPicker = false;
            },
            onInput(value) {
                this.projectInfo.ip += value;
            },
            onDelete() {
                let len = this.projectInfo.ip.length;
                if (len) {
                    this.projectInfo.ip = this.projectInfo.ip.substring(0, len - 1);
                }
            },
            tabBarChange(v) {
                if (v === 1) {
                    removeToken();
                    this.$router.replace({
                        path: '/login'
                    })
                }
            }
        }
    }
</script>

<style scoped>
    .btn-div {
        width: 85vw;
        margin: 10px auto;
    }

    .el-date-editor, .el-cascader, .el-input, .el-button {
        width: 100%;
    }


</style>