<template>
    <div>
        <van-picker
                ref="myDateTimePicker"
                title="时间选选择"
                show-toolbar
                :columns="columns"
                @confirm="onConfirm"
                @cancel="onCancel"
                @change="onChange"
        />
    </div>
</template>

<script>

    function fillZero(num) {
        return num < 10 ? `0${num}` : `${num}`;
    }

    function fillDay(year, month) {
        let max;
        if (month === 2) {
            max = (year % 4 === 0 ? 29 : 28);
        } else {
            let monthList = [1, 3, 5, 7, 8, 10, 12];
            max = monthList.indexOf(month) === -1 ? 30 : 31;
        }
        return fillOther(1, max);
    }

    function fillOther(min, max) {
        let list = [];
        for (let i = min; i <= max; i++) {
            list.push({text: fillZero(i), children: []})
        }
        return list;
    }

    import Vue from 'vue';
    import {Picker} from 'vant';

    Vue.use(Picker);
    export default {
        name: "DateTimePicker",
        props: {
            minYear: {
                type: Number,
                default: 2010
            },
            maxYear: {
                type: Number,
                default: new Date().getFullYear()
            },
        },
        created() {
            for (let year = this.minYear; year <= this.maxYear; year++) {
                let monthList = [];
                for (let month = 1; month <= 12; month++) {
                    monthList.push({text: fillZero(month), children: fillDay(year, month)})
                }
                this.yearMonthDays.push({text: `${year}`, children: monthList});
            }
            this.columns = [
                {values: this.yearMonthDays},
                {values: this.yearMonthDays[0].children},
                {values: this.yearMonthDays[0].children[0].children},
                {values: this.hours},
                {values: this.minutes},
                {values: this.seconds},
            ];
        },
        data() {
            return {
                columns: [],
                yearMonthDays: [],
                hours: fillOther(0, 12),
                minutes: fillOther(0, 59),
                seconds: fillOther(0, 59)
            }
        },
        methods: {
            onConfirm(value) {
                let dateTime = value.map(item => item.text);
                let date = dateTime.filter((item, index) => index <= 2).join("-");
                let time = dateTime.filter((item, index) => index > 2).join(":");
                this.$emit("confirm", `${date} ${time}`);
            },
            onCancel() {
                this.$emit("cancel");
            },
            onChange(picker, value, index) {
                if (index <= 1) {
                    picker.setColumnValues(index + 1, value[index].children);
                    for (let i = index + 1; i <= 2; i++) {
                        picker.setColumnIndex(i, 0);
                    }
                }
            }
        }
    }
</script>

<style scoped>

</style>