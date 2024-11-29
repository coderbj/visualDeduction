<script setup lang="ts">

</script>

<template>
  <header class="app-header">
    <div class="system-logo">
      <div class="logo"></div>
      <div class="system-name">作业前可视化推演</div>
    </div>
    <div class="header-tool"></div>
    <div class="weather">
      <div class="item">
        <div class="icon icon-sun"></div>
        <div class="text">晴</div>
      </div>
      <div class="item">
        <div class="icon icon-thermometer"></div>
        <div class="text">36.7</div>
      </div>
      <div class="item">
        <div class="icon icon-navigation"></div>
        <div class="text">西北风</div>
      </div>
      <div class="item">
        <div class="icon icon-wind"></div>
        <div class="text">三级</div>
      </div>
    </div>
  </header>
</template>

<style scoped lang="scss">
.app-header {
  display: flex;
  width: 100%;
  height: 40px;
  border-bottom: 1px solid #eee;
  box-sizing: border-box;
  background: white;
  .system-logo {
    display: flex;
    align-items: center;
    padding: 0 20px;
    .logo {
      width: 20px;
      height: 20px;
      background: url('../assets/images/vite.svg') no-repeat;
      background-size: 100% 100%;
    }
    .system-name {
      margin-left: 10px;
      font-weight: bold;
      font-size: 18px;
    }
  }

  .header-tool {
    flex: 1;
    background: red;
  }

  .weather {
    display: flex;

    .item {
      display: flex;
      align-items: center;
      padding: 0 10px;
      .icon {
        padding: 5px;
      }
      .text {
        font-size: 14px;
      }
    }
  }
}
</style>