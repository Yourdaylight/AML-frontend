<template>
	<el-form ref="form" :model="form" label-width="80px" @submit.prevent="onSubmit" style="margin:20px;width:60%;min-width:600px;">
		<el-form-item label="任务名称">
			<el-input v-model="form.name"></el-input>
		</el-form-item>

		<el-form-item label="数据集">
			<el-select v-model="form.dataset_name" placeholder="请选择" @change="onDatasetChange">
				<el-option
				  v-for="item in dataset_options"
				  :key="item.value"
				  :label="item.label"
				  :value="item.value">
				</el-option>
			</el-select>
		</el-form-item>

		<el-form-item label="特征列">
			<el-select v-model="form.features" multiple placeholder="请选择" @change="onFeatureChange">
				<el-option
				  v-for="item in dataset_cols"
				  :key="item.value"
				  :label="item.label"
				  :value="item.value">
				</el-option>
			</el-select>
		</el-form-item>

		<el-form-item label="目标列">
			<el-select v-model="form.target" placeholder="请选择" clearable>
				<el-option
				  v-for="item in target_cols"
				  :key="item.value"
				  :label="item.label"
				  :value="item.value">
				</el-option>
			</el-select>
		</el-form-item>

		<el-form-item label="模型类型">
			<el-select v-model="form.model_type" placeholder="请选择模型类型">
				<el-option label="分类" value="分类"></el-option>
				<el-option label="回归" value="回归"></el-option>
				<el-option label="聚类" value="聚类"></el-option>
			</el-select>
		</el-form-item>

		<el-form-item label="模型选择">
			<el-checkbox-group v-model="form.models">
				<el-checkbox
					v-for="item in models[form.model_type]"
					:label="item"
					:value="item"
					:name="type"
				></el-checkbox>
			</el-checkbox-group>
		</el-form-item>

		<el-form-item label="模型评估">
			<el-checkbox-group v-model="form.metrics">
					<el-checkbox
					v-for="item in metrics[form.model_type]"
					:label="item"
					:value="item"
					:name="type"
				></el-checkbox>

			</el-checkbox-group>
		</el-form-item>
		<el-form-item label="参数搜索">
			<el-input type="textarea" v-model="form.desc"></el-input>
		</el-form-item>
		<el-form-item>
			<el-button type="primary" @click="onSubmit">立即创建</el-button>
			<el-button @click.native.prevent>取消</el-button>
		</el-form-item>
		<!--		弹出框-->
<!--		<code_dailog></code_dailog>-->
		   <!--生成代码弹框-->
        <el-dialog title="代码" :visible.sync="dialogVisible" :close-on-click-modal="true" :modal="true" :show-close="true" :center="true">
             <el-col style="white-space: pre-wrap;">{{original_code}}</el-col>
             <span slot="footer" class="dialog-footer">
                 <el-button @click="dialogVisible = false">取 消</el-button>
                 <el-button type="primary" @click="onExportCode">导出文件</el-button>
               </span>
         </el-dialog>
	</el-form>
</template>

<script>
	import axios from 'axios'
	axios.defaults.withCredentials=true;
	export default {
		inject:['reload'],

		data() {
			return {
				dialogVisible: false,
				original_code:'',
				form: {
					name: '',
					dataset_name:'',
					model_type: '分类',
					features:[],
					target:'',
					models: [],
					metrics:[],
					desc:''

				},
				models:{
					"分类":['朴素贝叶斯','支持向量机','神经网络','逻辑回归','决策树',"KNN"],
					"回归":['支持向量机','神经网络','线性回归','决策树','KNN'],
					"聚类":['K-means']
				},
				metrics:{
					"分类":['ROC曲线','混淆矩阵'],
					"回归":["误差平方和","决定系数(R²)"],
					"聚类":[]
				},
				dataset_options:[],
				dataset_cols:[],
				//用于目标列中不出现已选择的特征列
				target_cols:[]
			}
		},
		created(){
			this.get_datasets()
			var datasetName=sessionStorage.getItem('dataset_name')
			if (datasetName!='') {
				this.form.dataset_name=datasetName
				this.get_dataset_cols(datasetName)

			}
		},
		methods: {
			onSubmit() {
				console.log('submit!');
				axios.post('/api/generate_code',{
					username:JSON.parse(sessionStorage.getItem('user')),
					data:this.form
				}).then((response)=>{
					var code=response.data.data
					this.original_code=code
					this.dialogVisible=true;


				})
			},
			get_datasets(){
                var original=JSON.parse(sessionStorage.getItem("dataset_list"))
                for (var dataset of original){
                    this.dataset_options.push({
                        label:dataset,
                        value:dataset
                    })}
                },
			//获取选定数据集的各列名称
			get_dataset_cols(dataset_name){
				this.dataset_cols=[]
				this.target_cols=[]
				this.tableData=[]
				axios.get('api/show_dataset?username='+sessionStorage.getItem('user')+'&dataset_name='+dataset_name)
						.then((response)=>{

							var body_data= response.data.data
							var columns=body_data.cols
							for(var column of columns){
								this.dataset_cols.push({
									label: column,
									value: column
								})
								this.target_cols.push({
									label: column,
									value: column
								})
							}
							sessionStorage.setItem("dataset_name",dataset_name)

						})
			},

			//选择完数据集后动态生成特征列、目标列下拉框
			onDatasetChange(){
				this.form={
					dataset_name:this.form.dataset_name,
					model_type: '分类',
					features:[],
					target:'',
					models: [],
					metrics:[],
					desc:''
				},
				this.get_dataset_cols(this.form.dataset_name)
			},
			//选择完'特征列'后，删除'目标列'下拉框中的对应数据
			onFeatureChange(){
				var features=JSON.parse(JSON.stringify(this.form.features))
				var all_cols=JSON.parse(JSON.stringify(this.dataset_cols))
				this.target_cols=[]
				console.log(features)
				for (var col of all_cols){
					console.log("索引:",col)
					if (features.indexOf(col.value)===-1){
						this.target_cols.push(col)
					}
				}

			},
			//导出代码文件
			onExportCode(){
				axios.get('/api/export_code',{
					params: {
						username: JSON.parse(sessionStorage.getItem('user')),
						name: this.form.name,
						dataset_name: this.form.dataset_name
					},

				}).then((response)=>{
					      let url = window.URL.createObjectURL(new Blob([response.data]));
							// 生成一个a标签
							let link = document.createElement("a");
							link.style.display = "none";
							link.href = url;
							// 生成时间戳
							let timestamp=new Date().getTime();
							link.download = "generate_"+JSON.parse(sessionStorage.getItem('user'))+"_"+this.form.name + ".py";
							document.body.appendChild(link);
							link.click();

				}).catch(error => {
					this.$message.error("下载失败")
				})

			}
		}
	}

</script>