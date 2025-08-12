import './ResourceRemarkPlugin.scss'
import {IPluginProps} from '../utils/types.ts'

const ResourceRemarkPlugin = ({drawingBoard}: IPluginProps) => {
  const graphics = drawingBoard.getSelectedGraphics()
  return (
    graphics?.value?.remark && (<div className="resource-remark">
        <div class="card-header">
          <span class="card-header-title">相关要求</span>
        </div>
      <div class="card-body">
        <p class="description">{graphics.value.remark}</p>
      </div>
    </div>)
  )
}

export default ResourceRemarkPlugin