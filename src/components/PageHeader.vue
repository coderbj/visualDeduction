<script setup lang="ts">
import {computed} from 'vue'
import {ArrowLeftBold} from '@element-plus/icons-vue'

const props = defineProps({
  title: {
    type: String,
    required: true,
    default: '标题',
  },
  back: {
    type: Boolean,
    default: true,
  }
})
const processedTitle = computed(() => {
  // 这里可以进行各种字符串加工操作，例如添加前缀
  return props.title.split(',')
})
</script>

<template>
  <div class="page-header">
    <div class="title">
      <div class="back" @click="() => $router.go(-1)" v-if="back">
        <el-button :icon="ArrowLeftBold" circle/>
      </div>
      <div class="t-content" v-for="(item, index) in processedTitle" :key="item">
        <i class="icon-back" v-if="index"></i>
        <span class="text" :class="{normal:index}">{{ item }}</span>
      </div>
    </div>
    <div class="center">
      <slot name="center"></slot>
    </div>
    <div class="operate">
      <slot name="operate"></slot>
    </div>
  </div>
</template>

<style scoped lang="scss">
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 60px;

  .back {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 5px;
  }

  .title {
    display: flex;
    margin-left: 20px;

    .t-content {
      display: flex;
      align-items: center;
      .icon-back {
        font-size: 24px;
        padding: 0 5px;
        color: #86c2ff;
      }

      .text {
        font-size: 24px;
        font-weight: bold;
        line-height: 60px;

        &.normal{
          font-weight: normal;
        }
      }
    }
  }

  .center {
    width: 300px;
  }
}
</style>