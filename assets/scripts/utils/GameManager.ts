import { _decorator, Component, director, Node, UITransform } from "cc";
const { ccclass, property } = _decorator;

@ccclass("GameManager")
export class GameManager extends Component {
    @property(Node)
    bg: Node = null;
    protected onLoad(): void {
        director.addPersistRootNode(this.node);
        // 确保唯一性：如果实例已存在，则销毁新创建的实例
        if (GameManager._instance && GameManager._instance !== this) {
            this.node.destroy();
            return;
        }
        GameManager._instance = this;
    }
    private constructor() {
        super();
    }
    private static _instance: GameManager = null;
    static getInstance() {
        return GameManager._instance;
    }

    get bgWidth() {
        return this.bg.getComponent(UITransform).width;
    }
    get bgHeight() {
        return this.bg.getComponent(UITransform).height;
    }

    get bgLeftBorder() {
        return 0;
    }

    get bgRightBorder() {
        return this.bgWidth;
    }

    get bgTopBorder() {
        return this.bgHeight;
    }
    get bgBottomBorder() {
        return 0;
    }
    start() {}

    onDestroy() {
        // 6. 当组件被销毁时，清空静态实例引用，避免出现悬空引用
        if (GameManager._instance === this) {
            GameManager._instance = null;
        }
    }
}
