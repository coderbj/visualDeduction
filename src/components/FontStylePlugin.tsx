import './FontStylePlugin.scss'
import {IPluginProps} from '../utils/types.ts'
import {ElCol, ElColorPicker, ElRow, ElSlider, } from 'element-plus'


const FontStylePlugin = ({drawingBoard}: IPluginProps) => {
  const graphics = drawingBoard.getSelectedGraphics()
  // 通用样式切换方法
  const toggleStyle =(
    prop,
    val1,
    val2
  ) => {
    graphics.value[prop] = graphics.value[prop] === val1 ? val2 : val1
  }

  // 文字装饰切换
  const toggleTextDecoration = (type: string, val1, val2) => {
    graphics.value[type] = graphics.value[type] === val1 ? val2 : val1
  }
  return (
    <div>
      <ElRow class="row">
        <ElCol span={24}>
          <p class="title">字号</p>
        </ElCol>
        <ElCol span={24}>
          <ElSlider
            modelValue={graphics.value['fontSize']}
            onUpdate:modelValue={(val) => {
              graphics.value['fontSize'] = val
            }}
            min={12}
            max={50}
          />
        </ElCol>
      </ElRow>
      <ElRow class="row">
        <ElCol span={24}>
          <p class="title">字体样式</p>
        </ElCol>
        <ElCol span={24} class="button-group">
          <i
            className={`icon icon-font_bold ${graphics.value.fontWeight === 'bold' ? 'primary' : 'default'}`}
            type={graphics.value.fontWeight === 'bold' ? 'primary' : 'default'}
            onClick={() => toggleStyle('fontWeight', 'bold', 'normal')}
          >
          </i>
          <i
            className={`icon icon-font_italic ${graphics.value.italic ? 'primary' : 'default'}`}
            onClick={() => toggleStyle('italic', true, false)}
          >
          </i>
          <i
            className={`icon icon-font_under ${graphics.value.textDecoration === 'under' ? 'primary' : 'default'}`}
            onClick={() => toggleTextDecoration('textDecoration', 'under', 'none')}
          >
          </i>
          <i
            className={`icon icon-font_del ${graphics.value.textDecoration === 'delete' ? 'primary' : 'default'}`}
            onClick={() => toggleTextDecoration('textDecoration', 'delete', 'none')}
          >
          </i>
        </ElCol>
      </ElRow>
      <ElRow justify="start" class="row">
        <ElCol span={24}>
          <p class="title">颜色</p>
        </ElCol>
        <ElCol span={12} class="sub-col">
          <p class="subtitle">描边</p>
          <ElColorPicker
            style={'margin-left: 2px'}
            modelValue={graphics.value['stroke']}
            onUpdate:modelValue={(val) => {
              graphics.value['stroke'] = val
            }}
          />
        </ElCol>
        <ElCol span={12} class="sub-col">
          <p class="subtitle">填充</p>
          <ElColorPicker
            style={'margin-left: 2px'}
            modelValue={graphics.value['fill']}
            onUpdate:modelValue={(val) => {
              graphics.value['fill'] = val
            }}
          />
        </ElCol>
      </ElRow>
      <ElRow class="row">
        <ElCol span={24}>
          <p class="title">描边大小</p>
        </ElCol>
        <ElCol span={24}>
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

    </div>
  )
}

export default FontStylePlugin