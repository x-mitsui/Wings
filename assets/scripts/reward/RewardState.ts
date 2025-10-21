import { _decorator } from "cc";
import { EntityState } from "../utils/EntityState";
const { ccclass, property } = _decorator;

@ccclass("RewardState")
export class RewardState extends EntityState {
    @property({
        type: Number,
        tooltip: "奖励生效时间",
        displayName: "生效时间(秒),-1永久生效"
    })
    duration: number = 1;
}
