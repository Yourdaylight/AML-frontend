<template>
	<section>

		 <el-upload
				 drag
				accept=".csv, .txt, .xls, .xlsx"
				action="/api/upload_dataset"
				 :data="user_info"
				:limit="1"
				:before-upload="beforeUpload"
				:on-success="handleAvatarSuccess"
				 :on-error="handleError"

		>
		  <el-button size="small" type="primary">
			<span class="iconfont icon-shangchuan" />上传文件
		  </el-button>
		</el-upload>
		<span style="color: orange">上传文件仅支持 csv,txt,xls,xlsx类型</span>

		<el-table :data="tableData" style="width: 100%">
			<el-table-column prop="address" label="序号" width="180"></el-table-column>
			<el-table-column prop="date" label="上传时间" width="180"></el-table-column>
			<el-table-column prop="name" label="数据集名称" width="180"></el-table-column>

			<el-table-column label="操作" width="180">
				<template slot-scope="scope">
				  <el-button size="mini" type="danger" @click="del(scope.row, scope.$index)">删除</el-button>
				</template>
		    </el-table-column>

			<el-table-column label="数据预览" width="180">
				<template slot-scope="scope">
				  <el-button size="mini" type="primary" @click="jump(scope.row, scope.$index)">预览</el-button>
				</template>
		    </el-table-column>
		</el-table>

	</section>
</template>

<script>
	import util from '../../common/js/util'
	import axios from 'axios';
	// import { getDataList } from '../../api/api';

	export default {
		data(){
			console.log(this.$route)
			return {
				tableData: [],
				list:"name",
				isloading:false,
				user_info:{
					"username":sessionStorage.getItem('user')
				}

			}
		},

		mounted () {

			var body=this.data_list()
			console.log(body)

  		},
		inject:['reload'],
		methods:{
			formatDate(date) {
				  var date = new Date(date);
				  var YY = date.getFullYear() + '-';
				  var MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
				  var DD = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
				  var hh = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
				  var mm = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
				  var ss = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
				  return YY + MM + DD +" "+hh + mm + ss;
			},
			//获取用户的所有数据集
			data_list(){
			    var dataset_list=[]
				var username=sessionStorage.getItem('user')
				axios.get('/api/get_data_list?username='+username)
						.then((response)=>{
							this.isloading=true
							var original=response.data.data
							var len=original.name.length
							for (var i=0;i<len;i++){
							        var temp=original.name[i]
									this.tableData.push({
										date:this.formatDate(original.upload_time[i]*1000),
										name:temp,
										address:i+1
									})
                                    dataset_list.push(temp)
							}
							this.isloading=false
                            sessionStorage.setItem("dataset_list",JSON.stringify(dataset_list))

						})
						.catch((error)=>{
							this.isloading=false
						})
			},
			//文件上传检验
			beforeUpload(file) {
			  const fileSuffix = file.name.substring(file.name.lastIndexOf(".") + 1);
			  const whiteList = ["csv","txt","xls", "xlsx"];
			  if (whiteList.indexOf(fileSuffix) === -1) {
				this.$message("上传文件只能是 csv、txt、xls、xlsx格式", "error");
				return false;
			  }
			  const isLt15M = file.size / 1024 / 1024 < 15;
			  if (!isLt15M) {
				this.$message("上传文件大小不能超过 15MB", "error");
				return false;
			  }
			},
			//上传成功回调
			handleAvatarSuccess(response, file,fileList) {
				console.log("上传成功!")
				this.$message("上传成功!",'info')
				//清空上传列表
				this.reload()
			},
			//上传失败回调
			handleError(err, file, fileList) {
				console.log("上传失败")
				var message = err.message
				var body = message.substring(4, message.length)
				var erro = JSON.parse(body)
				console.log(erro)
				this.$message("上传失败!  " + erro.msg, 'warning')
			},
			//删除指定数据集文件
			del(row,index){
				axios.post('/api/del_dataset',{
							dataset_name:row.name,
							username:sessionStorage.getItem('user')
				}).then((response)=> {
							console.log("查看返回值:",response.data)
							var body=response.data
							if (body.code==200)
								this.$message("删除成功","info")
							else
								this.$message("删除失败","error")
							this.reload()
						}
				)
			},
			//跳转到数据预览页面
			jump(row,index){
				sessionStorage.setItem('dataset_name',row.name)
				this.$router.push({ path: '/user' });
			}


		},

	}



</script>

<style scoped>
.el-col {
    border-radius: 4px;
  }

</style>