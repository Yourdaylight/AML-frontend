<template>
    <el-form :model="ruleForm2" :rules="rulesLogin" ref="ruleForm2" label-position="left" label-width="0px"
             class="demo-ruleForm login-container">
        <h3 class="title">机器学习代码生成器-登录</h3>
        <el-form-item prop="account">
            <el-input type="text" v-model="ruleForm2.account" auto-complete="off" placeholder="账号"></el-input>
        </el-form-item>
        <el-form-item prop="checkPass">
            <el-input type="password" v-model="ruleForm2.checkPass" auto-complete="off" placeholder="密码"></el-input>
        </el-form-item>
        <el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox>

        <a href="#" @click="handleRegist" style="margin-left:25%">没有账号？立即注册</a>
        <el-form-item style="width:100%;">
            <el-button type="primary" style="width:100%;" @click.native.prevent="handleSubmit2" :loading="logining">登录
            </el-button>
            <!--      <el-button @click.native.prevent="handleReset2">重置</el-button>-->
        </el-form-item>

        <!--    注册弹框-->
        <el-dialog title="注册" :visible.sync="dialogVisible" :close-on-click-modal="true" :modal="true"
                   :show-close="true" :center="true">
            <el-form :model="registform" :rules="rulesRegist" ref="registform" label-position="left">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="registform.username" type="text"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="registform.password" type="password"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="checkpassword">
                    <el-input v-model="registform.checkpassword" type="password"></el-input>
                </el-form-item>
                <el-form-item label="注册邮箱" prop="email">
                    <el-input v-model="registform.email" type="email"></el-input>
                </el-form-item>
                <el-form-item label="验证码" prop="checkcode">
                    <el-input v-model="registform.checkcode"></el-input>
                    <el-button type="original" @click="getCode" :disabled="isDiabled">{{buttonName}}</el-button>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
               <el-button @click="dialogVisible = false">取 消</el-button>
               <el-button type="primary" @click.native.prevent="handleRegistSubmit">立即注册</el-button>
             </span>
        </el-dialog>
    </el-form>

    <!--注册组件弹框-->

</template>

<script>
    import axios from 'axios'
    axios.defaults.withCredentials=true;
    //import NProgress from 'nprogress'
    let Base64 = require('js-base64').Base64
    export default {
        data() {

            var validatePassword=(rule,value,callback)=>{
                    if (value===''){
                        callback(new Error("输入不能为空!"))
                    }else if (this.registform.password!=value){
                        callback(new Error("两次密码输入不一致"))
                    } else {
                        callback()
                    }
                };

            var validateUserExist=(rule,value,callback)=>{
                  if (value===''){
                        callback(new Error("输入不能为空!"))
                    }
                  axios.post("/api/check_exist",{
                      "query_dict":{"username":value}
                  }).then((response)=>{
                      var data=response.data
                      if (data.msg===true){
                          callback(new Error("该用户名已存在"))
                      }
                      else
                          callback()
                  })


            };
             var validateEmailExist=(rule,value,callback)=>{
                  if (value===''){
                        callback(new Error("输入不能为空!"))
                    }
                  axios.post("/api/check_exist",{
                      "query_dict":{"email":value}
                  }).then((response)=>{
                      var data=response.data
                      if (data.msg){
                          callback(new Error("该邮箱号已注册"))
                      }else
                          callback()
                  })

            }

            return {
                logining: false,
                ruleForm2: {
                    account: '',
                    checkPass: ''
                },
                rulesLogin: {
                    account: [
                        {required: true, message: '请输入账号', trigger: 'blur'},
                        //{ validator: validaePass }
                    ],
                    checkPass: [
                        {required: true, message: '请输入密码', trigger: 'blur'},
                    ]
                },

                registform: {
                    username: '',
                    password: '',
                    checkpassword: '',
                    email: '',
                    checkcode: ''
                },
                rulesRegist:{
                    username:[
                        {required: true, message:'请输入用户名', trigger:'blur'},
                        {min:1, max:16, message:"长度在1-16个字符", trigger:'blur'},
                        {validator:validateUserExist,trigger:'blur'}
                    ],
                    password:[
                        {required:true,message:'请输入密码',trigger:'blur'},
                        {min:6,max:16,message:"长度在6-16个字符",trigger:'blur'}
                    ],
                    checkpassword:[
                        {validator:validatePassword}
                    ],
                    email:[
                        { required: true, message: '请输入邮箱地址', trigger: 'blur' },
                        { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] },
                        {validator:validateEmailExist,trigger:'blur'}
                    ],
                    checkcode:[
                        {required: true, message: '请输入验证码', trigger: 'blur'}
                    ]
                },
                checked: false,
                isDiabled:false,//验证码发送按钮
                buttonName:"获取验证码",
                dialogVisible: false
            };
        },
        methods: {
            handleRegist() {
                this.dialogVisible = true
            },
            handleReset2() {
                this.$refs.ruleForm2.resetFields();
            },
            handleSubmit2(ev) {
                var _this = this;
                this.$refs.ruleForm2.validate((valid) => {
                    if (valid) {
                        //_this.$router.replace('/table');
                        this.logining = true;
                        axios.post("/api/login",{
                            username: this.ruleForm2.account,
                            password: Base64.encode(this.ruleForm2.checkPass)
                        }).then((response)=>{
                            var data=response.data
                            if (data.msg===true) {
                                this.logining = false;
                                var user =this.ruleForm2.account
                                console.log(user)
                                sessionStorage.setItem('user', JSON.stringify(user));
                                sessionStorage.setItem('dataset_name', '')
                                this.$router.push({path: '/table'});
                                this.$message.success("登录成功")
                            }else {
                                this.logining = false;
                                this.$message.error("用户名或密码错误，登录失败")
                            }
                        })
                    } else {
                        console.log('error submit!!');
                        this.$message.error("用户名或密码错误，登录失败")
                        return false;
                    }
                })},

            handleRegistSubmit(){
                var _this = this;
                var flag=false
                this.$refs.registform.validate((valid) => {
                    if (valid) {
                        console.log("表单校验通过!")
                        flag=true
                        axios.post('/api/regist',{
                            username:this.registform.username,
                            password:Base64.encode(this.registform.password),
                            email:this.registform.email,
                            checkcode:this.registform.checkcode
                        }).then((response)=> {
                            var data=response.data
                            this.$refs['registform'].resetFields()
                            this.dialogVisible=false
                            this.$message.success(data.msg)
                            }).catch((error)=>{
                                console.log(error.response.data)
                                 var data=error.response.data
                                this.$message.error(data.msg)
                        })
                    } else {
                        this.$message.error("请先正确填写表单")
                    }
                })

            },
            getCode(){
                    let me = this;
                    this.isDiabled=true
                    axios.post('api/send_code',{
                        "email":this.registform.email
                    })
                    var totalTime=60
					let clock=window.setInterval(()=>{
					    totalTime--
                        this.buttonName=totalTime+ "s后重新发送"
                        if (totalTime < 0) {     //当倒计时小于0时清除定时器
                            window.clearInterval(clock)
                            this.buttonName= '重新获取验证码'
                            totalTime = 60
                            this.isDiabled=false
                        }
                    },1000)
            }
        }
    }

</script>

<style lang="scss" scoped>
    .login-container {
        /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
        -webkit-border-radius: 5px;
        border-radius: 5px;
        -moz-border-radius: 5px;
        background-clip: padding-box;
        margin: 180px auto;
        width: 350px;
        padding: 35px 35px 15px 35px;
        background: #fff;
        border: 1px solid #eaeaea;
        box-shadow: 0 0 25px #cac6c6;

        .title {
            margin: 0px auto 40px auto;
            text-align: center;
            color: #505458;
        }

        .remember {
            margin: 0px 0px 35px 0px;
        }
    }
</style>