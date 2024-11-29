import DrawingBoard from './DrawingBoard.ts'
import {IAppProps} from './types.ts'

class App {
  static drawingBoardInstance:null | DrawingBoard = null

  static init = ({domId}:IAppProps) => {
    this.drawingBoardInstance = new DrawingBoard({domId})
    //this.drawingBoardInstance.setBgImage('./images/map.jpg', 1920, 1422)
  }

  static destroy = () => {
    this.drawingBoardInstance && this.drawingBoardInstance.destroy()
  }
}

export default App