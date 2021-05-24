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
            <el-select v-model="clean_form.sub_method" v-show="show_sub_method"
            >
                <el-option v-for="item in clean_methods[clean_form.clean_method]"
                           :key="item" :label="item" :value="item">
                </el-option>
            </el-select>

            操作
            <el-button type="primary" @click="add_step">添加步骤</el-button>
        </el-col>

        <ul class="clean_conditions">
            <li  v-for="(item ,index) in cleanCondition">
                对
                <b class="column_style">{{item.columns.join(",")}}</b>列进行
                <b class="method_style">{{item.clean_method}} -- {{item.sub_method}}</b>
                <i class="el-icon-delete2" @click="click_del(index)" ></i>
                <i class="el-icon-arrow-up" @click="click_up(index)"></i>
                <i class="el-icon-arrow-down" @click="click_down(index)"></i>
            </li>
        </ul>

        <el-button type="warning" style="margin-top: 20px" @click="clean_data">生成新的数据</el-button>
        <el-button type="primary" style="margin-top: 20px" @click="generate_clean_code" >生成数据清洗代码</el-button>


          <!--生成新数据导入我的数据集确认弹框-->
        <el-dialog title="保存新数据" :visible.sync="saveDataDialogVisible" :close-on-click-modal="true" :modal="true" :show-close="true" :center="true">
             <el-col style="white-space: pre-wrap;">清洗规则校验通过，是否保存清洗后的新数据</el-col>
             <span slot="footer" class="dialog-footer">
                 <el-button type="danger" @click="saveDataDialogVisible = false">否</el-button>
                 <el-button type="primary" @click="save_clean_data" >是</el-button>
             </span>
         </el-dialog>

              <!--数据清洗代码生成弹框-->
        <el-dialog title="代码"
                   :visible.sync="codeDialogVisible"
                   :close-on-click-modal="true" :modal="true"
                   :show-close="true" :center="true"
                  >
             <el-col style="white-space: pre-wrap;max-height: 80%">{{clean_code}}</el-col>
             <span slot="footer" class="dialog-footer">
                 <el-button @click="codeDialogVisible = false">取 消</el-button>
                 <el-button type="primary" @click="onExportCode">导出文件</el-button>
				 <el-button @click="clean_data">立即运行</el-button>
			 </span>
         </el-dialog>
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
                condition_html: "",
                saveDataDialogVisible: false,
                generateCodeDialogVisible: false,
                codeDialogVisible: false,
                clean_code: ""
            }
        },
        created() {
            this.get_datasets()
            this.get_clean_methods()
            this.get_dataset_cols(this.value)
            var clean_params = sessionStorage.getItem("clean_params")
            if (clean_params){
                this.clean_form = JSON.parse(clean_params)
            }

        },
        watch: {
            clean_form:{
                handler: function(val, oldVal){
                    sessionStorage.setItem("clean_params",JSON.stringify(val))
                },
                deep: true
            }
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
                axios.get('api/model_selection/get_methods?type=clean').then(
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
            //校验清洗条件
            clean_data(){
                axios.post("/api/engine/check_clean_condition",{
                   "conditions":this.cleanCondition,
                   "dataset":this.value,
                    "user_name":JSON.parse(sessionStorage.getItem("user"))
                }).then((response)=>{
                    var data = response.data
                    if (data.code === 200) {
                        this.$message.info(data.msg)
                        this.saveDataDialogVisible = true
                    }else{
                        this.$message.error(data.msg)
                    }


                }).catch((error)=>{
                    this.$message.error("错误")
                })
            },
            //生成清洗代码
            generate_clean_code(){
                axios.post("/api/model_selection/generate_clean_code",{
                   "conditions":this.cleanCondition,
                   "dataset":this.value,
                    "user_name":JSON.parse(sessionStorage.getItem("user"))
                }).then((response)=>{
                    var data = response.data
                    if (data.code === 200){
                        this.$message.info(data.msg)
                        this.clean_code = data.data
                        this.codeDialogVisible = true
                        }
                    //校验失败
                    else{
                        this.$message.error(data.msg)
                    }
                }).catch((error)=>{
                    this.$message.error("错误")
                })
            },
            //清洗完成的数据入库
            save_clean_data(){
                axios.post("/api/engine/save_clean_data", {
                    "conditions":this.cleanCondition,
                   "dataset":this.value,
                    "user_name":JSON.parse(sessionStorage.getItem("user"))
                }).then((response)=>{
                    var data = response.data
                    data.code === 200 ? this.$message.info(data.msg):this.$message.error(data.msg)
                    this.$router.push({path: '/table'});
                })
            }

        }
    }
</script>

<style scoped>

    .clean_condition {
        margin-top: 10px;
        cursor: pointer;
    }

    .clean_conditions{
        display: block;
        margin-top: 50px;
        font-size: 20px;
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