import './Menu.scss'
import {defineComponent} from 'vue'
import {ElTooltip, ElButton} from 'element-plus'
import {Delete, FullScreen,Download} from '@element-plus/icons-vue'
import App from '../utils/App'

export default defineComponent({
  name: 'Menu',
  setup() {
    const fullScreen = () => {
      let ele = document.documentElement
      if (ele.requestFullscreen) {
        ele.requestFullscreen();
      } else if (ele.mozRequestFullScreen) {
        ele.mozRequestFullScreen();
      } else if (ele.webkitRequestFullscreen) {
        ele.webkitRequestFullscreen();
      } else if (ele.msRequestFullscreen) {
        ele.msRequestFullscreen();
      }
    }

    return () => (
      <div className="menu">
        <ElTooltip effect="dark" content='清空' placement="top-start">
          <ElButton onClick={() => App.drawingBoardInstance.leaferInstanceReadonly.sky.clear()} icon={Delete} circle></ElButton>
        </ElTooltip>
        <ElTooltip effect="dark" content='导出' placement="top-start">
          <ElButton onClick={() => App.drawingBoardInstance.leaferInstanceReadonly.export('画板.png')} icon={Download} circle></ElButton>
        </ElTooltip>
        <ElTooltip effect="dark" content='全屏' placement="top-start">
          <ElButton onClick={() => fullScreen()} icon={FullScreen} circle></ElButton>
        </ElTooltip>
      </div>
    )
  },
})

