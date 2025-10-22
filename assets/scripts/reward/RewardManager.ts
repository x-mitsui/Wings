import { _decorator, math, Node, UITransform } from "cc";
import { Spawn } from "../utils/Spawn";
import { GameManager } from "../utils/GameManager";
import { BGUtil } from "../utils/tool";
const { ccclass } = _decorator;

// 水平方向往哪边移动
enum XDirection {
    Left = 0,
    Right = 1
}
@ccclass("RewardManager")
export class RewardManager extends Spawn {
    xDirection = math.randomRangeInt(0, 2) as XDirection;
    override getXDelta(entityNode: Node) {
        let xDelta = 0;

        if (this.xDirection === XDirection.Left) {
            xDelta = -1;
        } else {
            xDelta = 1;
        }
        const xPos = entityNode.worldPosition.x;
        const rightBound =
            BGUtil.bgRightBorder - entityNode.getComponent(UITransform).contentSize.width / 2;
        const leftBound =
            BGUtil.bgLeftBorder + entityNode.getComponent(UITransform).contentSize.width / 2;
        if (xPos >= rightBound) {
            xDelta = -1;
            this.xDirection = XDirection.Left;
        }
        if (xPos <= leftBound) {
            xDelta = 1;
            this.xDirection = XDirection.Right;
        }
        return xDelta;
    }
}
