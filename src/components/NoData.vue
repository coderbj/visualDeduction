<template>
  <div class="no-data-block">
    <img class="img" draggable="false"  src="~@/assets/images/no-data.svg" alt="无数据">
    <p class="text">{{text}}</p>
  </div>
</template>

<script setup>
const props = defineProps({
  text:{
    type:String,
    default:'暂无数据'
  },
  size:{
    type:Number,
    default:20
  }
})
</script>

<style scoped lang="scss">
.no-data-block {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
  text-align: center;
  width: v-bind('props.size + "%"');
  user-select: none;
  .text {
    display: inline-block;
    padding-top: 20px;
    text-align: center;
    white-space: nowrap;
  }
}
</style>
