<template>
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

			<el-button  type="primary" @click="add_step">添加步骤</el-button>
		</el-col>
</template>

<script>
    export default {
        name: "Clean",

		data(){
			return{
				options:[],
				value:"",
				cols: [],
            	tableData: [],
				isloading:false
			}
		},
		created(){
        	this.get_datasets()
		},
		methods:{
			get_datasets(){
				var original=JSON.parse(sessionStorage.getItem("dataset_list"))
					console.log(original)
				for (var dataset of original){
					this.options.push({
						label:dataset,
						value:dataset
					})
				}
			},
			get_dataset_cols(dataset_name){
				axios.get('api/show_dataset?username='+sessionStorage.getItem('user')+'&dataset_name='+dataset_name)
						.then((response)=>{
							var body_data= response.data.data
							var columns=body_data.cols
							sessionStorage.setItem("dataset_cols",JSON.stringify(columns))
							sessionStorage.setItem("dataset_name",dataset_name)

						})
			},
			add_step(){

			}
		}
    }
</script>

<style scoped>

</style>