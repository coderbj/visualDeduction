<script setup lang="ts">

</script>

<template>
  <router-view/>
</template>

<style scoped lang="scss">
</style>
<style>
/*全局滚动条修改*/
::-webkit-scrollbar{
  width:5px;
  height:5px;
}
::-webkit-scrollbar-track{
  background: rgb(239, 239, 239);
  border-radius:5px;
}
::-webkit-scrollbar-thumb{
  background: #afafb5;
  border-radius:5px;
}
::-webkit-scrollbar-thumb:hover{
  background: #69717e;
}
::-webkit-scrollbar-corner{
  background: #4f555e;
}
</style>
