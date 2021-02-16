# 一、Vue 开发
## 1、循环v-for
 ### 1.1 循环数组
 ```vue
 <div id="app">
  <ol>
    <li v-for="site in sites">
      {{ site.name }}
    </li>
  </ol>
</div>
 
<script>
new Vue({
  el: '#app',
  data: {
    sites: [
      { name: 'Runoob' },
      { name: 'Google' },
      { name: 'Taobao' }
    ]
  }
})
</script>
```

### 1.2 迭代对象
主要三种方法迭代
- 迭代对象中的value `value in opject`
- 迭代对象中的key,value `(value,key) in object`
- 迭代对象中的key,value,index `(value,key,index) in object`
```vue
<div id="app">
  <ul>
    <li v-for="value in object">
    {{ value }}
    </li>
  </ul>
</div>
 
<script>
new Vue({
  el: '#app',
  data: {
    object: {
      name: '菜鸟教程',
      url: 'http://www.runoob.com',
      slogan: '学的不仅是技术，更是梦想！'
    }
  }
})
</script>

```

## 2、监听属性watch
通过wacth响应数据变化。$watch是一个实例化的对象，通过两个参数`监听的变量，变量数据改变的回调函数`
- 实例   
    data 属性中， kilometers 和 meters 初始值都为 0。watch 对象创建了两个方法 kilometers 和 meters。

当我们再输入框输入数据时，watch 会实时监听数据变化并改变自身的值
```vue
<div id = "computed_props">
    千米 : <input type = "text" v-model = "kilometers">
    米 : <input type = "text" v-model = "meters">
</div>
<p id="info"></p>
<script type = "text/javascript">
    var vm = new Vue({
    el: '#computed_props',
    data: {
        kilometers : 0,
        meters:0
    },
    methods: {
    },
    computed :{
    },
    watch : {
        kilometers:function(val) {
            this.kilometers = val;
            this.meters = this.kilometers * 1000
        },
        meters : function (val) {
            this.kilometers = val/ 1000;
            this.meters = val;
        }
    }
    });
    // $watch 是一个实例方法
    vm.$watch('kilometers', function (newValue, oldValue) {
    // 这个回调将在 vm.kilometers 改变后调用
    document.getElementById ("info").innerHTML = "修改前值为: " + oldValue + "，修改后值为: " + newValue;
})
</script>
```

## 3、表单
### 3.1 v-model
修饰符
- .lazy    
.lazy在默认情况下， v-model 在 input 事件中同步输入框的值与数据，但你可以添加一个修饰符 lazy ，从而转变为在 change 事件中同步：   

- .number   
如果想自动将用户的输入值转为 Number 类型（如果原值的转换结果为 NaN 则返回原值），可以添加一个修饰符 number 给 v-model 来处理输入值：
`<input v-model.number="age" type="number">`

- .trim
如果要自动过滤用户输入的首尾空格，可以添加 trim 修饰符到 v-model 上过滤输入：
`<input v-model.trim="msg">`

## 4、Vue组件开发
## 4.1 全局组件
所有实例都能用全局组件。
```vue
<div id="app">
    <runoob></runoob>
</div>
 
<script>
// 注册
Vue.component('runoob', {
  template: '<h1>自定义组件!</h1>'
})
// 创建根实例
new Vue({
  el: '#app'
})
</script>
```
# 二、Element UI
## 1 表格el_table
当`el-table`元素中注入`data`对象数组后，   
在`el-table-column`中用`prop`属性来对应对象中的键名即可填入数据，用`label`属性来定义表格的列名。可以使用`width`属性来定义列宽。
## 2 文件上传按钮el-upload
### ①基本操作
```html
<el-upload :action="uploadActionUrl">
    <el-button size="small" type="primary">点击上传</el-button>
</el-upload>
```
`:action`是执行上传动作的后台接口   
`el-button`是触发上传的按钮

### ②文件上传数量限制
```html
<el-upload 
    :action="uploadActionUrl"
    multiple
    :limit="3"
    :on-exceed="handleExceed">
    <el-button size="small" type="primary">点击上传</el-button>
</el-upload>
```
`multiple`设置是否同时选中多个文件   
`:limit` 设置最多上传文件数量
`on-exceed` 绑定方法处理超出数量后的动作
#### 上传格式+大小限制
```html
<el-upload 
    :action="uploadActionUrl"
    accept="image/jpeg,image/gif,image/png"
    :before-upload="onBeforeUpload"
    multiple
    :limit="3"
    :on-exceed="handleExceed">
    <el-button size="small" type="primary">点击上传</el-button>
    <div slot="tip" class="el-upload__tip">请上传图片格式文件</div>
</el-upload>
```
---
# 附录 排除记录
1、axios请求后端接口（代理已配置无误）前端报错   
 原因：使用mock会拦截所有的ajax请求，因此浏览器无法从后端服务器找到路径
 
 2、vue在页面加载时this显示为空
 - 原因：混合使用了普通函数和箭头函数（具体错误原因在axios的回调函数中使用了箭头函数）使得this的指向发生了变化
 - 解决方法：将回调函数以匿名函数的形式使用，methods中尽量通过普通函数定义，避免箭头函数的使用