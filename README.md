#接口(除了登录均为get)
## 0、POST `/api/login`
- 提交表单
```json
    {
      "username": "",
      "password": ""
    }
```
- 返回值(0为成功，1为失败。状态1时msg显示对应错误提示)
```json
{
    "msg":"登录成功",
    "status":0
}
```


## 1、GET `/api/get_data_list`
- 参数：无   
- 返回值：
```json
{
    "data_list": [
        "hour",
        "day"
    ]
}
```

## 2、 展示单个数据集(数据预览)GET `/api/show_data_set?dataset=`
- 参数:数据集名称（接口1中的返回数据(eg:hour,day)）
```json
{
  "dataset_name": ""
}
```
- 返回值:为整个数据集。遍历整个Json，其中每组key为列名(json字符串)，value（json数组）为该列中的所有元素


## 3、 POST 数据集参数 `/api/generate_code`
- 参数:快速构建中的各个参数
```json
{
    "name": "",
    "model_type": "",
    "model_choose": [],
    "metrics": [],
    "search_params": ""
}
```
返回值:自动生成的代码内容(String)

---
## 导航一
### 一、我的数据集
字段名称:id、数据名称、修改时间、数据集大小
操作：预览、删除
### 二、数据预览
字段名称：根据接口返回数据设置
数据格式：key为列名称,value为列中对应的值

### 三、快速建模
返回值以弹出层展示