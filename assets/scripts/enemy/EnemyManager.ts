import { _decorator, log, Node } from "cc";
import { Spawn } from "../utils/Spawn";
import { EnemyCollide } from "./EnemyCollide";
import { PlayerState } from "../player/PlayerState";
const { ccclass, property } = _decorator;

@ccclass("EnemyManager")
export class EnemyManager extends Spawn {
    @property(Node)
    player: Node = null;
    killAllEnemies(...data: any[]) {
        log("killAllEnemies:", data);
        const playerState = this.player.getComponent(PlayerState);
        if (!playerState.isBombOk()) return;
        playerState.resetBombCountdown();
        const children = this.node.children;
        for (let i = children.length - 1; i >= 0; i--) {
            const child = children[i];
            child.getComponent(EnemyCollide).playDownAc();
        }
    }
}
