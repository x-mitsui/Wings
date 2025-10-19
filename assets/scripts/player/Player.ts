import { _decorator, Component, Node } from "cc";
import { TouchComp } from "./TouchComp";
import { PlayerLevel } from "../types/Bullet";
import { BulletManager } from "./BulletManager";
const { ccclass, property } = _decorator;

@ccclass("Player")
export class Player extends Component {
    @property(Node)
    body: Node = null;
    @property(Node)
    bg: Node = null; // 背景节点
    level: PlayerLevel = PlayerLevel.Lvl0;

    start() {
        this.node.getComponent(BulletManager).inject(this.node);
        this.node.getComponent(TouchComp).inject(this.node);
    }
}
