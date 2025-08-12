import './TopBar.scss'
import App from '../utils/App.ts'
import {toolsOptions} from '../utils/Tools.ts'
import {defineComponent, computed,} from 'vue'
import {ElTooltip} from 'element-plus'
import {useGlobalStore} from '../store/global.ts'
import {storeToRefs} from 'pinia'
import {checkPicture} from '../utils/RegisterGlobalFunctions.ts'

export default defineComponent({
  name: 'TopBar',
  setup() {
    const {isPicture,animation, isLock} = storeToRefs(useGlobalStore())
    const getClass = computed(() => (idx: number) => {
        if (!App.drawingBoardInstance) return ''
        return App.drawingBoardInstance?.tools?.toolsActiveIndex.value === idx ? 'active' : ''
    })

    const selectTool = (index: number) => {
      if(!checkPicture(isPicture.value)) {
        animation.value = 'animate__shakeX'
        // 清除动画
        document.querySelector('.select-image').addEventListener('animationend', function() {
          animation.value = ''
        });
        return
      }
      if (App.drawingBoardInstance?.tools?.toolsActiveIndex.value === index) return
      App.drawingBoardInstance!.tools!.toolsActiveIndex.value = index
    }

    return () => (
      !isLock.value? <div className='top-tools'>
        {
          toolsOptions.map((item, index) => {
            return (
              <ElTooltip
                effect="dark"
                placement="bottom"
                key={index}
                content={item.title}
                auto-close={1000}
                trigger="click"
              >
                <div>
                  <div className={`tool ${getClass.value(index)}`} onClick={() => selectTool(index)}>
                    <i className={`icon ${item.icon}`}></i>
                  </div>
                </div>
              </ElTooltip>
            )
          })
        }
      </div> : null
    )
  },
})

