/*
class ToolbarManager {
  private static instance: ToolbarManager;
  private currentToolbar: Group | null = null;
  private leafer: Leafer;

  private constructor(leafer: Leafer) {
    this.leafer = leafer;
  }

  public static getInstance(leafer: Leafer): ToolbarManager {
    if (!ToolbarManager.instance) {
      ToolbarManager.instance = new ToolbarManager(leafer);
    }
    return ToolbarManager.instance;
  }

  // 根据元素类型切换工具条
  public showToolbar(target: Graphic) {
    // 先移除旧工具条
    if (this.currentToolbar) {
      this.leafer.remove(this.currentToolbar);
      this.currentToolbar = null;
    }

    // 根据类型创建新工具条
    switch (target.tag) {
      case 'Rect':
        this.currentToolbar = this.createRectToolbar(target);
        break;
      case 'Star':
        this.currentToolbar = this.createStarToolbar(target);
        break;
      // 添加更多类型...
    }

    // 添加并定位工具条
    if (this.currentToolbar) {
      this.leafer.add(this.currentToolbar);
      this.updatePosition(target);
    }
  }

  private createRectToolbar(target: Graphic): Group {
    const toolbar = new Group();

    // 删除按钮
    const deleteBtn = this.createButton(
      './images/icon-del.svg',
      () => this.leafer.remove(target) // 绑定当前元素的删除操作
    );
    deleteBtn.x = 35;

    toolbar.add(deleteBtn);
    return toolbar;
  }

  private createStarToolbar(target: Graphic): Group {
    const toolbar = new Group();

    // 编辑按钮
    const editBtn = this.createButton(
      './images/icon-edit.svg',
      () => this.onEditStar(target) // 绑定当前元素的编辑操作
    );
    editBtn.x = -35;

    toolbar.add(editBtn);
    return toolbar;
  }

  private createButton(icon: string, onClick: Function): Box {
    return new Box({
      tag: 'Button',
      width: 30,
      height: 30,
      fill: '#fefefe',
      stroke: '#dfdfdf',
      cornerRadius: 3,
      cursor: 'pointer',
      hoverStyle: { fill: '#eee' },
      event: { tap: () => onClick() },
      children: [{
        tag: 'Icon',
        width: 16,
        height: 16,
        x: 7,
        y: 7,
        fill: { type: 'image', url: icon }
      }]
    });
  }

  // 更新工具条位置（可扩展为跟随元素移动）
  private updatePosition(target: Graphic) {
    if (this.currentToolbar) {
      const bounds = target.getBounds();
      this.currentToolbar.x = bounds.x + bounds.width / 2;
      this.currentToolbar.y = bounds.y - 40;
    }
  }

  private onEditStar(star: Graphic) {
    // 实现具体的星星编辑逻辑
    console.log('Editing star:', star);
  }
}*/
