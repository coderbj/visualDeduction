<script setup lang="ts">
import { reactive } from 'vue'
import {useRouter} from 'vue-router'
import {verify} from '@/service/Login.ts'
import {ElMessage} from 'element-plus'
import {useUserStore} from '@/store/user.ts'

const router = useRouter()
const {setUserInfo} = useUserStore()

const form = reactive({
  username: '',
  password: ''
})

const handleSubmit = async () => {
  const res = await verify(form)
  if(res.code === 1 && res.data.length > 0) {
    const userinfo = res.data[0]
    setUserInfo(userinfo)
    router.push('/entry')
  } else {
    ElMessage.error(res.msg)
  }
}
</script>


<template>

  <div class="login">
    <div class="system-name">作业可视化推演系统</div>
    <div class="login-container">
      <div class="logo"><img src="/images/logo.svg" alt=""></div>
      <div class="login-title">管理员登录</div>
      <el-form label-position="top">
        <div class="username">
          <el-form-item label="用户名">
            <el-input v-model="form.username" size="large" placeholder="请输入用户名">
            </el-input>
          </el-form-item>
        </div>
        <div class="password">
          <el-form-item label="密码" >
            <el-input v-model="form.password" size="large" placeholder="请输入密码" type="password" show-password>
            </el-input>
          </el-form-item>

        </div>
        <div class="login-btn">
          <el-button class="submit" type="primary" size="large" @click="handleSubmit">登录</el-button>
        </div>
      </el-form>
      <div class="blur">

      </div>
      <div class="pic"></div>
    </div>
    <div class="footer">
<!--      <a class="link">www.baidu.com</a>
      <a class="link" target="_blank">鲁ICP备2023041104</a>
      <a class="link" target="_blank">鲁公网安备37021002001165</a>-->
    </div>
  </div>
</template>

<style scoped lang="scss">
.login {
  width :100vw;
  height :100%;
  background: url("@/assets/images/login-bg@1x.webp") no-repeat 50%;
  .system-name {
    position: absolute;
    top: 100px;
    left: 50%;
    z-index: 9;
    transform: translateX(-50%);
    font-weight: bold;
    font-size: $font-size-xxxxl;
    animation: h-move 45s linear infinite alternate;
    background: url(@/assets/images/sea-flur.jpg) no-repeat 50%;
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  .login-container {
    position: relative;
    z-index: 1;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 500px;
    background: transparent;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
    border-radius: 24px;

    .login-title {
      width: 100%;
      color: $gray-800;
      text-align: center;
      font-size: $font-size-xxxl;
      h2 {
        text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
      }
    }
    .logo {
      margin: 0 auto;
      padding: 15px;
      box-sizing: border-box;
      width: 90px;
      height: 90px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .el-form {
      padding: 55px 40px 40px 40px;
      box-sizing: border-box;
      :deep(.el-input__wrapper) {
        box-shadow: none;
        &.is-focus {
          box-shadow: 0 0 0 1px $primary-color inset;
        }
      }
      .username {
        width: 100%;
      }
      .password {
        margin-top: 20px;
        width: 100%;
      }
      .login-btn {
        text-align: center;
        margin-top: 40px;
        width: 100%;
        .submit {
          width: 100%;
        }
      }
    }
    .blur {
      box-sizing: border-box;
      position: absolute;
      z-index: -1;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background: rgba(255, 255, 255, 0.5);
      backdrop-filter: blur(30px);
      -webkit-backdrop-filter: blur(30px);
      border-radius: 24px;
      overflow: hidden;
    }
    .pic {
      position: absolute;
      z-index: -2;
      left: 20px;
      top: 0;
      width: 100%;
      height: 100%;
      background-size: 80%;
      background: url("/images/logo.svg") no-repeat;
      overflow: hidden;
    }
  }
  .footer{
    position: absolute;
    bottom: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    .link {
      padding: 0 12px;
      color: $gray-700;
      font-size: $font-size-xs;
      cursor: pointer;
    }
  }
}

@keyframes h-move {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 100% 0;
  }
}

// 当设备屏幕的宽度小于或等于 1023 像素时，该媒体查询条件成立
@media only screen and (max-width: 1023px) {
  .login {
    padding: 16px;
    box-sizing: border-box;
    .system-name {
      top: 30px;
      font-size: $font-size-xxxl;
    }
    .login-container {
      width: 50%;

      .el-form {
        padding: 20px;

        .password {
          margin-top: 10px;
        }
        .login-btn {
          margin-top: 10px;
        }
      }

      .login-title {
        font-size: $font-size-xl;
      }

      .pic {
        background-size: 80%;
      }
    }
    .footer {
      display: none;
    }
  }
}
@media screen and (max-width: 1152px) and (min-width: 1024px) {
  .login {
    padding: 16px;
    box-sizing: border-box;
    .system-name {
      top: 30px;
      font-size: $font-size-xxxl;
    }
    .login-container {
      width: 50%;

      .el-form {
        padding: 20px;

        .password {
          margin-top: 10px;
        }
        .login-btn {
          margin-top: 10px;
        }
      }

      .login-title {
        font-size: $font-size-xl;
      }

      .pic {
        background-size: 80%;
      }
    }
    .footer {
      display: none;
    }
  }
}
@media screen and (max-width: 1279px) and (min-width: 1152px){
  .login {
    //padding: 16px;
    box-sizing: border-box;
    .system-name {
      top: 30px;
      font-size: $font-size-xxxxl;
    }
    .login-container {
      width: 60%;

      .el-form {
        padding: 20px 40px 20px 40px;

        .password {
          margin-top: 10px;
        }
        .login-btn {
          margin-top: 40px;
        }
      }

      .login-title {
        font-size: $font-size-xxl;
      }

      .pic {
        background-size: 80%;
      }
    }
    .footer {
      display: none;
    }
  }
}
@media screen and (max-width: 1359px) and (min-width: 1280px){
  .login {
    padding: 16px;
    box-sizing: border-box;
    .system-name {
      top: 30px;
      font-size: $font-size-xxxxl;
    }
    .login-container {
      width: 60%;

      .el-form {
        padding: 55px 40px 40px 40px;

        .password {
          margin-top: 10px;
        }
        .login-btn {
          margin-top: 40px;
        }
      }

      .login-title {
        font-size: $font-size-xxl;
      }

      .pic {
        background-size: 80%;
      }
    }
    .footer {
      display: none;
    }
  }
}
@media screen and (max-width: 1439px) and (min-width: 1360px){
  .login {
    padding: 16px;
    box-sizing: border-box;
    .system-name {
      top: 60px;
      font-size: $font-size-xxxxl;
    }
    .login-container {
      width: 60%;

      .el-form {
        padding: 55px 40px 40px 40px;

        .password {
          margin-top: 10px;
        }
        .login-btn {
          margin-top: 40px;
        }
      }

      .login-title {
        font-size: $font-size-xxxl;
      }

      .pic {
        background-size: 80%;
      }
    }
    .footer {
      display: none;
    }
  }
}



/* 对于 2x 屏幕，使用 @2x 图片 */
@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
  .login {
    background-image: url('@/assets/images/login-bg@2x.webp');
  }
}
</style>