import { _decorator, Component, Node, Sprite, UITransform } from "cc";
const { ccclass, property } = _decorator;

@ccclass("bg")
export class bg extends Component {
    @property
    speed = 0;
    bg1: Node = null;
    bg2: Node = null;
    height = null;
    start() {
        this.bg1 = this.node.getChildByName("bg1");
        this.bg2 = this.node.getChildByName("bg2");
        this.height = this.bg1.getComponent(UITransform).contentSize.height;
    }

    move() {}

    update(deltaTime: number) {
        const pos1 = this.bg1.position;
        const pos2 = this.bg2.position;
        this.bg1.setPosition(pos1.x, pos1.y - this.speed * deltaTime);
        this.bg2.setPosition(pos2.x, pos2.y - this.speed * deltaTime);
        if (this.bg1.position.y <= -this.height) {
            this.bg1.setPosition(pos1.x, pos2.y + this.height);
        }
        if (this.bg2.position.y <= -this.height) {
            this.bg2.setPosition(pos2.x, pos1.y + this.height);
        }
    }
}
