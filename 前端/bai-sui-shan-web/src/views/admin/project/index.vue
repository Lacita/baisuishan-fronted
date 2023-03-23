<template>
    <div class="main">
        <div v-if="isPCValue">
            <el-row :gutter="10" style="margin-top: 10px; margin-bottom: 20px;">
                <el-col :span="6">
                    <el-input size="small" v-model="queryInfo.ip" placeholder="请输入IP"></el-input>
                </el-col>
                <el-col :span="3">
                    <el-select size="small" v-model="queryInfo.cityId" placeholder="请选择城市">
                        <el-option v-for="(item,key) in cityTypeList" :key="key" :label="item.text"
                                   :value="item.value"></el-option>
                    </el-select>
                </el-col>
                <el-col :span="3">
                    <el-select size="small" v-model="queryInfo.projectId" placeholder="请选择项目">
                        <el-option v-for="(item,key) in projectTypeList" :key="key" :label="item.text"
                                   :value="item.value"></el-option>
                    </el-select>
                </el-col>
                <el-col :span="3">
                    <el-button type="primary" size="small" @click="search(false)">搜索</el-button>
                </el-col>
                <el-col :span="9" style="text-align: right;">
                    <el-button type="success" size="small" @click="onClickRight">添加</el-button>
                </el-col>
            </el-row>
            <el-table :data="dataList" style="width: 100%" size="small">
                <el-table-column prop="cityName" label="城市名称" align="center"></el-table-column>
                <el-table-column prop="projectName" label="项目名称" align="center" width="100"></el-table-column>
                <el-table-column prop="projectIp" label="项目IP" align="center"></el-table-column>
                <el-table-column label="操作" width="200" align="center">
                    <template slot-scope="{row}">
                        <el-button size="small" type="text" @click="removeProject(row)">删除</el-button>
                        <el-button size="small" type="text" @click="modifyProject(row)">修改</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div style="margin: 20px auto; text-align: center;">
                <el-pagination
                        @current-change="handleCurrentChange"
                        background
                        layout="total ,prev, pager, next"
                        :total="total">
                </el-pagination>
            </div>
        </div>
        <div v-else>
            <van-nav-bar title="项目管理" @click-right="onClickRight">
                <template #right>
                    <van-icon name="plus" size="18"/>
                </template>
            </van-nav-bar>
            <van-search v-model="queryInfo.ip" placeholder="请输入IP" @search="search(false)"/>
            <van-dropdown-menu>
                <van-dropdown-item @change="dropdownChange" v-model="queryInfo.cityId" :options="cityTypeList"/>
                <van-dropdown-item @change="dropdownChange" v-model="queryInfo.projectId" :options="projectTypeList"/>
            </van-dropdown-menu>
            <div class="record" id="record-container">
                <div id="record">
                    <van-swipe-cell v-for="item in dataList" :key="item.id">
                        <van-cell>
                            <template #title>
                                <span class="item">{{item.cityName}}</span>
                                <span class="item">{{item.projectName}}</span>
                                <span class="item">{{item.projectIp}}</span>
                            </template>
                        </van-cell>
                        <template #right>
                            <van-button square type="danger" @click="removeProject(item)" text="删除"/>
                        </template>
                    </van-swipe-cell>
                </div>
            </div>
        </div>


        <el-dialog title="添加项目" :visible.sync="dialogFormVisible" width="500px">
            <el-form :model="dataInfo" ref="ruleForm" :rules="rules" label-width="80px" size="small">
                <el-form-item label="城市" prop="cityId">
                    <el-select size="small" style="width: 85%;" v-model="dataInfo.cityId" placeholder="请选择城市">
                        <template v-for="(item,key) in cityTypeList">
                            <template v-if="key > 0">
                                <el-option :key="key" :label="item.text" :value="item.value"></el-option>
                            </template>
                        </template>
                    </el-select>
                </el-form-item>
                <el-form-item label="项目" prop="projectId">
                    <el-select size="small" style="width: 85%;" v-model="dataInfo.projectId" placeholder="请选择项目">
                        <template v-for="(item,key) in projectTypeList">
                            <template v-if="key > 0">
                                <el-option :key="key" :label="item.text" :value="item.value"></el-option>
                            </template>
                        </template>
                    </el-select>
                </el-form-item>
                <el-form-item label="IP" prop="projectIp">
                    <el-input style="width: 85%;" v-model="dataInfo.projectIp" placeholder="请输入ip"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" size="small" @click="saveInfo">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    const ipPattern = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
    import {searchProject, modifyProject, selectTypeAll, removeProject, createProject} from '../../../api/project'
    import Vue from 'vue';
    import {
        Search,
        SwipeCell,
        Cell,
        Button,
        DropdownMenu,
        DropdownItem,
        NavBar,
        Icon,
        Toast,
        Dialog
    } from 'vant';

    Vue.use(Cell);
    Vue.use(Button);
    Vue.use(SwipeCell);
    Vue.use(Search);
    Vue.use(DropdownMenu);
    Vue.use(DropdownItem);
    Vue.use(NavBar);
    Vue.use(Icon);
    import {isPC} from "../../../util";
    import {
        Col as elCol, Row as elRow, Input,
        Button as elButton, Select, Table as elTable, TableColumn,
        Pagination, Option, MessageBox, Form, FormItem, Dialog as elDialog
    } from 'element-ui';

    Vue.use(elRow);
    Vue.use(elCol);
    Vue.use(elButton);
    Vue.use(Input);
    Vue.use(Select);
    Vue.use(elTable);
    Vue.use(TableColumn);
    Vue.use(Pagination);
    Vue.use(Option);
    Vue.use(Form);
    Vue.use(FormItem);
    Vue.use(elDialog);


    export default {
        name: "project",
        data() {
            return {
                rules: {
                    cityId: [
                        {required: true, message: '请选择城市', trigger: 'change'},
                    ],
                    projectId: [
                        {required: true, message: '请选择项目', trigger: 'change'}
                    ],
                    projectIp: [
                        {required: true, message: '请输入正确的ip地址', trigger: 'blur'},
                        {pattern: ipPattern, message: '请输入正确的ip地址', trigger: 'blur'}
                    ],
                },
                dialogFormVisible: false,
                isPCValue: isPC(),
                queryInfo: {
                    pageNo: 1,
                    pageSize: 20,
                    ip: '',
                    cityId: '',
                    projectId: ''
                },
                dataInfo: {},
                total: 0,
                dataList: [],
                cityTypeList: [{value: '', text: '全部城市'}],
                projectTypeList: [{value: '', text: '全部项目'}],
            }
        },
        created() {
            this.selectType();
            if (this.isPCValue) {
                this.queryInfo.pageSize = 10;
            }
            this.search(false);
        },
        mounted() {
            if (!this.isPCValue) {
                this.scroll();
            }
        },
        methods: {
            search(flag) {
                if (flag && this.total > 0 && this.total === this.dataList.length) return false;
                if (!flag) {
                    this.queryInfo.pageNo = 1;
                    this.total = 0;
                    this.dataList = [];
                }
                searchProject(this.queryInfo).then(res => {
                    this.total = res.total;
                    if (this.isPCValue) {
                        this.dataList = res.list;
                        return false;
                    }
                    if (flag) {
                        res.list.forEach(item => {
                            this.dataList.push(item);
                        });
                    } else {
                        this.dataList = res.list;
                    }
                })
            },
            removeProject(item) {
                Dialog.alert({
                    title: '提示',
                    message: '确认删除本条记录吗?',
                    theme: 'round-button',
                }).then(() => {
                    removeProject(item.id).then(() => {
                        Toast.success('删除成功');
                        this.search(false);
                    })
                });
            },
            selectType() {
                selectTypeAll().then(res => {
                    this.cityTypeList = this.cityTypeList.concat(res.cityList);
                    this.projectTypeList = this.projectTypeList.concat(res.projectList);
                })
            },
            modifyProject(row) {
                MessageBox.prompt('请输入新的IP', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputPattern: ipPattern,
                    inputErrorMessage: 'IP格式不正确'
                }).then(({value}) => {
                    let info = Object.assign({}, row);
                    info.projectIp = value;
                    modifyProject(info).then(() => {
                        Toast.success('修改成功');
                        this.search(false);
                    });
                }).catch(() => {
                });
            },
            saveInfo() {
                this.$refs['ruleForm'].validate((valid) => {
                    if (valid) {
                        createProject(this.dataInfo).then(() => {
                            Toast.success('添加成功');
                            this.search(false);
                            this.dialogFormVisible = false;
                            this.dataInfo = {id: '', cityId: '', projectId: '', projectIp: ''}
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            dropdownChange() {
                this.search(false);
            },
            onClickRight() {
                if (this.isPCValue) {
                    this.dialogFormVisible = true;
                    this.dataInfo = {
                        id: '',
                        cityId: '',
                        projectId: '',
                        projectIp: ''
                    }
                } else {
                    this.$router.push({
                        path: '/admin/project/create'
                    })
                }
            },
            handleCurrentChange(v) {
                this.queryInfo.pageNo = v;
                this.search(true);
            },
            scroll() {
                const recordContainer = document.getElementById("record-container");
                const recordDom = document.getElementById("record");
                recordContainer.onscroll = () => {
                    let bottomOfWindow = recordContainer.scrollTop + recordContainer.offsetHeight >= recordDom.clientHeight - 5;
                    if (bottomOfWindow) {
                        this.queryInfo.pageNo += 1;
                        this.search(true);
                    }
                };
            }
        }

    }
</script>

<style scoped>
    .record {
        height: calc(100vh - 214px);
        margin: 10px auto;
        overflow: auto;
    }

    .item {
        margin: 0px 10px;
    }

    .el-select {
        width: 100%;
    }
</style>