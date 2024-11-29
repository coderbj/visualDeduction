import './GraphicsAttributeMenu.scss'
import {computed, defineComponent} from 'vue'
import App from '../utils/App.ts'
import {toolsData} from '../utils/Resource.ts'

export default defineComponent({
  name: 'GraphicsAttributeMenu',
  setup() {
    const activeResourceIndex = App.drawingBoardInstance?.activeResourceIndex
    const activeResource = computed(() => {
      return toolsData[activeResourceIndex.value].plugins
    })
    // 判断是否选中了图形
    const selectedGraphics = App.drawingBoardInstance?.selectedGraphics
    return () => (
      <div>
        {
          selectedGraphics.value && selectedGraphics.value.resourceName ? <div className="attribute-menu">
            {
              activeResource.value.map((MenuPlugin) => {
                return (
                  <div className="toolbarMenuOption">
                    <MenuPlugin drawingBoard={App.drawingBoardInstance}/>
                  </div>
                )
              })
            }
          </div> : null
        }
      </div>
    )
  }
})