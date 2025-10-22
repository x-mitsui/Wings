import { _decorator, Component, Node } from "cc";
import { GameManager } from "../utils/GameManager";
const { ccclass, property } = _decorator;

@ccclass("main")
export class main extends Component {
    onLoad() {
        GameManager.instance.bindNodes(
            this.node.getChildByName("bg").getChildByName("bg0"),
            this.node.getChildByName("player"),
            this.node.getChildByName("gameOverUI")
        );
    }

    update(deltaTime: number) {}
}
