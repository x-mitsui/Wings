import { _decorator } from "cc";
import { eventManager } from "../utils/EventManager";
import { CustomUI } from "./CustomUI";
import { PLAYER_CHANGE_SCORE } from "../utils/Event";
const { ccclass } = _decorator;

@ccclass("ScoreUI")
export class ScoreUI extends CustomUI {
    protected onLoad(): void {
        super.onLoad();
        eventManager.on(PLAYER_CHANGE_SCORE, this.onChangeScore, this);
    }

    onChangeScore(score: number): void {
        this.setLabelText(score + "");
    }
}
