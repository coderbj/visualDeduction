import './TopBar.scss'
import App from '../utils/App.ts'
import {toolsOptions} from '../utils/Tools.ts'
import {defineComponent, computed,} from 'vue'

export default defineComponent({
  name: 'TopBar',
  setup() {
    const getClass = computed(() => (idx: number) => {
        if (!App.drawingBoardInstance) return ''
        return App.drawingBoardInstance?.tools?.toolsActiveIndex.value === idx ? 'active' : ''
    })

    const selectTool = (index: number) => {
      if (App.drawingBoardInstance?.tools?.toolsActiveIndex.value === index) return
      App.drawingBoardInstance!.tools!.toolsActiveIndex.value = index
    }

    return () => (
      <div className='top-tools'>
        {
          toolsOptions.map((item, index) => {
            return (
              <div className={`tool ${getClass.value(index)}`} key={index} onClick={() => selectTool(index)}>
                <i className={`icon ${item.icon}`}></i>
              </div>
            )
          })
        }
      </div>
    )
  },
})

