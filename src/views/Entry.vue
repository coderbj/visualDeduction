<script setup lang="ts">
import {storeToRefs} from 'pinia'
import {useRouter} from 'vue-router'
import {useUserStore} from '@/store/user'
import {CircleCloseFilled, QuestionFilled, UserFilled} from '@element-plus/icons-vue'
import {useGlobalStore} from '@/store/global.ts'

const router = useRouter()
const {userInfo} = storeToRefs(useUserStore())

// 引入本地图片
const avatarImage = () => {
  return new URL('@/assets/images/avatar.svg', import.meta.url).href
}
// 跳转到会前学习
const toSchoolPage = () => {
  router.push('/school')
}
// 跳转到交底信息
const toShareListPage = () => {
  router.push('/share-list')
}
// 跳转到环境设置
const toEnvSetupPage = () => {
  router.push('/env-setup')
}
// 跳转到推演记录
const toTaskRecordsPage = () => {
  router.push('/task-records')
}
// 跳转到用户管理
const toUserPage = () => {
  router.push({name: 'user'})
}
// 跳转到操作说明
const toHelpPage = () => {
  router.push({name: 'help'})
}
// 跳转到登录页
const toLoginPage = () => {
  // 清除用户信息
  useUserStore().clearUserInfo()
  // 清除taskId
  useGlobalStore().clearTaskId()
  router.push({name: 'login'})
}
</script>

<template>
  <div class="entry">
    <div class="header">
      <div class="system-logo">
        <div class="logo"></div>
        <div class="system-name">作业可视化推演系统</div>
      </div>

      <div class="user">
        <el-dropdown placement="bottom-end" trigger="click">
          <span style="display: flex; align-items: center">
            <el-avatar :size="24" :src="avatarImage()"></el-avatar>
            <span class="username">欢迎你，{{ userInfo.username }}</span>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>
                <div class="_unscoped-item" @click="toHelpPage">
                  <el-icon>
                    <QuestionFilled/>
                  </el-icon>
                  <span>操作说明</span>
                </div>
              </el-dropdown-item>
              <el-dropdown-item>
                <div class="_unscoped-item" @click="toUserPage">
                  <el-icon>
                    <UserFilled/>
                  </el-icon>
                  <span>用户管理</span>
                </div>
              </el-dropdown-item>
              <el-dropdown-item>
                <div class="_unscoped-item" @click="toLoginPage">
                  <el-icon>
                    <CircleCloseFilled/>
                  </el-icon>
                  <span>退出登录</span>
                </div>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
    <el-alert
        title="温馨提示"
        type="warning"
        description="为了您的操作体验，请锁定横屏使用"
        show-icon
        center
    />
    <div class="content">
      <div class="item" @click="toSchoolPage">
        <i class="icon"></i>
        <span class="text">会前学习</span>
        <span class="desc">学习相关案例，提高作业安全意识</span>
      </div>
      <div class="item" @click="toShareListPage">
        <i class="icon"></i>
        <span class="text">交底信息</span>
        <span class="desc">添加作业内容与风险点，熟悉注意事项</span>
      </div>
      <div class="item" @click="toEnvSetupPage">
        <i class="icon"></i>
        <span class="text">开始推演</span>
        <span class="desc">进入环境设置，开始新的推演</span>
      </div>
      <div class="item" @click="toTaskRecordsPage">
        <i class="icon"></i>
        <span class="text">推演记录</span>
        <span class="desc">进入推演列表，查看已存在的推演</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.entry {
  display: flex;
  flex-direction: column;
  background: url("@/assets/images/login-bg@1x.webp");
  height: 100%;

  .header {
    padding: 0 20px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100vw;
    height: 60px;
    background: rgba(255, 255, 255, .5);

    .system-logo {
      display: flex;
      align-items: center;

      .logo {
        width: 40px;
        height: 40px;
        background: url('/images/logo.svg') no-repeat;
        background-size: 100% 100%;
      }

      .system-name {
        margin-left: 10px;
        font-weight: bold;
        font-size: $font-size-xxl;
        color: $black;
      }
    }

    .user {
      display: flex;
      align-items: center;

      .username {
        margin-left: 10px;
        user-select: none;
      }
    }
  }
  .el-alert {
    display: none;
  }
  .content {
    padding: 200px;
    box-sizing: border-box;
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;

    .item {
      position: relative;
      width: clamp(200px, 50vw, 600px);
      margin: 0 50px;
      aspect-ratio: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      background: linear-gradient(0deg, #3169DC 0%, #5BCFFF 100%);
      border-radius: 20px;
      font-size: clamp(16px, 2.5vw, 24px);
      cursor: pointer;
      overflow: hidden;
      transition: all 0.3s ease;

      /* 水波纹边框系统 */
      &::before,
      &::after {
        content: '';
        position: absolute;
        border-radius: 20px;
        pointer-events: none;
      }

      /* 静态边框层 */
      &::before {
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        border: 10px solid #8ad6ff;
        box-shadow: 0 0 0 10px #b7e1ff;
        transition: opacity 0.4s ease;
      }

      &::after {
        top: 50%;
        left: 50%;
        width: 0;
        height: 0;
        background: rgba(183, 225, 255, 0.2);
        transform: translate(-50%, -50%);
        opacity: 0;
        transition: width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1),
        height 0.6s cubic-bezier(0.34, 1.56, 0.64, 1),
        opacity 0.4s linear;
      }

      // 内容层级提升
      .icon, .text, .desc {
        position: relative;
        z-index: 1;
      }

      &:hover {
        // 触发波纹扩散
        &::after {
          width: 150%;
          height: 150%;
          opacity: 1;
        }

        // 隐藏原始边框
        &::before {
          opacity: 0;
        }

      }

      .icon {
        width: 214px;
        height: 176px;
        background: url('@/assets/images/icon-entry.webp') no-repeat;
      }
      &:nth-child(1) {
        .icon {
          background-position: 0 0;
        }
      }
      &:nth-child(2) {
        .icon {
          background-position: -214px 0;
        }
      }
      &:nth-child(3) {
        .icon {
          background-position:  -428px 0;
        }
      }
      &:nth-child(4) {
        .icon {
          background-position:-642px 0;
        }
      }


      .text {
        //padding: 0 80px;
        display: inline-block;
        margin-top: 20px;
        font-size: 36px;
        color: $white;
      }

      .desc {
        padding: 0 24px;
        text-align: center;
        margin-top: 30px;
        font-size: 16px;
        color: $white;
      }
    }
  }
}

/*不超过1151， 不小于1024时*/
@media screen and (max-width: 1023px) and (min-width: 800px) {
  .entry {
    .content {
      padding: 30px;
      .item {
        margin: 0 10px;
        .icon {
          width: 60px;
          height: 60px;
          background-size: 400%;
        }
        .text {
          margin-top: 0;
          padding: 0;
          font-size: 28px;
        }
        .desc {
          padding: 0 20px;
          margin-top: 10px;
          text-align: center;
        }

        &:nth-child(1) {
          .icon {
            background-position: 0 0;
          }
        }
        &:nth-child(2) {
          .icon {
            background-position: -60px 0;
          }
        }
        &:nth-child(3) {
          .icon {
            background-position: -120px 0;
          }
        }
        &:nth-child(4) {
          .icon {
            background-position: -180px 0;
          }
        }
      }
    }
  }
}
/*不超过1151， 不小于1024时*/
@media screen and (max-width: 1151px) and (min-width: 1024px) {
  .entry {
    .content {
      padding: 50px;
      .item {
        margin: 0 20px;
        .icon {
          width: 60px;
          height: 60px;
          background-size: 400%;
        }
        .text {
          margin-top: 0;
          padding: 0;
          font-size: 28px;
        }
        .desc {
          padding: 0 20px;
          margin-top: 10px;
          text-align: center;
        }

        &:nth-child(1) {
          .icon {
            background-position: 0 0;
          }
        }
        &:nth-child(2) {
          .icon {
            background-position: -60px 0;
          }
        }
        &:nth-child(3) {
          .icon {
            background-position: -120px 0;
          }
        }
        &:nth-child(4) {
          .icon {
            background-position: -180px 0;
          }
        }
      }
    }
  }
}
/*不超过1279， 不小于1152时*/
@media screen and (max-width: 1279px) and (min-width: 1152px) {
  .entry {
    .content {
      padding: 50px;
      .item {
        margin: 0 20px;
        .icon {
          width: 100px;
          height: 100px;
          background-size: 400%;
        }
        .text {
          margin-top: 0;
          padding: 0;
          font-size: 28px;
        }
        .desc {
          padding: 0 20px;
          margin-top: 10px;
          text-align: center;
        }

        &:nth-child(1) {
          .icon {
            background-position: 0 0;
          }
        }
        &:nth-child(2) {
          .icon {
            background-position: -100px 0;
          }
        }
        &:nth-child(3) {
          .icon {
            background-position: -200px 0;
          }
        }
        &:nth-child(4) {
          .icon {
            background-position: -300px 0;
          }
        }
      }
    }
  }
}
/*不超过1359， 不小于1280时*/
@media screen and (max-width: 1359px) and (min-width: 1280px) {
  .entry {
    .content {
      padding: 50px;
      .item {
        margin: 0 20px;
        .icon {
          width: 100px;
          height: 100px;
          background-size: 400%;
        }
        .text {
          margin-top: 0;
          padding: 0;
          font-size: 28px;
        }
        .desc {
          padding: 0 20px;
          margin-top: 10px;
          text-align: center;
        }

        &:nth-child(1) {
          .icon {
            background-position: 0 0;
          }
        }
        &:nth-child(2) {
          .icon {
            background-position: -100px 0;
          }
        }
        &:nth-child(3) {
          .icon {
            background-position: -200px 0;
          }
        }
        &:nth-child(4) {
          .icon {
            background-position: -300px 0;
          }
        }
      }
    }
  }
}
/*不超过1439， 不小于1360时*/
@media screen and (max-width: 1439px) and (min-width: 1360px) {
  .entry {
    .content {
      padding: 50px;
      .item {
        margin: 0 20px;
        .icon {
          width: 100px;
          height: 100px;
          background-size: 400%;
        }

        .desc {
          margin-top: 10px;
        }

        &:nth-child(1) {
          .icon {
            background-position: 0 0;
          }
        }
        &:nth-child(2) {
          .icon {
            background-position: -100px 0;
          }
        }
        &:nth-child(3) {
          .icon {
            background-position: -200px 0;
          }
        }
        &:nth-child(4) {
          .icon {
            background-position: -300px 0;
          }
        }
      }
    }
  }
}
/*不超过1679， 不小于1440时*/
@media screen and (max-width: 1679px) and (min-width: 1440px) {
  .entry {
    .content {
      padding: 50px;
      .item {
        margin: 0 20px;
        width: clamp(200px, 50vw, 400px);
        height: clamp(100px, 30vh, 400px);

        .icon {
          width: 100px;
          height: 100px;
          background-size: 400%;
        }

        .desc {
          margin-top: 10px;
        }

        &:nth-child(1) {
          .icon {
            background-position: 0 0;
          }
        }
        &:nth-child(2) {
          .icon {
            background-position: -100px 0;
          }
        }
        &:nth-child(3) {
          .icon {
            background-position: -200px 0;
          }
        }
        &:nth-child(4) {
          .icon {
            background-position: -300px 0;
          }
        }
      }
    }
  }
}
/*不超过1767， 不小于1680时*/
@media screen and (max-width: 1767px) and (min-width: 1680px){
  .entry {
    .content {
      padding: 50px;
      .item {
        margin: 0 20px;
        width: clamp(200px, 50vw, 400px);
        height: clamp(100px, 30vh, 400px);
        .icon {
          width: 100px;
          height: 100px;
          background-size: 400%;
        }
        .text {
          margin-top: 5px;
        }
        .desc {
          margin-top: 10px;
        }
        &:nth-child(1) {
          .icon {
            background-position: 0 0;
          }
        }
        &:nth-child(2) {
          .icon {
            background-position: -100px 0;
          }
        }
        &:nth-child(3) {
          .icon {
            background-position: -200px 0;
          }
        }
        &:nth-child(4) {
          .icon {
            background-position: -300px 0;
          }
        }
      }
    }
  }
}
/*不超过1920， 不小于1768时*/
@media screen and (max-width: 1920px) and (min-width: 1768px){
  .entry {
    .content {
      .item {
        margin: 0 20px;
        width: clamp(200px, 50vw, 400px);
        height: clamp(100px, 30vh, 400px);

        .icon {
          width: 100px;
          height: 100px;
          background-size: 400%;
        }
        .desc {
          margin-top: 10px;
        }
        &:nth-child(1) {
          .icon {
            background-position: 0 0;
          }
        }
        &:nth-child(2) {
          .icon {
            background-position: -100px 0;
          }
        }
        &:nth-child(3) {
          .icon {
            background-position: -200px 0;
          }
        }
        &:nth-child(4) {
          .icon {
            background-position: -300px 0;
          }
        }
      }
    }
  }
}

/* 对于 2x 屏幕，使用 @2x 图片 */
@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
  .entry {
    background: url('@/assets/images/login-bg@2x.webp') no-repeat center/cover;
  }
}

// 检测到竖屏
@media (orientation: portrait) {
  .entry {
    .el-alert {
      display: block;
    }
    .content {
      display: flex;
      flex-direction: column;
      justify-content:center;
      align-items: center;
      padding: 0;
      .item {
        display: flex;
        justify-content: center;
        flex-direction: unset;
        margin: 10px 0;
        height: auto;
        aspect-ratio: 1 / .3;
        .icon {
          width: 60px;
          height: 60px;
          background-size: 400%;
        }
        .text {
          margin-top: 0;
          margin-left: 12px;
        }
        .desc {
          display: none;
        }
        &:nth-child(1) {
          .icon {
            background-position: 0 0;
          }
        }
        &:nth-child(2) {
          .icon {
            background-position: -60px 0;
          }
        }
        &:nth-child(3) {
          .icon {
            background-position: -120px 0;
          }
        }
        &:nth-child(4) {
          .icon {
            background-position: -180px 0;
          }
        }
      }
    }
  }
}

</style>
<style>
._unscoped-item {
  display: flex;
  align-items: center;
}
</style>