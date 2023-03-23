<template>
    <div class="main">
        <div v-if="isPCValue">
            <el-row :gutter="10" style="margin-top: 10px; margin-bottom: 20px;">
                <el-col :span="6">
                    <el-input size="small" v-model="queryInfo.name" placeholder="请输入用户名"></el-input>
                </el-col>
                <el-col :span="5">
                    <el-radio-group v-model="queryInfo.system" size="small">
                        <el-radio-button :label="item.value" :key="key" v-for="(item,key) in userTypeList">
                            {{item.text}}
                        </el-radio-button>
                    </el-radio-group>
                </el-col>
                <el-col :span="5">
                    <el-radio-group v-model="queryInfo.enable" size="small">
                        <el-radio-button :label="item.value" :key="key" v-for="(item,key) in userEnableLIst">
                            {{item.text}}
                        </el-radio-button>
                    </el-radio-group>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" size="small" @click="search(false)">搜索</el-button>
                </el-col>
                <el-col :span="4" style="text-align: right;">
                    <el-button type="success" size="small" @click="onClickRight">添加</el-button>
                </el-col>
            </el-row>
            <el-table :data="dataList" style="width: 100%" size="small">
                <el-table-column label="状态" align="center" width="100">
                    <template slot-scope="{row}">
                        <template v-if="row.enable === '0'">
                            <el-tag type="success" size="small">启用</el-tag>
                        </template>
                        <template v-else>
                            <el-tag type="warning" size="small">禁用</el-tag>
                        </template>
                    </template>
                </el-table-column>
                <el-table-column label="用户名" align="center" width="100">
                    <template slot-scope="{row}">
                        <el-tag size="small" type="primary">{{row.system === '1' ? '管理员' :'操作员'}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="用户名" align="center"></el-table-column>
                <el-table-column prop="createTime" label="创建时间" align="center" width="150"></el-table-column>
                <el-table-column label="操作" width="200" align="center">
                    <template slot-scope="{row}">
                        <el-button size="small" type="text" @click="removeInfo(row)">删除</el-button>
                        <el-button size="small" type="text" @click="changeEnable(row)">
                            {{row.enable === '0' ? '禁用' : '启用'}}
                        </el-button>
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
            <van-nav-bar title="用户管理" @click-right="onClickRight">
                <template #right>
                    <van-icon name="plus" size="18"/>
                </template>
            </van-nav-bar>
            <van-search v-model="queryInfo.name" placeholder="请输入用户名" @search="search(false)"/>
            <van-dropdown-menu>
                <van-dropdown-item @change="dropdownChange" v-model="queryInfo.system" :options="userTypeList"/>
                <van-dropdown-item @change="dropdownChange" v-model="queryInfo.enable" :options="userEnableLIst"/>
            </van-dropdown-menu>
            <div class="record" id="record-container">
                <div id="record">
                    <van-swipe-cell v-for="item in dataList" :key="item.id">
                        <template #left>
                            <van-button square :type="item.enable === '0' ? 'warning' : 'info'"
                                        :text="item.enable === '0' ? '禁用' : '启用'" @click="changeEnable(item)"/>
                        </template>
                        <van-cell>
                            <template #title>
                            <span class="item">
                                <template v-if="item.enable === '0'">
                                    <van-tag type="success">启用</van-tag>
                                </template>
                                <template v-else>
                                    <van-tag type="warning">禁用</van-tag>
                                </template>
                            </span>
                                <span class="item">
                                <van-tag plain type="primary">{{item.system === '1' ? '管理员' :'操作员'}}</van-tag>
                            </span>
                                <span class="item">{{item.name}}</span>
                                <span class="item">{{item.createTime}}</span>
                            </template>
                        </van-cell>
                        <template #right>
                            <van-button square type="danger" @click="removeInfo(item)" text="删除"/>
                        </template>
                    </van-swipe-cell>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {searchUser, removeUser, modifyUserEnable} from '../../../api/project'
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
        Tag,
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
    Vue.use(Tag);

    import {
        Col as elCol, Row as elRow, Input,
        Button as elButton, RadioGroup, RadioButton, Table as elTable, TableColumn,
        Pagination, Tag as elTag
    } from 'element-ui';
    import {isPC} from "../../../util";

    Vue.use(elRow);
    Vue.use(elCol);
    Vue.use(elButton);
    Vue.use(Input);
    Vue.use(elTable);
    Vue.use(TableColumn);
    Vue.use(Pagination);
    Vue.use(RadioGroup);
    Vue.use(RadioButton);
    Vue.use(elTag);

    export default {
        name: "user",
        data() {
            return {
                isPCValue: isPC(),
                queryInfo: {
                    pageNo: 1,
                    pageSize: 20,
                    name: '',
                    system: '',
                    enable: ''
                },
                total: 0,
                dataList: [],
                userTypeList: [
                    {value: '', text: '全部类别'},
                    {value: '0', text: '操作员'},
                    {value: '1', text: '管理员'}
                ],
                userEnableLIst: [
                    {value: '', text: '全部状态'},
                    {value: '0', text: '启用'},
                    {value: '1', text: '禁用'}
                ]
            }
        },
        created() {
            if (this.isPcValue) {
                this.queryInfo.pageSize = 10;
            }
            this.search(false);
        },
        mounted() {
            if(!this.isPCValue){
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
                searchUser(this.queryInfo).then(res => {
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
            changeEnable(item) {
                modifyUserEnable(item.id).then(() => {
                    Toast.success('状态修改成功');
                    this.search(false);
                })
            },
            removeInfo(item) {
                Dialog.alert({
                    title: '提示',
                    message: '确认删除本条记录吗?',
                    theme: 'round-button',
                }).then(() => {
                    removeUser(item.id).then(() => {
                        Toast.success('删除成功');
                        this.search(false);
                    })
                });
            },
            dropdownChange() {
                this.search(false);
            },
            handleCurrentChange(v) {
                this.queryInfo.pageNo = v;
                this.search(true);
            },
            onClickRight() {
                this.$router.push({
                    path: '/admin/user/create'
                })
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
</style>