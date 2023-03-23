<template>
    <div class="main">
        <div v-if="isPcValue">
            <el-row :gutter="10" style="margin-top: 10px; margin-bottom: 20px;">
                <el-col :span="6">
                    <el-input size="small" v-model="queryInfo.name" placeholder="搜索内容">
                        <el-select v-model="queryInfo.condition" style="width: 100px;" slot="prepend" placeholder="请选择">
                            <el-option label="用户名" value="userName"></el-option>
                            <el-option label="请求IP" value="requestIp"></el-option>
                            <el-option label="项目名" value="projectName"></el-option>
                            <el-option label="项目IP" value="projectIp"></el-option>
                            <el-option label="车牌号" value="projectCarNo"></el-option>
                        </el-select>
                    </el-input>
                </el-col>
                <el-col :span="6">
                    <el-button type="primary" size="small" @click="search(false)">搜索</el-button>
                </el-col>
            </el-row>
            <el-table :data="dataList" highlight-current-row @row-click="showDetail" style="width: 100%"
                      size="small">
                <el-table-column label="状态" width="100" align="center">
                    <template slot-scope="{row}">
                        <template v-if="row.isSuccess === '1'">
                            <el-tag type="danger" effect="dark" size="small">失败</el-tag>
                        </template>
                        <template v-else>
                            <el-tag type="success" effect="dark" size="small">成功</el-tag>
                        </template>
                    </template>
                </el-table-column>
                <el-table-column label="日志类型" align="center">
                    <template slot-scope="{row}">
                        <template v-if="row.describeInfo">
                            {{row.describeInfo}}
                        </template>
                        <template v-else>
                            {{row.type === '0' ? '登录日志' : '操作日志'}}
                        </template>
                    </template>
                </el-table-column>
                <el-table-column prop="userName" label="用户" align="center"></el-table-column>
                <el-table-column prop="requestIp" label="请求地址" align="center" width="120"></el-table-column>
                <el-table-column prop="cityInfo" label="IP所在地" align="center"></el-table-column>
                <el-table-column prop="requestTime" label="请求时间" align="center" width="150"></el-table-column>
                <el-table-column prop="requestLong" label="历经时间" align="center" width="100"></el-table-column>
                <el-table-column prop="browser" label="浏览器" align="center"></el-table-column>
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
            <van-nav-bar title="日志信息"></van-nav-bar>
            <van-search v-model="queryInfo.name" placeholder="请输入用户名" @search="search(false)"/>
            <div class="record" id="record-container">
                <div id="record">
                    <van-cell v-for="item in dataList" :key="item.id" is-link @click="showDetail(item)">
                        <template #title>
                            <van-tag :type="item.isSuccess === '1' ? 'danger' : 'success'">
                                {{item.isSuccess === '1' ? '失败' : '成功'}}
                            </van-tag>
                            <span class="custom-title item">{{item.userName}}</span>
                            <span class="custom-ip item">{{item.requestIp}}</span>
                            <span class="custom-city item">{{item.cityInfo}}</span>
                        </template>
                    </van-cell>
                </div>
            </div>
        </div>
        <van-popup
                v-model="show"
                position="bottom"
                :style="{ height: '60%' }"
        >
            <div>
                <template v-if="dataInfo.describeInfo">
                    <van-divider>{{dataInfo.describeInfo}}</van-divider>
                </template>
                <template v-else>
                    <van-divider>{{dataInfo.type === '0' ? '登录日志' : '操作日志'}}</van-divider>
                </template>
                <van-cell icon="clock-o" title="请求时间" :value="dataInfo.requestTime"/>
                <van-cell icon="underway-o" title="历经时间(ms)" :value="dataInfo.requestLong"/>
                <van-cell icon="info-o" title="浏览器" :value="dataInfo.browser"/>
                <van-cell icon="cluster-o" title="请求IP" :value="dataInfo.requestIp"/>
                <van-cell icon="location-o" title="地址" :value="dataInfo.cityInfo"/>
                <van-cell icon="description" title="操作项目" v-if="dataInfo.type === '3' && dataInfo.requestParams">
                    <template #label>
                        <van-field label="项目" readonly :placeholder="dataInfo.requestParams.info.name"/>
                        <van-field label="IP" readonly :placeholder="dataInfo.requestParams.info.ip"/>
                        <van-field v-if="dataInfo.requestParams.info.carNo" label="车牌号" readonly
                                   :placeholder="dataInfo.requestParams.info.carNo"/>
                        <van-field v-if="dataInfo.requestParams.info.inOutTime" label="出入时间" readonly
                                   :placeholder="dataInfo.requestParams.info.inOutTime.replace('T',' ')"/>
                    </template>
                </van-cell>
                <template v-if="dataInfo.isSuccess === '0'">
                    <van-cell icon="share-o" title="返回结果" :label="dataInfo.result"/>
                </template>
                <template v-else>
                    <van-cell icon="close" title="错误提示" :label="dataInfo.exceptionInfo"/>
                </template>
            </div>
        </van-popup>
    </div>
</template>

<script>
    import {searchLog} from '../../../api/project';
    import {isPC} from "../../../util";
    import Vue from 'vue';
    import {Search, Cell, Popup, Tag, Divider, NavBar, Field} from 'vant';

    Vue.use(Cell);
    Vue.use(Search);
    Vue.use(Tag);
    Vue.use(Popup);
    Vue.use(Divider);
    Vue.use(NavBar);
    Vue.use(Field);

    import {
        Button as elButton,
        Table as elTable,
        TableColumn,
        Tag as elTag,
        Pagination,
        Col as elCol,
        Row as elRow, Input,
        Select, Option
    } from 'element-ui';

    Vue.use(elButton);
    Vue.use(Select);
    Vue.use(elTable);
    Vue.use(TableColumn);
    Vue.use(elTag);
    Vue.use(Pagination);
    Vue.use(elRow);
    Vue.use(elCol);
    Vue.use(Option);
    Vue.use(Input);

    export default {
        name: "log",
        data() {
            return {
                isPCValue: isPC(),
                queryInfo: {
                    pageNo: 1,
                    pageSize: 20,
                    name: '',
                    condition: 'userName'
                },
                total: 0,
                dataList: [],
                show: false,
                dataInfo: {}
            }
        },
        created() {
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
                searchLog(this.queryInfo).then(res => {
                    this.total = res.total;
                    if (this.isPCValue) {
                        this.dataList = res.list;
                        return;
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
            showDetail(row) {
                this.show = true;
                this.dataInfo = Object.assign({}, row);
                if (this.dataInfo.requestParams) {
                    this.dataInfo.requestParams = JSON.parse(this.dataInfo.requestParams);
                }
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
            },
            handleCurrentChange(v) {
                this.queryInfo.pageNo = v;
                this.search(true);
            }
        }

    }
</script>

<style scoped>
    .record {
        height: calc(100vh - 166px);
        margin: 10px auto;
        overflow: auto;
    }

    .item {
        margin: 0px 10px;
    }
</style>