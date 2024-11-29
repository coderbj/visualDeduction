import './ResourceDescriptionPlugin.scss'
import {ElCard} from 'element-plus'
import {IPluginProps} from '../utils/types.ts'


const ResourceDescriptionPlugin = ({drawingBoard}: IPluginProps) => {
  const graphics = drawingBoard.getSelectedGraphics()

  return (
    <div>
      <ElCard style="max-width: 480px" shadow="never" v-slots={{
        header: () => (
          <div class="card-header">
            <span class="card-header-title">信息</span>
          </div>
        )
      }}>
        <p class="description">{graphics.value.description}</p>
      </ElCard>
    </div>
  )
}

export default ResourceDescriptionPlugin