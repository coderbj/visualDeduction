<script setup lang="ts">
import {ref} from 'vue'
import {useRouter} from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'
import PageHeader from '@/components/PageHeader.vue'
import NoData from '@/components/NoData.vue'


const router = useRouter()
const toLibraryListPage = (type)=> {
  router.push({
    name: 'library-type',
    query: {
      type,
    },
  })
}

const colors = [
  '#2d64d8',
  '#d63232',
  '#ba7c0d',
  '#30aed8',
  '#FF8C33',
  '#4f299a',
  '#27560f',
]
const libraryList = ref([
  {id: 1, type: '吊装作业', icon: 'icon-diaozhuang'},
  {id: 2, type: '动火作业', icon: 'icon-donghuo'},
  {id: 3, type: '动土作业', icon: 'icon-dongtu'},
  {id: 4, type: '高处作业', icon: 'icon-gaochu'},
  {id: 5, type: '临时用电作业', icon: 'icon-lindian'},
  {id: 6, type: '盲板抽堵作业', icon: 'icon-mangban'},
  {id: 7, type: '受限空间作业', icon: 'icon-shouxian'},
])
const getList = async () => {

}
getList()

</script>

<template>
  <div class="library">
    <AppHeader/>
    <div class="container">
      <PageHeader title="要素库管理"></PageHeader>
      <div class="grid-container" v-if="libraryList.length">
        <div class="grid-item"
             @click="toLibraryListPage(item.type)"
             v-for="(item, index) in libraryList"
             :key="item.id">
          <i class="icon" :class="item.icon" :style="{color:colors[index]}"></i>
          <i class="icon-bg" :class="item.icon"></i>
          <span class="text">{{item.type}}</span>
          <i class="icon-enter"></i>
        </div>
      </div>
      <NoData v-else/>
    </div>
  </div>
</template>

<style scoped lang="scss">
.library {
  width: 100vw;
  height: 100vh;

  .container {
    padding: 20px;
    box-sizing: border-box;
    width: 100%;
    height: calc(100% - 40px);

    .grid-container {
      padding: 20px;
      box-sizing: border-box;
      display: grid;
      justify-content: center;
      align-content: start;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
      overflow: auto;
      height: calc(100% - 60px);

      .grid-item {
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 20px 0;
        box-sizing: border-box;
        overflow: hidden;
        font-size: 30px;
        color: #222;
        //aspect-ratio: 2 / 1;
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
          width: 80px;
          height: 80px;
          background: rgba(255, 255, 255, 0.7);
          border-radius: 50%;
        }

        .icon-bg {
          position: absolute;
          top: 0;
          left: -30px;
          font-size: 7em;
          color: rgba(0,0,0,0.05);
        }

        .text {
          margin-top: 10px;
          font-weight: bold;
          font-size: 24px;
          color: $black;
        }
        .icon-enter {
          color: $black;
          font-size: 30px;
          position: absolute;
          right: 15px;
          bottom: 8px;
        }
      }
    }
  }


}
</style>