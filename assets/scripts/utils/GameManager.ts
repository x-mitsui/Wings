import { _decorator, Component, director, Node, UITransform } from "cc";
const { ccclass, property } = _decorator;

/**
 * 参照官方单例：https://docs.cocos.com/creator/3.8/manual/zh/audio-system/audioExample.html
 * public static get instance(): GameManager {
 *    if (this._instance == null) {
 *       this._instance = new GameManager(); // 新建一个实例
 *    }
 *    return this._instance;
 * }
 * 游戏管理器
 * 注意：此单例模式的特殊之处：要能在UI界面配置属性，如节点bg
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
        GameManager._instance = this;
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
