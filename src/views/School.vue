<script setup lang="ts">
import {ref} from 'vue'
import PageHeader from '@/components/PageHeader.vue'
import {getVideoList} from '@/service/School.ts'
import PageSubheader from '@/components/PageSubheader.vue'
import NoData from '@/components/NoData.vue'
import VideoCover from '@/assets/images/video-cover.svg'

const videoList = ref([])
const PageIndex = ref(1)
const PageSize = ref(1000)
const searchValue = ref('')
const filterValue = ref('')
const count = ref(0)
// 动态标题
const dynamicTitle = ref('危险作业')

const videoUrl = (url: string) => {
  return BASE_URL+'/' + url
}

const getVideoListData = async () => {
  const res = await getVideoList({
    PageIndex: PageIndex.value,
    PageSize: PageSize.value,
    name: searchValue.value,
    zuoye_type: filterValue.value
  })
  if(res.code === 1) {
    videoList.value = res.data
    count.value = res.count
  } else {
    count.value = 0
  }
}
getVideoListData()

const handleFilterChange = () => {
  if(filterValue.value === '') {
    dynamicTitle.value = '危险作业'
  } else {
    dynamicTitle.value = filterValue.value
  }
  getVideoListData()
}
</script>

<template>
  <div class="school">
    <PageHeader title="会前学习"/>
    <div class="banner">
      <div class="title">全面视频详解，掌握<span class="stress">{{dynamicTitle}}</span>操作</div>
    </div>
    <PageSubheader class="page-subheader">
      <template #default>
        <div class="filters">
          <div class="title">筛选：</div>
          <el-radio-group v-model="filterValue" @change="handleFilterChange">
            <el-radio-button label="全部" value=""/>
            <el-radio-button label="吊装作业" value="吊装作业"/>
            <el-radio-button label="动火作业" value="动火作业"/>
            <el-radio-button label="动土作业" value="动土作业"/>
            <el-radio-button label="高处作业" value="高处作业"/>
            <el-radio-button label="临时用电作业" value="临时用电作业"/>
            <el-radio-button label="盲板抽堵作业" value="盲板抽堵作业"/>
            <el-radio-button label="受限空间作业" value="受限空间作业"/>
          </el-radio-group>
        </div>
      </template>
    </PageSubheader>
    <div class="content">
      <PageHeader title="视频" :back="false"/>
      <div class="video-wrapper" v-if="count">
        <div class="video-item" v-for="item in videoList" :key="item.id">
          <div class="cover-font">{{item.video_name}}</div>
          <video class="video" width="100%" height="auto" :poster="VideoCover" :src="videoUrl(item.video_url)" controls/>
        </div>
      </div>
      <NoData :size="10" v-else/>
    </div>
  </div>
</template>

<style scoped lang="scss">
.school {
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100dvh;

  .banner {
    height: 100px;
    background: url("@/assets/images/school-banner.webp") no-repeat center/cover;
    display: flex;
    justify-content: center;
    align-items: center;

    .title {
      font-weight: bold;
      font-size: $font-size-xxxxl;

      .stress {
        color: $primary-color;
      }
    }
  }

  .filters {
    display: flex;
    align-items: center;

    .title {
      white-space: nowrap;
      margin-right: 10px;
    }

    :deep(.el-radio-group) {
      .el-radio-button {
        margin: 5px 5px 5px 0;

        .el-radio-button__inner {
          box-sizing: content-box;
          border: 1px solid var(--el-border-color);
          border-radius: var(--el-border-radius-base);
        }

        &.is-active {
          .el-radio-button__inner {
            border-color: var(--el-radio-button-checked-border-color);
          }
        }
      }
    }
  }

  .content {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: auto;

    .video-wrapper {
      padding: 20px 0;
      box-sizing: border-box;
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr)); /* 始终保持三列 */
      gap: 20px; /* 卡片间距 */
      max-width: 1200px; /* 可选最大宽度 */
      margin: 0 auto; /* 居中布局 */

      .video-item {
        position: relative;
        width: 300px;
        border-radius: 8px;
        overflow: hidden;

        .cover-font {
          position: absolute;
          left: 20px;
          top: 20px;
          font-size: $font-size-xxl;
          font-weight: bold;
          color: white;
          z-index: 9;
        }

        .video {
          display: block;
          object-fit: cover;
        }

      }
    }
  }
}
</style>