import { _decorator, Component, director, error, log, sys } from "cc";
import { eventManager } from "./EventManager";
import { GAME_BEST_SCORE, GAME_STATE_UPDATE, GAME_UPDATE_SCORE } from "../utils/CONST";
const { ccclass } = _decorator;

/**
 * 参照官方单例：https://docs.cocos.com/creator/3.8/manual/zh/audio-system/audioExample.html
 * 游戏管理器
 * 注意：不要尝试往常驻节点上挂载某个场景内的元素，不然切换场景时会出现空指针
 */

export enum GameState {
    PLAYING,
    PAUSED,
    GAMEOVER
}
@ccclass("GameManager")
export class GameManager extends Component {
    private _bestScore = 0;
    private _currentScore = 0;
    private _state: GameState = GameState.PLAYING;

    protected onLoad(): void {
        director.addPersistRootNode(this.node);
        GameManager._inst = this;
    }
    private static _inst: GameManager = null;
    public static get inst(): GameManager {
        return GameManager._inst;
    }

    get state() {
        return this._state;
    }
    set state(value: GameState) {
        this._state = value;
        eventManager.emit(GAME_STATE_UPDATE, value);
    }
    get bestScore() {
        return this._bestScore;
    }
    set bestScore(value: number) {
        this._bestScore = value;
    }
    get currentScore() {
        return this._currentScore;
    }
    set currentScore(value: number) {
        this._currentScore = value;
        eventManager.emit(GAME_UPDATE_SCORE, value);
    }

    gameOver() {
        log("game over");
        const bestScoreHistory = sys.localStorage.getItem(GAME_BEST_SCORE) || 0;
        if (this._currentScore > bestScoreHistory) {
            sys.localStorage.setItem(GAME_BEST_SCORE, this._currentScore + "");
        }
        this.state = GameState.GAMEOVER;
        director.pause();
    }

    gamePause() {
        this.state = GameState.PAUSED;
        director.pause();
    }
    gameResume() {
        this.state = GameState.PLAYING;
        director.resume();
    }

    gameQuit() {
        this._currentScore = 0;
        director.loadScene("start", (err) => {
            if (err) {
                error("场景start加载失败:", err);
            } else {
                log("场景start加载成功");
                this.gameResume();
            }
        });
    }
    gameRestart() {
        this._currentScore = 0;
        const currentSceneName = director.getScene().name;
        director.loadScene(currentSceneName, (err) => {
            if (err) {
                error("场景" + currentSceneName + "加载失败:", err);
            } else {
                log("场景" + currentSceneName + "加载成功");
                this.gameResume();
            }
        });
    }

    onDestroy() {
        if (GameManager._inst === this) {
            GameManager._inst = null;
        }
    }
}
