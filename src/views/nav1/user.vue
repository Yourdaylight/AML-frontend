<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">

			<el-select v-model="value" placeholder="请选择">
				<el-option
				  v-for="item in options"
				  :key="item.value"
				  :label="item.label"
				  :value="item.value">
				</el-option>
			</el-select>

			<el-button  type="primary" @click="show_dataset">查看</el-button>
		</el-col>

		<!--列表-->
		<template>
		 <el-table class="tb-edit" highlight-current-row :data="tableData" style="width: 100%">

            <template v-for="(col ,index) in cols">

                <el-table-column v-if="col.type==='sort'" :prop="col.prop" sortable :label="col.label">

                </el-table-column>
            </template>
        </el-table>

		</template>

	</section>
</template>
<script>
	import { getUserList } from '../../api/api';
	import axios from 'axios'
	import  Table from './Table.vue'

	//import NProgress from 'nprogress'
	export default {
		data() {
			return {
				options:[],
				value:"",
				cols: [],
            	tableData: []


			}
		},
		inject:['reload'],
		created() {
			this.get_datasets()
			var datasetName=sessionStorage.getItem('dataset_name')
			if (datasetName!='') {
				this.value=datasetName
				this.show_dataset()
			}
		},
		methods: {
			get_datasets(){
				axios.get('/api/get_data_list')
						.then((response)=>{
							var original=response.data.data
							for (var dataset of original.name){
								this.options.push({
									label:dataset,
									value:dataset
								})
							}
						})
			},
			show_dataset(){
				this.cols=[]
				this.tableData=[]
				axios.get('api/show_dataset?dataset_name='+this.value)
						.then((response)=>{

							var body=response.data
							var body_data= response.data.data
							var columns=body_data.cols
							console.log(body)
							//添加表头
							for (var column of columns){
								this.cols.push({
									label:column,
									prop:column,
									type:"sort"
								})
							}
							//计算数据长度，循环添加
							var data_length=body_data[columns[0]].length
							if (data_length>100){
								var text="当前数据集共有"+data_length+"条数据,预览仅显示前100条"
								data_length=100
								this.$message(text,'info')
							}
							for(var i=0;i<data_length;i++){
								//按行添加
								var row={}
								for(var column of columns){
									row[column]=body_data[column][i]
								}
								this.tableData.push(row)
								sessionStorage.setItem("dataset_name",this.value)
							}
						})
			}
		},

	};

</script>

<style scoped>

</style>