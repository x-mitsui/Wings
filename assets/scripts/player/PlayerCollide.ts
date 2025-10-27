import {
    _decorator,
    Animation,
    AnimationState,
    Collider2D,
    Component,
    Contact2DType,
    IPhysics2DContact,
    log,
    Node
} from "cc";
import { PlayerState } from "./PlayerState";
import { EnemyCollide } from "../enemy/EnemyCollide";
import { GameManager } from "../mgr/GameManager";
import { ObjectPoolManager } from "../mgr/ObjectPoolManager";
import { OBJECT_POOL_KEY_PREFIX } from "../utils/CONST";
import { RewardData } from "../reward/types";
import { PlayerLevel } from "./types";
import { Entity } from "../utils/Entity";
import { AudioManager } from "../mgr/AudioManager";
const { ccclass } = _decorator;

@ccclass("PlayerCollide")
export class PlayerCollide extends Component {
    collider: Collider2D = null;
    protected onLoad(): void {
        this.collider = this.getComponent(Collider2D);
    }
    start() {
        if (!this.collider) return;
        this.collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
    }

    onBeginContact(
        selfCollider: Collider2D,
        otherCollider: Collider2D,
        contact: IPhysics2DContact
    ) {
        const player = selfCollider.node;

        const entity = otherCollider.node;
        const entName = entity.name;
        switch (true) {
            case entName.includes("enemy"):
                this.enemyContact(player, entity);
                break;
            case entName.includes("reward"):
                this.rewardContact(player, entity);
                break;
        }
    }

    enemyContact(player: Node, entity: Node) {
        const playerState = player.getComponent(PlayerState);
        const enemy = entity;
        const enemyCollide = enemy.getComponent(EnemyCollide);
        if (!player || !player.isValid || !enemy || !enemy.active || playerState.isHitten) return;
        playerState.isHitten = true;
        this.scheduleOnce(() => {
            this.takeDamageLogic(1);

            enemyCollide.takeDamageLogic(1);
        }, 0);
    }
    reward: Node = null;
    rewardContact(player: Node, entity: Node) {
        if (this.reward === entity) return; // 由于Box2D每个边都参与检测，所以添加标记处理
        this.reward = entity;
        const playerState = player.getComponent(PlayerState);
        const rewardState = this.reward.getComponent(Entity<RewardData>).state;
        if (!player || !player.isValid || !this.reward || !this.reward.active) return;
        this.scheduleOnce(() => {
            ObjectPoolManager.inst.put(
                OBJECT_POOL_KEY_PREFIX + this.reward.name.toUpperCase(),
                this.reward
            );
            log("rewardState.id-->", rewardState.id, rewardState.duration);
            // 双枪
            if (rewardState.id === 0) {
                AudioManager.inst.playOneShot("sounds/get_double_laser");
                playerState.level = PlayerLevel.Lvl1;
                this.scheduleOnce(() => {
                    playerState.level = PlayerLevel.Lvl0; // 延迟执行
                }, rewardState.duration);
                return;
            }
            // 清屏炸弹
            if (rewardState.id === 1) {
                AudioManager.inst.playOneShot("sounds/get_bomb");
                playerState.bombCount += 1;
            }
        }, 0);
    }

    // 执行掉血逻辑
    takeDamageLogic(hp: number) {
        const state = this.node.getComponent(PlayerState);
        state.hp -= hp;
        if (state.hp > 0) {
            this.playHitAc();
        } else {
            this.playDownAc();
        }
    }

    playHitAc() {
        const animation = this.node.getComponent(Animation);
        let acName = this.node.name + "_hit";
        animation.play(acName);

        animation.on(Animation.EventType.FINISHED, this.playerHittenCallback.bind(this));
        animation.play("player_hit");
    }

    playerHittenCallback() {
        this.node.getComponent(PlayerState).isHitten = false;
        this.node.getComponent(Animation).play("player_idle");
    }

    playDownAc() {
        const animation = this.node.getComponent(Animation);
        this.node.getComponent(Collider2D).enabled = false; // 立即禁用，以免在播放动画时干扰

        const acName = this.node.name + "_down";

        animation.on(Animation.EventType.FINISHED, this.playDownAcCallback.bind(this));
        animation.play(acName);
    }

    playDownAcCallback(type: Animation.EventType, state: AnimationState) {
        if (state.name === this.node.name + "_down") {
            GameManager.inst.gameOver();
        }
    }

    protected onDestroy(): void {
        if (this.collider) {
            this.collider.off(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }
        this.unscheduleAllCallbacks();
    }
}
