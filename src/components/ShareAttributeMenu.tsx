import './ShareAttributeMenu.scss'
import {computed, defineComponent,} from 'vue'
import App from '../utils/App.ts'
import {useResourceStore} from '../store/resource.ts'
import {storeToRefs} from 'pinia'
import LineSegmentSizePlugin from '../components/LineSegmentSizePlugin.tsx'
import ResourceDescriptionPlugin from '../components/ResourceDescriptionPlugin.tsx'
import ResourceRemarkPlugin from '@/components/ResourceRemarkPlugin.tsx'

export default defineComponent({
  name: 'ShareAttributeMenu',
  setup() {
    const {parentIndex} = storeToRefs(useResourceStore())
    const parentIndexMap = {
      1: () => [LineSegmentSizePlugin,ResourceRemarkPlugin],
      2: () => [ResourceDescriptionPlugin,ResourceRemarkPlugin],
      3: () => [ResourceDescriptionPlugin,ResourceRemarkPlugin],
      4: () => [ResourceDescriptionPlugin,ResourceRemarkPlugin],
      5: () => [ResourceDescriptionPlugin,ResourceRemarkPlugin],
      6: () => [ResourceDescriptionPlugin,ResourceRemarkPlugin],
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
    const selectedGraphics = App.shareBoardInstance?.selectedGraphics
    return () => (
      <div>
        {
          selectedGraphics.value && selectedGraphics.value.parentIndex ? <div className="attribute-menu">
            <div class="menu-title icon-minus-square" onclick={foldMenu}></div>
            <div class="menu-content">
              {
                activeResource.value.map((MenuPlugin) => {
                  return (
                    <div className="toolbarMenuOption">
                      <MenuPlugin drawingBoard={App.shareBoardInstance}/>
                    </div>
                  )
                })
              }
            </div>
          </div> : null
        }
      </div>
    )
  }
})