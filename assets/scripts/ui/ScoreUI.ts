import { _decorator } from "cc";
import { CustomUI } from "./CustomUI";
import { GAME_UPDATE_SCORE } from "../utils/CONST";
import { eventManager } from "../utils/EventManager";
const { ccclass } = _decorator;

@ccclass("ScoreUI")
export class ScoreUI extends CustomUI {
    protected onLoad(): void {
        super.onLoad();
        eventManager.on(GAME_UPDATE_SCORE, this.onChangeScore, this);
    }

    onChangeScore(score: number): void {
        this.setLabelText(score + "");
    }
}
