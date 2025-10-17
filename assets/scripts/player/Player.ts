import { _decorator, Component, Node, UITransform, math, director } from "cc";
import { Bullet } from "./Bullet";
import { PlayerLevel } from "../common";
import { TouchComp } from "./TouchComp";
const { ccclass, property } = _decorator;

@ccclass("Player")
export class Player extends Component {
    @property(Node)
    body: Node = null;
    @property(Node)
    bg: Node = null; // 背景节点
    level: PlayerLevel = PlayerLevel.Lvl1;

    start() {
        // this.scheduleOnce(() => {
        this.node.getComponent(Bullet).inject(this.node);
        this.node.getComponent(TouchComp).inject(this.node);
        // });
    }
}
