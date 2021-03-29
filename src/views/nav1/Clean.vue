<template>
    <!--工具条-->
    <div>
        <el-col :span="24" class="toolbar">
            数据集选择
            <el-select v-model="value" placeholder="请选择" @change="on_dataset_change">
                <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                </el-option>
            </el-select>
        </el-col>

        <!--		<el-col v-for="msg in message" >-->
        <!--			<el-col v-html="msg"></el-col>-->
        <!--		</el-col>-->
        <el-col class="clean_condition">
            对
            <el-select multiple v-model="clean_form.columns">
                <el-option
                        v-for="item in cols"
                        :key="item" :label="item" :value="item">
                </el-option>
            </el-select>
            列
            进行
            <el-select v-model="clean_form.clean_method" @change="on_method_change">
                <el-option
                        v-for="item in method_choice"
                        :key="item" :label="item.label" :value="item.value">
                </el-option>
            </el-select>

            <!--清洗方法类的子方法下拉选择框	-->
            <el-select v-model="clean_form.sub_method" v-show="show_sub_method">
                <el-option v-for="item in clean_methods[clean_form.clean_method]"
                           :key="item" :label="item" :value="item">
                </el-option>
            </el-select>

            操作
            <el-button type="primary" @click="add_step">添加步骤</el-button>
        </el-col>

        <ul>
            <li  v-for="(item ,index) in cleanCondition">
                对
                <b class="column_style">{{item.columns.join(",")}}</b>列进行
                <b class="method_style">{{item.clean_method}} -- {{item.sub_method}}</b>
                <i class="el-icon-delete2" @click="click_del(index)" ></i>
                <i class="el-icon-arrow-up" @click="click_up(index)"></i>
                <i class="el-icon-arrow-down" @click="click_down(index)"></i>
            </li>
        </ul>
    </div>



</template>

<script>
    import axios from 'axios'

    export default {
        name: "Clean",

        data() {
            return {
                clean_form: {
                    columns: "",//数据清洗应用列
                    clean_method: "",//清洗方法
                    sub_method: "",//下拉框选择的子方法
                    sub_condition: "",//子方法产生的输入框
                },
                options: [],
                value: sessionStorage.getItem("dataset_name"),
                cols: [],
                tableData: [],
                isloading: false,
                cleanCondition: [],//用户输入动态生成的清洗条件
                method_choice: [],
                clean_methods: {},//后端传的清洗方法（部分方法可能会有子方法需要动态生成输入框）
                show_sub_method: false,
                condition_html: ""
            }
        },
        created() {
            this.get_datasets()
            this.get_clean_methods()
            this.get_dataset_cols(this.value)

        },
        methods: {
            /*初始化加载方法:用户所有数据集、清洗方法 */

            get_datasets() {
                var original = JSON.parse(sessionStorage.getItem("dataset_list"))
                console.log(original)
                for (var dataset of original) {
                    this.options.push({
                        label: dataset,
                        value: dataset
                    })
                }
            },
            get_clean_methods() {
                axios.get('api/get_clean_methods').then(
                    (response) => {
                        var methods = response.data.data
                        console.log(methods)
                        this.clean_methods = methods

                        for (var method in methods) {
                            this.method_choice.push({
                                label: method,
                                value: method
                            })
                        }
                    }
                )
            },
            //数据清洗规则排序/删除按钮响应
            click_del(index) {
                // this.$message.error(string(index))
                this.cleanCondition.splice(index,1)

            },
            click_up(index){
                console.log(index,typeof index)
                var temp = this.cleanCondition[index]
                this.cleanCondition[index]=this.cleanCondition[index-1]
                this.cleanCondition[index-1]=temp
            },
            click_down(index){
                var temp = this.cleanCondition[index]
                this.cleanCondition[index]=this.cleanCondition[index+1]
                this.cleanCondition[index+1]=temp
                var a=[1,2,3]
                console.log(a)
                temp=a[2]
                a[2]=a[0]
                a[0]=temp
                console.log(a)
            },

            /*业务方法*/
            //根据数据集名称获取所有列
            get_dataset_cols(dataset_name) {
                axios.get('api/get_dataset_cols?username=' + sessionStorage.getItem('user') + '&dataset_name=' + this.value)
                    .then((response) => {
                        var columns = response.data.data
                        sessionStorage.setItem("dataset_cols", JSON.stringify(columns))
                        sessionStorage.setItem("dataset_name", dataset_name)
                        this.cols = columns
                        this.cols.unshift("全部")


                    })
            },
            //数据集发生变化，获取对应数据列
            on_dataset_change() {
                this.get_dataset_cols(this.value)
                this.cleanCondition = []
            },

            on_method_change() {
                var method = this.clean_form.clean_method
                var sub_method = this.clean_methods[method]
                var have_sub = typeof sub_method === "string" ? false : true
                if (have_sub) {
                    this.clean_form.sub_method = this.clean_methods[method][0]
                }
                this.show_sub_method = have_sub

            },
            add_step() {
                var clean_form = this.clean_form
                this.cleanCondition.push({
                    "columns":clean_form.columns,
                    "clean_method":clean_form.clean_method,
                    "sub_method":clean_form.sub_method
                })

            },

        }
    }
</script>

<style scoped>

    .clean_condition {
        margin-top: 10px;
        cursor: pointer;
    }


    .column_style {
        color: orangered;
        margin-left: 10px;
        margin-right: 10px;
        border-radius: 3px;
        border: 1px solid orangered;


    }

    .method_style {
        color: blue;
        margin-left: 10px;
        margin-right: 10px;
        border-radius: 3px;
        border: 1px solid blue;

    }
    i{
        cursor: pointer;
    }

</style>