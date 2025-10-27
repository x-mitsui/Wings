import { RewardData, XDirection } from "./types";
import { _decorator, log, Node, UITransform } from "cc";
import { DataManager } from "../mgr/DataManager";
import { BGUtil } from "../utils/tool";
import { Entity } from "../utils/Entity";
import { EntityController } from "../utils/EntityController";
const { ccclass } = _decorator;

@ccclass("RewardController")
export class RewardController extends EntityController {
    initEntityConfig() {
        this.entityConfigs = DataManager.inst.getConfigs("reward");
    }
    entityAssembleState(entityNode: Node) {
        const state = entityNode.getComponent(Entity<RewardData>).state;
        const entityConfig = DataManager.inst.getConfigs("reward")[state.id];
        log("rewardxxxxx:", state.id, DataManager.inst.getConfigs("reward"), entityConfig);
        state.ySpeed = entityConfig.ySpeed;
        state.xSpeed = entityConfig.xSpeed;
    }

    override getX(entityNode: Node) {
        const rewardData = entityNode.getComponent(Entity<RewardData>).state;
        if (!rewardData.xDirection)
            rewardData.xDirection = (Math.random() < 0.5 ? -1 : 1) as XDirection;

        const xPos = entityNode.worldPosition.x;
        const rightBound =
            BGUtil.bgRightBorder - entityNode.getComponent(UITransform).contentSize.width / 2;
        const leftBound =
            BGUtil.bgLeftBorder + entityNode.getComponent(UITransform).contentSize.width / 2;
        if (xPos >= rightBound) {
            rewardData.xDirection = XDirection.Left;
        }
        if (xPos <= leftBound) {
            rewardData.xDirection = XDirection.Right;
        }
        return rewardData.xDirection * rewardData.xSpeed;
    }
}
