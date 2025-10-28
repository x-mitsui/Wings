import { _decorator, Component, Node, UITransform } from "cc";
const { ccclass, property } = _decorator;

@ccclass("bg")
export class bg extends Component {
    @property
    speed = 0;
    bg0: Node = null;
    bg1: Node = null;
    height = null;
    start() {
        // 背景适配原则：
        // 1. 前提-竖屏游戏fitWidth
        // 2. 找到所有目标设备中高宽比最大的那个，然后根据这个宽高比和设计分辨率的高宽比做对比，通过printSizes观察可视区域和画布的高度的差值，补齐背景图片的高度
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
