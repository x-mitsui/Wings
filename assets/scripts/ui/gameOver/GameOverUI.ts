import { _decorator, Component, Label, Node, sys } from "cc";
import { GameManager } from "../../mgr/GameManager";
import { GAME_BEST_SCORE } from "../../utils/CONST";
import { ObjectPoolManager } from "../../mgr/ObjectPoolManager";
import { AudioManager } from "../../mgr/AudioManager";
const { ccclass, property } = _decorator;

@ccclass("GameOverUI")
export class GameOverUI extends Component {
    @property(Node)
    bestScoreLabel: Node = null;
    @property(Node)
    currentScoreLabel: Node = null;
    @property(Node)
    restartButton: Node = null;
    @property(Node)
    quitButton: Node = null;
    onEnable() {
        AudioManager.inst.playOneShot("sounds/game_over");
        const localBestScore = sys.localStorage.getItem(GAME_BEST_SCORE) || 0;
        if (localBestScore) {
            this.bestScoreLabel.getComponent(Label).string = localBestScore;
        }

        const currentScore = GameManager.inst.currentScore;
        this.currentScoreLabel.getComponent(Label).string = currentScore + "";
    }
    protected onLoad(): void {
        this.restartButton.on(Node.EventType.TOUCH_END, this.onClickRestart, this);
        this.quitButton.on(Node.EventType.TOUCH_END, this.onClickQuit, this);
    }

    onClickRestart() {
        AudioManager.inst.playOneShot("sounds/button");
        this.node.active = false;
        GameManager.inst.gameRestart();
    }
    onClickQuit() {
        AudioManager.inst.playOneShot("sounds/button");
        ObjectPoolManager.inst.clearAll();
        GameManager.inst.gameQuit();
    }
}
