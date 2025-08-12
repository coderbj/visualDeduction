import './GraphicsAttributeMenu.scss'
import {computed, defineComponent, toRef,} from 'vue'
import App from '../utils/App.ts'
import {useResourceStore} from '../store/resource.ts'
import {storeToRefs} from 'pinia'
import LineSegmentSizePlugin from '../components/LineSegmentSizePlugin.tsx'
import ResourceDescriptionPlugin from '../components/ResourceDescriptionPlugin.tsx'
import ResourceRemarkPlugin from '@/components/ResourceRemarkPlugin.tsx'
import FontStylePlugin from '@/components/FontStylePlugin.tsx'

export default defineComponent({
  name: 'GraphicsAttributeMenu',
  setup() {
    const {parentIndex} = storeToRefs(useResourceStore())
    const parentIndexMap = {
      '图形': () => [LineSegmentSizePlugin,ResourceRemarkPlugin], // 图形
      '工器具': () => [ResourceDescriptionPlugin,ResourceRemarkPlugin], // 工器具
      '防护': () => [ResourceDescriptionPlugin,ResourceRemarkPlugin], // 防护
      '人员': () => [ResourceDescriptionPlugin,ResourceRemarkPlugin], // 人员
      '车辆': () => [ResourceDescriptionPlugin,ResourceRemarkPlugin], // 车辆
      '隐患': () => [ResourceDescriptionPlugin,ResourceRemarkPlugin], // 隐患
      '标注': () => [ResourceRemarkPlugin], // 标注
      '文字': () => [FontStylePlugin, ResourceRemarkPlugin], // 文字
      '警戒线': () => [ResourceRemarkPlugin], // 警戒线
    };

    const activeResource = computed(() => {
      const index = parentIndex.value
      const resourceFunction = parentIndexMap[index]
      return resourceFunction? resourceFunction() : []
    })

    // 折叠菜单
    const foldMenu = () => {
      const attributeMenu = document.querySelector('.attribute-menu')
      const menuTitle = document.querySelector('.menu-title')
      attributeMenu?.classList.toggle('fold')
      menuTitle?.classList.toggle('icon-plus-square')
      menuTitle?.classList.toggle('icon-minus-square')
    }

    // 判断是否选中了图形
    const selectedGraphics = toRef(App.drawingBoardInstance?.selectedGraphics)

    return () => (
      <div>
        {
          selectedGraphics.value && selectedGraphics.value.parentIndex ? <div className="attribute-menu">
            {(selectedGraphics.value.remark || selectedGraphics.value.description || selectedGraphics.value.name === 'textTool') && (
              <div className="menu-title icon-minus-square" onclick={foldMenu}></div>
            )}
            {(selectedGraphics.value.remark || selectedGraphics.value.description || selectedGraphics.value.name === 'textTool') && (
              <div class="menu-content">
                {
                  activeResource.value.map((MenuPlugin) => {
                    return (
                      <div className="toolbarMenuOption">
                        <MenuPlugin drawingBoard={App.drawingBoardInstance}/>
                      </div>
                    )
                  })
                }
              </div>
            )}
          </div> : null
        }
      </div>
    )
  }
})