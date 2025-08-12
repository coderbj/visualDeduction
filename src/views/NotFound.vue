<template>
  <div class="not-found">
    <div class="content">
      <img src="@/assets/images/404.svg" class="four0four" alt="404">
      <div class="text">哎哟，找不到页面~</div>
      <el-button class="back-home" @click="backHome" type="primary">返回首页</el-button>
    </div>
  </div>
</template>

<script>
import {useRouter} from 'vue-router'

export default {
  name: "not-found",
  setup() {
    const router = useRouter()
    const backHome = ()=> {
      router.push({
        path:'/'
      })
    }
    return {
      backHome
    }
  }
}
</script>

<style scoped lang="scss">
.not-found {
  position: fixed;
  overflow: hidden;
  left: 0;
  bottom: 0;
  top: 0;
  right: 0;

  .content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    width: 25%;
    .back-home {
      margin-top: 20px;
    }

    .four0four {
      display: inline-block;
      max-width: 100%;
      height: auto;
    }
    .text {
      text-align: center;
      font-size: 18px;
    }
  }
}

@media screen and (max-width: 751px) and (min-width: 320px){
  .content {
    width:200px!important;
    top:150px
  }
}





</style>
