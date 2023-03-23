<template>
    <div class="main">
        <van-nav-bar :title="queryInfo.id === '0' ? '城市管理' : '项目名管理'" left-arrow left-text="返回"
                     @click-left="$router.back(-1)" @click-right="show = true">
            <template #right>
                <van-icon name="plus" size="18"/>
            </template>
        </van-nav-bar>
        <div v-if="isPCValue" style="max-width: 100vw; overflow: hidden;">
            <el-row :gutter="10" style="margin-top: 10px; margin-bottom: 20px;">
                <el-col :span="6">
                    <el-input size="small" v-model="queryInfo.name" placeholder="请输入名称"></el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" size="small" @click="search(false)">搜索</el-button>
                </el-col>
            </el-row>
            <el-table :data="dataList" style="width: 100%" size="small">
                <el-table-column prop="text" label="名称" align="center"></el-table-column>
                <el-table-column prop="createTime" label="创建时间" align="center" width="150"></el-table-column>
                <el-table-column label="操作" width="200" align="center">
                    <template slot-scope="{row}">
                        <el-button size="small" type="text" @click="removeInfo(row)">删除</el-button>
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
            <van-search v-model="queryInfo.name" placeholder="请输入名称" @search="search(false)"/>
            <div class="record" id="record-container">
                <div id="record">
                    <van-swipe-cell v-for="item in dataList" :key="item.id">
                        <van-cell :title="item.text" :value="item.createTime"/>
                        <template #right>
                            <van-button square type="danger" @click="removeInfo(item)" text="删除"/>
                        </template>
                    </van-swipe-cell>
                </div>
            </div>
        </div>
        <van-popup v-model="show" :style="{ width: '90%',paddingTop: '30px' ,paddingBottom: '20px'}">
            <van-divider>添加</van-divider>
            <van-form @submit="onSubmit">
                <van-field
                        v-model="dataInfo.name"
                        autofocus
                        name="name"
                        label="名称"
                        placeholder="名称"
                        :rules="[{ required: true, message: '请填写名称' }]"
                />
                <div style="margin: 16px;">
                    <van-button round block type="info" native-type="submit">提交</van-button>
                </div>
            </van-form>
        </van-popup>
    </div>
</template>

<script>
    import {removeType, searchType, saveType} from "../../../api/project";
    import Vue from 'vue';
    import {Cell, Dialog, Icon, NavBar, Search, Toast, Button, SwipeCell, Popup, Form, Field, Divider} from 'vant';

    Vue.use(Field);
    Vue.use(NavBar);
    Vue.use(Search);
    Vue.use(SwipeCell);
    Vue.use(Icon);
    Vue.use(Cell);
    Vue.use(Popup);
    Vue.use(Button);
    Vue.use(Form);
    Vue.use(Divider);

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
        name: "type",
        data() {
            return {
                isPCValue: isPC(),
                queryInfo: {
                    pageNo: 1,
                    pageSize: 20,
                    id: '0',
                    name: ''
                },
                show: false,
                total: 0,
                dataList: [],
                dataInfo: {
                    name: '',
                    type: ''
                }
            }
        },
        created() {
            let type = this.$route.params && this.$route.params.type;
            if (type === '1') {
                this.queryInfo.id = '1';
            } else {
                this.queryInfo.id = '0';
            }
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
                searchType(this.queryInfo).then(res => {
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
            onSubmit() {
                this.dataInfo.type = this.queryInfo.id;
                saveType(this.dataInfo).then(() => {
                    Toast.success('添加成功');
                    this.dataInfo = {name: '', type: ''};
                    this.search(false);
                })
            },
            removeInfo(item) {
                Dialog.alert({
                    title: '提示',
                    message: '确认删除本条记录吗?',
                    theme: 'round-button',
                }).then(() => {
                    removeType(item.value).then(() => {
                        Toast.success('删除成功');
                        this.search(false);
                    })
                });
            },
            handleCurrentChange(v){
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
        height: calc(100vh - 120px);
        margin: 10px auto;
        overflow: auto;
    }

    .item {
        margin: 0px 10px;
    }
</style>