import { _decorator, Component, director, Node, UITransform } from "cc";
const { ccclass, property } = _decorator;

/**
 * 游戏管理器
 * 注意：此单例模式的特殊之处：要能在UI界面配置属性，
 * 这样就免不了要先在场景编辑器中提前放置，
 * 所以_instance就不得不指向这个提前放置的实例
 */
@ccclass("GameManager")
export class GameManager extends Component {
    @property(Node)
    bg: Node = null;
    bombCount = 0;
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
    static get instance() {
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
        if (GameManager._instance === this) {
            GameManager._instance = null;
        }
    }
}
