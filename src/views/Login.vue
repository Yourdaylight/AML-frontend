<template>
    <el-form :model="ruleForm2" :rules="rulesLogin" ref="ruleForm2" label-position="left" label-width="0px"
             class="demo-ruleForm login-container">
        <h3 class="title">系统登录</h3>
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
            <el-form :model="registform" :rules="rulesRegist" :label-position="left">
                <el-form-item label="用户名">
                    <el-input v-model="registform.username" type="text"></el-input>
                </el-form-item>
                <el-form-item label="密码">
                    <el-input v-model="registform.password" type="password"></el-input>
                </el-form-item>
                <el-form-item label="确认密码">
                    <el-input v-model="registform.checkpassword" type="password"></el-input>
                </el-form-item>
                <el-form-item label="注册邮箱">
                    <el-input v-model="registform.email" type="email"></el-input>
                </el-form-item>
                <el-form-item label="验证码">
                    <el-input v-mode="registform.checkcode"></el-input>
                    <el-button type="original">获取验证码</el-button>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
           <el-button @click="dialogVisible = false">取 消</el-button>
           <el-button type="primary" @click="dialogVisible = false">立即注册</el-button>
         </span>
        </el-dialog>
    </el-form>

    <!--注册组件弹框-->

</template>

<script>

    //import NProgress from 'nprogress'
    export default {
        data() {
            var validateNull=(rule,value,callback)=>{
                    if (value===''){
                        callback(new Error("输入不能为空!"))
                    }
                };

            return {
                logining: false,
                ruleForm2: {
                    account: 'admin',
                    checkPass: '123456'
                },
                rulesLogin: {
                    account: [
                        {required: true, message: '请输入账号', trigger: 'blur'},
                        //{ validator: validaePass }
                    ],
                    checkPass: [
                        {required: true, message: '请输入密码', trigger: 'blur'},
                        //{ validator: validaePass2 }
                    ]
                },
                rulesRegist:{
                    username:[
                        {required:true,message:'请输入用户名',trigger:'blur'},
                        {min:1,max:16,message:"长度在1-16个字符",trigger:'blur'}
                    ],
                    password:[
                        {required:true,message:'请输入密码',trigger:'blur'},
                        {min:6,max:16,message:"长度在6-16个字符",trigger:'blur'}
                    ]
                },
                checked: false,
                registform: {
                    username: '',
                    password: '',
                    checkpassword: '',
                    email: '',
                    checkcode: ''
                },
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
            handleSubmit2: function (ev) {
                var _this = this;
                this.$refs.ruleForm2.validate((valid) => {
                    if (valid) {
                        //_this.$router.replace('/table');
                        this.logining = true;
                        //NProgress.start();
                        var loginParams = {
                            username: this.ruleForm2.account,
                            password: this.ruleForm2.checkPass
                        };

                        this.logining = false;
                        var user = 'admin'
                        sessionStorage.setItem('user', JSON.stringify(user));
                        sessionStorage.setItem('dataset_name', '')
                        this.$router.push({path: '/table'});
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });

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