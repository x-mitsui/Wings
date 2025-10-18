import { _decorator, Component, Node, Sprite, UITransform } from "cc";
const { ccclass, property } = _decorator;

@ccclass("bg")
export class bg extends Component {
    @property
    speed = 0;
    bg0: Node = null;
    bg1: Node = null;
    height = null;
    start() {
        this.bg0 = this.node.getChildByName("bg0");
        this.bg1 = this.node.getChildByName("bg1");
        this.height = this.bg0.getComponent(UITransform).contentSize.height;
    }

    move() {}

    update(deltaTime: number) {
        const pos0 = this.bg0.position;
        const pos1 = this.bg1.position;
        this.bg0.setPosition(pos0.x, pos0.y - this.speed * deltaTime);
        this.bg1.setPosition(pos1.x, pos1.y - this.speed * deltaTime);
        if (this.bg0.position.y <= -this.height) {
            this.bg0.setPosition(pos0.x, pos1.y + this.height);
        }
        if (this.bg1.position.y <= -this.height) {
            this.bg1.setPosition(pos1.x, pos0.y + this.height);
        }
    }
}
