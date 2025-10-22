import { _decorator, Component, log } from "cc";
import { GAME_STATE_UPDATE } from "../utils/CONST";
import { GameState } from "../utils/GameManager";
import { eventManager } from "../utils/EventManager";
const { ccclass } = _decorator;

@ccclass("CanvasUI")
export class CanvasUI extends Component {
    protected onLoad(): void {
        eventManager.on(GAME_STATE_UPDATE, this.onChangeGameState, this);
    }

    onChangeGameState(state: GameState): void {
        if (state === GameState.GAMEOVER) {
            log("游戏结束,展示游戏结束UI");
            this.node.getChildByName("gameOverUI").active = true;
        }
    }
}
