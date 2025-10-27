import { _decorator, Animation, Collider2D, log, Node } from "cc";
import { EnemyCollide } from "./EnemyCollide";
import { PlayerState } from "../player/PlayerState";
import { EnemyState } from "./types";
import { DataManager } from "../mgr/DataManager";
import { EntityController } from "../utils/EntityController";
import { Entity } from "../utils/Entity";
const { ccclass, property } = _decorator;

@ccclass("EnemyController")
export class EnemyController extends EntityController {
    initEntityConfig() {
        this.entityConfigs = DataManager.inst.getConfigs("enemy");
    }
    @property(Node)
    player: Node = null;

    override entityAssembleState(entityNode: Node) {
        entityNode.getComponent(Animation).play(entityNode.name + "_idle");
        entityNode.getComponent(Collider2D).enabled = true;
        const state = entityNode.getComponent(Entity<EnemyState>).state;
        const entityConfig = DataManager.inst.getConfigs("enemy")[state.id];
        log("xxxxx:", state.id, DataManager.inst.getConfigs("enemy"), entityConfig);
        state.ySpeed = entityConfig.ySpeed;
        state.hp = entityConfig.hp;
    }

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
