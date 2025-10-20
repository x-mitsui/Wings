import {
    _decorator,
    Animation,
    AnimationState,
    Collider2D,
    Component,
    Contact2DType,
    director,
    IPhysics2DContact
} from "cc";
import { PlayerState } from "./PlayerState";
import { EnemyState } from "../enemy/EnemyState";
import { EnemyCollide } from "../enemy/EnemyCollide";
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
        const playerState = player.getComponent(PlayerState);
        const enemy = otherCollider.node;
        const enemyCollide = enemy.getComponent(EnemyCollide);
        if (!player || !player.isValid || !enemy || !enemy.isValid || playerState.isHitten) return;
        playerState.isHitten = true;

        if (!enemy.name.includes("enemy")) return;

        this.scheduleOnce(() => {
            this.takeDamageLogic(1);

            enemyCollide.takeDamageLogic(1);
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
            console.log("game over");
            director.pause();
        }
    }

    protected onDestroy(): void {
        if (this.collider) {
            this.collider.off(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }
    }
}
