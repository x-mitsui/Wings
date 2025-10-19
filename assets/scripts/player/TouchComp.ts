import { _decorator, Component, EventTouch, input, Node, Input, UITransform, math } from "cc";
import { Player } from "./Player";
const { ccclass } = _decorator;

@ccclass("TouchComp")
export class TouchComp extends Component {
    // 背景大小
    bgContentSize: math.Size = null;
    // 主角飞机实际大小
    realSize: math.Size = null;
    inject(player: Node) {
        this.bgContentSize = player.getComponent(Player).bg.getComponent(UITransform).contentSize;
    }
    protected onLoad(): void {
        const contentSize = this.node.getComponent(UITransform).contentSize;
        const scale = this.node.scale;
        this.realSize = new math.Size(contentSize.width * scale.x, contentSize.height * scale.y);

        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
        input.on(Input.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
    }

    onTouchStart(event: EventTouch) {
        console.log("touch start");
    }

    onTouchMove(event: EventTouch) {
        console.log("touch move");
        const delta = event.getDelta();

        this.node.setPosition(this.node.position.add3f(delta.x, delta.y, 0));

        if (this.node.position.x < -this.bgContentSize.width / 2 + this.realSize.width / 2) {
            this.node.setPosition(
                -this.bgContentSize.width / 2 + this.realSize.width / 2,
                this.node.position.y
            );
        }
        if (this.node.position.x > this.bgContentSize.width / 2 - this.realSize.width / 2) {
            this.node.setPosition(
                this.bgContentSize.width / 2 - this.realSize.width / 2,
                this.node.position.y
            );
        }
        if (this.node.position.y < -this.bgContentSize.height / 2 + this.realSize.height / 2) {
            this.node.setPosition(
                this.node.position.x,
                -this.bgContentSize.height / 2 + this.realSize.height / 2
            );
        }
        if (this.node.position.y > this.bgContentSize.height / 2 - this.realSize.height / 2) {
            this.node.setPosition(
                this.node.position.x,
                this.bgContentSize.height / 2 - this.realSize.height / 2
            );
        }
    }

    onTouchEnd(event: EventTouch) {
        console.log("touch end");
    }

    onTouchCancel(event: EventTouch) {
        console.log("touch cancel");
    }

    protected onDestroy(): void {
        input.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.off(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        input.off(Input.EventType.TOUCH_END, this.onTouchEnd, this);
        input.off(Input.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
    }
}
