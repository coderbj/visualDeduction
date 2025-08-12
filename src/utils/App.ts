import DrawingBoard from './DrawingBoard.ts'
import ShareBoard from './ShareBoard.ts'
import {IAppProps} from './types.ts'

class App {
  static drawingBoardInstance:null | DrawingBoard = null // 画板实例
  static shareBoardInstance:null | ShareBoard = null // 推送实例
  // 初始化画板实例
  static init = ({domId}:IAppProps) => {
    this.drawingBoardInstance = new DrawingBoard({domId})
  }
  // 初始化推送实例
  static initShare = ({domId}:IAppProps) => {
    this.shareBoardInstance = new ShareBoard({domId})
  }
  // 销毁画板实例
  static destroy = () => {
    this.drawingBoardInstance && this.drawingBoardInstance.destroy()
  }
  // 销毁推送实例
  static destroyShare = () => {
    this.shareBoardInstance && this.shareBoardInstance.destroy()
  }
}

export default App