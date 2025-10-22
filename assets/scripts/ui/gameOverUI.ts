import { _decorator, Component, director, Label, Node, sys } from "cc";
import { GameManager } from "../utils/GameManager";
import { GAME_BEST_SCORE } from "../utils/CONST";
const { ccclass, property } = _decorator;

@ccclass("gameOverUI")
export class gameOverUI extends Component {
    @property(Node)
    bestScoreLabel: Node = null;
    @property(Node)
    currentScoreLabel: Node = null;
    @property(Node)
    restartButton: Node = null;
    @property(Node)
    quitButton: Node = null;
    onEnable() {
        const localBestScore = sys.localStorage.getItem(GAME_BEST_SCORE) || 0;
        if (localBestScore) {
            this.bestScoreLabel.getComponent(Label).string = localBestScore;
        }

        const currentScore = GameManager.instance.currentScore;
        this.currentScoreLabel.getComponent(Label).string = currentScore + "";
    }
    protected onLoad(): void {
        this.restartButton.on(Node.EventType.TOUCH_END, this.onClickRestart, this);
        this.quitButton.on(Node.EventType.TOUCH_END, this.onClickQuit, this);
    }

    onClickRestart() {
        this.node.active = false;
        GameManager.instance.gameRestart();
    }
    onClickQuit() {
        GameManager.instance.gameQuit();
    }
}
