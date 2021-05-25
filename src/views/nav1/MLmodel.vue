<template>

	<el-form ref="form" :model="form" :rules="rules_model" label-width="80px" @submit.prevent="onSubmit" style="margin:20px;width:60%;min-width:600px;">
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
			<el-select v-model="form.model_type" placeholder="请选择模型类型" @change="onModelTypeChange">
				<el-option label="分类" value="分类"></el-option>
				<el-option label="回归" value="回归"></el-option>
				<el-option label="聚类" value="聚类"></el-option>
			</el-select>
		</el-form-item>

		<el-form-item label="数据建模适用场景">
			<el-select v-model="form.model_scene" placeholder="请选择模型类型" @change="onModelTypeChange">
				<el-option
				 v-for="item in scenes"
						:label="item"
						:value="item"
				></el-option>
			</el-select>
		</el-form-item>

		<el-form-item label="模型选择">
			<el-checkbox-group v-model="form.model_name">
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
			<el-button type="primary" @click="saveParams">保存条件</el-button>
			<el-button @click.native.prevent>取消</el-button>
		</el-form-item>

		<!--生成代码弹框-->
        <el-dialog title="代码" :visible.sync="dialogVisible" :close-on-click-modal="true" :modal="true" :show-close="true" :center="true">
			<el-col style="white-space: pre-wrap;">{{original_code}}</el-col>
			<span slot="footer" class="dialog-footer">
                 <el-button @click="dialogVisible = false">取 消</el-button>
                 <el-button type="primary" @click="onExportCode">导出文件</el-button>
				 <el-button type="primary" @click="run_code">立即运行</el-button>
			</span>
         </el-dialog>
		<el-col v-html="run_code_result"></el-col>
	</el-form>

</template>

<script>
	import axios from 'axios'
	axios.defaults.withCredentials=true;
	export default {
		// inject:['reload'],

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
					desc:'',
					model_scene:"股价预测",

				},
				rules_model:{
					name:[
						{required: true, message:'任务名称不能为空', trigger:'blur'},
						{min:1, max:16, message:"长度在1-16个字符", trigger:'blur'},
					]
				},
				models:{},//用户可选择的模型,key为模型类型(分类，回归，聚类),value为具体模型[]
				metrics:{},//用户可选择的模型评估方法,key为模型类型(分类，回归，聚类),value为具体方法[]
				dataset_options:[],
				dataset_cols:[],
				//用于目标列中不出现已选择的特征列
				target_cols:[],
				run_code_result:"",
				scenes:["股价预测","气温预测","湿度预测","商品价格预测",
						"成绩等级分类","属性分类","情感/语义评分",
						"地理信息聚类","情感属性聚类"]
			}
		},
		created(){
			this.get_datasets()
			var datasetName=sessionStorage.getItem('dataset_name')
			console.log(this.form)
			if (datasetName!='') {
				this.form.dataset_name=datasetName
				this.get_dataset_cols(datasetName)
			}
			this.get_methods()
			//session是否存在参数缓存，如果存在，则读取缓存参数
			var model_params = sessionStorage.getItem("model_params")
			if (model_params)
				this.form=JSON.parse(model_params)
		},

		//监听所有输入框的变化，实现数据缓存
		watch:{
			form:{
				handler:function(val,oldVal){
					console.log("new:%s,old:%s",val,oldVal)
					sessionStorage.setItem("model_params",JSON.stringify(this.form))
				},
				deep:true
			}
		},
		methods: {
			onSubmit() {
				console.log('submit!');
				// 如果存在之前的运行结果，先清空
				this.run_code_result=""
				axios.post('/api/generate_code',{
					username:JSON.parse(sessionStorage.getItem('user')),
					data:this.form
				}).then((response)=>{
					var code=response.data.data
					this.original_code=code
					this.dialogVisible=true;
				})
			},
			//保存当前查询条件
			saveParams(){
				axios.post('/api/model_selection/save_params',{
					username:JSON.parse(sessionStorage.getItem('user')),
					data:this.form
				}).then((response)=>{
					var code=response.data.data
					if (code===200){
						this.$message.success(response.data.msg)
					}
					else {
						this.$message.warning(response.data.msg)
					}

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

			// 获取数据建模方法
			get_methods(){
				axios.get('api/model_selection/get_methods?type=ml').then(
                    (response) => {
                        var methods = response.data.data
                        this.models = methods
                    }
                )
				axios.get('api/model_selection/get_methods?type=metrics').then(
                    (response) => {
                        var methods = response.data.data
                        this.metrics = methods
                    }
                )
			},
			//选择完数据集后动态生成特征列、目标列下拉框
			onDatasetChange(){
				this.form={
					dataset_name:this.form.dataset_name,
					model_type: '分类',
					features:[],
					target:'',
					model_name: [],
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
			//模型类型发生变化时，清空模型选择，模型评估的内容
			onModelTypeChange(){
				this.form.model_name = []
				this.form.metrics = []
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

			},

			//运行代码文件
			run_code(){
				axios.post('/api/engine/run_mining_code',{
					username:JSON.parse(sessionStorage.getItem('user')),
					data:this.form

				}).then((response)=>{
					var code = response.data.code
					if (code === 200) {
						var data = response.data
						this.$message.success("执行成功")
						var html_name = response.data.data
						console.log(html_name)
						var insert_iframe = '<iframe  src="../../../static/'+html_name+
                                            '" scrolling="yes" style="width: 100%;height: 500px;" frameborder="0"></iframe>'
						this.run_code_result = insert_iframe
						this.dialogVisible = false
					}
					else {
						this.$message.error("运行失败，请确保训练的特征以及清洗完毕")
						this.original_code = response.data.msg
					}

				}).catch(error => {
					console.log(error.response)
					this.$message.error(error.response)
					this.$message.error("配置参数不合理，运行失败！")
				})
			},
		}
	}

</script>