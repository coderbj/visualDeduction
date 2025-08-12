import './LineSegmentSizePlugin.scss'
import {ElRow, ElCol, ElSlider, ElColorPicker} from 'element-plus'
import {IPluginProps} from '../utils/types.ts'

const LineSegmentSizePlugin = ({drawingBoard}: IPluginProps) => {
  const graphics = drawingBoard.getSelectedGraphics()
  return (
    <div>
      <ElRow class="row">
        <ElCol span={24}>
          <p class="title">描边</p>
        </ElCol>
        <ElCol span={24}>
          <p class="subtitle-block">粗细</p>
          <ElSlider
            modelValue={graphics.value['strokeWidth']}
            onUpdate:modelValue={(val) => {
              graphics.value['strokeWidth'] = val
            }}
            min={0}
            max={20}
          />
        </ElCol>
      </ElRow>
      <ElRow justify="start" class="row">
        <ElCol span={24}>
          <p class="title">颜色</p>
        </ElCol>
        <ElCol span={12} class="sub-col">
          <p class="subtitle">描边颜色</p>
          <ElColorPicker
            modelValue={graphics.value['stroke']}
            onUpdate:modelValue={(val) => {
              graphics.value['stroke'] = val
            }}
          />
        </ElCol>
        <ElCol span={12} class="sub-col">
          <p class="subtitle">填充颜色</p>
          <ElColorPicker
            modelValue={graphics.value['fill']}
            onUpdate:modelValue={(val) => {
              graphics.value['fill'] = val
            }}
          />
        </ElCol>
      </ElRow>
      <ElRow class="row">
        <ElCol span={24}>
          <p class="title">透明度</p>
        </ElCol>
        <ElCol span={24}>
          <ElSlider
            modelValue={graphics.value['opacity']}
            onUpdate:modelValue={(val) => {
              graphics.value['opacity'] = val
            }}
            min={0}
            max={1}
            step={0.1}
          />
        </ElCol>
      </ElRow>
      {graphics.value.tag !== 'Ellipse'&& graphics.value.tag !== 'Line' && (
        <ElRow class="row">
          <ElCol span={24}>
            <p class="title">圆角</p>
          </ElCol>
          <ElCol span={24}>
            <ElSlider
              modelValue={graphics.value['cornerRadius']}
              onUpdate:modelValue={(val) => {
                graphics.value['cornerRadius'] = val
              }}
              min={0}
              max={50}
            />
          </ElCol>
        </ElRow>
      )}
      {
        graphics.value.tag === 'Polygon' && (
          <ElRow class="row">
            <ElCol span={24}>
              <p class="title">边数</p>
            </ElCol>
            <ElCol span={24}>
              <ElSlider
                modelValue={graphics.value['sides']}
                onUpdate:modelValue={(val) => {
                  graphics.value['sides'] = val
                }}
                min={3}
                max={12}
              />
            </ElCol>
          </ElRow>
        )
      }
    </div>
  )
}


export default LineSegmentSizePlugin