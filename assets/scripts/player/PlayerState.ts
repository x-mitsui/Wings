import { _decorator, Component, Node } from "cc";
import { TouchComp } from "./TouchComp";
import { PlayerLevel } from "./bullet/types";
import { PlayerBulletManager } from "./bullet/PlayerBulletManager";
const { ccclass, property } = _decorator;

@ccclass("PlayerState")
export class PlayerState extends Component {
    @property(Node)
    body: Node = null;
    @property(Node)
    bg: Node = null; // 背景节点
    @property(Node)
    playerBulletContainer: Node = null;

    level: PlayerLevel = PlayerLevel.Lvl0;
    hp = 3;
    isHitten = false;

    start() {
        this.playerBulletContainer.getComponent(PlayerBulletManager).inject(this.node);
        this.node.getComponent(TouchComp).inject(this.node);
    }
}
