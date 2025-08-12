<script setup lang="ts">
import AppHeader from '@/components/AppHeader.vue'
import PageHeader from '@/components/PageHeader.vue'

const toHelpDetailPage = (type:string) => {
  if(type === 'drones'){
    window.open('./docs/DJI_Mini_4_Pro_User_Manual_CHS.pdf')
  }else if(type === 'software'){
    window.open('./docs/Software_Operation_Instructions_v1.0_zh_cn.pdf')
  }
}


</script>

<template>
  <div class="help">
    <AppHeader/>
    <div class="container">
      <PageHeader title="操作指导"></PageHeader>
      <div class="grid-container">
        <div class="grid-item" @click="toHelpDetailPage('drones')">
          <i class="icon"></i>
          <span class="text">无人机操作指导书</span>
          <i class="icon-enter"></i>
        </div>
        <div class="grid-item" @click="toHelpDetailPage('software')">
          <i class="icon"></i>
          <span class="text">软件操作指导书</span>
          <i class="icon-enter"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.help {
  width: 100vw;
  height: 100dvh;

  .container {
    padding: 20px;
    box-sizing: border-box;
    width: 100%;
    height: calc(100% - 40px);

    .grid-container {
      padding: 20px;
      box-sizing: border-box;
      display: flex;
      justify-content: center;
      align-items: center;
      height: calc(100% - 60px);

      .grid-item {
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        min-width: 300px;
        margin: 0 30px;
        padding: 20px;
        font-size: 30px;
        color: #222;
        aspect-ratio: 1 / 1;
        border-radius: 20px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        border: 8px solid $white;
        user-select: none;
        cursor: pointer;

        .icon {
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 64px;
          width: 250px;
          height: 250px;
          background: rgba(255, 255, 255, 0.7);
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
          border-radius: 50%;
        }

        .text {
          margin-top: 20px;
          font-weight: bold;
          font-size: 32px;
          color: $black;
        }

        .icon-enter {
          color: #86c2ff;
          font-size: 30px;
          position: absolute;
          right: 15px;
          bottom: 8px;
        }

        &:nth-child(1) {
          .icon {
            background: url("@/assets/images/drones.svg") no-repeat center;
          }
        }

        &:nth-child(2) {
          .icon {
            background: url("@/assets/images/software.svg") no-repeat center;
          }
        }
      }
    }
  }
}


</style>