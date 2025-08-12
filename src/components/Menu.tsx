import './Menu.scss'
import {defineComponent} from 'vue'
import { ElButton,ElIcon} from 'element-plus'
import {ref, Ref} from 'vue'
import App from '../utils/App'
import {ArrowLeft, ArrowRight} from '@element-plus/icons-vue'
import {storeToRefs} from 'pinia'
import {useGlobalStore} from '@/store/global.ts'
const {isLock} = storeToRefs(useGlobalStore())

export default defineComponent({
  name: 'Menu',
  setup() {
    const isFullScreen: Ref<boolean> = ref(false)
    const fullScreen = () => {
      let ele = document.documentElement
      if (!isFullScreen.value) {
        ele.requestFullscreen && ele.requestFullscreen()
        isFullScreen.value = true
      } else {
        document.exitFullscreen && document.exitFullscreen()
        isFullScreen.value = false
      }
      // 重绘画板
      App.drawingBoardInstance.contentFrame.updateLayout()
    }

    return () => (
     !isLock.value && <div className="menu">
        <div className={'item'}>
          <ElButton circle onClick={() => App.drawingBoardInstance.historyBack()} icon={ArrowLeft}></ElButton>
          <span className={'text'}>撤销</span>
        </div>
       <div className={'item'}>
         <ElButton circle onClick={() => App.drawingBoardInstance.historyUnBack()} icon={ArrowRight}></ElButton>
         <span className={'text'}>恢复</span>
       </div>
       <div className={'item'}>
         <ElButton circle onClick={() => App.drawingBoardInstance.clearBoard()}>
           <ElIcon><i className='icon-x-square'></i></ElIcon>
         </ElButton>
         <span className={'text'}>清空</span>
       </div>
       <div className={'item'}>
         <ElButton circle onClick={() => App.drawingBoardInstance.changePicture()}>
           <ElIcon><i className='icon-rotate-ccw'></i></ElIcon>
         </ElButton>
         <span className={'text'}>重来</span>
       </div>

        {/*<ElTooltip effect="dark" content="导出" placement="top-start" auto-close={1000} trigger="click">
          <ElButton circle onClick={() => App.drawingBoardInstance.contentFrame.export('画板.png')}>
            <ElIcon><i className='icon-download'></i></ElIcon>
          </ElButton>
        </ElTooltip>*/}

       <div className={'item'}>
         <ElButton circle onClick={() => fullScreen()}>
           <ElIcon><i className={isFullScreen.value ? 'icon-minimize':'icon-maximize' }></i></ElIcon>
         </ElButton>
         <span className={'text'}>全屏</span>
       </div>
      </div>
    )
  },
})

