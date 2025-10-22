import { _decorator, Component, Enum, Node } from "cc";
import { PlayerLevel } from "./bullet/types";
import { PlayerBulletManager } from "./bullet/PlayerBulletManager";
import { eventManager } from "../utils/EventManager";
import {
    PLAYER_RESET_BOMB_COUNTDOWN,
    PLAYER_CHANGE_BOMB_COUNT,
    PLAYER_CHANGE_HP
} from "../utils/CONST";
const { ccclass, property } = _decorator;

@ccclass("PlayerState")
export class PlayerState extends Component {
    @property(Node)
    body: Node = null;
    @property(Node)
    playerBulletContainer: Node = null;
    @property({ type: Enum(PlayerLevel), displayName: "武器等级" })
    level: PlayerLevel = PlayerLevel.Lvl0;
    _hp = 3;

    _bombCount = 0;
    @property
    bombCD = 3;
    _bombCountdown = 0; // bomb cd倒计时，第一次可用，所以为0
    isHitten = false;

    set bombCount(count: number) {
        this._bombCount = count;
        eventManager.emit(PLAYER_CHANGE_BOMB_COUNT, count);
    }

    get bombCount() {
        return this._bombCount;
    }

    set hp(count: number) {
        this._hp = count;
        eventManager.emit(PLAYER_CHANGE_HP, count);
    }

    get hp() {
        return this._hp;
    }

    setBombOK() {
        this._bombCountdown = 0;
    }
    isBombOk() {
        return this._bombCountdown <= 0 && this._bombCount > 0;
    }
    resetBombCountdown() {
        this._bombCountdown = this.bombCD;
        eventManager.emit(PLAYER_RESET_BOMB_COUNTDOWN, this.bombCD);
    }

    start() {
        this.hp = 3; // 触发一次lifeUI更新
        this.playerBulletContainer.getComponent(PlayerBulletManager).inject(this.node);
    }
}
