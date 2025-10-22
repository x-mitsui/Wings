import {
    _decorator,
    Component,
    EventTouch,
    input,
    Input,
    EventHandler,
    log,
    Node,
    UITransform,
    math
} from "cc";
import { GameManager, GameState } from "../utils/GameManager";
import { BGUtil } from "../utils/tool";
const { ccclass, property } = _decorator;

@ccclass("TouchComp")
export class TouchComp extends Component {
    @property(Node)
    player: Node = null;
    // 双击相关
    @property({ type: [EventHandler] })
    public dbClickCustomEventHandlers: EventHandler[] = [];
    // 双击时间间隔阈值（毫秒）
    private doubleClickThreshold: number = 250;
    // 记录第一次点击的时间戳
    private firstClickTime: number = 0;
    // 点击计数器
    private clickCount: number = 0;

    protected onLoad(): void {
        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
        input.on(Input.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
    }

    onTouchStart(event: EventTouch) {
        log("touch start");
        const currentTime = Date.now();

        // 如果是第一次点击，或者距离上次点击时间过长，重置计数器
        if (currentTime - this.firstClickTime > this.doubleClickThreshold) {
            this.clickCount = 0;
        }

        this.clickCount++;

        if (this.clickCount === 1) {
            log("第一次点击！");
            // 记录第一次点击的时间
            this.firstClickTime = currentTime;
        } else if (this.clickCount === 2) {
            log("双击事件试图触发！");
            // 第二次点击在时间阈值内，触发双击事件
            if (currentTime - this.firstClickTime <= this.doubleClickThreshold) {
                this.onDoubleClick();
                this.clickCount = 0; // 重置计数器
            } else {
                // 超时，将此次点击视为新的第一次点击
                this.firstClickTime = currentTime;
                this.clickCount = 1;
            }
        }
    }

    onTouchMove(event: EventTouch) {
        log("touch move");
        if (GameManager.instance.state !== GameState.PLAYING) return;

        const delta = event.getDelta();
        const playerSize = this.player.getComponent(UITransform);
        const playerRealSize = new math.Rect(
            0,
            0,
            playerSize.width * this.player.scale.x,
            playerSize.height * this.player.scale.y
        );

        this.player.setWorldPosition(this.player.worldPosition.add3f(delta.x, delta.y, 0));

        if (this.player.worldPosition.x < playerRealSize.width / 2) {
            this.player.setWorldPosition(playerRealSize.width / 2, this.player.worldPosition.y, 0);
        }
        if (this.player.worldPosition.x > BGUtil.bgWidth - playerRealSize.width / 2) {
            this.player.setWorldPosition(
                BGUtil.bgWidth - playerRealSize.width / 2,
                this.player.worldPosition.y,
                0
            );
        }
        if (this.player.worldPosition.y < playerRealSize.height / 2) {
            this.player.setWorldPosition(this.player.worldPosition.x, playerRealSize.height / 2, 0);
        }
        if (this.player.worldPosition.y > BGUtil.bgHeight - playerRealSize.height / 2) {
            this.player.setWorldPosition(
                this.player.worldPosition.x,
                BGUtil.bgHeight - playerRealSize.height / 2,
                0
            );
        }
    }

    onTouchEnd(event: EventTouch) {
        log("touch end");
    }

    onTouchCancel(event: EventTouch) {
        log("touch cancel");
    }

    protected onDestroy(): void {
        input.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.off(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        input.off(Input.EventType.TOUCH_END, this.onTouchEnd, this);
        input.off(Input.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
    }

    private onDoubleClick() {
        log("双击事件触发！");
        // 在这里编写你的双击响应逻辑，例如：
        // - 放大/缩小角色或地图
        // - 快速使用道具
        // - 打开特定菜单
        const customData = 666;
        this.dbClickCustomEventHandlers.forEach((eventHandler: EventHandler) => {
            // callback接受参数会将ui界面的customEventData和customData糅合到一块
            eventHandler.emit([customData]);
        });
    }
}
