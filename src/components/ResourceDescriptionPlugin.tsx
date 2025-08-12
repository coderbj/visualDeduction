import './ResourceDescriptionPlugin.scss'
import {IPluginProps} from '../utils/types.ts'


const ResourceDescriptionPlugin = ({drawingBoard}: IPluginProps) => {
  const graphics = drawingBoard.getSelectedGraphics()

  return (
    <div className="resource-description">
        <div class="card-header">
          <span class="card-header-title">描述</span>
        </div>
      <div class="card-body">
        <p className="description">
          {graphics.value && graphics.value.description? graphics.value.description : '暂无描述'}
        </p>
      </div>
    </div>
  )
}

export default ResourceDescriptionPlugin