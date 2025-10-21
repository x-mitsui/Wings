import { _decorator, Component, EventTouch, input, Input, UITransform, math } from "cc";
import { GameManager } from "../utils/GameManager";
const { ccclass } = _decorator;

@ccclass("TouchComp")
export class TouchComp extends Component {
    // 主角飞机实际大小
    realSize: math.Size = null;

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
        const gameMgr = GameManager.instance;
        const delta = event.getDelta();

        this.node.setWorldPosition(this.node.worldPosition.add3f(delta.x, delta.y, 0));

        if (this.node.worldPosition.x < this.realSize.width / 2) {
            this.node.setWorldPosition(this.realSize.width / 2, this.node.worldPosition.y, 0);
        }
        if (this.node.worldPosition.x > gameMgr.bgWidth - this.realSize.width / 2) {
            this.node.setWorldPosition(
                gameMgr.bgWidth - this.realSize.width / 2,
                this.node.worldPosition.y,
                0
            );
        }
        if (this.node.worldPosition.y < this.realSize.height / 2) {
            this.node.setWorldPosition(this.node.worldPosition.x, this.realSize.height / 2, 0);
        }
        if (this.node.worldPosition.y > gameMgr.bgHeight - this.realSize.height / 2) {
            this.node.setWorldPosition(
                this.node.worldPosition.x,
                gameMgr.bgHeight - this.realSize.height / 2,
                0
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
