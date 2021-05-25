<template>
    <section>
        <el-table :data="historyList" style="width: 100%">
            <el-table-column prop="name" label="任务名称" width="120"></el-table-column>
            <el-table-column prop="dataset_name" label="数据集名称" width="120"></el-table-column>
            <el-table-column prop="target" label="目标列" width="120"></el-table-column>
            <el-table-column prop="features" label="特征列" width="120"></el-table-column>
            <el-table-column prop="model_type" label="模型类型" width="120"></el-table-column>
            <el-table-column prop="model_name" label="模型名称" width="120"></el-table-column>
            <el-table-column prop="evaluate_methods" label="模型评估方法" width="120"></el-table-column>
            <el-table-column prop="model_scene" label="模型使用场景" width="120"></el-table-column>

            <el-table-column label="快速建模" width="120">
                <template slot-scope="scope">
                    <el-button size="mini" type="warning" @click="build_model(scope.row,scope.$index)">快速建模</el-button>
                </template>
            </el-table-column>

            <el-table-column label="删除" width="120">
                <template slot-scope="scope">
                    <el-button size="mini" type="danger" @click="del_history(scope.row,scope.$index)">删除</el-button>
                </template>
            </el-table-column>


        </el-table>
    </section>
</template>

<script>
    import axios from 'axios'

    axios.defaults.withCredentials = true;

    export default {
        data() {
            return {
                historyList: []
            }
        },
        created() {
            this.history_list()
        },
        inject:['reload'],
        methods: {
            history_list() {
                var username = sessionStorage.getItem('user')
                axios.get('/api/get_history_list?username=' + JSON.parse(username))
                    .then((response) => {
                        var data = response.data.data
                        var len = data.length
                        for (var i = 0; i < len; i++) {
                            this.historyList.push(data[i])
                        }
                    })
            },

			// 将历史记录的各参数，转换成构建模型的参数形式
			build_model(row,index){
				var list_fields = ["features","model_name","evaluate_methods"]
				var model_params = {}
				for(var key in row){
					model_params[key] = list_fields.indexOf(key)>-1 ? row[key].split(","):row[key]
				}
				sessionStorage.setItem("model_params",JSON.stringify(model_params))
                sessionStorage.setItem("dataset_name",model_params["dataset_name"])
				this.$router.push({path:'/MLmodel'})
			},

            // 删除历史记录
            del_history(row, index){
                var del_task_name = row.name
                var username = JSON.parse(sessionStorage.getItem("user"))
                axios.post('/api/model_selection/delete_history',
                    {
                        "username":username,
                        "name":row.name
                    })
                    .then((response) => {
                        	console.log("查看返回值:",response.data)
							var body=response.data
							if (body.code==200) {
                                this.$message.success("删除成功！")
                                this.reload()
                            }
							else
								this.$message.error("删除失败")
                    })
            }
        }

    }

</script>