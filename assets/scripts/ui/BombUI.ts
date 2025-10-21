import { _decorator } from "cc";
import { eventManager } from "../utils/EventManager";
import { PLAYER_CHANGE_BOMB_COUNT } from "../utils/Event";
import { CustomUI } from "./CustomUI";
const { ccclass, property } = _decorator;

@ccclass("BombUI")
export class BombUI extends CustomUI {
    protected onLoad(): void {
        super.onLoad();
        eventManager.on(PLAYER_CHANGE_BOMB_COUNT, this.onChangeBombCount, this);
    }

    onChangeBombCount(count: number): void {
        this.setLabelText(count + "");
    }
}
