import {
    _decorator,
    Component,
    EventTouch,
    input,
    Node,
    Input,
    Sprite,
    UITransform,
    Vec2,
    math
} from "cc";
import { checkIsIn } from "./utils/tool";
const { ccclass, property } = _decorator;

@ccclass("player")
export class player extends Component {
    @property(Node)
    role: Node = null;
    @property(Node)
    bg: Node = null;
    // 背景大小
    bgContentSize: math.Size = null;
    // 角色实际大小
    roleRealSize: math.Size = null;
    protected onLoad(): void {
        this.bgContentSize = this.bg.getChildByName("bg1").getComponent(UITransform).contentSize;
        const contentSize = this.role.getComponent(UITransform).contentSize;
        const scale = this.role.scale;
        this.roleRealSize = new math.Size(
            contentSize.width * scale.x,
            contentSize.height * scale.y
        );

        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
        input.on(Input.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
    }
    start() {}

    onTouchStart(event: EventTouch) {
        console.log("touch start");
    }

    onTouchMove(event: EventTouch) {
        console.log("touch move");
        const delta = event.getDelta();

        // if (checkIsIn(this.roleRealSize, this.bgContentSize, this.role.position)) {
        //     this.role.setPosition(this.role.position.x + delta.x, this.role.position.y + delta.y);
        // }
        this.role.setPosition(this.role.position.x + delta.x, this.role.position.y + delta.y);

        if (this.role.position.x < this.roleRealSize.width / 2) {
            this.role.setPosition(this.roleRealSize.width / 2, this.role.position.y);
        }
        if (this.role.position.x > this.bgContentSize.width - this.roleRealSize.width / 2) {
            this.role.setPosition(
                this.bgContentSize.width - this.roleRealSize.width / 2,
                this.role.position.y
            );
        }
        if (this.role.position.y < this.roleRealSize.height / 2) {
            this.role.setPosition(this.role.position.x, this.roleRealSize.height / 2);
        }
        if (this.role.position.y > this.bgContentSize.height - this.roleRealSize.height / 2) {
            this.role.setPosition(
                this.role.position.x,
                this.bgContentSize.height - this.roleRealSize.height / 2
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

    update(deltaTime: number) {}
}
