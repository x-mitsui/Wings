import { _decorator, Node, Sprite, tween } from "cc";
import { eventManager } from "../../utils/EventManager";
import { PLAYER_RESET_BOMB_COUNTDOWN, PLAYER_CHANGE_BOMB_COUNT } from "../../utils/CONST";
import { CustomUI } from "../CustomUI";
import { PlayerState } from "../../player/PlayerState";
const { ccclass, property } = _decorator;

@ccclass("BombUI")
export class BombUI extends CustomUI {
    @property(Node)
    player: Node = null;
    protected onLoad(): void {
        super.onLoad();
        eventManager.on(PLAYER_CHANGE_BOMB_COUNT, this.onChangeBombCount, this);
        eventManager.on(PLAYER_RESET_BOMB_COUNTDOWN, this.onStartBombCD, this);
    }

    onChangeBombCount(count: number): void {
        this.setLabelText(count + "");
    }
    onStartBombCD(count: number): void {
        const playerState = this.player.getComponent(PlayerState);
        const bombSp = this.node.getComponent(Sprite);
        playerState.bombCount--;
        tween(bombSp)
            .set({ fillRange: 0 })
            .to(count, { fillRange: 1 })
            .call(() => {
                playerState.setBombOK();
            })
            .start();
    }
}
