<template>
  <div id="userLayout">
    <div class="userLayout_left">
      <img src="@/assets/login/Group51.png" alt="" />
    </div>
    <div class="userLayout_right">
      <div class="login_panle_form">
        <div class="login_panle_form_title">用户登录</div>
        <el-form
          ref="loginForm"
          :model="loginFormData"
          :rules="rules"
          @keyup.enter="submitForm">
          <el-form-item prop="username">
            <el-input
              v-model="loginFormData.username"
              placeholder="请输入用户名">
              <template #prefix>
                <img
                  src="@/assets/login/Group27.png"
                  class="input-icon"
                  alt="" />
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="loginFormData.password"
              type="password"
              placeholder="请输入密码"
              @show-password.prevent>
              <template #prefix>
                <img
                  src="@/assets/login/Group31.png"
                  class="input-icon"
                  alt="" />
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="captcha">
            <div class="vPicBox">
              <el-input
                v-model="loginFormData.captcha"
                placeholder="请输入验证码"
                style="width: 50%">
                <template #prefix>
                  <img
                    src="@/assets/login/Group32.png"
                    class="input-icon"
                    alt="" />
                </template>
              </el-input>

              <div class="vPic">
                <img
                  v-if="picPath"
                  :src="picPath"
                  alt="请输入验证码"
                  @click="loginVerify()" />
              </div>
            </div>
          </el-form-item>
          <el-checkbox v-model="loginFormData.rememberMe" size="large"
            >记住账号密码</el-checkbox
          >
          <el-form-item>
            <el-button
              type="primary"
              size="large"
              style="width: 100%"
              @click="submitForm">
              登 录
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="login_panle"></div>
  </div>
</template>
<script>
export default {
  name: 'Login',
};
</script>

<script setup>
import { captcha } from '@/api/user';
import Cookies from 'js-cookie';
import { reactive, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { useUserStore } from '@/pinia/modules/user';
import { encrypt } from '@/utils/rsaEncrypt';
// 验证函数
const checkUsername = (rule, value, callback) => {
  if (value.length === null) {
    return callback(new Error('请输入正确的用户名'));
  } else {
    callback();
  }
};
const checkPassword = (rule, value, callback) => {
  if (value.length === null) {
    return callback(new Error('请输入正确的密码'));
  } else {
    callback();
  }
};

// 获取验证码
const loginVerify = () => {
  captcha({}).then(ele => {
    rules.captcha[1].max = ele.data.captchaLength;
    rules.captcha[1].min = ele.data.captchaLength;
    picPath.value = ele.data.picPath;
    loginFormData.captchaId = ele.data.captchaId;
  });
};
loginVerify();
//Remberme
const remberme = () => {
  if (Cookies.get('rememberMe')) {
    loginFormData.username = Cookies.get().username;
    loginFormData.password = Cookies.get().password;
  }
};

const loginForm = ref(null);
const picPath = ref('');
const loginFormData = reactive({
  username: '',
  password: '',
  captcha: '',
  captchaId: '',
  rememberMe: false,
});
remberme();
const rules = reactive({
  username: [{ validator: checkUsername, trigger: 'blur' }],
  password: [{ validator: checkPassword, trigger: 'blur' }],
  captcha: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    {
      message: '验证码格式不正确',
      trigger: 'blur',
    },
  ],
});
// 实例化状态仓库
const userStore = useUserStore();

const login = async () => {
  const str = JSON.stringify(loginFormData);
  const data = JSON.parse(str);
  data.password = encrypt(data.password);
  return await userStore.LoginIn(data);
};
const submitForm = () => {
  //规则校验
  loginForm.value.validate(async v => {
    if (v) {
      const flag = true;
      console.log(flag);
      if (!flag) {
        loginVerify();
      } else {
        if (loginFormData.rememberMe) {
          Cookies.set('username', loginFormData.username, { expires: 5 });
          Cookies.set('password', loginFormData.password, { expires: 5 });
          Cookies.set('rememberMe', loginFormData.rememberMe, { expires: 5 });
        } else {
          Cookies.remove('username');
          Cookies.remove('password');
          Cookies.remove('rememberMe');
        }
      }
    } else {
      console.log('登录失败');
      ElMessage({
        type: 'error',
        message: '请正确填写登录信息',
        showClose: true,
      });
      loginVerify();
      return false;
    }
  });
};

// 跳转初始化
// const checkInit = async () => {
//   const res = await checkDB();
//   if (res.code === 0) {
//     if (res.data?.needInit) {
//       userStore.NeedInit();
//       router.push({ name: 'Init' });
//     } else {
//       ElMessage({
//         type: 'info',
//         message: '已配置数据库信息，无法初始化',
//       });
//     }
//   }
// };
</script>

<style lang="scss" scoped>
@import '@/style/newLogin.scss';
</style>
